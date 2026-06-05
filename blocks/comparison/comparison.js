/**
 * comparison — "How Knack stands apart" 3-column comparison.
 *
 * Authoring rows (positional):
 *   1. eyebrow text (e.g. "The honest comparison")
 *   2. <h2> heading (e.g. "How Knack stands apart")
 *   3..N: one row per column — cells:
 *        cell1 = column kicker / "vs." label (e.g. "vs. Coding tools", "Knack")
 *        cell2 = column title (becomes <h3>)
 *        cell3 = a <ul> of points (each <li> a point)
 *        cell4 = optional "featured" flag — the literal text "featured" marks
 *                the magenta Knack column (✓ ticks); other columns render ✕.
 *
 * No buttons. No images. Cards render visible.
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const frag = document.createDocumentFragment();
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // Row 1: eyebrow. Row 2: heading.
  const eyebrowText = text(rows[0]);
  const headRow = rows[1];
  const headEl = headRow ? (headRow.querySelector('h1, h2, h3, h4') || headRow) : null;
  const headingText = headEl ? text(headEl) : '';

  if (eyebrowText || headingText) {
    const center = document.createElement('div');
    center.className = 'center';
    if (eyebrowText) {
      const p = document.createElement('p');
      p.className = 'eyebrow';
      p.textContent = eyebrowText;
      center.append(p);
    }
    if (headingText) {
      const h2 = document.createElement('h2');
      h2.textContent = headingText;
      center.append(h2);
    }
    wrap.append(center);
  }

  // Remaining rows: columns.
  const grid = document.createElement('div');
  grid.className = 'cmp-grid';

  rows.slice(2).forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const kicker = text(cells[0]);
    const title = text(cells[1]);
    const list = cells[2] ? cells[2].querySelector('ul') : null;
    const featured = /featured/i.test(text(cells[3]));
    if (!kicker && !title && !list) return;

    const col = document.createElement('div');
    col.className = featured ? 'cmp knack' : 'cmp';

    if (kicker) {
      const vs = document.createElement('div');
      vs.className = 'vs';
      vs.textContent = kicker;
      col.append(vs);
    }
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      col.append(h3);
    }
    if (list) {
      col.append(list.cloneNode(true));
    }
    grid.append(col);
  });

  if (grid.children.length) wrap.append(grid);
  frag.append(wrap);
  block.replaceChildren(frag);
}
