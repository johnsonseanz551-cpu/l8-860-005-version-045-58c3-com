(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");
    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var carousel = document.querySelector("[data-hero-carousel]");
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dotsWrap = carousel.querySelector("[data-hero-dots]");
        var active = 0;
        var timer = null;
        function showSlide(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === active);
            });
            if (dotsWrap) {
                Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === active);
                });
            }
        }
        if (dotsWrap) {
            slides.forEach(function (_, i) {
                var dot = document.createElement("button");
                dot.type = "button";
                dot.setAttribute("aria-label", "切换推荐影片");
                dot.addEventListener("click", function () {
                    showSlide(i);
                    if (timer) {
                        clearInterval(timer);
                    }
                    timer = setInterval(function () {
                        showSlide(active + 1);
                    }, 5200);
                });
                dotsWrap.appendChild(dot);
            });
        }
        showSlide(0);
        timer = setInterval(function () {
            showSlide(active + 1);
        }, 5200);
    }

    var grids = Array.prototype.slice.call(document.querySelectorAll("[data-card-grid]"));
    grids.forEach(function (grid) {
        var controls = grid.parentElement ? grid.parentElement.querySelector(".list-controls") : null;
        var input = controls ? controls.querySelector("[data-grid-search]") : null;
        var sort = controls ? controls.querySelector("[data-sort-select]") : null;
        var cards = Array.prototype.slice.call(grid.children);
        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : "";
            cards.forEach(function (card) {
                var text = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-text") || "")).toLowerCase();
                card.classList.toggle("hidden-by-filter", keyword && text.indexOf(keyword) === -1);
            });
        }
        function applySort() {
            if (!sort) {
                return;
            }
            var value = sort.value;
            var sorted = cards.slice();
            if (value === "rating") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-rating") || 0) - Number(a.getAttribute("data-rating") || 0);
                });
            } else if (value === "views") {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute("data-views") || 0) - Number(a.getAttribute("data-views") || 0);
                });
            } else if (value === "year") {
                sorted.sort(function (a, b) {
                    return Number(String(b.getAttribute("data-year") || "").replace(/\D/g, "") || 0) - Number(String(a.getAttribute("data-year") || "").replace(/\D/g, "") || 0);
                });
            }
            sorted.forEach(function (card) {
                grid.appendChild(card);
            });
            cards = sorted;
            applyFilter();
        }
        if (input) {
            input.addEventListener("input", applyFilter);
        }
        if (sort) {
            sort.addEventListener("change", applySort);
        }
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q) {
        var searchInput = document.querySelector("[data-grid-search]");
        if (searchInput) {
            searchInput.value = q;
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
}());
