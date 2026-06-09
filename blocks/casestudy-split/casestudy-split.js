/**
 * casestudy-split — centered eyebrow+headline over a 2-column split:
 * prose (left) + magenta pullquote card (right).
 * Lifted from prototype <section class="challenge">.
 *
 * Authoring rows (positional):
 *   1. eyebrow text ("The challenge")
 *   2. <h2> headline
 *   3. prose cell — one or more <p> (cloned verbatim)
 *   4. pullquote — blockquote cell (the quote text)
 *   5. cite — name + role (use <br> or a <span> for the role line)
 *
 * No buttons, no images.
 */

function firstHeading(cell) {
  return cell ? cell.querySelector('h1, h2, h3') : null;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cell = (i) => (rows[i] ? rows[i].children[0] || rows[i] : null);

  const frag = document.createDocumentFragment();

  // centered header
  const center = document.createElement('div');
  center.className = 'center';

  const eyebrowCell = cell(0);
  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    center.append(eyebrow);
  }

  const h2Source = firstHeading(cell(1)) || cell(1);
  if (h2Source) {
    const h2 = document.createElement('h2');
    h2.innerHTML = h2Source.innerHTML;
    center.append(h2);
  }
  frag.append(center);

  // split
  const split = document.createElement('div');
  split.className = 'split';

  const prose = document.createElement('div');
  prose.className = 'prose';
  const proseCell = cell(2);
  if (proseCell) {
    const paras = proseCell.querySelectorAll('p');
    if (paras.length) {
      paras.forEach((p) => prose.append(p.cloneNode(true)));
    } else if (proseCell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = proseCell.textContent.trim();
      prose.append(p);
    }
  }
  split.append(prose);

  const quoteCell = cell(3);
  if (quoteCell && quoteCell.textContent.trim()) {
    const fig = document.createElement('figure');
    fig.className = 'pullquote';
    const bq = document.createElement('blockquote');
    bq.innerHTML = quoteCell.innerHTML;
    fig.append(bq);

    const citeCell = cell(4);
    if (citeCell && citeCell.textContent.trim()) {
      const cite = document.createElement('cite');
      cite.innerHTML = citeCell.innerHTML;
      fig.append(cite);
    }
    split.append(fig);
  }

  frag.append(split);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(frag);
  block.replaceChildren(wrap);
}
