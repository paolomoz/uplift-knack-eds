/**
 * feature-tabs — "Create, deploy & scale custom apps — without code."
 * A pill switcher that swaps a product-screenshot panel. Lifted from the
 * stardust prototype <section> with .switch-tabs + .panel.
 *
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. H2 headline
 *   3. sub paragraph
 *   4..N: one row PER tab, cells in order:
 *        cell1 tab label        (pill button text)
 *        cell2 panel eyebrow
 *        cell3 panel H3
 *        cell4 panel body paragraph
 *        cell5 image — a <picture>/<img> (use the fully-qualified
 *              screenshot URL on the EDS host)
 *
 * Clicking a pill toggles aria-selected on the tab and the `.on` class on
 * the matching panel. The first tab is selected by default. Honors
 * prefers-reduced-motion via CSS (no JS-driven motion here).
 */

function txt(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrow = txt(rows[0] && rows[0].firstElementChild);
  const h2 = txt(rows[1] && rows[1].firstElementChild);
  const sub = txt(rows[2] && rows[2].firstElementChild);
  const tabRows = rows.slice(3).filter((r) => r.children.length);

  const frag = document.createDocumentFragment();

  // ---- header ----
  const center = document.createElement('div');
  center.className = 'center';
  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow;
    center.append(p);
  }
  if (h2) {
    const h = document.createElement('h2');
    h.textContent = h2;
    center.append(h);
  }
  if (sub) {
    const p = document.createElement('p');
    p.style.marginTop = '14px';
    p.style.fontSize = '1.1rem';
    p.textContent = sub;
    center.append(p);
  }
  frag.append(center);

  // ---- tabs + panels ----
  const tablist = document.createElement('div');
  tablist.className = 'switch-tabs';
  tablist.setAttribute('role', 'tablist');

  const panels = [];

  tabRows.forEach((row, i) => {
    const cells = [...row.children];
    const label = txt(cells[0]) || `Tab ${i + 1}`;
    const panelEyebrow = txt(cells[1]);
    const panelH3 = txt(cells[2]);
    const panelBody = txt(cells[3]);
    const img = cells[4] ? cells[4].querySelector('picture, img') : null;
    const id = `ft-panel-${i}`;

    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', id);
    tab.dataset.index = String(i);
    tab.textContent = label;
    tablist.append(tab);

    const panel = document.createElement('div');
    panel.className = i === 0 ? 'panel on' : 'panel';
    panel.id = id;
    panel.setAttribute('role', 'tabpanel');

    const copy = document.createElement('div');
    if (panelEyebrow) {
      const pe = document.createElement('p');
      pe.className = 'eyebrow';
      pe.textContent = panelEyebrow;
      copy.append(pe);
    }
    if (panelH3) {
      const h3 = document.createElement('h3');
      h3.textContent = panelH3;
      copy.append(h3);
    }
    if (panelBody) {
      const pb = document.createElement('p');
      pb.textContent = panelBody;
      copy.append(pb);
    }
    panel.append(copy);
    if (img) panel.append(img.cloneNode(true));

    panels.push(panel);
  });

  frag.append(tablist);
  panels.forEach((p) => frag.append(p));

  // ---- interaction ----
  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    const idx = Number(tab.dataset.index);
    tablist.querySelectorAll('.tab').forEach((t) => {
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    panels.forEach((p, i) => p.classList.toggle('on', i === idx));
  });

  block.replaceChildren(frag);
}
