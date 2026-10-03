(function () {
  var LINKS = [
    ["twitch-svgrepo-com.svg", "https://www.twitch.tv/henstly", "Twitch"],
    ["discord-icon-svgrepo-com.svg", "https://discord.gg/m8ybZ5pfvF", "Discord"],
    ["telegram-communication-chat-interaction-network-connection-svgrepo-com.svg", "https://t.me/henstlystream", "Telegram"]
  ];
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
    var logo = header.querySelector(".md-logo");
    var base = ((logo && logo.getAttribute("href")) || ".").replace(/\/*$/, "/");
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
      img.alt = "";
      a.appendChild(img);
      header.insertBefore(a, search || null);
    });
  }
  if (window.document$) document$.subscribe(addLinks);
  else addLinks();
})();
