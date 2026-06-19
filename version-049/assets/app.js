(function () {
    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    var header = qs('[data-header]');
    var toggle = qs('[data-mobile-toggle]');

    function refreshHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 16) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    refreshHeader();
    window.addEventListener('scroll', refreshHeader, { passive: true });

    if (toggle && header) {
        toggle.addEventListener('click', function () {
            header.classList.toggle('open');
        });
    }

    qsa('.site-search').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = qs('input[name="q"]', form);
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    });

    var slides = qsa('[data-hero-slide]');
    var dots = qsa('[data-hero-dot]');
    var activeSlide = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === activeSlide);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === activeSlide);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        timer = window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var index = Number(dot.getAttribute('data-hero-dot')) || 0;
            showSlide(index);
            if (timer) {
                window.clearInterval(timer);
            }
            startHero();
        });
    });

    startHero();

    var player = qs('[data-video-player]');
    if (player) {
        var video = qs('video', player);
        var cover = qs('.player-cover', player);
        var stream = player.getAttribute('data-stream');
        var hlsInstance = null;
        var attached = false;

        function attachVideo() {
            if (!video || !stream || attached) {
                return;
            }
            attached = true;
            video.controls = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
            player.classList.add('is-ready');
        }

        function playVideo() {
            attachVideo();
            if (!video) {
                return;
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', function () {
                cover.classList.add('hide-cover');
                playVideo();
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                } else {
                    video.pause();
                }
            });
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                player.classList.remove('is-playing');
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    var searchPage = qs('[data-search-page]');
    if (searchPage) {
        var input = qs('#librarySearch');
        var items = qsa('[data-search-item]');
        var buttons = qsa('[data-filter]');
        var clear = qs('[data-clear-search]');
        var state = {
            category: '',
            type: '',
            region: '',
            year: ''
        };

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var query = normalize(input ? input.value : '');
            items.forEach(function (item) {
                var text = normalize(item.getAttribute('data-text'));
                var visible = true;
                if (query && text.indexOf(query) === -1) {
                    visible = false;
                }
                Object.keys(state).forEach(function (key) {
                    if (state[key] && item.getAttribute('data-' + key) !== state[key]) {
                        visible = false;
                    }
                });
                item.classList.toggle('search-hidden', !visible);
            });
        }

        function setButtonState() {
            buttons.forEach(function (button) {
                var key = button.getAttribute('data-filter');
                var value = button.getAttribute('data-value');
                button.classList.toggle('active', state[key] === value);
            });
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var key = button.getAttribute('data-filter');
                var value = button.getAttribute('data-value');
                state[key] = state[key] === value ? '' : value;
                setButtonState();
                applyFilters();
            });
        });

        if (input) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q') || '';
            input.value = q;
            input.addEventListener('input', applyFilters);
        }

        if (clear) {
            clear.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                state.category = '';
                state.type = '';
                state.region = '';
                state.year = '';
                setButtonState();
                applyFilters();
            });
        }

        applyFilters();
    }
}());
