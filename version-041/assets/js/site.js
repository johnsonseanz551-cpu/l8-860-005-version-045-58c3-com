(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    const prev = slider.querySelector('[data-hero-prev]');
    const next = slider.querySelector('[data-hero-next]');
    let active = 0;
    let timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    restart();
  });

  document.querySelectorAll('[data-search-area]').forEach(function (area) {
    const input = area.querySelector('[data-search-input]');
    const select = area.querySelector('[data-filter-select]');
    const cards = Array.from(area.querySelectorAll('[data-card]'));
    const empty = area.querySelector('[data-empty]');

    function valueOf(card) {
      return [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-genre') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-type') || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const selected = select ? select.value.trim().toLowerCase() : '';
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = valueOf(card);
        const okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const okSelected = !selected || haystack.indexOf(selected) !== -1;
        const show = okKeyword && okSelected;
        card.classList.toggle('hidden-card', !show);
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (select) {
      select.addEventListener('change', applyFilter);
    }
  });
})();
