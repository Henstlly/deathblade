(function () {
  var el = window.SiteUtils.el;
  var SITE_ROOT = window.SiteUtils.detectSiteRoot("glossary-tooltip.js");
  function buildTip(data) {
    var tip = el("div", "skill-tip md-typeset");
    tip.setAttribute("role", "tooltip");
    if (data.icon) {
      var header = el("div", "skill-tip-header");
      var icon = document.createElement("img");
      icon.className = "skill-tip-icon";
      icon.src = window.SiteUtils.iconSrc(SITE_ROOT, "icon-" + data.icon + ".png");
      icon.alt = "";
      icon.loading = "lazy";
      window.SiteUtils.hideOnError(icon, "display");
      header.appendChild(icon);
      header.appendChild(el("div", "skill-tip-title", data.term));
      tip.appendChild(header);
    } else {
      tip.appendChild(el("div", "skill-tip-title", data.term));
    }
    if (data.def) tip.appendChild(el("p", "skill-tip-note", data.def));
    return tip;
  }
  function attach(trigger) {
    if (trigger.classList.contains("skill-tip-wired")) return;
    var id = trigger.getAttribute("data-glossary-id");
    var data = id && window.DB_GLOSSARY && window.DB_GLOSSARY[id];
    if (!data) return;
    window.SkillTooltip.wireCustom(trigger, buildTip(data));
  }
  window.SiteUtils.registerRenderer(".skill-mention[data-glossary-id]", attach);
})();
