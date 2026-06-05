import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();

const HEADER_PATH = '/fragments/nav/header';

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    el.append(fragment);
    // The fragment carries two sections: an announcement strip and the nav
    // row. Tag them so the CSS can render a full-width promo bar above a
    // centered, sticky nav. A single-section fragment is treated as nav.
    const sections = [...el.querySelectorAll('.section')];
    if (sections.length > 1) {
      sections[0].classList.add('header-promo');
      sections[sections.length - 1].classList.add('header-nav');
    } else if (sections.length === 1) {
      sections[0].classList.add('header-nav');
    }
  } catch (e) {
    throw Error(e);
  }
}
