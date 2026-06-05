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
    // Preserve authored inline markup. The gradient word is authored as
    // <em> (DA strips a bare styling-only <span>); convert it to the
    // gradient <span>. Fall back to wrapping the known phrase so the
    // brand gradient renders even if DA drops the inline emphasis too.
    const heading = h1Cell.querySelector('h1, h2, h3');
    h1.innerHTML = heading ? heading.innerHTML : h1Cell.innerHTML;
    h1.querySelectorAll('em, i').forEach((em) => {
      const span = document.createElement('span');
      span.innerHTML = em.innerHTML;
      em.replaceWith(span);
    });
    const GRAD = 'Watch it build.';
    if (!h1.querySelector('span') && h1.textContent.includes(GRAD)) {
      h1.innerHTML = h1.innerHTML.replace(GRAD, `<span>${GRAD}</span>`);
    }
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
    // Undecorated links (the secondary "Talk to sales →") render as a
    // text link, matching the prototype's .link-sec affordance.
    cta.querySelectorAll('a:not(.btn)').forEach((a) => a.classList.add('link-sec'));
    copy.append(cta);
  }

  const trust = document.createElement('div');
  trust.className = 'trust';
  trust.innerHTML = '<span class="stars">★★★★★</span> Trusted by <b>100,000+</b> users worldwide';
  copy.append(trust);

  // ---- live-app mock column (the "watch it build" centerpiece) ----
  const app = document.createElement('div');
  app.className = 'app build-anim';
  app.innerHTML = `
    <div class="app-bar">
      <span class="d"></span><span class="d"></span><span class="d"></span>
      <span class="title">Operations · Live App</span>
      <span class="live"><span class="pulse"></span> Live</span>
    </div>
    <div class="app-body">
      <div class="sweep"></div>
      <div class="kpis">
        <div class="kpi"><div class="l">Open work orders</div><div class="v mag">248</div></div>
        <div class="kpi"><div class="l">Saved / yr</div><div class="v pink">$250k+</div></div>
        <div class="kpi"><div class="l">SLA met</div><div class="v">92%</div><div class="bar"><i></i></div></div>
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
  animateApp(app);
}

// Count up a "$250k+" / "92%" / "248" value from 0 to its final text.
function heroCountUp(el) {
  const final = el.textContent;
  const m = final.match(/^(\D*)([\d.,]+)(\D*)$/);
  if (!m) return;
  const [, pre, num, suf] = m;
  const target = parseFloat(num.replace(/,/g, ''));
  if (!Number.isFinite(target)) return;
  const dur = 1100;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    const e = 1 - (1 - p) ** 3;
    el.textContent = `${pre}${Math.round(target * e)}${suf}`;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
}

// The live-systems choreography: KPIs count up, the SLA bar fills, and the
// records flip in on a stagger — the app appears to assemble itself. All
// neutralized under prefers-reduced-motion (final values shown statically).
function animateApp(app) {
  const bar = app.querySelector('.bar i');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (bar) bar.style.width = '92%';
    return;
  }
  app.querySelectorAll('.kpi .v').forEach((el) => { setTimeout(() => heroCountUp(el), 600); });
  if (bar) {
    bar.style.width = '0%';
    setTimeout(() => { bar.style.transition = 'width 1s var(--e-enter)'; bar.style.width = '92%'; }, 700);
  }
  [...app.querySelectorAll('table.rows tbody tr')].forEach((r, i) => {
    r.animate(
      [{ opacity: 0, transform: 'translateY(14px) rotateX(8deg)' }, { opacity: 1, transform: 'none' }],
      { duration: 600, delay: 300 + i * 120, easing: 'cubic-bezier(.25,.46,.45,.94)', fill: 'forwards' },
    );
  });
}
