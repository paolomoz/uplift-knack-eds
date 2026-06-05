# Block row contracts

## hero
Static live-app mock is block-internal (not authorable). Editable rows:
1. eyebrow text
2. H1 headline — may contain a `<span>` for the coral-gradient word
3. sub paragraph
4. CTAs — `<strong><a>` primary + `<em><a>` secondary (cloned verbatim; ak.js decorateButton adds .btn classes)

## logos
1. the "Trusted by 100,000+ users across the world" line (plain text)
2. a `<ul><li>…</li></ul>` of customer/logo names — each `<li>` becomes a grayscale name span

## feature-tabs
1. eyebrow text
2. H2 headline
3. sub paragraph
4..N: one row PER tab, cells in order:
   - cell1 tab label
   - cell2 panel eyebrow
   - cell3 panel H3
   - cell4 panel body
   - cell5 image (`<picture>`/`<img>`, fully-qualified screenshot URL)
   First tab is selected by default; clicking a pill toggles aria-selected + the panel `.on` class.


## value-cards
Section "No code. No delay. No hassle." — 3 value cards (icon + title + body).
Row contract (positional):
- Row 1: H2 section heading.
- Rows 2..N (one per card):
  - cell1 = icon keyword (`zap` | `clock` | `bar-chart-3`; unknown falls back to `zap`)
  - cell2 = card title (rendered as `<h3>`)
  - cell3 = card body (rendered as `<p>`)
Icons inline Lucide SVG in JS. Cards visible by default; optional IntersectionObserver fade-up (reduced-motion safe). No buttons/images.

## comparison
Section `.compare` "How Knack stands apart" — 3 columns (vs Coding / Knack featured / vs No-Code).
Row contract (positional):
- Row 1: eyebrow text.
- Row 2: H2 heading.
- Rows 3..N (one per column):
  - cell1 = column kicker / "vs." label (e.g. "vs. Coding tools", "Knack")
  - cell2 = column title (rendered as `<h3>`)
  - cell3 = a `<ul>` of points (cloned verbatim)
  - cell4 = optional flag; literal text `featured` marks the magenta Knack column (✓ ticks); others render ✕.
No buttons/images. Cards visible.

## components
Section "Built on enterprise-grade components" — 6-up card grid (icon + title + desc), 3 columns x 2 rows.
Row contract (positional):
- Row 1: H2 section heading.
- Rows 2..N (one per component):
  - cell1 = icon keyword (`database` | `palette` | `shield-check` | `settings` | `line-chart` | `sparkles`; unknown falls back to `database`)
  - cell2 = title (rendered as `<h3>`)
  - cell3 = description (rendered as `<p>`)
Icons inline Lucide SVG in JS. Cards visible by default; optional IntersectionObserver fade-up (reduced-motion safe). No buttons/images.

## integrations-band
Source: prototype `<section class="integ">` — magenta→coral gradient band, "Move beyond patchwork integrations".
DA rows (positional):
- row 1, cell 1: H2 headline
- row 2, cell 1: sub paragraph
- row 3, cell 1: CTA — author as `<strong><a>` (primary). On the gradient band, block CSS inverts `a.btn-primary` to white fill / brand-color text.
Block-internal (NOT authored): the 8 lettered decorative tiles (Z, S, G, M, St, Q, Tw, Hb).

## stats
Source: prototype `<div class="stats">` (Results section) — three big gradient stats.
DA rows (positional): one row per stat (3 rows) —
- cell 1: number (e.g. "$250k+")
- cell 2: label (e.g. "saved per year")
Numbers render STATICALLY at final values; optional reduced-motion-safe count-up enhancement only when motion is allowed (final value always in DOM first). The prototype's `.story` blockquote is intentionally omitted (not in contract).

## faq
Source: prototype `<div class="faq">` (Results FAQs) — native `<details>` accordion.
DA rows (positional):
- row 1, cell 1: H2 heading ("FAQs")
- rows 2..N: Q/A — cell 1: question, cell 2: answer.
First Q/A item is rendered open. No JS interaction (native `<details>`; +/- marker via CSS).

## closing
Source: prototype `<section class="final">` — gradient CTA band, reused as the closing on every page.
DA rows (positional):
- row 1, cell 1: H2 headline
- row 2, cell 1: sub paragraph
- row 3, cell 1: CTA — author as `<strong><a>` (primary). Block CSS inverts `a.btn-primary` to white fill / brand-color text on the gradient band.
