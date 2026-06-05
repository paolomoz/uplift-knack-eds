/**
 * integrations-band — "Move beyond patchwork integrations" — the
 * magenta→coral gradient band with a centered headline + sub, a row of
 * decorative lettered integration tiles, and a "See All Integrations" CTA.
 * Lifted from the stardust prototype <section class="integ">.
 *
 * Authoring rows (positional):
 *   1. H2 headline
 *   2. sub paragraph
 *   3. CTA — wrap primary in <strong>; the EDS link decorator (ak.js
 *      decorateButton) applies .btn / .btn-primary. The cell's child
 *      nodes are cloned verbatim.
 *
 * The lettered tiles (Z, S, G, …) are a decorative brand motif baked into
 * the block — they are NOT authored content.
 */

const TILES = ['Z', 'S', 'G', 'M', 'St', 'Q', 'Tw', 'Hb'];

function pickCell(row, i = 0) {
  if (!row) return null;
  return row.children[i] || row;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const h2Cell = pickCell(rows[0]);
  const subCell = pickCell(rows[1]);
  const ctaCell = pickCell(rows[2]);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const center = document.createElement('div');
  center.className = 'center';

  if (h2Cell) {
    const h2 = document.createElement('h2');
    const heading = h2Cell.querySelector('h1, h2, h3');
    h2.innerHTML = heading ? heading.innerHTML : h2Cell.innerHTML;
    center.append(h2);
  }

  if (subCell && subCell.textContent.trim()) {
    const sub = document.createElement('p');
    sub.textContent = subCell.textContent.trim();
    center.append(sub);
  }

  wrap.append(center);

  const logos = document.createElement('div');
  logos.className = 'integ-logos';
  TILES.forEach((t) => {
    const tile = document.createElement('div');
    tile.textContent = t;
    logos.append(tile);
  });
  wrap.append(logos);

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  block.replaceChildren(wrap);
}
