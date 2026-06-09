/**
 * casestudy-hero — editorial, type-led customer-story hero.
 * Lifted from prototype <section class="hero" data-section="hero">.
 *
 * Authoring rows (positional):
 *   1. breadcrumb — cell holding plain <a> links (rendered with › separators)
 *   2. eyebrow text ("Customer Story · Government")
 *   3. <h1> headline
 *   4. sub paragraph
 *   5. CTAs — wrap primary in <strong>, secondary in <em>; the EDS link
 *      decorator (ak.js decorateButton) applies .btn / .btn-primary /
 *      .btn-secondary. Cell child nodes are cloned verbatim — NO manufactured
 *      anchors.
 *   6. trust line (may contain <b> for the bold figure)
 *   7. pulled quote — blockquote cell (use <em> for the gradient phrase)
 *   8. cite — name on first line, role on second (separate <span> or after <br>)
 *   9..N: stat rows — cell1: value (append "%"/text as authored), cell2: label.
 *         Add class "pink" text inside value cell? No — second stat is pink by
 *         position is brittle; instead any value whose authored text ends with
 *         "%" keeps brand color, and the author can mark a value cell's text
 *         with a leading "~" to tint pink. To stay faithful & simple, we tint
 *         the value by position parity is NOT used; see CSS .pink applied when
 *         the value row cell contains a <strong> wrapper.
 */

function firstHeading(cell) {
  return cell ? cell.querySelector('h1, h2, h3') : null;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cell = (i) => (rows[i] ? rows[i].children[0] || rows[i] : null);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // 1. breadcrumb
  const crumbCell = cell(0);
  if (crumbCell && crumbCell.querySelector('a')) {
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const links = [...crumbCell.querySelectorAll('a')];
    links.forEach((a, i) => {
      nav.append(a.cloneNode(true));
      if (i < links.length - 1) {
        const sep = document.createElement('span');
        sep.textContent = '›';
        nav.append(sep);
      }
    });
    wrap.append(nav);
  }

  // 2-6. lead block
  const lead = document.createElement('div');
  lead.className = 'hero-lead';

  const eyebrowCell = cell(1);
  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    lead.append(eyebrow);
  }

  const h1Source = firstHeading(cell(2)) || cell(2);
  if (h1Source) {
    const h1 = document.createElement('h1');
    h1.innerHTML = h1Source.innerHTML;
    lead.append(h1);
  }

  const subCell = cell(3);
  if (subCell && subCell.textContent.trim()) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = subCell.textContent.trim();
    lead.append(sub);
  }

  const ctaCell = cell(4);
  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hero-cta';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    lead.append(actions);
  }

  const trustCell = cell(5);
  if (trustCell && trustCell.textContent.trim()) {
    const trust = document.createElement('div');
    trust.className = 'trust';
    trust.innerHTML = trustCell.innerHTML;
    lead.append(trust);
  }

  wrap.append(lead);

  // 7-8. pulled display quote
  const quoteCell = cell(6);
  if (quoteCell && quoteCell.textContent.trim()) {
    const fig = document.createElement('figure');
    fig.className = 'hero-quote';
    const bq = document.createElement('blockquote');
    bq.innerHTML = quoteCell.innerHTML;
    fig.append(bq);

    const citeCell = cell(7);
    if (citeCell && citeCell.textContent.trim()) {
      const cite = document.createElement('cite');
      cite.innerHTML = citeCell.innerHTML;
      fig.append(cite);
    }
    wrap.append(fig);
  }

  // 9..N. stat strip
  const statRows = rows.slice(8).filter((r) => (r.children[0] || r).textContent.trim());
  if (statRows.length) {
    const strip = document.createElement('div');
    strip.className = 'statstrip';
    strip.setAttribute('aria-label', 'Impact at a glance');
    statRows.forEach((row) => {
      const valueCell = row.children[0];
      const labelCell = row.children[1];
      if (!valueCell) return;
      const stat = document.createElement('div');
      stat.className = 'stat';
      const v = document.createElement('div');
      v.className = 'v';
      // a <strong>-wrapped value authors the accent (pink) treatment
      if (valueCell.querySelector('strong')) v.classList.add('pink');
      v.textContent = valueCell.textContent.trim();
      stat.append(v);
      if (labelCell && labelCell.textContent.trim()) {
        const l = document.createElement('div');
        l.className = 'l';
        l.textContent = labelCell.textContent.trim();
        stat.append(l);
      }
      strip.append(stat);
    });
    wrap.append(strip);
  }

  block.replaceChildren(wrap);
}
