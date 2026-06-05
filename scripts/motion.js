/**
 * Page-level scroll-reveal — the live-systems register's signature "content
 * rises in as you scroll" motion. Runs in the lazy phase (after blocks are
 * decorated and painted), so it only marks sections that are CURRENTLY below
 * the fold: those can be set to the hidden pre-reveal state without any
 * visible flash, then transitioned in when they scroll into view.
 *
 * No-op under prefers-reduced-motion; never runs without JS. Above-the-fold
 * sections are left untouched (already visible).
 */
export default function initMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  const fold = window.innerHeight * 0.9;
  document.querySelectorAll('main .section').forEach((section) => {
    if (section.getBoundingClientRect().top > fold) {
      section.classList.add('reveal');
      io.observe(section);
    }
  });
}
