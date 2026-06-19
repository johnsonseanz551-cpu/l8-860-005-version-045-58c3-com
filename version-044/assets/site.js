(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = qs('[data-menu-toggle]');
    var mobileNav = qs('[data-mobile-nav]');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    qsa('[data-hero]').forEach(function (hero) {
      var slides = qsa('[data-hero-slide]', hero);
      var dots = qsa('[data-hero-dot]', hero);
      var prev = qs('[data-hero-prev]', hero);
      var next = qs('[data-hero-next]', hero);
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          start();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          show(dotIndex);
          start();
        });
      });

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      show(0);
      start();
    });

    qsa('[data-filter-panel]').forEach(function (panel) {
      var scope = panel.getAttribute('data-filter-panel');
      var target = qs('[data-filter-target="' + scope + '"]');
      var cards = target ? qsa('[data-movie-card]', target) : [];
      var empty = qs('[data-empty-for="' + scope + '"]');
      var searchInput = qs('[data-filter-search]', panel);
      var typeSelect = qs('[data-filter-type]', panel);
      var regionSelect = qs('[data-filter-region]', panel);
      var yearSelect = qs('[data-filter-year]', panel);

      function matches(card, query, typeValue, regionValue, yearValue) {
        var keywords = normalizeText(card.getAttribute('data-keywords'));
        var type = card.getAttribute('data-type') || '';
        var region = card.getAttribute('data-region') || '';
        var year = card.getAttribute('data-year') || '';
        var okQuery = !query || keywords.indexOf(query) !== -1;
        var okType = !typeValue || type === typeValue;
        var okRegion = !regionValue || region === regionValue;
        var okYear = !yearValue || year === yearValue;
        return okQuery && okType && okRegion && okYear;
      }

      function apply() {
        var query = normalizeText(searchInput && searchInput.value);
        var typeValue = typeSelect ? typeSelect.value : '';
        var regionValue = regionSelect ? regionSelect.value : '';
        var yearValue = yearSelect ? yearSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var showCard = matches(card, query, typeValue, regionValue, yearValue);
          card.style.display = showCard ? '' : 'none';
          if (showCard) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [searchInput, typeSelect, regionSelect, yearSelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      apply();
    });
  });
})();
