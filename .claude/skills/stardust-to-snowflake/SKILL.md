---
name: stardust-to-snowflake
description: Convert stardust HTML prototypes (under stardust/prototypes/**) into Edge Delivery Services (EDS / AEM) blocks and content pages. Each prototype <section> becomes one EDS block; the prototype's per-section CSS becomes that block's CSS scoped under the block class. Use when the user wants to lift a stardust pipeline output (or any styled per-page HTML prototypes) into a working EDS site under blocks/ and content/.
---

# Stardust → EDS

## When to use

The user has:
1. Static HTML prototypes (one per page) under `stardust/prototypes/**/*.html` with inline `<style>` blocks. Typically produced by the `stardust:prototype` skill, but any per-page styled HTML works.
2. An EDS project at the repo root — `blocks/`, `styles/`, `scripts/`, `head.html`, plus existing chrome blocks (`header`, `footer`, `fragment`, `section-metadata`).
3. A goal to convert: prototypes → authorable EDS blocks + EDS content pages under `content/**`.

If the user has prototypes but no EDS scaffolding, stop and ask whether to bootstrap. If they have EDS but no prototypes, this skill doesn't apply.

## The one rule that drives everything else

**One prototype `<section>` = one EDS block.** Do not abstract. Do not invent variants. Do not extract "patterns" across prototypes unless two sections are visually identical.

The prototype is the visual spec. The block exists to author its content. This rule sounds obvious. It is not what you will be tempted to do. See ANTI-PATTERNS below — every entry there is a real failure mode that cost a full reset on a previous run.

## Output you will produce

For a typical 5–10 page site:

- **One block per distinct prototype section.** A 5-page site with 6 sections each → ~12–18 blocks (some are reused across pages, e.g. `closing`).
- **One EDS content page per prototype page.** Same number of pages.
- **Header + footer fragments** at `content/fragments/nav/{header,footer}.html`.
- **Updated `styles/styles.css`** with brand tokens lifted from the prototype's `:root`, a reset, the EDS section scaffold, and a global button system (see "Lean on EDS button conventions" below). Nothing more.
- **No shared utility modules.** No wave systems. No section-metadata style classes. No motion library. The prototype already encodes these per-section; keep them inside the owning block.

## Steps

### 1. Audit (light)

Read every prototype's `<main>` markup (skip the `<style>` for now) and produce a per-page section list:

```
home: hero, work, approach, team, clients, closing
approach: approach-hero, manifesto, tenets-detailed, cadence, closing
team: team-hero, team-roster, work-style, recent, careers, closing
…
```

A useful pattern: dispatch the `Explore` subagent at thoroughness=quick with this exact ask. You don't need a 22-pattern punch list — you need filenames + section names. **Resist the urge to "find shared patterns."** Pattern reuse will emerge organically when two sections turn out to be byte-identical.

### 2. Decide names + reuse — LOCK BEFORE WRITING ANY CODE

Naming rules:
- Block name = the prototype's `<section class="X">` value, kebab-cased (`hero`, `work`, `closing`, `approach`).
- When the same section appears on multiple pages with identical visual treatment, build ONE block and use it everywhere. The classic example: `closing` CTA at the end of every page.
- When a section appears on multiple pages but looks different (e.g. home `hero` vs case-study `case-hero` vs service `service-hero`), they are different blocks. Prefix with the page archetype.
- When two sections within one prototype share the same visual treatment but different copy (e.g. case-study `discovery` and `decisions` are both 2-col prose with eyebrow + headline), it is fine to merge into one block (`case-prose-2col`) with a single text variant cell ("tinted" / "default"). Use your judgment.

**Surface 3–5 naming questions to the user before writing any block code:**
- "What's the home hero called? `hero`?"
- "Are the closing CTAs across all pages identical? Same `closing` block?"
- "Should case-study discovery/decisions/solutions be one block or three?"
- "Is the per-service hero distinct from the home hero? Build `service-hero` separately?"

Lock the answers in writing (in `stardust/eds-conversion-log.md` or similar). This is the single highest-leverage step in the whole process.

### 3. Foundation

Update `styles/styles.css` to the following — and ONLY the following:

- Lift `:root` tokens verbatim from the prototype's `<style>` (colors, fonts, type scale, weights, tracking, layout, motion easing).
- Document reset (box-sizing, margin reset, scroll-behavior, body font + bg, ::selection, img defaults, button reset).
- A minimal EDS section scaffold:
  ```css
  main .section { display: block; }
  main .section > .default-content,
  main .section > .block-content { display: block; }
  main > div, .has-template, div[data-status] { display: none; }
  ```
- A global button system (see next section). This is the one place per-block CSS does NOT own its paint — buttons are site-wide and convention-driven.

That's it. No section-style classes. No motion primitives. No utility classes beyond the button system.

`scripts/scripts.js` stays minimal — only the page boot. No reveal-on-scroll. No marquee init. No header scroll-state. Per-block animation is owned by per-block CSS.

### 4. Self-host fonts and minimize CLS — never put font loads in `head.html`

Four principles, applied in this order on every project:

**1. Leave `head.html` untouched. No font lines, period.**
No Google Fonts `<link>`. No CDN `<link rel="stylesheet">` for type. No `<style>` blocks declaring `@font-face`. **No `<link rel="preload" as="font">`** either — even self-hosted preloads belong out of `head.html`. The browser will fetch the woff2 it needs as soon as `styles/styles.css` parses; the `body { arial }` / `body.session { var(--font-body) }` split (principle 3) eliminates the CLS that preloading is normally meant to prevent. **All `@font-face` declarations live in `styles/styles.css`.**

**2. Self-host the brand font when licensing permits.**
Inspect the prototype to identify each font family and its license:
- SIL OFL 1.1 (Inter, JetBrains Mono, Fraunces, Roboto, Open Sans, IBM Plex, Source Sans, etc.) → self-host. License permits redistribution, including embedding on the served domain.
- Apache 2.0 (some Google Fonts) → self-host.
- Proprietary commercial (Adobe Fonts / Typekit, Monotype, foundry-direct) → keep CDN load and document the licensing constraint in the conversion log; you will NOT achieve zero CLS in this case.

For OFL fonts, fetch latin-subset variable woff2 files. The fastest reliable source is jsDelivr's `@fontsource-variable/<name>` packages:

```bash
mkdir -p styles/fonts
curl -sSL -o styles/fonts/<name>-variable.woff2 \
  "https://cdn.jsdelivr.net/npm/@fontsource-variable/<name>@latest/files/<name>-latin-wght-normal.woff2"
# italic, if used:
curl -sSL -o styles/fonts/<name>-italic-variable.woff2 \
  "https://cdn.jsdelivr.net/npm/@fontsource-variable/<name>@latest/files/<name>-latin-wght-italic.woff2"
```

Latin-only variable woff2 is typically 30–60 KB per file, weights 100–900 included.

**3. Body.session pattern with a metric-matched fallback `@font-face`.**
The brand font must NOT render at first paint. Default to a metric-matched system font; switch to the brand font once `decorateSession()` (in `scripts/ak.js`) adds `body.session`. The recipe:

```css
@font-face {
  font-family: "<Brand>";
  src: url("/styles/fonts/<brand>-variable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

/* Override the system font's metrics so it renders with the brand font's
   line box. Naming the @font-face after the system font (e.g. "Arial",
   "Times New Roman") makes any reference to that family in a font stack
   pick up the metric-adjusted version site-wide — no per-block changes. */
@font-face {
  font-family: "Arial";          /* "Times New Roman" for a serif brand */
  src: local("Arial");           /* local("Times New Roman") for serif */
  size-adjust: <X>%;
  ascent-override: <Y>%;
  descent-override: <Z>%;
  line-gap-override: 0%;
}

:root {
  --font-body: "<Brand>", arial, sans-serif;       /* serif: times, "Times New Roman", serif */
}

body { font-family: arial, sans-serif; }
body.session { font-family: var(--font-body); }
```

The metric-override values come from the `@fontsource-variable/<name>` package's published calibration — fetch their CSS:

```bash
curl -s "https://cdn.jsdelivr.net/npm/@fontsource-variable/<name>@latest/index.css" \
  | grep -A 6 "Fallback"
```

Each fontsource package publishes a `<Name> Fallback` `@font-face` with `size-adjust`, `ascent-override`, and `descent-override` values. Lift those three numbers verbatim and apply them to a local-system `@font-face` renamed to the system font (`"Arial"`, `"Times New Roman"`, `"Courier New"`).

The CLS chain that results:
- **Initial paint**: `body { font-family: arial, sans-serif; }` — renders the metric-adjusted local Arial because the override `@font-face` named `"Arial"` wins over the OS Arial. Line box already matches the brand font's metrics.
- **Session activates**: `body.session` switches to `var(--font-body)`. Brand woff2 is still loading; Arial renders in its place with matching metrics. **Zero shift.**
- **Brand font loads**: swaps in. **Zero shift** because metrics already match.

**4. Match the fallback family to the brand font's classification.**
Use the SAME class of typeface for the fallback so visual rhythm is preserved during the load:
- Sans-serif brand → fallback `arial, sans-serif`. Override `@font-face "Arial"` with `local("Arial")`.
- Serif brand → fallback `times, "Times New Roman", serif`. Override `@font-face "Times New Roman"` with `local("Times New Roman")`.
- Monospace brand → fallback `"Courier New", courier, monospace`. Override `@font-face "Courier New"` with `local("Courier New")`. (Note: skipping monospace metric-matching is acceptable when the mono font is only used in small eyebrows/labels — CLS impact is negligible. Document the choice in the conversion log.)

Never substitute classifications (don't match a serif brand to Arial; don't match a sans brand to Times). Even with metric overrides, character widths and rhythm differ enough that the visible shift is jarring.

### 5. Lean on EDS button conventions — DO NOT manufacture button anchors in block JS

The EDS link decorator in `scripts/ak.js` (`decorateButton()`) automatically applies button classes when authors wrap a link in inline emphasis. This runs during page boot, AFTER block JS. Block JS just needs to clone the cell anchor as-is.

**Author markup → auto-applied class:**

| Author markup | Class applied | Visual |
|---|---|---|
| `<strong><a>` | `.btn.btn-primary` | wavelength fill, dark text |
| `<em><a>` | `.btn.btn-secondary` | transparent + outline (color-aware) |
| `<em><strong><a>` | `.btn.btn-accent` | canvas fill on dark surfaces |
| `<del><a>` | `.btn.btn-negative` | rare; destructive |
| `+ <u>` inside any | adds `.btn-outline` | transparent variant |
| 2+ buttons in same parent | parent gets `.btn-group` | flex with gap |

**Add to `styles/styles.css`** (the project's brand button system):

```css
a.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 26px;
  font-size: 12px;
  font-weight: var(--weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid transparent;
  transition: background 0.25s var(--ease-out), color 0.25s var(--ease-out), border-color 0.25s var(--ease-out);
}

a.btn-primary { background: var(--color-wavelength); color: var(--color-ink-rich); border-color: var(--color-wavelength); }
a.btn-primary:hover { background: var(--color-canvas); border-color: var(--color-canvas); }

a.btn-secondary { background: transparent; color: currentcolor; border-color: rgb(255 255 255 / 40%); }
a.btn-secondary:hover { border-color: currentcolor; background: rgb(255 255 255 / 5%); }

/* On light surfaces, secondary uses dark-tinted outline. List the dark sections explicitly. */
main .section:not(.dark, .closing, .hero, .team) a.btn-secondary { border-color: var(--color-rule-strong); color: var(--color-ink-rich); }
main .section:not(.dark, .closing, .hero, .team) a.btn-secondary:hover { border-color: var(--color-ink-rich); }

/* Trailing arrow on primary/accent. */
a.btn-primary::after, a.btn-accent::after { content: "→"; font-weight: 600; transition: transform 0.3s var(--ease-out); }
a.btn-primary:hover::after, a.btn-accent:hover::after { transform: translateX(4px); }

.btn-group { display: inline-flex; flex-wrap: wrap; gap: 16px; align-items: center; }
```

**Block JS pattern — just clone the cell:**

```js
// Get the cell that holds the CTAs
const ctaCell = rows[N]?.firstElementChild;
if (ctaCell && ctaCell.querySelector('a')) {
  const actions = document.createElement('div');
  actions.className = 'actions';
  [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
  container.append(actions);
}
```

DO NOT manufacture anchors with `cta.className = 'btn-loud'` or inject custom SVG arrows. The global `::after` arrow + the convention's class system handle 95% of cases.

**Block CSS pattern — only override what's actually different:**

The `closing` block's CTA is slightly larger than the global default. That's a legitimate override:

```css
.closing .actions a.btn-primary { padding: 22px 32px; font-size: 13px; }
```

Three lines. Targets the global class, not a custom one. This is the entire "blocks slightly augment defaults" pattern.

**When NOT to use the convention:**

Some links are NOT buttons. Examples:
- A wavelength-underlined text link in a section footer ("How we work →"). It's a styled text link, not a chip.
- Whole-card anchors on tile grids (`<a class="tile">…</a>`). The whole tile is the click target.
- Channel values in a closing CTA (`<a href="tel:…">801-363-0101</a>`). It's a value, not a CTA.
- `mailto:` / `tel:` links inside prose.

For these: the author leaves the `<a>` as a plain anchor in content (no `<strong>` / `<em>` wrap), and the owning block styles it with per-block CSS. The convention is for buttons; if it's not a button, don't apply it.

### 6. Chrome (header + footer)

The header and footer blocks are special because they load from fragments and **EDS strips classes/ids from non-block default content.** Class-based identification works locally but fails in production.

Identify elements **structurally**:

```js
// In header.js
const root = doc.querySelector('main') || doc.body;

// Logo: first <picture>; preserve its wrapping <a> if present.
const picture = root.querySelector('picture, img');
const wrappingAnchor = picture.closest('a');

// Nav list: first <ul>.
const list = root.querySelector('ul');

// CTA: last <a> not inside the logo wrapper and not inside the nav <ul>.
const ctaSource = [...root.querySelectorAll('a')].reverse().find((a) => (
  !a.querySelector('picture, img') && !a.closest('ul')
));
```

```js
// In footer.js — columns are direct children of the wrapping <div>.
const cols = [...wrapper.children].filter((c) => c.tagName === 'DIV');
const lockupCol  = cols.find((c) => c.querySelector('picture, img'));
const colophonCol = cols[cols.length - 1] !== lockupCol ? cols[cols.length - 1] : null;
const linkCols    = cols.filter((c) => c !== lockupCol && c !== colophonCol && c.querySelector('ul'));
```

Then rebuild into a chrome shape with the classes the CSS expects (`.lockup`, `.group`, `.colophon`, `.cta-btn`).

Fragment files at `content/fragments/nav/{header,footer}.html` follow the EDS document shape:

```html
<!DOCTYPE html>
<html lang="en">
<body>
<header></header>
<main>
<div>
  <p><a href="/" aria-label="Home"><picture><img src="…" alt="…"></picture></a></p>
  <ul>…nav links…</ul>
  <p><a href="/contact">Start a project</a></p>
</div>
</main>
<footer></footer>
</body>
</html>
```

### 7. Blocks (parallel agents)

Dispatch one agent per page-archetype cluster (utility pages, services, case studies, etc.). Each agent owns a non-overlapping set of new blocks and content pages. Three to four parallel agents is the sweet spot.

The brief template:

> Per the project's locked direction: each prototype `<section>` becomes its own EDS block. Lift the prototype's `<style>` for that section verbatim, scope it under the block class (`.block-name .x` instead of `section.x .y`), and rebuild the prototype's DOM through a `decorate(block)` function that consumes EDS table-block input.
>
> **You own**: prototypes [list], content pages [list], sections [list].
>
> **Existing blocks — REUSE, do not recreate**: [list with one-line authoring shape per block].
>
> **Brand tokens** are global in `styles/styles.css`; do not redefine.
>
> **Buttons**: do NOT manufacture button anchors. Author CTAs as `<strong><a>` (primary) or `<em><a>` (secondary) in the content page; in block JS, clone the cell's child nodes into a `.actions` wrapper. Block CSS only overrides global button styles when something is genuinely different (e.g. larger size). Text links with flourish (wavelength underline) are NOT buttons — leave as plain `<a>` and style per-block.
>
> **EDS block convention**: each block at `blocks/<name>/<name>.{js,css}`. JS exports `default async function decorate(block)`. Block input is `<div class="block-name"><div>row<div>cell</div></div>…</div>`. CSS scoped under `.block-name`. Inline SVG markup per-block (no shared utility). Honor `prefers-reduced-motion`.
>
> **EDS content page format**: NO `<head>` element (project `head.html` is injected by EDS), empty `<header></header>`/`<footer></footer>`, each top-level `<div>` inside `<main>` is one section containing one block, no `<style>`/`<script>`/section-metadata, fully-qualified image URLs.
>
> **Done criteria**: [list of paths]. Return a list of new blocks + one-line summary per page.

Agents do not need to coordinate on shared blocks — the brief tells them which existing blocks to reuse.

### 8. Block JS scaffold

```js
/**
 * <block-name> — <one-line description from prototype data-intent attribute>
 *
 * Authoring rows (positional):
 *   1. <picture> background image
 *   2. eyebrow text
 *   3. <h2> headline (use <strong> for emphasis colored wavelength)
 *   4. body paragraph
 *   5. CTA links — wrap primary in <strong>, secondary in <em>; the EDS link
 *      decorator applies .btn.btn-primary / .btn.btn-secondary
 *   6..N: card rows — cells: num | label | description
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }
function pic(cell)  { return cell ? cell.querySelector('picture, img') : null; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // 1. Read each row positionally
  // 2. Build the prototype's DOM (with prototype-style class names)
  // 3. For CTA rows, clone the cell's child nodes into a .actions wrapper —
  //    do NOT manufacture button anchors with custom classes.
  // 4. block.replaceChildren(...newMarkup);
}
```

### 9. Content page scaffold

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <header></header>
  <main>
    <div>
      <div class="block-name">
        <div><div>cell content</div><div>cell content</div></div>
        <div><div><strong><a href="/path">Primary CTA</a></strong> <em><a href="/path">Secondary CTA</a></em></div></div>
      </div>
    </div>
    <div>
      <!-- next section -->
    </div>
  </main>
  <footer></footer>
</body>
</html>
```

**Do NOT emit a `<head>` element.** EDS content pages are markdown-equivalent fragments: the document chrome (title, meta, stylesheets, scripts) lives in the project's `head.html`, which EDS injects at delivery time. A `<head>` block in a content page is dead weight at best and a duplication conflict at worst. Same rule applies to fragment files (`content/fragments/**`).

Image URLs MUST be fully qualified (`https://main--<repo>--<owner>.aem.page/stardust/prototypes/images/…`) so EDS preview and the rendered prototype agree on what to show.

## Anti-patterns (lessons paid for the hard way)

These look reasonable. They will cost a full reset.

**1. Abstracting prototype sections into "blocks with variants."**
Building one `hero` block with five class-variant treatments (`dark` / `light` / `image` / `full-bleed` / `with-wave`) seems DRY. In practice the variants don't share enough markup or CSS to compress; the JS forks too many ways; CSS gets brittle. **Build one block per distinct prototype section.** Reuse only when sections are byte-identical.

**2. Section-metadata style classes that parallel block variants.**
Defining `.section.dark`, `.section.prose-2col`, `.section.eyebrow`, etc. and applying them via section-metadata adds a second styling system that overlaps with block CSS. Authors don't know whether to set `dark` on the section or on the block. Pick one path: **per-block CSS that paints the entire section.** No section-style classes.

**3. Shared utility modules (waves, animation primitives).**
A wave SVG that all blocks import seems reusable. But each prototype section uses its wave differently (different dimensions, colors, animation). Inlining the SVG inside the owning block is more code on paper but eliminates a coupling and makes each block self-contained.

**4. Manually creating button anchors in block JS.**
Code like `cta.className = 'btn-loud'; cta.innerHTML = '<span>…</span>' + ARROW_SVG;` duplicates the EDS button decorator's job, fights its class-application order, and ties block JS to specific button classes. **Clone the cell anchor; let `decorateButton()` apply the class.** Block CSS overrides the global button style only when something is actually different (size, hover variant).

**5. Class-based element detection in fragments.**
EDS strips classes from non-block default content when loading fragments. `fragment.querySelector('.lockup')` works locally, returns `null` in production. **Always identify by structure**: first `<picture>`, last `<a>`, only `<ul>`, etc.

**6. `.default-content-wrapper` (or any guess about EDS's section DOM).**
The actual EDS shape is `<div class="section"><div class="default-content">…</div><div class="block-content">…</div></div>`. Confirm by inspecting a rendered page in the browser before designing CSS that relies on the wrapping shape.

**7. Doing the audit in too much depth.**
A 22-pattern audit produces abstractions. You only need a per-page section list. Pattern reuse emerges organically when you find two byte-identical sections.

**8. Building before locking decisions.**
Naming + reuse decisions look small but ripple through every block and content page. **Surface 3–5 naming questions to the user up front.** Lock answers in writing before any block code.

**9. Generic placeholder image paths.**
`/img/case-studies/foo.jpg` will 404 unless those images are uploaded. Use the prototype host URL so what you author renders correctly in EDS preview from day one.

**10. Touching `head.html` for fonts (preload included).**
Google Fonts `<link>` tags, Adobe Fonts script tags, any CDN-hosted stylesheet, AND `<link rel="preload" as="font">` lines all belong out of `head.html`. The first three add DNS/handshake hops and external coupling; the preload looks helpful but it's not — the metric-matched `body.session` pattern (principle 3) makes preload irrelevant for CLS, and adding it splits font discovery between two files. Declare `@font-face` in `styles/styles.css` only. Document any non-self-hostable proprietary font and the CLS trade-off it imposes.

**11. Skipping the metric-matched fallback `@font-face`.**
Without `size-adjust` + `ascent-override` + `descent-override` on a system-font fallback, the swap from system font → brand font shifts every line of text on the page when the woff2 lands. Lift the calibration from the matching `@fontsource-variable/<name>` package; rename the override `@font-face` after the system font (`"Arial"`, `"Times New Roman"`) so any reference to that family in a font stack picks up the adjusted metrics automatically.

**12. Over-applying the button convention.**
Not every link is a button. Whole-card tile anchors, tel:/mailto: channel values, and styled text links (e.g. wavelength-underlined "How we work →") are NOT buttons. Authors leave these as plain `<a>`; per-block CSS styles them. **The convention is for chips with a clickable boundary; if it's not that, don't apply it.**

## Checklist (per page)

- [ ] Each section in the prototype `<main>` has a corresponding block call in the content page.
- [ ] **No `<head>` element.** The page goes `<!DOCTYPE html><html><body>…</body></html>` — EDS injects the project `head.html` at delivery. Fragment files follow the same rule.
- [ ] `<header></header>` and `<footer></footer>` are EMPTY (chrome resolves via fragments).
- [ ] Image URLs are fully qualified (`https://main--…/stardust/prototypes/images/…`).
- [ ] No `<style>` or `<script>` tags in the content page.
- [ ] No section-metadata blocks.
- [ ] Closing CTA reuses the shared `closing` block.
- [ ] CTA links are wrapped in `<strong>` (primary) or `<em>` (secondary). Text links and tile-card anchors are plain `<a>`.
- [ ] Block JS exports `default async function decorate(block)` with JSDoc describing rows and noting any button conventions.
- [ ] Block CSS is scoped under `.block-name`.
- [ ] Block CSS does NOT redefine global tokens.
- [ ] Block CSS does NOT redefine global button classes (only legitimate overrides like size or hover variant).
- [ ] SVG markup is inline in the block JS (no shared waves utility).
- [ ] Block JS does NOT manufacture button anchors with custom classes.
- [ ] `prefers-reduced-motion: reduce` honored on any animation.
- [ ] `head.html` is untouched. No font `<link>`, `<script>`, `<style>`, or `<link rel="preload" as="font">` lines added. All `@font-face` declarations live in `styles/styles.css`. Brand woff2(s) live in `styles/fonts/`.
- [ ] Body defaults to a metric-matched system fallback (`arial, sans-serif` for sans brand, `times, "Times New Roman", serif` for serif). `body.session` switches to the brand stack via `var(--font-body)`.
- [ ] An override `@font-face` named after the system font (e.g. `"Arial"`) declares `size-adjust` / `ascent-override` / `descent-override` lifted from `@fontsource-variable/<name>`'s published calibration. Result: zero CLS on font swap.
- [ ] No per-block `font-family: var(--font-body)` or `var(--font-display)` declarations. Brand font flows from `body.session` via inheritance. Only mono and serif (Fraunces / Times) families are explicitly set per-block.

## When you finish

Update `stardust/eds-conversion-log.md` (or create one) with: final block inventory, decisions locked, anti-patterns avoided this run, anything site-specific the next person should know. The log is the running history of "why does this look the way it does."
