/**
 * listing-hero — the Solutions listing hero (eyebrow, gradient headline, lead,
 * and a search box). Lifted verbatim from the stardust prototype
 * <section class="lhero">.
 *
 * Authoring rows (positional):
 *   1. eyebrow text (e.g. "Solutions")
 *   2. H1 headline — wrap the phrase to be colored in <em> to get the
 *      magenta→coral gradient text (rendered with .grad-text).
 *   3. lead paragraph
 *   4. (optional) search placeholder text — if present, a non-functional
 *      search box is rendered using that string as the input placeholder.
 *
 * No button anchors are manufactured here; the search box is decorative
 * (the prototype's filter JS is intentionally not ported).
 */

function pickCell(row, i = 0) {
  if (!row) return null;
  return row.children[i] || row;
}

const SEARCH_SVG = `<svg class="lucide lucide-search" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>`;

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = pickCell(rows[0]);
  const h1Cell = pickCell(rows[1]);
  const leadCell = pickCell(rows[2]);
  const searchCell = pickCell(rows[3]);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    wrap.append(eyebrow);
  }

  if (h1Cell) {
    const h1 = document.createElement('h1');
    const heading = h1Cell.querySelector('h1, h2, h3');
    // Map any <em> emphasis to the brand gradient-text span.
    const source = heading || h1Cell;
    source.querySelectorAll('em').forEach((em) => {
      const span = document.createElement('span');
      span.className = 'grad-text';
      span.innerHTML = em.innerHTML;
      em.replaceWith(span);
    });
    h1.innerHTML = source.innerHTML;
    wrap.append(h1);
  }

  if (leadCell && leadCell.textContent.trim()) {
    const lead = document.createElement('p');
    lead.className = 'lead';
    lead.textContent = leadCell.textContent.trim();
    wrap.append(lead);
  }

  const placeholder = searchCell ? searchCell.textContent.trim() : '';
  if (placeholder) {
    const label = document.createElement('label');
    label.className = 'lsearch';
    label.innerHTML = SEARCH_SVG;
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = placeholder;
    input.setAttribute('aria-label', 'Search solutions');
    label.append(input);
    wrap.append(label);
  }

  block.replaceChildren(wrap);
}
