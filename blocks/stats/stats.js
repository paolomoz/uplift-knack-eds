/**
 * stats — "Real outcomes, measured." — a centered eyebrow + heading over
 * three big count-up-style stats ($250k+ / 92% / 10x) with labels. Lifted
 * from the stardust prototype's Results section (.center header + .stats).
 *
 * Authoring rows (positional):
 *   Header rows have ONE cell each (optional, in order):
 *     1: eyebrow text   (e.g. "Results")
 *     2: heading text   (e.g. "Real outcomes, measured.")
 *   Stat rows have TWO cells each — one row per stat:
 *     cell 1: number (e.g. "$250k+")
 *     cell 2: label  (e.g. "saved per year")
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

  const headerLines = [];
  const statRows = [];
  let storyCell = null;
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) { statRows.push(row); return; }
    const cell = cells[0];
    if (!cell) return;
    // A single-cell row carrying a blockquote (or a link) is the testimonial.
    if (cell.querySelector('blockquote, a')) storyCell = cell;
    else headerLines.push(text(cell));
  });

  const frag = document.createDocumentFragment();

  // ---- centered eyebrow + heading (matches the other section headers) ----
  if (headerLines.some(Boolean)) {
    const center = document.createElement('div');
    center.className = 'center';
    if (headerLines[0]) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = headerLines[0];
      center.append(eyebrow);
    }
    if (headerLines[1]) {
      const h2 = document.createElement('h2');
      h2.textContent = headerLines[1];
      center.append(h2);
    }
    frag.append(center);
  }

  // ---- stat grid ----
  const grid = document.createElement('div');
  grid.className = 'stats-grid wrap';

  statRows.forEach((row) => {
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

  frag.append(grid);

  // ---- testimonial / story (optional) ----
  if (storyCell) {
    const story = document.createElement('div');
    story.className = 'story';
    const bq = storyCell.querySelector('blockquote');
    if (bq) story.append(bq.cloneNode(true));
    const link = storyCell.querySelector('a');
    if (link) {
      const a = link.cloneNode(true);
      a.classList.add('link-sec');
      story.append(a);
    }
    frag.append(story);
  }

  block.replaceChildren(frag);
}
