(function () {
    var header = document.querySelector("[data-header]");
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    function setHeaderState() {
        if (!header) {
            return;
        }

        if (window.scrollY > 12) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    }

    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });

    if (menuToggle && mobileNav && header) {
        menuToggle.addEventListener("click", function () {
            var opened = mobileNav.classList.toggle("is-open");
            header.classList.toggle("is-open", opened);
        });
    }

    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            image.classList.add("image-missing");
        });
    });

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot) {
                dot.classList.toggle("is-active", Number(dot.getAttribute("data-hero-dot")) === current);
            });
        }

        function startAuto() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startAuto();
            });
        });

        startAuto();
    }

    var searchInput = document.querySelector("[data-page-search]");
    var cardList = document.querySelector("[data-card-list]");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var activeFilter = "all";

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function filterCards() {
        if (!cardList) {
            return;
        }

        var query = normalize(searchInput ? searchInput.value : "");
        var cards = Array.prototype.slice.call(cardList.querySelectorAll(".movie-card"));

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year"),
                card.getAttribute("data-tags"),
                card.textContent
            ].join(" "));
            var matchQuery = !query || haystack.indexOf(query) !== -1;
            var matchFilter = activeFilter === "all" || haystack.indexOf(normalize(activeFilter)) !== -1;

            card.hidden = !(matchQuery && matchFilter);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterCards);
    }

    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            activeFilter = chip.getAttribute("data-filter") || "all";
            chips.forEach(function (item) {
                item.classList.toggle("is-active", item === chip);
            });
            filterCards();
        });
    });
}());
