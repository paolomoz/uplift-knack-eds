/**
 * quote-band — centered testimonial band. Lifted from the stardust prototype
 * <section class="quote-band"> on solution-proposed.html: an eyebrow line, a
 * large blockquote, and a brand-colored citation.
 *
 * Authoring rows (positional):
 *   1. eyebrow text (optional)
 *   2. the quote (becomes <blockquote>) — surrounding quote marks optional
 *   3. citation (becomes <cite>) — e.g. "— Bruna Rego @ RV Wood Floors"
 */
function pick(row, i = 0) { return row ? (row.children[i] || row) : null; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = pick(rows[0]);
  const quoteCell = pick(rows[1]);
  const citeCell = pick(rows[2]);

  const qw = document.createElement('div');
  qw.className = 'qw';

  if (eyebrowCell && text(eyebrowCell)) {
    const e = document.createElement('p');
    e.className = 'eyebrow';
    e.textContent = text(eyebrowCell);
    qw.append(e);
  }

  if (quoteCell && text(quoteCell)) {
    const bq = document.createElement('blockquote');
    bq.textContent = text(quoteCell);
    qw.append(bq);
  }

  if (citeCell && text(citeCell)) {
    const cite = document.createElement('cite');
    cite.textContent = text(citeCell);
    qw.append(cite);
  }

  block.replaceChildren(qw);
}
