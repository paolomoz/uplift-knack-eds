/**
 * hero-plain — page hero WITHOUT the live-app mock (used on listing and
 * detail pages whose source hero carries no app visual). Renders a centered
 * eyebrow + H1 + sub + CTAs over the brand wash.
 *
 * Authoring rows (positional):
 *   1. eyebrow text (optional)
 *   2. H1 headline
 *   3. sub paragraph (optional)
 *   4. CTAs (optional) — <strong><a> primary, plain <a> secondary
 */
function pick(row, i = 0) { return row ? (row.children[i] || row) : null; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = pick(rows[0]);
  const h1Cell = pick(rows[1]);
  const subCell = pick(rows[2]);
  const ctaCell = pick(rows[3]);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

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
    // gradient word authored as <em> (DA-safe) -> gradient <span>
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
    cta.querySelectorAll('a:not(.btn)').forEach((a) => a.classList.add('link-sec'));
    wrap.append(cta);
  }

  block.replaceChildren(wrap);
}
