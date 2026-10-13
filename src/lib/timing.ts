/**
 * Animation / interaction timings.
 *
 * `reference-measured`: read from the reference's served JS/CSS (setTimeout/setInterval/rAF values
 * and keyframes), see docs/auditoria-referencia.md. Nothing here is an estimate unless marked so.
 */
export const T = {
  /** reference-measured: buttons wait 300 ms before navigating (`setTimeout(forward, 300)`). */
  navDelay: 300,
  /** reference-measured: `preventAction: 500` — clicks are ignored for 500 ms after navigating. */
  navLock: 500,
  /** reference-measured: step wrappers cross-fade with `transition: all .1s`. */
  stepFade: 100,

  hero: {
    /** reference-measured: `setInterval(next, 2e3)` + 2 s `animShowHidden` keyframe. */
    slide: 2000,
    /** reference-measured: loader runs 5000 ms (rAF, `t/5e3*100`). */
    loader: 5000,
  },

  creating: {
    /** Requested: the four bars take 7 s in total, at a uniform speed (1.75 s each). */
    total: 7000,
    /** short pause on 100% so the last line can be read before moving on */
    holdAtEnd: 400,
  },

  cards: {
    /** reference-measured: intro reveal steps (title, cards, subtitle, footer). */
    introSteps: [0, 300, 1100, 1500],
    flipDownAt: 2200,
    flipDuration: 800,
    shuffleAt: [80, 580, 1080],
    selectingAt: 1580,
    shuffleMove: 400,
    gatherAt: 900,
    gatherMove: 600,
    celebrateAt: 1700,
    popStagger: 180,
  },

  /** reference-measured: loading testimonials carousel autoplay 4000 ms. */
  reviewsAutoplay: 4000,
} as const;
