/**
 * components — "Built on enterprise-grade components" 6-up card grid.
 *
 * Authoring rows (positional):
 *   1. <h2> section heading (centered)
 *   2..N: one row per component — cells:
 *        cell1 = icon keyword (database | palette | shield-check | settings |
 *                line-chart | sparkles | ...)
 *        cell2 = title (becomes <h3>)
 *        cell3 = description (becomes <p>)
 *
 * Icons are inline Lucide SVG (per-card map below). No external icon files.
 * Cards render visible; optional subtle fade-up reveal layered via JS only.
 */

const ICONS = {
  database: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>',
  palette: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" /><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /></svg>',
  'shield-check': '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>',
  settings: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>',
  'line-chart': '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></svg>',
  sparkles: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" /></svg>',
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

  // Remaining rows: component cards.
  const grid = document.createElement('div');
  grid.className = 'grid6';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const iconKey = text(cells[0]).toLowerCase();
    const title = text(cells[1]);
    const body = text(cells[2]);
    if (!title && !body) return;

    const card = document.createElement('div');
    card.className = 'ccard reveal';

    const ic = document.createElement('div');
    ic.className = 'ic';
    ic.innerHTML = ICONS[iconKey] || ICONS.database;
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

  // Optional subtle reveal — content already visible; layer motion only when safe.
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
