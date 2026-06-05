/**
 * closing — "Get started in 30 seconds." — the magenta→coral gradient CTA
 * band reused as the closing section on every page. Lifted from the
 * stardust prototype <section class="final">.
 *
 * Authoring rows (positional):
 *   1. H2 headline
 *   2. sub paragraph
 *   3. CTA — wrap primary in <strong>; the EDS link decorator (ak.js
 *      decorateButton) applies .btn / .btn-primary. The cell's child
 *      nodes are cloned verbatim.
 */

function pickCell(row, i = 0) {
  if (!row) return null;
  return row.children[i] || row;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const h2Cell = pickCell(rows[0]);
  const subCell = pickCell(rows[1]);
  const ctaCell = pickCell(rows[2]);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (h2Cell) {
    const h2 = document.createElement('h2');
    const heading = h2Cell.querySelector('h1, h2, h3');
    h2.innerHTML = heading ? heading.innerHTML : h2Cell.innerHTML;
    wrap.append(h2);
  }

  if (subCell && subCell.textContent.trim()) {
    const sub = document.createElement('p');
    sub.textContent = subCell.textContent.trim();
    wrap.append(sub);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  block.replaceChildren(wrap);
}
