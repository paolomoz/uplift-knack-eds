/**
 * value-cards — "No code. No delay. No hassle." value proposition cards.
 *
 * Authoring rows (positional):
 *   1. <h2> section heading (centered)
 *   2..N: one row per card — cells:
 *        cell1 = icon keyword (zap | clock | bar-chart-3 | ...)
 *        cell2 = card title (becomes <h3>)
 *        cell3 = card body (becomes <p>)
 *
 * Icons are inline Lucide SVG (per-card map below). No external icon files.
 * Cards render visible; a subtle fade-up reveal is layered on only when JS +
 * IntersectionObserver are available and motion is allowed (reduced-motion safe).
 */

const ICONS = {
  zap: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>',
  clock: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>',
  'bar-chart-3': '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>',
};

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const frag = document.createDocumentFragment();

  // Row 1: heading.
  const headRow = rows[0];
  const headEl = headRow ? (headRow.querySelector('h1, h2, h3, h4') || headRow) : null;
  const headingText = headEl ? text(headEl) : '';
  if (headingText) {
    const center = document.createElement('div');
    center.className = 'center';
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    center.append(h2);
    frag.append(center);
  }

  // Remaining rows: cards.
  const grid = document.createElement('div');
  grid.className = 'cards3';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const iconKey = text(cells[0]).toLowerCase();
    const title = text(cells[1]);
    const body = text(cells[2]);
    if (!title && !body) return;

    const card = document.createElement('div');
    card.className = 'vcard reveal';

    const ic = document.createElement('div');
    ic.className = 'ic';
    ic.innerHTML = ICONS[iconKey] || ICONS.zap;
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

  // Optional subtle reveal — content is already visible; only layer motion in.
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
