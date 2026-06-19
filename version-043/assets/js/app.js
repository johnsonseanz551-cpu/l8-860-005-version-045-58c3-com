(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function toggleNavigation() {
    var button = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-nav]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFiltering() {
    var input = document.querySelector("[data-search-input]");
    var region = document.querySelector("[data-region-filter]");
    var type = document.querySelector("[data-type-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var counter = document.querySelector("[data-result-count]");
    var empty = document.querySelector("[data-empty-state]");
    if (!cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (input && query) {
      input.value = query;
    }

    function valueOf(select) {
      return select ? select.value.trim().toLowerCase() : "";
    }

    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var regionValue = valueOf(region);
      var typeValue = valueOf(type);
      var visible = 0;
      cards.forEach(function (card) {
        var index = (card.getAttribute("data-index") || "").toLowerCase();
        var ok = true;
        if (q && index.indexOf(q) === -1) {
          ok = false;
        }
        if (regionValue && index.indexOf(regionValue) === -1) {
          ok = false;
        }
        if (typeValue && index.indexOf(typeValue) === -1) {
          ok = false;
        }
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });
      if (counter) {
        counter.textContent = String(visible);
      }
      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    }

    [input, region, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }

  ready(function () {
    toggleNavigation();
    setupHero();
    setupFiltering();
  });
})();
