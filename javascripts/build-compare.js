(function () {
  var FAMILY_FOLDER = { re: "remaining-energy", surge: "surge" };
  var SITE_ROOT = window.SiteUtils.detectSiteRoot("build-compare.js");
  function buildUrl(family, build) {
    return SITE_ROOT + FAMILY_FOLDER[family] + "/" + build.id + "/";
  }
  var toPoint = window.SiteUtils.pentagonPoint;
  var pointsToAttr = window.SiteUtils.pentagonPointsToAttr;
  var svgEl = window.SiteUtils.svgEl;
  var fmt1 = window.SiteUtils.formatStat;
  function isCompareVisible(b) {
    return b.compareEnabled !== false && !b.compareHidden;
  }
  function buildOverviewTable(family, data) {
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    ["Билд", "Сложность", "DPS в Тризионе", "Описание"].forEach(function (label) {
      var th = document.createElement("th");
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    data.builds.filter(isCompareVisible).forEach(function (build) {
      var row = document.createElement("tr");
      var nameCell = document.createElement("td");
      var nameLink = document.createElement("a");
      nameLink.href = (build.compareVideo && build.video)
        ? build.video
        : buildUrl(family, build);
      nameLink.className = "build-compare-name";
      var dot = document.createElement("span");
      dot.className = "build-compare-dot";
      dot.style.backgroundColor = build.accent;
      nameLink.appendChild(dot);
      var nameText = build.name;
      if (build.recommended) {
        nameText += "\u00a0\u2605";
      }
      nameLink.appendChild(document.createTextNode(nameText));
      nameCell.appendChild(nameLink);
      row.appendChild(nameCell);
      function buildBarCell(labelText, pct, trackClass, fillClass) {
        var cell = document.createElement("div");
        cell.className = "table-bar-cell";
        cell.appendChild(document.createTextNode(labelText));
        var track = document.createElement("div");
        track.className = trackClass || "stat-bar-track";
        var fill = document.createElement("div");
        fill.className = fillClass || "stat-bar-fill";
        fill.style.width = pct + "%";
        track.appendChild(fill);
        cell.appendChild(track);
        return cell;
      }
      var diffCell = document.createElement("td");
      diffCell.appendChild(buildBarCell(fmt1(build.difficulty) + " / 10", (build.difficulty / 10) * 100));
      row.appendChild(diffCell);
      var trixCell = document.createElement("td");
      if (build.trixion == null) {
        trixCell.textContent = "\u2014";
      } else {
        var trixPct = Math.max(0, Math.min(1, (build.trixion - 1.0) / 0.3)) * 100;
        var fillClass = "stat-bar-fill stat-bar-fill-teal" + (build.trixionConfirmed === false ? " stat-bar-fill-unconfirmed" : "");
        trixCell.appendChild(buildBarCell(
          build.trixion.toFixed(2) + "x", trixPct,
          "stat-bar-track stat-bar-track-teal", fillClass
        ));
      }
      row.appendChild(trixCell);
      row.appendChild(buildDescriptionCell(build));
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    return table;
  }
  function buildDescriptionCell(build) {
    var cell = document.createElement("td");
    cell.className = "build-compare-desc";
    var src = build.description || build.bestFor || "";
    var re = /\{([a-z0-9]+)(?::([^}]*))?\}/g;
    var last = 0, m;
    while ((m = re.exec(src)) !== null) {
      if (m.index > last) {
        cell.appendChild(document.createTextNode(src.slice(last, m.index)));
      }
      var name = window.DB_SKILL_NAMES && window.DB_SKILL_NAMES[m[1]];
      if (name) {
        var span = document.createElement("span");
        span.className = "skill-mention";
        span.setAttribute("data-skill-id", m[1]);
        span.textContent = m[2] != null && m[2] !== "" ? m[2] : name;
        cell.appendChild(span);
      } else {
        cell.appendChild(document.createTextNode(m[0]));
      }
      last = m.index + m[0].length;
    }
    if (last < src.length) cell.appendChild(document.createTextNode(src.slice(last)));
    return cell;
  }
  function buildOverlaySvg(axisLabels, buildA, buildB) {
    var cx = 100, cy = 98, rMax = 60;
    var angles = axisLabels.map(function (_, i) { return (360 / axisLabels.length) * i; });
    var svg = svgEl("svg", {
      viewBox: "0 0 200 190",
      class: "pentagon-svg build-compare-svg",
      role: "img",
      "aria-label":
        buildA.name +
        " vs " +
        buildB.name +
        ": " +
        axisLabels
          .map(function (l, i) { return l + " " + fmt1(buildA.pentagon[i]) + " vs " + fmt1(buildB.pentagon[i]); })
          .join(", "),
    });
    [0.33, 0.66, 1.0].forEach(function (frac, i) {
      var pts = angles.map(function (a) { return toPoint(cx, cy, a, rMax * frac); });
      svg.appendChild(
        svgEl("polygon", { points: pointsToAttr(pts), class: "pentagon-ring" + (i === 2 ? " pentagon-ring-outer" : "") })
      );
    });
    angles.forEach(function (a) {
      var p = toPoint(cx, cy, a, rMax);
      svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: p[0].toFixed(1), y2: p[1].toFixed(1), class: "pentagon-spoke" }));
    });
    [buildB, buildA].forEach(function (build) {
      var dataPts = angles.map(function (a, i) {
        var v = Math.max(0, Math.min(10, build.pentagon[i]));
        return toPoint(cx, cy, a, rMax * (v / 10));
      });
      svg.appendChild(
        svgEl("polygon", {
          points: pointsToAttr(dataPts),
          fill: build.accent,
          "fill-opacity": "0.16",
          stroke: build.accent,
          "stroke-width": "1.75",
          "stroke-linejoin": "round",
          class: "build-compare-poly",
        })
      );
      dataPts.forEach(function (p) {
        svg.appendChild(svgEl("circle", { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: "2.4", fill: build.accent, class: "build-compare-dot" }));
      });
    });
    var labelR = rMax + 15;
    angles.forEach(function (a, i) {
      var p = toPoint(cx, cy, a, labelR);
      var x = p[0], y = p[1];
      var anchor = "middle";
      if (Math.abs(x - cx) >= 3) anchor = x < cx ? "end" : "start";
      var dy = 0;
      if (a === 0) dy = -2;
      else if (a === 180 || (a >= 126 && a <= 234)) dy = 4;
      var text = svgEl("text", { x: x.toFixed(1), y: (y + dy).toFixed(1), "text-anchor": anchor, class: "pentagon-label" });
      text.textContent = axisLabels[i];
      svg.appendChild(text);
    });
    return svg;
  }
  function buildSelect(builds, selectedId, ariaLabel) {
    var select = document.createElement("select");
    select.className = "build-compare-select";
    select.setAttribute("aria-label", ariaLabel);
    builds.forEach(function (b) {
      var opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = b.name;
      if (b.id === selectedId) opt.selected = true;
      select.appendChild(opt);
    });
    return select;
  }
  function buildKeyDifferences(axisLabels, invert, buildA, buildB) {
    var card = document.createElement("div");
    card.className = "build-compare-diffcard";
    var title = document.createElement("div");
    title.className = "build-compare-diffcard-title";
    title.textContent = "Ключевые различия";
    card.appendChild(title);
    var chipsA = [];
    var chipsB = [];
    axisLabels.forEach(function (label, i) {
      var delta = buildA.pentagon[i] - buildB.pentagon[i];
      if (Math.abs(delta) < 0.05) return;
      var favorsA = invert[i] ? delta < 0 : delta > 0;
      var sign = invert[i] ? "\u2212" : "+";
      var text = sign + fmt1(Math.abs(delta)) + " " + label;
      (favorsA ? chipsA : chipsB).push(text);
    });
    var body = document.createElement("div");
    body.className = "build-compare-diffcard-body";
    if (chipsA.length === 0 && chipsB.length === 0) {
      var same = document.createElement("div");
      same.className = "build-compare-diffcard-empty";
      same.textContent = "Эти билды почти не отличаются ни по одной из осей.";
      body.appendChild(same);
    } else {
      [
        [buildA, chipsA],
        [buildB, chipsB],
      ].forEach(function (pair) {
        var build = pair[0];
        var chips = pair[1];
        var col = document.createElement("div");
        col.className = "build-compare-diffcard-col";
        var name = document.createElement("div");
        name.className = "build-compare-diffcard-name";
        name.style.color = build.accent;
        name.textContent = build.name;
        col.appendChild(name);
        var chipRow = document.createElement("div");
        chipRow.className = "build-compare-diffcard-chips";
        if (chips.length === 0) {
          var none = document.createElement("span");
          none.className = "build-compare-diffcard-none";
          none.textContent = "Явного преимущества нет";
          chipRow.appendChild(none);
        } else {
          chips.forEach(function (text) {
            var chip = document.createElement("span");
            chip.className = "build-compare-diffchip";
            chip.style.borderColor = build.accent + "4d";
            chip.style.color = build.accent;
            chip.textContent = text;
            chipRow.appendChild(chip);
          });
        }
        col.appendChild(chipRow);
        body.appendChild(col);
      });
    }
    card.appendChild(body);
    return card;
  }
  function getUrlPair(compareBuilds) {
    var params = new URLSearchParams(window.location.search);
    var a = params.get("a");
    var b = params.get("b");
    if (!a || !b || a === b) return null;
    var buildA = compareBuilds.filter(function (build) { return build.id === a; })[0];
    var buildB = compareBuilds.filter(function (build) { return build.id === b; })[0];
    if (!buildA || !buildB) return null;
    return [buildA.id, buildB.id];
  }
  function shareUrlFor(idA, idB) {
    var params = new URLSearchParams(window.location.search);
    params.set("a", idA);
    params.set("b", idB);
    return window.location.pathname + "?" + params.toString() + window.location.hash;
  }
  function updateUrl(idA, idB) {
    if (!window.history || !window.history.replaceState) return;
    window.history.replaceState(null, "", shareUrlFor(idA, idB));
  }
  var copyToClipboard = window.SiteUtils.copyToClipboard;
  function renderWidget(container, family) {
    var data = window.DB_BUILD_DATA && window.DB_BUILD_DATA[family];
    if (!data) return;
    var compareBuilds = data.builds.filter(isCompareVisible);
    var urlPair = getUrlPair(compareBuilds);
    var idA = (urlPair && urlPair[0]) || container.getAttribute("data-build-a") || compareBuilds[data.defaultPair[0]].id;
    var idB = (urlPair && urlPair[1]) || container.getAttribute("data-build-b") || compareBuilds[data.defaultPair[1]].id;
    if (idA === idB) {
      idA = compareBuilds[data.defaultPair[0]].id;
      idB = compareBuilds[data.defaultPair[1]].id;
    }
    var buildA = compareBuilds.filter(function (b) { return b.id === idA; })[0] || compareBuilds[0];
    var buildB = compareBuilds.filter(function (b) { return b.id === idB; })[0] || compareBuilds[1];
    container.innerHTML = "";
    var tableScroll = document.createElement("div");
    tableScroll.className = "build-compare-table-scroll";
    tableScroll.appendChild(buildOverviewTable(family, data));
    container.appendChild(tableScroll);
    var headerRow = document.createElement("div");
    headerRow.className = "build-compare-header-row";
    var controls = document.createElement("div");
    controls.className = "build-compare-controls";
    var wrapA = document.createElement("span");
    wrapA.className = "build-compare-select-wrap";
    var dotA = document.createElement("span");
    dotA.className = "build-compare-select-dot";
    var selectA = buildSelect(compareBuilds, buildA.id, "Первый билд для сравнения");
    wrapA.appendChild(dotA);
    wrapA.appendChild(selectA);
    var vs = document.createElement("span");
    vs.className = "build-compare-vs";
    vs.textContent = "vs";
    var wrapB = document.createElement("span");
    wrapB.className = "build-compare-select-wrap";
    var dotB = document.createElement("span");
    dotB.className = "build-compare-select-dot";
    var selectB = buildSelect(compareBuilds, buildB.id, "Второй билд для сравнения");
    wrapB.appendChild(dotB);
    wrapB.appendChild(selectB);
    controls.appendChild(wrapA);
    controls.appendChild(vs);
    controls.appendChild(wrapB);
    headerRow.appendChild(controls);
    var COPY_ICON =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    var CHECK_ICON =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    var shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.className = "build-compare-share-btn";
    shareBtn.innerHTML = COPY_ICON;
    shareBtn.setAttribute("aria-label", "Скопировать ссылку на это сравнение");
    shareBtn.setAttribute("data-tooltip", "Скопировать ссылку на это сравнение");
    headerRow.appendChild(shareBtn);
    container.appendChild(headerRow);
    var body = document.createElement("div");
    body.className = "build-compare-body";
    container.appendChild(body);
    function renderBody() {
      body.innerHTML = "";
      dotA.style.backgroundColor = buildA.accent;
      dotB.style.backgroundColor = buildB.accent;
      var svgMount = document.createElement("div");
      svgMount.className = "build-compare-svg-mount";
      svgMount.appendChild(buildOverlaySvg(data.axisLabels, buildA, buildB));
      body.appendChild(svgMount);
      body.appendChild(buildKeyDifferences(data.axisLabels, data.invert, buildA, buildB));
    }
    renderBody();
    var shareResetTimer = null;
    function resetShareBtn() {
      shareBtn.innerHTML = COPY_ICON;
      shareBtn.setAttribute("data-tooltip", "Скопировать ссылку на это сравнение");
      shareBtn.setAttribute("aria-label", "Скопировать ссылку на это сравнение");
    }
    shareBtn.addEventListener("click", function () {
      copyToClipboard(window.location.origin + shareUrlFor(buildA.id, buildB.id))
        .then(function () {
          clearTimeout(shareResetTimer);
          shareBtn.innerHTML = CHECK_ICON;
          shareBtn.setAttribute("data-tooltip", "Ссылка скопирована");
          shareBtn.setAttribute("aria-label", "Ссылка скопирована");
          shareResetTimer = setTimeout(resetShareBtn, 1800);
        })
        .catch(function () {
          clearTimeout(shareResetTimer);
          shareBtn.setAttribute("data-tooltip", "Не получилось скопировать — скопируйте из адресной строки");
          shareBtn.setAttribute("aria-label", "Не получилось скопировать — скопируйте из адресной строки");
          shareResetTimer = setTimeout(resetShareBtn, 2400);
        });
    });
    selectA.addEventListener("change", function () {
      if (selectA.value === selectB.value) {
        selectB.value = buildA.id;
      }
      buildA = compareBuilds.filter(function (b) { return b.id === selectA.value; })[0];
      buildB = compareBuilds.filter(function (b) { return b.id === selectB.value; })[0];
      updateUrl(buildA.id, buildB.id);
      renderBody();
    });
    selectB.addEventListener("change", function () {
      if (selectB.value === selectA.value) {
        selectA.value = buildB.id;
      }
      buildA = compareBuilds.filter(function (b) { return b.id === selectA.value; })[0];
      buildB = compareBuilds.filter(function (b) { return b.id === selectB.value; })[0];
      updateUrl(buildA.id, buildB.id);
      renderBody();
    });
  }
  function renderContainer(container) {
    renderWidget(container, container.getAttribute("data-family"));
  }
  window.SiteUtils.registerRenderer(".build-compare[data-family]", renderContainer);
})();
