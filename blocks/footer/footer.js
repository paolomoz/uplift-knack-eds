import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_PATH = '/fragments/nav/footer';

/**
 * Reshape the flat fragment content (logo + tagline, then H4+UL column
 * pairs, then the copyright lines) into a brand column, four link columns,
 * and a bottom bar — matching the prototype's foot-grid / foot-bot.
 */
function buildColumns(el) {
  const dc = el.querySelector('.default-content-wrapper, .default-content');
  if (!dc) return;

  const grid = document.createElement('div');
  grid.className = 'foot-grid';
  const brand = document.createElement('div');
  brand.className = 'foot-col foot-brand';
  grid.append(brand);
  const bottom = document.createElement('div');
  bottom.className = 'foot-bot';

  let current = brand;
  let inColumns = false;
  [...dc.children].forEach((node) => {
    if (node.tagName === 'H4') {
      inColumns = true;
      current = document.createElement('div');
      current.className = 'foot-col';
      current.append(node);
      grid.append(current);
    } else if (node.tagName === 'UL') {
      current.append(node);
    } else if (node.tagName === 'P') {
      (inColumns ? bottom : brand).append(node);
    } else {
      current.append(node);
    }
  });

  dc.replaceChildren(grid, bottom);
}

/**
 * loads and decorates the footer
 * @param {Element} el The footer element
 */
export default async function init(el) {
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    el.append(fragment);
    buildColumns(el);
  } catch (e) {
    throw Error(e);
  }
}
