// ===========================================================================
// v0.84.0-c11.14 checkpoint 84C — BOTTOM-CLEARANCE DETECTOR.
//
// Checkpoint 84B needed three passes because its detector counted collapsed
// 0x0 controls, then measured a hidden element, and compared rectangles at
// scroll position zero — where a mid-document control legitimately sits under
// a floating bar that the reader simply scrolls past.
//
// What actually matters is whether the LAST interactive control can be
// brought fully clear of the persistent bottom navigation. So this scrolls to
// the end with a real wheel event — `window.scrollTo` inside an evaluate is
// ignored here — and measures the gap between the lowest visible control and
// the nav's top edge.
// ===========================================================================

export const MIN_GAP = 8;

/** Visible means painted, not merely present in the DOM. */
const VISIBLE = `(e) => {
  const r = e.getBoundingClientRect();
  const cs = getComputedStyle(e);
  return r.width > 0 && r.height > 0
    && cs.display !== 'none' && cs.visibility !== 'hidden'
    && cs.opacity !== '0' && e.offsetParent !== null;
}`;

/** Scroll to the end with a real wheel, then measure the lowest control. */
export async function measureBottomClearance(page) {
  // A real wheel event; a scripted scrollTo does not move this layout.
  for (let i = 0; i < 6; i += 1) {
    await page.mouse.move(180, 400);
    await page.mouse.wheel({ deltaY: 1500 });
    await new Promise((r) => setTimeout(r, 120));
  }
  await new Promise((r) => setTimeout(r, 250));
  return page.evaluate((visSrc, minGap) => {
    // eslint-disable-next-line no-eval
    const visible = eval(visSrc);
    const nav = document.querySelector('nav.fixed');
    if (!nav) return { noNav: true };
    const nr = nav.getBoundingClientRect();
    const navShown = getComputedStyle(nav).display !== 'none' && nr.height > 0;
    const controls = [...document.querySelectorAll('button, a[href], [role=button]')]
      .filter((e) => visible(e) && !nav.contains(e));
    if (!controls.length) return { noControls: true };
    const lowest = controls.reduce((a, b) =>
      (a.getBoundingClientRect().bottom > b.getBoundingClientRect().bottom ? a : b));
    const lr = lowest.getBoundingClientRect();
    const gap = Math.round(nr.top - lr.bottom);
    return {
      navShown,
      navRect: [Math.round(nr.top), Math.round(nr.bottom)],
      label: (lowest.innerText || lowest.getAttribute('aria-label') || '?').trim().replace(/\n/g, ' ').slice(0, 24),
      controlRect: [Math.round(lr.top), Math.round(lr.bottom)],
      gap,
      pass: !navShown || gap >= minGap,
      atScrollEnd: Math.round(document.documentElement.scrollTop)
        >= Math.round(document.documentElement.scrollHeight - document.documentElement.clientHeight) - 2,
    };
  }, VISIBLE, MIN_GAP);
}
