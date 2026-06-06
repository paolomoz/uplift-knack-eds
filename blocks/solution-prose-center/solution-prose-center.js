/**
 * solution-prose-center — centered heading + a longer intro paragraph above a
 * 3-up grid of value cards. Lifted from the stardust prototype
 * <section class="wrap why"> ("Why Choose Knack for Job Scheduling?") on
 * solution-proposed.html. Visually distinct from solution-prose: it carries a
 * prose intro paragraph in the centered header and its card icon chips use the
 * solid brand-primary fill (the prototype's `.why .vcard .ic` rule).
 *
 * Authoring rows (positional):
 *   1. <h2> section heading (centered)
 *   2. intro paragraph (centered, optional)
 *   3..N: one row per card — cells:
 *        cell1 = icon (emoji authored directly, or inline SVG; passed verbatim)
 *        cell2 = card title (becomes <h3>)
 *        cell3 = card body (becomes <p>)
 *
 * Cards render visible; a subtle fade-up reveal is layered on only when JS +
 * IntersectionObserver are available and motion is allowed (reduced-motion safe).
 */
function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const frag = document.createDocumentFragment();

  // Row 1: heading. Row 2: intro paragraph.
  const headRow = rows[0];
  const headEl = headRow ? (headRow.querySelector('h1, h2, h3, h4') || headRow) : null;
  const headingText = headEl ? text(headEl) : '';
  const introCell = rows[1] ? (rows[1].children[0] || rows[1]) : null;
  const introText = introCell ? text(introCell) : '';

  if (headingText || introText) {
    const center = document.createElement('div');
    center.className = 'center';
    if (headingText) {
      const h2 = document.createElement('h2');
      h2.textContent = headingText;
      center.append(h2);
    }
    if (introText) {
      const p = document.createElement('p');
      p.textContent = introText;
      center.append(p);
    }
    frag.append(center);
  }

  // Remaining rows: cards.
  const grid = document.createElement('div');
  grid.className = 'cards3';

  rows.slice(2).forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const iconCell = cells[0];
    const title = text(cells[1]);
    const body = text(cells[2]);
    if (!title && !body) return;

    const card = document.createElement('div');
    card.className = 'vcard reveal';

    const ic = document.createElement('div');
    ic.className = 'ic';
    if (iconCell) ic.innerHTML = iconCell.innerHTML;
    card.append(ic);

    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      card.append(h3);
    }
    if (body) {
      const p = document.createElement('p');
      p.textContent = body;
      card.append(p);
    }
    grid.append(card);
  });

  if (grid.children.length) frag.append(grid);

  block.replaceChildren(frag);

  const reveals = [...block.querySelectorAll('.reveal')];
  const prefersReduced = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reveals.length && 'IntersectionObserver' in window && !prefersReduced) {
    block.classList.add('reveal-ready');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  }
}
