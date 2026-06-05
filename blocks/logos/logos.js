/**
 * logos — social-proof strip. Lifted from the stardust prototype
 * <section class="proof wrap">: a centered "Trusted by…" line above a
 * grayscale row of customer names.
 *
 * Authoring rows (positional):
 *   1. the "Trusted by 100,000+ users across the world" line (plain text)
 *   2. a list (<ul><li>…</li></ul>) of customer / logo names — each <li>
 *      becomes a grayscale name span in the strip.
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const lineCell = rows[0] && (rows[0].firstElementChild || rows[0]);
  const listCell = rows[1] && (rows[1].firstElementChild || rows[1]);

  const frag = document.createDocumentFragment();

  if (lineCell && lineCell.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = lineCell.textContent.trim();
    frag.append(p);
  }

  const logos = document.createElement('div');
  logos.className = 'logos';
  const items = listCell ? [...listCell.querySelectorAll('li')] : [];
  const names = items.length
    ? items.map((li) => li.textContent.trim()).filter(Boolean)
    : (listCell ? listCell.textContent.split(/[,\n]/).map((s) => s.trim()).filter(Boolean) : []);
  names.forEach((name) => {
    const span = document.createElement('span');
    span.textContent = name;
    logos.append(span);
  });
  if (logos.children.length) frag.append(logos);

  block.replaceChildren(frag);
}
