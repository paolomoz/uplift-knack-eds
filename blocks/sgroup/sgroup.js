/**
 * sgroup — a solution group: a left-aligned heading + a count, then a grid of
 * whole-card solution links. Lifted verbatim from the stardust prototype
 * <section class="sgroup">. The three sgroup sections on the listing page are
 * visually identical, so they all use this one block (legitimate reuse).
 *
 * Authoring rows (positional):
 *   1. HEAD row — two cells: [heading text] | [count text, e.g. "7 solutions"]
 *   2..N. CARD rows — four cells:
 *        [icon <img>] | [title text] | [description text] | [card link <a href>]
 *
 * Each card is a WHOLE-CARD anchor (the link's href wraps icon+title+desc+go):
 * these are plain anchors, NOT buttons — the entire card is the click target,
 * so the EDS button convention is intentionally not applied. The card link
 * cell holds a single <a> whose href becomes the card href and whose text
 * becomes the "go" label.
 */

function pickCell(row, i = 0) {
  if (!row) return null;
  return row.children[i] || null;
}

function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // --- head row ---
  const headRow = rows[0];
  const head = document.createElement('div');
  head.className = 'sgroup-head';
  const h2 = document.createElement('h2');
  const headingCell = pickCell(headRow, 0);
  const heading = headingCell && headingCell.querySelector('h1, h2, h3');
  h2.textContent = heading ? heading.textContent.trim() : text(headingCell);
  head.append(h2);
  const countText = text(pickCell(headRow, 1));
  if (countText) {
    const count = document.createElement('span');
    count.className = 'muted';
    count.textContent = countText;
    head.append(count);
  }
  wrap.append(head);

  // --- cards grid ---
  const grid = document.createElement('div');
  grid.className = 'scards';

  rows.slice(1).forEach((row) => {
    const iconCell = pickCell(row, 0);
    const titleCell = pickCell(row, 1);
    const descCell = pickCell(row, 2);
    const linkCell = pickCell(row, 3);
    const sourceLink = linkCell && linkCell.querySelector('a');

    const card = document.createElement('a');
    card.className = 'scard';
    if (sourceLink) card.href = sourceLink.getAttribute('href');

    // icon
    const ic = document.createElement('span');
    ic.className = 'scard-ic';
    const img = iconCell && iconCell.querySelector('img, picture');
    if (img) ic.append(img.cloneNode(true));
    card.append(ic);

    // text (title + description)
    const tx = document.createElement('span');
    tx.className = 'scard-tx';
    const b = document.createElement('b');
    b.textContent = text(titleCell);
    tx.append(b);
    const desc = text(descCell);
    if (desc) {
      const span = document.createElement('span');
      span.textContent = desc;
      tx.append(span);
    }
    card.append(tx);

    // go label
    const go = document.createElement('span');
    go.className = 'scard-go';
    go.textContent = sourceLink ? (sourceLink.textContent.trim() || 'Explore →') : 'Explore →';
    card.append(go);

    grid.append(card);
  });

  wrap.append(grid);
  block.replaceChildren(wrap);
}
