// FORK GUIDE: DATA - every build entry (pentagon stats, accent colors,
// bestFor blurbs) is one of Deathblade's own builds. Replace the re/surge
// families and their builds arrays with your class's own lineup; the
// axisLabels/invert/axisNote fields let you define your own 5th axis
// (this site uses Recovery for RE, Exposure for Surge).
//
// SINGLE SOURCE OF TRUTH for build pentagon/compare stats. Both
// pentagon-badge.js (the badge on each build's own page) and
// build-compare.js (the overview table + overlay picker on essentials.md)
// read from window.DB_BUILD_DATA instead of keeping their own copies -
// edit a build's numbers here ONCE and both places update.
//
// Must load before pentagon-badge.js and build-compare.js - see the
// extra_javascript order in mkdocs.yml.
//
// EASY EDIT GUIDE:
//   Find the build under its family (re / surge) and edit the fields
//   below. Everything that appears on both the build's own pentagon
//   badge AND the essentials.md compare widget lives here:
//     pentagon      - [Difficulty, DPS, Mobility, Recovery/Exposure, Speed],
//                      0-10 scale. Same axis-order/scale writeup as before,
//                      see the old pentagon-badge.js history for the DPS
//                      "ranked within family" methodology if you need it.
//     difficulty    - should match pentagon[0]
//     trixion       - the Trixion DPS multiplier, or null if unmeasured
//     trixionConfirmed - false shows the diagonal-stripe "unconfirmed" fill
//     accent        - hex color used for this build's line/fill everywhere
//     bestFor       - SHORT blurb for the compare table only. The build's
//                     own page keeps its own longer "Best For:" prose
//                     written directly in the .md - that's intentionally
//                     not templated from here, it's real prose.
//     recommended   - true adds the small star next to the name
//     compareEnabled - false keeps a build in the compare table's overview
//                      rows but out of the two-build picker (no pentagon
//                      data to overlay)
//     compareHidden  - true drops a build from the comparison entirely
//                      (overview rows AND picker). Use this to retire a
//                      build from the comparison without deleting its data:
//                      its own page still reads pentagon/difficulty by id,
//                      so removing the entry would break that page.
//
//   RE and Surge are never compared against each other - RE's fifth axis
//   is Recovery (higher is better), Surge's is Exposure (lower is
//   better), and DPS is ranked within each family on its own 0-10 scale.
//   Overlaying the two would silently mix incompatible axes.
//
//   axisNoteIndex/axisNote (family-level, Surge only): the pentagon badge
//   shows this as a hover tooltip + caption line under the SVG, on
//   whichever axis index it points at (3 = Recovery/Exposure here) - a
//   reminder that Exposure is a risk stat where lower is better, unlike
//   the other four axes.

