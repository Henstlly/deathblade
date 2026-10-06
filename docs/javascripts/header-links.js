// FORK GUIDE: INFRA - site chrome, keep as-is.
// Twitch / Discord / Telegram links in the Material header, next to the search
// toggle, on every page rather than just Home.
//
// Small enough to stand on its own instead of going into extra.js: it only
// touches the header, needs no page data, and the icons are plain files under
// assets/shared/media_icons/ - no SiteUtils, no inline-JSON payload.
//
// Placement: the three <a> are inserted as siblings inside .md-header__inner,
// right before the search label. That row is already a flex line whose
// .md-header__title carries flex-grow: 1, so they get pushed to the far right
// with no positioning CSS. Each one reuses Material's own .md-header__button
// class, which already supplies padding, margin, cursor and a ~1.9rem click
// target - so the only styling needed is the icon size below.
//
// The guard is required, not defensive tidiness: navigation.instant is on, and
// document$ re-fires on every SPA-style page swap, so without it the icons
// would be appended again on each in-app navigation.
//
// Icon colors are the site's own red (--dbc-red, #e05a6e) and are baked into
// the SVGs - each file had exactly one color it needed changed: Twitch's
// #9146FF and Discord's #5865F2 fill, and Telegram's .st117 rule (#1B92D1),
// which is the only one of that file's 150 mixer classes the single path
// actually uses. So they can't be restyled from here; changing them means
// editing the fills in the SVGs. #e05a6e measures 4.6:1 against the #1c1c1e
// header, clearing the 3:1 WCAG 1.4.11 non-text bar for logos, hence no
// brightness filter.
(function () {
  var LINKS = [
    ["twitch-svgrepo-com.svg", "https://www.twitch.tv/henstly", "Twitch"],
    ["discord-icon-svgrepo-com.svg", "https://discord.gg/m8ybZ5pfvF", "Discord"],
    ["telegram-communication-chat-interaction-network-connection-svgrepo-com.svg", "https://t.me/henstlystream", "Telegram"]
  ];

  // Injected as a <style> tag rather than appended to extra.css, purely to keep
  // this feature self-contained in one file. Moving these two rules into
  // extra.css is a straight copy-paste if you'd rather keep all CSS in the one
  // place - note the 1rem step-down keeps the row readable on phones, where
  // the header is only 2.4rem tall and the title is already ellipsized.
  function addStyle() {
    if (document.getElementById("header-links-style")) return;
    var style = document.createElement("style");
    style.id = "header-links-style";
    style.textContent =
      ".media-link img { width: 1.1rem; height: 1.1rem; }\n" +
      "@media screen and (max-width: 600px) { .media-link img { width: 1rem; height: 1rem; } }\n";
    document.head.appendChild(style);
  }

  function addLinks() {
    addStyle();

    var header = document.querySelector(".md-header__inner");
    if (!header || header.querySelector(".media-link")) return;

    // Site root for the current page depth, taken from the logo's own href
    // (".", "..", "../.." depending on nesting) so one string resolves on Home
    // and on a two-level-deep page alike - no hardcoded base path to go stale
    // if use_directory_urls ever changes.
    var logo = header.querySelector(".md-logo");
    var base = ((logo && logo.getAttribute("href")) || ".").replace(/\/*$/, "/");

    // Sit immediately left of the search toggle. If a future theme drop stops
    // rendering it, insertBefore(null) appends instead, which still lands them
    // at the right-hand end of the row.
    var search = header.querySelector('label[for="__search"]');

    LINKS.forEach(function (link) {
      var a = document.createElement("a");
      a.className = "md-header__button media-link";
      a.href = link[1];
      a.title = link[2];
      a.setAttribute("aria-label", link[2]);
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      var img = document.createElement("img");
      img.src = base + "assets/shared/media_icons/" + link[0];
      img.alt = "";  // decorative - the anchor above already names the link
      a.appendChild(img);

      header.insertBefore(a, search || null);
    });
  }

  if (window.document$) document$.subscribe(addLinks);
  else addLinks();
})();
