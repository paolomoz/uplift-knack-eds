/**
 * plans — pricing tiers. One row per plan:
 *   cell1 name (h3)   cell2 audience   cell3 price ("$49/mo")
 *   cell4 features <ul>   cell5 CTA (<strong><a> = featured/primary)
 */
function text(c) { return c ? c.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const grid = document.createElement('div');
  grid.className = 'plans-grid';

  rows.forEach((row) => {
    const c = [...row.children];
    if (c.length < 2) return;
    const [nameC, audC, priceC, featC, ctaC] = c;
    const plan = document.createElement('div');
    plan.className = 'plan';
    const cta = ctaC && ctaC.querySelector('a');
    // ak.js decorateButton may already have unwrapped <strong><a> into
    // <a class="btn-primary"> by the time this runs, so check both.
    const featured = !!(ctaC && (ctaC.querySelector('strong') || (cta && /btn-primary/.test(cta.className))));
    if (featured) plan.classList.add('featured');

    const h3 = document.createElement('h3');
    h3.textContent = text(nameC);
    plan.append(h3);

    if (text(audC)) {
      const p = document.createElement('p');
      p.className = 'aud';
      p.textContent = text(audC);
      plan.append(p);
    }
    if (text(priceC)) {
      const pr = document.createElement('div');
      pr.className = 'price';
      const m = text(priceC).match(/^(\D*[\d,.]+)(.*)$/);
      if (m) pr.innerHTML = `${m[1]}<small>${m[2]}</small>`;
      else pr.textContent = text(priceC);
      plan.append(pr);
    }
    const ul = featC && featC.querySelector('ul');
    if (ul) plan.append(ul.cloneNode(true));
    if (cta) {
      const a = cta.cloneNode(true);
      a.className = `btn ${featured ? 'btn-primary' : 'btn-secondary'}`;
      plan.append(a);
    }
    grid.append(plan);
  });

  block.replaceChildren(grid);
}
