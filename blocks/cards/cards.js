/**
 * cards — generic responsive card grid covering the migrated [cards] /
 * [group] / [grid] sections (feature cards, checklists, related links).
 *
 * Authoring rows (positional):
 *   Optional heading row: a SINGLE cell containing an <h2> (and optionally a
 *     trailing <p> lead). Detected by the presence of <h2>.
 *   Card rows: one per card. Either
 *     [title, body]  — cell1 becomes <h3>, cell2 is rich body, or
 *     [body]         — a single rich cell (preserved verbatim: p/ul/a).
 */
function text(el) { return el ? el.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const frag = document.createDocumentFragment();

  // ---- optional heading / count row ----
  // For listing grids the header may carry only a count ("105 app templates")
  // with no <h2>, so on the .listing variant any single-cell first row is the
  // header. Otherwise require an <h2> to avoid mistaking a card for a header.
  const listing = block.classList.contains('listing');
  let start = 0;
  const firstCells = [...rows[0].children];
  if (firstCells.length === 1 && (firstCells[0].querySelector('h2') || listing)) {
    const cell = firstCells[0];
    const center = document.createElement('div');
    center.className = 'center';
    const h2src = cell.querySelector('h2');
    const htext = h2src ? text(h2src) : '';
    if (htext) {
      const h2 = document.createElement('h2');
      h2.textContent = htext;
      center.append(h2);
    }
    // lead/count: prefer a <p>, but DA unwraps a lone <p> to bare text, so
    // fall back to the cell's own text (minus the heading).
    const leadP = cell.querySelector('p');
    let leadText = leadP ? text(leadP) : text(cell);
    if (htext && !leadP) leadText = leadText.replace(htext, '').trim();
    if (leadText) {
      const l = document.createElement('p');
      l.className = 'lead';
      l.textContent = leadText;
      center.append(l);
    }
    if (center.childNodes.length) { frag.append(center); start = 1; }
  }

  // ---- cards ----
  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  for (let i = start; i < rows.length; i += 1) {
    const cells = [...rows[i].children];
    if (!cells.length) continue;
    const card = document.createElement('div');
    card.className = 'card';

    let iconCell;
    let titleCell;
    let bodyCell;
    if (cells.length >= 3) { [iconCell, titleCell, bodyCell] = cells; }
    else if (cells.length === 2) { [titleCell, bodyCell] = cells; }
    else { [bodyCell] = cells; }

    // optional card image — rendered here (block JS) so EDS's content media
    // pipeline doesn't rewrite/break the src; missing files hide gracefully.
    if (iconCell) {
      const m = text(iconCell).match(/^(icon|media):(.+)$/);
      if (m) {
        const im = document.createElement('img');
        im.src = m[2];
        im.loading = 'lazy';
        im.alt = text(titleCell) || '';
        im.className = m[1] === 'media' ? 'card-media' : 'card-icon';
        im.addEventListener('error', () => im.remove());
        card.append(im);
      }
    }

    if (titleCell && text(titleCell)) {
      const h3 = document.createElement('h3');
      h3.textContent = text(titleCell);
      card.append(h3);
    }
    if (bodyCell) {
      const tmp = document.createElement('div');
      tmp.innerHTML = bodyCell.innerHTML;
      if (!tmp.querySelector('p, ul, ol, a, h3, h4')) {
        if (text(bodyCell)) {
          const p = document.createElement('p');
          p.textContent = text(bodyCell);
          card.append(p);
        }
      } else {
        [...tmp.childNodes].forEach((n) => card.append(n.cloneNode(true)));
      }
    }
    if (card.childNodes.length) grid.append(card);
  }

  frag.append(grid);
  block.replaceChildren(frag);
}
