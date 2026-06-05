/**
 * hero — "Don't read about the app. Watch it build." with a static
 * Operations · Live App mock (KPIs + rows). Lifted from the stardust
 * prototype <section class="hero">.
 *
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. H1 headline (a nested <span> renders with the coral gradient)
 *   3. sub paragraph
 *   4. CTAs — wrap primary in <strong>, secondary in <em>; the EDS link
 *      decorator (ak.js decorateButton) applies .btn / .btn-primary /
 *      .btn-secondary. The cell's child nodes are cloned verbatim.
 *
 * The live-app mock (app-bar, KPIs, rows) is a brand motif baked into the
 * block — it is NOT content and shows final values statically.
 */

function pickCell(row, i = 0) {
  if (!row) return null;
  return row.children[i] || row;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = pickCell(rows[0]);
  const h1Cell = pickCell(rows[1]);
  const subCell = pickCell(rows[2]);
  const ctaCell = pickCell(rows[3]);

  const grid = document.createElement('div');
  grid.className = 'wrap hero-grid';

  // ---- copy column ----
  const copy = document.createElement('div');

  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    copy.append(eyebrow);
  }

  if (h1Cell) {
    const h1 = document.createElement('h1');
    h1.style.marginTop = '14px';
    // Preserve authored inline markup (e.g. <span> for the gradient word).
    const heading = h1Cell.querySelector('h1, h2, h3');
    h1.innerHTML = heading ? heading.innerHTML : h1Cell.innerHTML;
    copy.append(h1);
  }

  if (subCell && subCell.textContent.trim()) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = subCell.textContent.trim();
    copy.append(sub);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const cta = document.createElement('div');
    cta.className = 'hero-cta';
    [...ctaCell.childNodes].forEach((n) => cta.append(n.cloneNode(true)));
    copy.append(cta);
  }

  const trust = document.createElement('div');
  trust.className = 'trust';
  trust.innerHTML = '<span class="stars">★★★★★</span> Trusted by <b>100,000+</b> users worldwide';
  copy.append(trust);

  // ---- live-app mock column (static brand motif) ----
  const app = document.createElement('div');
  app.className = 'app';
  app.innerHTML = `
    <div class="app-bar">
      <span class="d"></span><span class="d"></span><span class="d"></span>
      <span class="title">Operations · Live App</span>
      <span class="live"><span class="pulse"></span> Live</span>
    </div>
    <div class="app-body">
      <div class="kpis">
        <div class="kpi"><div class="l">Open work orders</div><div class="v mag">248</div></div>
        <div class="kpi"><div class="l">Saved / yr</div><div class="v pink">$250k+</div></div>
        <div class="kpi"><div class="l">SLA met</div><div class="v">92%</div><div class="bar"><i style="--fill:92%;width:92%"></i></div></div>
      </div>
      <table class="rows">
        <thead><tr><th>Record</th><th>Owner</th><th>Status</th></tr></thead>
        <tbody>
          <tr class="row"><td><span class="rowdot"></span>WO-1043 · HVAC</td><td>A. Chen</td><td><span class="pill-s s-live">Live</span></td></tr>
          <tr class="row"><td>WO-1044 · Electrical</td><td>R. Diaz</td><td><span class="pill-s s-build">Building</span></td></tr>
          <tr class="row"><td>WO-1045 · Plumbing</td><td>M. Osei</td><td><span class="pill-s s-queue">Queued</span></td></tr>
          <tr class="row"><td>WO-1046 · Inspection</td><td>J. Park</td><td><span class="pill-s s-live">Live</span></td></tr>
        </tbody>
      </table>
    </div>`;

  grid.append(copy, app);
  block.replaceChildren(grid);
}
