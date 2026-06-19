(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var mobile = document.querySelector('[data-mobile-nav]');

    if (toggle && mobile) {
      toggle.addEventListener('click', function () {
        mobile.classList.toggle('open');
      });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
      var current = 0;

      function setSlide(index) {
        current = index;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle('is-active', itemIndex === current);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle('active', itemIndex === current);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          setSlide(index);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          setSlide((current + 1) % slides.length);
        }, 5200);
      }
    }

    var panels = document.querySelectorAll('[data-filter-panel]');

    panels.forEach(function (panel) {
      var section = panel.closest('section') || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll('[data-card]'));
      var input = panel.querySelector('[data-search-input]');
      var activeRegion = '';
      var activeType = '';

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search') || '').toLowerCase();
          var region = card.getAttribute('data-region') || '';
          var type = card.getAttribute('data-type') || '';
          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedRegion = !activeRegion || region === activeRegion;
          var matchedType = !activeType || type === activeType;
          card.classList.toggle('is-hidden', !(matchedKeyword && matchedRegion && matchedType));
        });
      }

      if (input) {
        input.addEventListener('input', applyFilter);
      }

      panel.querySelectorAll('[data-filter-region]').forEach(function (button) {
        button.addEventListener('click', function () {
          activeRegion = button.getAttribute('data-filter-region') || '';
          panel.querySelectorAll('[data-filter-region], [data-filter-all]').forEach(function (item) {
            item.classList.remove('active');
          });
          button.classList.add('active');
          applyFilter();
        });
      });

      panel.querySelectorAll('[data-filter-type]').forEach(function (button) {
        button.addEventListener('click', function () {
          if (activeType === button.getAttribute('data-filter-type')) {
            activeType = '';
            button.classList.remove('active');
          } else {
            activeType = button.getAttribute('data-filter-type') || '';
            panel.querySelectorAll('[data-filter-type]').forEach(function (item) {
              item.classList.remove('active');
            });
            button.classList.add('active');
          }
          applyFilter();
        });
      });

      var allButton = panel.querySelector('[data-filter-all]');
      if (allButton) {
        allButton.addEventListener('click', function () {
          activeRegion = '';
          activeType = '';
          if (input) {
            input.value = '';
          }
          panel.querySelectorAll('.filter-chip').forEach(function (item) {
            item.classList.remove('active');
          });
          allButton.classList.add('active');
          applyFilter();
        });
      }
    });
  });
})();
