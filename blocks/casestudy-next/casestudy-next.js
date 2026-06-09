/**
 * casestudy-next — "What's next": narrow surface-tinted prose band
 * (eyebrow + h2 + paragraphs). Lifted from prototype <section class="next">.
 *
 * Authoring rows (positional):
 *   1. eyebrow text ("What's next")
 *   2. <h2> headline
 *   3. prose cell — one or more <p> (cloned verbatim)
 *
 * No buttons, no images.
 */

function firstHeading(cell) {
  return cell ? cell.querySelector('h1, h2, h3') : null;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cell = (i) => (rows[i] ? rows[i].children[0] || rows[i] : null);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const eyebrowCell = cell(0);
  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    wrap.append(eyebrow);
  }

  const h2Source = firstHeading(cell(1)) || cell(1);
  if (h2Source) {
    const h2 = document.createElement('h2');
    h2.innerHTML = h2Source.innerHTML;
    wrap.append(h2);
  }

  const proseCell = cell(2);
  if (proseCell) {
    const paras = proseCell.querySelectorAll('p');
    if (paras.length) {
      paras.forEach((p) => wrap.append(p.cloneNode(true)));
    } else if (proseCell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = proseCell.textContent.trim();
      wrap.append(p);
    }
  }

  block.replaceChildren(wrap);
}