(function () {
  window.DB_BUILD_DATA = {
    re: {
      axisLabels: ["Сложность", "DPS", "Мобильность", "Восстановление", "Скорость"],
      // true = lower is better on this axis. All RE axes are higher-is-better.
      invert: [false, false, false, false, false],
      defaultPair: [0, 2], // 333 (Ceiling) vs 111 (Head Hunt)
      builds: [
        {
          id: "333-ceiling",
             description: "{turningslash} откатывает умение {fatalwave}.",
          video: "https://www.youtube.com/watch?v=MP--TuRX3xI",
          name: "333 Шакрамы",
          accent: "#e56c7e",
          pentagon: [8, 9, 5, 8.5, 8.5],
          difficulty: 8,
          trixion: 1.2,
          trixionConfirmed: true,
          bestFor: "\u2728 Всесторонний потолок урона",
          recommended: true,
          compareEnabled: true,
        },
        {
          id: "313-high-floor",
             description: "{surge} откатывает умение {fatalwave}.",
          video: "https://www.youtube.com/watch?v=6ez2lS4AI6Q",
          compareVideo: true,
          name: "313 Шакрамы 2.0",
          accent: "#e6b422",
          pentagon: [7.5, 8, 5, 9, 10],
          difficulty: 7.5,
          trixion: 1.17,
          trixionConfirmed: true,
          bestFor: "\uD83D\uDC9C Комфорт и восстановление",
          recommended: false,
          compareEnabled: true,
        },
        {
          id: "111-head-hunt",
             description: "Классический билд без {fatalwave:Воздушных шакрам}, с {deathsentence:Смертным приговором}.",
          video: "https://www.youtube.com/watch?v=z8KE3HG_ggg",
          name: "111 Классика",
          accent: "#59c08f",
          pentagon: [9, 8, 5, 7, 10],
          difficulty: 9,
          trixion: 1.18,
          trixionConfirmed: true,
          bestFor: "\uD83D\uDD2A Раскрытие скилов и оглушение",
          recommended: false,
          compareEnabled: true,
        },
        {
          id: "standard",
             description: "Билд без использования ядер, с {spincutter:Разрубающими лезвиями}.",
          video: "https://www.youtube.com/watch?v=pZDYek5l1og",
          name: "Стандарт без ядер",
          accent: "#8d8b93",
          pentagon: [6, 6, 8.5, 4, 6],
          difficulty: 6,
          trixion: null,
          trixionConfirmed: true,
          bestFor: "\uD83C\uDF31 Билд для новичка до А.Р.К.",
          recommended: false,
          compareEnabled: true,
          // Retired from the build comparison along with the page itself:
          // it's the pre-Ark-Grid legacy build and isn't being recommended
          // to new players, so a 6/10 row next to the real builds only
          // invites someone to pick the weakest one off the list. Kept in
          // the data (rather than deleted) because this build's own page
          // still reads its pentagon, difficulty and blurb by id.
          compareHidden: true,
        },
      ],
    },
    surge: {
      axisLabels: ["Сложность", "DPS", "Мобильность", "Экспозиция", "Скорость"],
      // Exposure is back-attack/positional risk - lower is better, unlike
      // every other axis (matches the data-caption on each build's own
      // pentagon-badge).
      invert: [false, false, false, true, false],
      defaultPair: [0, 1], // 111 (Classic) vs 222 (Speedy)
      axisNoteIndex: 3,
      axisNote: "Экспозиция: риск атак в спину и позиционный риск.",
      builds: [
        {
          id: "111-classic",
             description: "Классичный геймплей Твёрдой воли.",
          video: "https://www.youtube.com/watch?v=pzFa5zOuNik",
          name: "111 Классика",
          accent: "#e56c7e",
          pentagon: [7.5, 9, 7, 6.5, 7],
          difficulty: 7.5,
          trixion: 1.23,
          trixionConfirmed: true,
          bestFor: "\uD83E\uDD81 Классичный геймплей Твёрдой воли",
          recommended: false,
          compareEnabled: true,
        },
        {
          id: "222-speedy",
             description: "Видоизменённый 111 — ощущается быстрее.",
          video: "https://www.youtube.com/watch?v=V1UQhE37Yjs",
          name: "222 Ускоренный",
          accent: "#59c08f",
          pentagon: [7, 9, 9, 8, 8],
          difficulty: 7,
          trixion: 1.25,
          trixionConfirmed: true,
          bestFor: "\uD83D\uDC06 Простое удержание урона",
          recommended: false,
          compareEnabled: true,
        },
        {
          id: "333-blitz",
             description: "Билд через {blitzrush:Охоту за головами}.",
          video: "https://www.youtube.com/watch?v=pzFa5zOuNik",
          compareVideo: true,
          name: "333 Охота за головами",
          accent: "#a8a2b2",
          pentagon: [8, 8, 8, 9, 6],
          difficulty: 8,
          trixion: 1.2,
          trixionConfirmed: false,
          bestFor: "\uD83D\uDC2F Ожидание баффов",
          recommended: false,
          compareEnabled: true,
        },
      ],
    },
  };
})();
