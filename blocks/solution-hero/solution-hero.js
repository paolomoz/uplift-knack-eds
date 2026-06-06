/**
 * solution-hero — the solution-page hero. Lifted from the stardust prototype
 * <section class="hero"> on solution-proposed.html, but WITHOUT the live-app
 * mock (this hero is text-only: breadcrumb + eyebrow + H1 + sub + CTAs +
 * trust line). Left-aligned over the brand wash.
 *
 * Authoring rows (positional):
 *   1. breadcrumb (optional) — author the trailing/current crumb as <em>;
 *      it renders highlighted in brand color.
 *   2. eyebrow text (optional)
 *   3. H1 headline — author the gradient/emphasis tail as <em>; it becomes
 *      a brand-colored <span>.
 *   4. sub paragraph (optional)
 *   5. CTAs (optional) — <strong><a> primary, <em><a> secondary. The cell's
 *      child nodes are cloned verbatim; ak.js decorateButton applies classes.
 *   6. trust line (optional) — e.g. "★★★★★ Trusted by thousands…"; the lead
 *      star glyphs (author as <strong>) render as the colored star rating.
 */
function pick(row, i = 0) { return row ? (row.children[i] || row) : null; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const crumbCell = pick(rows[0]);
  const eyebrowCell = pick(rows[1]);
  const h1Cell = pick(rows[2]);
  const subCell = pick(rows[3]);
  const ctaCell = pick(rows[4]);
  const trustCell = pick(rows[5]);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (crumbCell && crumbCell.textContent.trim()) {
    const crumb = document.createElement('p');
    crumb.className = 'crumb';
    crumb.innerHTML = crumbCell.innerHTML;
    // current crumb authored as <em> -> brand-colored span
    crumb.querySelectorAll('em, i').forEach((em) => {
      const span = document.createElement('span');
      span.innerHTML = em.innerHTML;
      em.replaceWith(span);
    });
    wrap.append(crumb);
  }

  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const e = document.createElement('p');
    e.className = 'eyebrow';
    e.textContent = eyebrowCell.textContent.trim();
    wrap.append(e);
  }

  if (h1Cell) {
    const h1 = document.createElement('h1');
    const heading = h1Cell.querySelector('h1, h2, h3');
    h1.innerHTML = heading ? heading.innerHTML : h1Cell.innerHTML;
    // emphasis tail authored as <em> -> brand-colored span
    h1.querySelectorAll('em, i').forEach((em) => {
      const span = document.createElement('span');
      span.innerHTML = em.innerHTML;
      em.replaceWith(span);
    });
    wrap.append(h1);
  }

  if (subCell && subCell.textContent.trim()) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = subCell.textContent.trim();
    wrap.append(sub);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const cta = document.createElement('div');
    cta.className = 'hero-cta';
    [...ctaCell.childNodes].forEach((n) => cta.append(n.cloneNode(true)));
    wrap.append(cta);
  }

  if (trustCell && trustCell.textContent.trim()) {
    const trust = document.createElement('div');
    trust.className = 'trust';
    trust.innerHTML = trustCell.innerHTML;
    // star glyphs authored as <strong> -> .stars span
    trust.querySelectorAll('strong, b').forEach((s) => {
      // only convert the leading glyph run to .stars; keep emphasis words bold
      if (/^[★☆\s]+$/.test(s.textContent)) {
        const span = document.createElement('span');
        span.className = 'stars';
        span.innerHTML = s.innerHTML;
        s.replaceWith(span);
      }
    });
    wrap.append(trust);
  }

  block.replaceChildren(wrap);
}
