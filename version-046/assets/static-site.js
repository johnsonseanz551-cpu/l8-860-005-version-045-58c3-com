(function () {
  function selectAll(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    show(0);
    start();
  }

  function setupFilters() {
    selectAll('[data-filter-panel]').forEach(function (panel) {
      var section = panel.closest('.site-section') || document;
      var cards = selectAll('.filter-card', section);
      var queryInput = panel.querySelector('[data-filter-query]');
      var yearInput = panel.querySelector('[data-filter-year]');
      var typeInput = panel.querySelector('[data-filter-type]');
      var regionInput = panel.querySelector('[data-filter-region]');
      var empty = section.querySelector('[data-empty-state]');

      function text(value) {
        return String(value || '').trim().toLowerCase();
      }

      function apply() {
        var query = text(queryInput && queryInput.value);
        var year = text(yearInput && yearInput.value);
        var type = text(typeInput && typeInput.value);
        var region = text(regionInput && regionInput.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = text(card.getAttribute('data-text'));
          var cardYear = text(card.getAttribute('data-year'));
          var cardType = text(card.getAttribute('data-type'));
          var cardRegion = text(card.getAttribute('data-region'));
          var match = true;
          if (query && haystack.indexOf(query) === -1) {
            match = false;
          }
          if (year && cardYear.indexOf(year) === -1) {
            match = false;
          }
          if (type && cardType.indexOf(type) === -1 && haystack.indexOf(type) === -1) {
            match = false;
          }
          if (region && cardRegion.indexOf(region) === -1 && haystack.indexOf(region) === -1) {
            match = false;
          }
          card.classList.toggle('is-hidden-by-filter', !match);
          if (match) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [queryInput, yearInput, typeInput, regionInput].forEach(function (input) {
        if (input) {
          input.addEventListener('input', apply);
          input.addEventListener('change', apply);
        }
      });
    });
  }

  function setupPlayers() {
    selectAll('.video-player').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var loading = player.querySelector('.player-loading');
      var message = player.querySelector('.player-message');
      var source = player.getAttribute('data-source');
      var hls = null;
      var started = false;

      function setMessage(text) {
        if (message) {
          message.textContent = text;
          message.hidden = !text;
        }
      }

      function setLoading(active) {
        if (loading) {
          loading.hidden = !active;
        }
      }

      function playVideo() {
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            setMessage('请再次点击播放按钮');
          });
        }
      }

      function start() {
        if (!video || !source) {
          return;
        }
        if (cover) {
          cover.classList.add('is-hidden');
        }
        setMessage('');
        setLoading(true);

        if (started) {
          setLoading(false);
          playVideo();
          return;
        }
        started = true;

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setLoading(false);
            playVideo();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setLoading(false);
              setMessage('视频加载失败，请稍后重试');
              if (hls) {
                hls.destroy();
                hls = null;
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.addEventListener('loadedmetadata', function () {
            setLoading(false);
            playVideo();
          }, { once: true });
          video.addEventListener('error', function () {
            setLoading(false);
            setMessage('视频加载失败，请稍后重试');
          }, { once: true });
        } else {
          setLoading(false);
          setMessage('当前浏览器不支持视频播放');
        }
      }

      if (cover) {
        cover.addEventListener('click', start);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!started) {
            start();
          }
        });
      }
      selectAll('[data-player-jump]').forEach(function (button) {
        button.addEventListener('click', function () {
          window.setTimeout(start, 80);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
}());
