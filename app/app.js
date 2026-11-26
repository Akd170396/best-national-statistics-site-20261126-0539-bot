/* NusaData — app.js
   Boot: pasang pendengar router dan kontrol, lalu render halaman pertama. */
"use strict";

(function () {
  function boot() {
    document.getElementById("navToggle").addEventListener("click", function () {
      var nav = document.getElementById("mainnav");
      var open = nav.classList.toggle("open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.getElementById("view").addEventListener("click", function (e) {
      NUSA_VIEWS.onChipClick(e);
      NUSA_VIEWS.onTableClick(e);
    });
    document.getElementById("view").addEventListener("input", function (e) {
      NUSA_VIEWS.onSearch(e);
    });
    window.addEventListener("hashchange", NUSA_VIEWS.render);
    window.addEventListener("resize", function () {
      var y = window.scrollY;
      NUSA_VIEWS.render();
      window.scrollTo(0, y);
    });
    NUSA_VIEWS.render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
