# EDS conversion log — casestudy-proposed.html (skilltest run)

Source prototype: `stardust/prototypes/casestudy-proposed.html`
(Hobsons Bay City Council — Knack customer story.)
Target content page: `_da/skilltest/casestudy.html`

## Skill applied

`stardust-to-snowflake` — one prototype `<section>` = one EDS block; per-section
CSS lifted verbatim and rescoped under the block class; DOM rebuilt in
`decorate(block)`; CTAs authored as `<strong><a>` / `<em><a>` and cloned in JS
(EDS `decorateButton` in `scripts/ak.js` applies `.btn` classes); brand tokens
already global in `styles/styles.css` (NOT modified).

## Audit — prototype <main> sections (chrome excluded)

`casestudy: hero, challenge, solution, next, final` plus `nav` (header) and
`footer`. `nav`/`footer` are chrome and resolve via existing fragments —
not authored on this page.

## Naming + reuse decisions — LOCKED

The skill says "surface 3–5 naming questions to the user before writing code."
No interactive channel here, so the answers are locked below.

1. **Is the case-study hero the same as the home `hero` / `hero-plain` /
   `solution-hero`?**
   No. It carries a breadcrumb, a display-scale pulled blockquote, a trust line,
   and a 3-up hairline stat strip — none of the existing heroes have this shape.
   The names `hero`, `hero-plain`, `solution-hero` are already taken and look
   different. Per the skill's archetype-prefix rule → **new block
   `casestudy-hero`**. (Note: an existing `_da/case-study/hobsons-bay.html` uses
   `hero-plain`; that is a different, plainer page treatment and is left
   untouched. This skilltest page is the richer "proposed" redesign.)

2. **The challenge section (2-col prose + magenta pullquote card) — reuse
   anything?** No existing 2-col-prose-with-pullquote block. `solution-prose`
   is an icon+title+body stack, not this. → **new block `casestudy-split`**.

3. **The solution section (centered header + 3×2 icon cards) — reuse `cards`
   or `value-cards` / `components`?** The card visual (coral-gradient rounded
   icon chip, hairline border, hover lift) is the prototype's own `.ccard`
   treatment and the header is a centered eyebrow+h2+sub. Rather than bend an
   existing card block's paint, lift the prototype section verbatim →
   **new block `casestudy-cards`**. Icons authored as plain text cells so emoji
   pass through and the two inline-SVG (lucide) icons are reproduced in block JS
   by keyword; unknown keyword falls back to a generic glyph (graceful).

4. **The "What's next" section — reuse anything?** It is a narrow surface-tinted
   prose band (eyebrow + h2 + paragraphs). Small and specific; gets its own
   block → **new block `casestudy-next`**.

5. **The final CTA band (`section.final`, magenta→coral gradient) — reuse the
   shared `closing` block?** Yes. The existing `closing` block was lifted from
   exactly this `section.final` treatment and its row contract ([h2],[sub],[CTA])
   fits. → **REUSE `closing`** (no new block).

## Section → block mapping (locked)

| Prototype `<section>` | EDS block        | New? |
|-----------------------|------------------|------|
| `hero`                | `casestudy-hero` | new  |
| `challenge`           | `casestudy-split`| new  |
| `solution`            | `casestudy-cards`| new  |
| `next`                | `casestudy-next` | new  |
| `final`               | `closing`        | reuse|

Header/footer chrome → existing `header`/`footer` blocks + fragments.

## New blocks — row contracts (one line each)

- **casestudy-hero**: [breadcrumb links cell] · [eyebrow] · [h1] · [sub] ·
  [CTAs: `<strong><a>` + `<em><a>`] · [trust line] · [pulled quote: blockquote
  cell] · [cite name/role cell] · then one row per stat: [value][label].
- **casestudy-split**: [eyebrow] · [h2] · [prose cell with `<p>`s] · [pullquote
  blockquote cell] · [pullquote cite cell].
- **casestudy-cards**: [eyebrow] · [h2] · [sub] · then one row per card:
  [icon keyword/emoji][h3 title][body].
- **casestudy-next**: [eyebrow] · [h2] · [prose cell with `<p>`s].

## Existing blocks reused

- `closing` — rows [h2], [sub], [CTA]. Used for the final CTA band.
- `header` / `footer` — chrome via fragments (unchanged).

## Buttons

CTAs authored as `<strong><a>` (primary) and `<em><a>` (secondary "Talk to
sales →"). Block JS clones the CTA cell's child nodes into `.actions`; no
button anchors manufactured. The prototype's secondary is a `.link-sec` text
link ("Talk to sales →") — authored as `<em><a>` so it becomes `.btn-secondary`
via the convention, matching the prototype's pairing intent. The trailing arrow
is kept in the link text as authored.

## Images

The prototype `<main>` content references NO images — all card icons are inline
lucide SVG or emoji. The only `<img>` in the prototype is the Knack logo in the
nav/footer chrome (`../current/assets/logo.svg`), which is owned by the
header/footer fragments, not this content page. So there are **no image URLs to
qualify on the content page and no missing-image risk** for the authored blocks.

## Constraints honored

- styles/styles.css, scripts/*, head.html, existing blocks: NOT modified.
- No global tokens redefined; no section-metadata; no `<style>`/`<script>` in page.
- Block CSS scoped under the block class; brand font flows via inheritance
  (`body.session`); no per-block `font-family: var(--font-body)`.
- `prefers-reduced-motion: reduce` honored on hover/reveal motion.
- `node --check` run on every block JS.
- No deploy (no admin.da.live, no push).

## Anti-patterns avoided this run

- Did NOT abstract heroes into one variant block — `casestudy-hero` is its own
  block (anti-pattern #1).
- Did NOT add section-metadata style classes (#2).
- Did NOT build a shared icon/SVG utility — inline per-block (#3).
- Did NOT manufacture button anchors — cloned the cell (#4).
- Did NOT touch head.html / fonts (#10).
- Reused `closing` instead of cloning the gradient band (correct reuse).
</content>
</invoke>
