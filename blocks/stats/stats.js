/**
 * stats — "Real outcomes, measured." — three big count-up-style stats
 * ($250k+ / 92% / 10x) with labels. Lifted from the stardust prototype
 * <div class="stats"> inside the Results section.
 *
 * Authoring rows (positional): one row per stat —
 *   cell 1: number (e.g. "$250k+")
 *   cell 2: label  (e.g. "saved per year")
 *
 * Numbers are illustrative and render STATICALLY at their final values.
 * No JS count-up is required; an optional reduced-motion-safe count-up
 * progressive enhancement is applied only when motion is allowed, and the
 * final value is always present in the DOM first.
 */

function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

function animateCount(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const final = el.textContent;
  const match = final.match(/^(\D*)([\d.,]+)(\D*)$/);
  if (!match) return;
  const [, prefix, numStr, suffix] = match;
  const target = parseFloat(numStr.replace(/,/g, ''));
  if (!Number.isFinite(target)) return;

  const run = () => {
    const start = performance.now();
    const dur = 1100;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - p) ** 3;
      const val = Math.round(target * eased);
      el.textContent = `${prefix}${val}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = final;
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  } else {
    run();
  }
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('div');
  grid.className = 'stats-grid wrap';

  rows.forEach((row) => {
    const numCell = row.children[0];
    const labelCell = row.children[1];
    const num = text(numCell);
    if (!num) return;

    const stat = document.createElement('div');
    stat.className = 'stat';

    const n = document.createElement('div');
    n.className = 'n';
    n.textContent = num;
    stat.append(n);

    const label = text(labelCell);
    if (label) {
      const p = document.createElement('p');
      p.textContent = label;
      stat.append(p);
    }

    grid.append(stat);
    animateCount(n);
  });

  block.replaceChildren(grid);
}
