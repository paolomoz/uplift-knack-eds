/**
 * casestudy-cards — "The solution": centered header + 3-up card grid
 * (coral-gradient icon chip + title + body). Lifted from prototype
 * <section class="solution"> (.center + .grid6 of .ccard).
 *
 * Authoring rows (positional):
 *   1. eyebrow text ("The solution")
 *   2. <h2> headline
 *   3. sub paragraph (optional)
 *   4..N: card rows — cell1: icon (a keyword for a built-in lucide glyph, OR a
 *         literal emoji/character that is passed through), cell2: <h3> title,
 *         cell3: body paragraph.
 *
 * Built-in icon keywords (inline lucide SVG, no shared utility):
 *   clipboard-list | shield-check | line-chart
 * Anything else in cell1 is treated as literal icon text (emoji like 🔄 📚 🗂️).
 *
 * No buttons, no images.
 */

const ICONS = {
  'clipboard-list': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'line-chart': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
};

function lucide(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', `lucide lucide-${name}`);
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.innerHTML = ICONS[name];
  return svg;
}

function firstHeading(cell) {
  return cell ? cell.querySelector('h1, h2, h3') : null;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cell = (i) => (rows[i] ? rows[i].children[0] || rows[i] : null);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // centered header
  const center = document.createElement('div');
  center.className = 'center';

  const eyebrowCell = cell(0);
  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    center.append(eyebrow);
  }

  const h2Source = firstHeading(cell(1)) || cell(1);
  if (h2Source) {
    const h2 = document.createElement('h2');
    h2.innerHTML = h2Source.innerHTML;
    center.append(h2);
  }

  const subCell = cell(2);
  if (subCell && subCell.textContent.trim()) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = subCell.textContent.trim();
    center.append(sub);
  }
  wrap.append(center);

  // card grid
  const grid = document.createElement('div');
  grid.className = 'grid6';

  rows.slice(3).forEach((row) => {
    const iconCell = row.children[0];
    const titleCell = row.children[1];
    const bodyCell = row.children[2];
    if (!titleCell && !bodyCell) return;

    const card = document.createElement('div');
    card.className = 'ccard';

    const ic = document.createElement('div');
    ic.className = 'ic';
    const key = iconCell ? iconCell.textContent.trim() : '';
    if (ICONS[key]) {
      ic.append(lucide(key));
    } else {
      ic.textContent = key;
    }
    card.append(ic);

    const titleHeading = titleCell ? titleCell.querySelector('h1, h2, h3') : null;
    const h3 = document.createElement('h3');
    h3.innerHTML = titleHeading ? titleHeading.innerHTML
      : (titleCell ? titleCell.textContent.trim() : '');
    card.append(h3);

    if (bodyCell && bodyCell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = bodyCell.textContent.trim();
      card.append(p);
    }

    grid.append(card);
  });

  wrap.append(grid);
  block.replaceChildren(wrap);
}
