/**
 * faq — "FAQs" — a native <details>/<summary> accordion of Q/A pairs.
 * Lifted from the stardust prototype <div class="faq"> (Results FAQs).
 *
 * Authoring rows (positional):
 *   1. H2 heading ("FAQs")
 *   2..N: Q/A rows — cell 1: question, cell 2: answer.
 *
 * The first Q/A item is rendered open. No JS interaction is required —
 * native <details> handles toggling; the +/- marker is CSS.
 */

function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const center = document.createElement('div');
  center.className = 'center wrap';
  const headingCell = rows[0]?.children[0] || rows[0];
  const heading = headingCell ? headingCell.querySelector('h1, h2, h3') : null;
  const h2 = document.createElement('h2');
  h2.innerHTML = heading ? heading.innerHTML : (text(headingCell) || 'FAQs');
  center.append(h2);

  const list = document.createElement('div');
  list.className = 'faq-list wrap';

  rows.slice(1).forEach((row, i) => {
    const q = text(row.children[0]);
    const a = text(row.children[1]);
    if (!q) return;

    const details = document.createElement('details');
    if (i === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.textContent = q;
    details.append(summary);

    if (a) {
      const p = document.createElement('p');
      p.textContent = a;
      details.append(p);
    }

    list.append(details);
  });

  block.replaceChildren(center, list);
}
