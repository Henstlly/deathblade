# 111 Классика 🔪

<div class="build-card-row" markdown>
<div class="build-card" markdown>

<!-- Difficulty/Trixion/Playstyle stats above, AND the pentagon badge below,
     both read from javascripts/build-data.js (window.DB_BUILD_DATA) - there is
     nothing to hand-edit in either div itself. Find this build by its
     data-build id there and edit pentagon/difficulty/trixion/bestFor/etc.;
     the stat row, the pentagon badge, and the essentials.md comparison table
     all update together from that one place. -->
<div class="build-stats" data-build="111-head-hunt" data-family="re"></div>

**Кому подходит:**{: .best-для } Тем, кто любит свободу в ротации.

**Описание:**{: .tradeoff } Почти не прощает ошибки (нет запаса на промах)

- «Хитроумный финт» занят в ротации, поэтому он может быть недоступен для восстановления ротации или для <span class="skill-mention" data-glossary-id="counter">контртаки</span>.
- В некоторых рейдах куда приятнее билда 333 (Шакрамов).
- Не сильно проигрывает по урону билду 333.

</div>
<div class="pentagon-badge" data-build="111-head-hunt" data-family="re" markdown>
<div class="pentagon-badge-title">Профиль билда</div>
<div class="pentagon-svg-mount"></div>
<div class="pentagon-badge-extra" markdown>
[Видео-гайд](https://www.youtube.com/watch?v=z8KE3HG_ggg){ .video-chip } [Геймплей](https://www.youtube.com/watch?v=4O9THIPhVuY){ .video-chip }
</div>
</div>
</div>

## Код билда {#skill-codes}

<!-- Paste the exported skill-code string (from the in-game loadout share
     feature) into the fenced code block below. Each `=== "Tab Name"` block is
     a separate tab holding its own code + optional italic note above it -
     copy that pattern to add another import option (e.g. an easier variant). -->

<div class="setup-panel" data-accent="lavender" markdown>
<div class="setup-notes" markdown>

<details class="setup-note" data-kind="danger" open markdown>
<summary><span class="setup-note-tag">Внимание</span>Перед импортом<span class="setup-note-arrow"></span></summary>

Убедись, что прочитал [Основы](essentials.md) перед импортом! Самоцветы сравни с гайдом ([Самоцветы](#gems)).

</details>

</div>
</div>

=== "111 Классика ★"

    ```
    DED8173FFCD39D6E2AED87D8C54A30A2569E5C130484E7B31875BD18BC4FCD74B8D8C6E186D6D4B7988EF707136AB5E29402AC759861C87EE2D2B1E7784BF2E2
    ```

## Система А.Р.К. {#ark-setup}

<!-- ark-passives / ark-cores JSON below use the site-wide node/core id
     vocabulary - each ark-passives node only needs its id + invested level,
     tier/max/name/icon all resolve from ap-node-names.js. Full schema is
     documented in javascripts/ark-passive-tree.js and ark-core-badge.js's
     "EASY EDIT GUIDE" comments. A nested "Alt" details block (e.g. an
     easier/optional variant) can carry its own compact ark-passives/
     skill-setup pair for that alternative - copy the existing pattern
     rather than editing the main tree in place. -->

<div class="setup-panel" data-accent="lavender" markdown>

<div class="ark-passives" data-family="re" markdown>
<script type="application/json">
[
    { "id": "evolution", "nodes": [
      { "id": "crit", "level": 10 },
      { "id": "specialization", "level": 30 },
      { "id": "limitbreakevo", "level": 2 },
      { "id": "keensense", "level": 1 },
      { "id": "strike", "level": 2 },
      { "id": "master", "level": 1 },
      { "id": "pulverize", "level": 1 },
      { "id": "standingstriker", "level": 2 }
    ] },
    { "id": "enlightenment", "nodes": [
      { "id": "swiftstrike", "level": 1 },
      { "id": "remainingenergy", "level": 3 },
      { "id": "firmwill", "level": 3 },
      { "id": "swordcraftenhancement", "level": 1 },
      { "id": "extremebodymovement", "level": 2 },
      { "id": "orbcirculation", "level": 5 }
    ] },
    { "id": "leap", "nodes": [
      { "id": "awakeningamplifier", "level": 1 },
      { "id": "unleashedpower", "level": 5 },
      { "id": "releasepotential", "level": 3 },
      { "id": "instantspell", "level": 3 },
      { "id": "danceofnightmares", "level": 3 }
    ] }
  ]
</script>
</div>

<div class="ark-cores" data-family="re" markdown>
<script type="application/json">
[
  { "core": "sun", "label": "Art Master", "points": 0 },
  { "core": "moon", "label": "Arts Core", "points": 3 },
  { "core": "star", "label": "Basics", "points": 0 }
]
</script>
</div>

<div class="setup-notes" markdown>

<details class="setup-note" data-kind="tip" open markdown>
<summary><span class="setup-note-tag">Советы</span>Советы по А.Р.К.<span class="setup-note-arrow"></span></summary>

- Используй [Калькулятор Созвездий А.Р.К.](../resources.md#ark-passive-calculator), чтобы оптимизировать вкладку «Экспансию».

</details>

<details class="setup-note" data-kind="note" markdown>
<summary><span class="setup-note-tag">Заметка</span><span class="skill-mention" data-glossary-id="arkgrid">Созвездия А.Р.К.</span><span class="setup-note-arrow"></span></summary>

- Можно играть без созвездий, но не рекомендуется.

</details>

</div>

</div>

## Гравировки {#engravings}

<div class="setup-panel" data-accent="lavender" markdown>

<div class="engraving-loadout engraving-loadout-fixed" markdown>
<span class="engraving-chip" data-skill-id="grudge"><img class="skill-icon" src="../../assets/shared/icon-grudge.png" alt="">Титаноборец</span>
<span class="engraving-chip" data-skill-id="adrenaline"><img class="skill-icon" src="../../assets/shared/icon-adrenaline.png" alt="">Адреналин</span>
<span class="engraving-chip" data-skill-id="ambushmaster"><img class="skill-icon" src="../../assets/shared/icon-ambushmaster.png" alt="">Бесшумный убийца</span>
<span class="engraving-chip" data-skill-id="raidcaptain"><img class="skill-icon" src="../../assets/shared/icon-raidcaptain.png" alt="">Неутомимый натиск</span>
<span class="engraving-chip" data-skill-id="keenbluntweapon"><img class="skill-icon" src="../../assets/shared/icon-keenbluntweapon.png" alt="">Моргенштерн</span>
</div>

<p class="engraving-loadout-hint engraving-loadout-hint-line" markdown>Подробнее о гравировках можно прочитать [здесь!](essentials.md#engravings)</p>

</div>

## Набор навыков {#skill-setup}

<!-- Full skill-setup schema (id/level/tripods/rune/subtitle/picks) is in
     javascripts/skill-setup.js's "EASY EDIT GUIDE" comment. Names, icons, and
     tags resolve automatically by id from skill-data.js - only add "name" to
     override the display text for a genuine one-off case. -->

<div class="setup-panel" data-accent="lavender" markdown>

<div class="skill-setup" data-family="re" markdown>
<script type="application/json">
[
  {"id": "soulabsorber", "level": 14, "tripods": [3, 1, 2], "rune": {"tier": "legendary", "name": "Wealth"}},
  {"id": "deathsentence", "level": 14, "tripods": [2, 2, 1], "rune": {"tier": "legendary", "name": "Galewind"}},
  {"id": "twinshadows", "level": 14, "tripods": [2, 1, 2], "rune": {"tier": "rare", "name": "Wealth"}},
  {"id": "headhunt", "level": 7, "tripods": [2, 2], "rune": {"tier": "uncommon", "name": "Wealth"}},
  {"id": "turningslash", "level": 14, "tripods": [1, 3, 1], "rune": {"tier": "rare", "name": "Wealth"}},
  {"id": "maelstrom", "level": 10, "tripods": [2, 1, 2], "rune": {"tier": "rare", "name": "Wealth"}},
  {"id": "blitzrush", "level": 14, "tripods": [2, 1, 1], "rune": {"tier": "epic", "name": "Wealth"}},
  {"id": "voidstrike", "level": 11, "tripods": [3, 1, 2], "rune": {"tier": "epic", "name": "Wealth"}},
  {"id": "surge", "subtitle": "Identity"},
  {"id": "deathlyslash", "subtitle": "Technique"},
  {"id": "bladeassault", "subtitle": "Awakening"}
]
</script>
</div>

<div class="setup-notes" markdown>

</div>

</div>

## Самоцветы {#gems}

<!-- Ranked skill-id lists per column (dmg/cd), top = highest priority.
     Full schema, including the expandable "alts" form for a swappable
     alternative, is in javascripts/gem-priority.js's "EASY EDIT GUIDE"
     comment. -->

<div class="setup-panel" data-accent="lavender" markdown>

<div class="gem-priority" markdown>
<script type="application/json">
[
  { "col": "dmg", "items": [
    "surge", "deathsentence", "twinshadows", "turningslash",
    "soulabsorber", "blitzrush", "voidstrike"
  ] },
  { "col": "cd", "items": [
    "maelstrom", "blitzrush", "headhunt", "turningslash"
  ] }
]
</script>
</div>

</div>

## Ротация {#rotation}

Используй **Открытие** (по желанию), затем чередуй **Цикл 1** и **2** до конца боя. Открытие набирает стаки «Адреналина» и навешивает синергии.

Открытие с 3 сфер (<span class="food-req-item">![](../assets/shared/icon-stimulant.png){: .skill-icon } Мощная «Эйфория»</span>)
{ .rotation-stage }

<div class="rotation-line" markdown>
<script type="application/json">
[{ "id": "headhunt", "swapNext": true }, "twinshadows", "deathsentence", "maelstrom", "turningslash", "deathlyslash", "surge",
 { "cycleRef": 2, "title": "Цикл «Длани Авесты» + «Охоты за головами»" },
 { "cycleRef": 1, "title": "Цикл «Искусства меча» + «Убийственной стали»" },
 { "suffix": "и так далее" }]
</script>
</div>

Чередующиеся циклы
{ .rotation-stage }

<div class="cycle-card" markdown>
<div class="cycle-card-header"><span class="cycle-num cycle-num-1">1</span><span class="cycle-title">Цикл «Искусства меча» + «Убийственной стали»</span></div>
<div class="rotation-line" markdown>
<script type="application/json">
["maelstrom", "voidstrike", "twinshadows", "headhunt", "deathlyslash", "deathsentence", "turningslash", "surge"]
</script>
</div>
</div>

<div class="cycle-card" markdown>
<div class="cycle-card-header"><span class="cycle-num cycle-num-2">2</span><span class="cycle-title">Цикл «Длани Авесты» + «Охоты за головами»</span></div>
<div class="rotation-line" markdown>
<script type="application/json">
["soulabsorber", "blitzrush", "twinshadows", "deathsentence", "turningslash",
 { "id": "headhunt", "situational": "восстановление" },
 "surge"]
</script>
</div>
</div>

<div class="rotation-notes" markdown>

Старайся уместить «Двойную плеть» из **Цикла 2** под «Плащ клинков» из **Цикла 1**, чтобы набрать 3 сферы без повторного применения плаща.

</div>

<aside class="setup-note" data-kind="danger" markdown>
<p><span class="setup-note-tag">Важно</span> Правильное использование «Плаща клинков» крайне важно. Научись правильно нажимать и держать его на себе.</p>
</aside>

Открытие с 0-2 сфер
{ .rotation-stage }

<div class="rotation-notes" markdown>

1. **Цикл 1**, если доступна «Убийственная сталь», иначе начни с «Плаща клинков» + **Цикл 2**.

</div>

Восстановление
{ .rotation-stage }

<div class="setup-panel" data-accent="lavender" markdown>

<div class="setup-notes" markdown>

<details class="setup-note" data-kind="tip" open markdown>
<summary><span class="setup-note-tag">Советы</span>Видео по восстановлению<span class="setup-note-arrow"></span></summary>

Посмотри это 54-минутное [видео по восстановлению в 111](https://www.youtube.com/watch?v=z8KE3HG_ggg) или выбери более простой билд.

Используй свободные стаки «Двойной плети»/«Плаща клинков»/«Охоты за головами». Искусство меча, Длань Авесты НЕ рекомендую нажимать для фикса ротации.

</details>

</div>

</div>

## Распределение Урона {#dps-spread}

<!-- data-labels / data-values / data-ids are three parallel comma-separated
     lists, ordered highest % first - update after a fresh Trixion recording
     or a balance pass. Full schema is in javascripts/dps-chart.js's
     "EASY EDIT GUIDE" comment. -->

<p class="dps-showcase-caption">Древние ядра, самоцветы полностью Ур. 10</p>

<div class="dps-showcase" markdown>
<div class="dps-showcase-frame" markdown>
<div class="dps-chart" data-show-icons data-values="21,19.9,16.6,11.6,10.6,8,6.6,5.5" data-ids="deathlyslash,surge,deathsentence,turningslash,twinshadows,soulabsorber,blitzrush,voidstrike"></div>
</div>
</div>