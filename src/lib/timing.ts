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
    /**
     * Progress curve of each bar as [ms since the bar started, %]. Bars run one after another and
     * change pace (fast starts, slow-downs, short holds) so the analysis feels real. Total ≈ 15.6 s.
     */
    curves: [
      [[0, 0], [600, 22], [1000, 31], [1700, 58], [2300, 74], [2900, 93], [3200, 100]],
      [[0, 0], [500, 12], [1400, 40], [2400, 52], [2900, 61], [3700, 88], [4600, 100]],
      [[0, 0], [400, 18], [900, 46], [1300, 55], [2400, 79], [3400, 100]],
      [[0, 0], [700, 15], [1500, 38], [2600, 70], [3200, 82], [3900, 94], [4400, 100]],
    ] as [number, number][][],
    /** short pause on 100% so the last line can be read before moving on */
    holdAtEnd: 500,
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
