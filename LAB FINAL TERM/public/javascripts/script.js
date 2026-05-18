

(function () {

    // 1. HAMBURGER
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var mainNav      = document.getElementById('main-nav');
    var navOverlay   = document.getElementById('nav-overlay');

    function openMenu() {
        mainNav.classList.add('nav-open');
        hamburgerBtn.classList.add('is-active');
        if (navOverlay) navOverlay.classList.add('is-visible');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mainNav.classList.remove('nav-open');
        hamburgerBtn.classList.remove('is-active');
        if (navOverlay) navOverlay.classList.remove('is-visible');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', function () {
            mainNav.classList.contains('nav-open') ? closeMenu() : openMenu();
        });
    }
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // 2. MOBILE NAV DROPDOWNS
    document.querySelectorAll('nav ul li.has-dropdown > a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (window.innerWidth > 768) return;
            e.preventDefault();
            var parent = this.parentElement;
            document.querySelectorAll('nav ul li.has-dropdown').forEach(function (el) {
                if (el !== parent) el.classList.remove('mobile-open');
            });
            parent.classList.toggle('mobile-open');
        });
    });

    document.querySelectorAll('.dropdown li.has-sub > a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (window.innerWidth > 768) return;
            e.preventDefault();
            this.parentElement.classList.toggle('mobile-open');
        });
    });

    // 3. FOOTER ACCORDION
    var quicklinksBtn  = document.getElementById('quicklinks-btn');
    var quicklinksBody = document.getElementById('quicklinks-body');

    if (quicklinksBtn && quicklinksBody) {
        quicklinksBtn.addEventListener('click', function () {
            var isOpen = quicklinksBody.classList.toggle('is-open');
            quicklinksBtn.classList.toggle('is-open', isOpen);
            quicklinksBtn.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // 4. SEARCH OVERLAY
    var searchOpenBtn  = document.getElementById('searchOpenBtn');
    var searchCloseBtn = document.getElementById('searchCloseBtn');
    var searchOverlay  = document.getElementById('searchOverlay');
    var searchInput    = document.getElementById('searchInput');
    var searchResults  = document.getElementById('searchResults');

    function closeSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
        if (searchInput)   searchInput.value = '';
        if (searchResults) searchResults.innerHTML =
            '<p class="search-placeholder-text">Start typing to search products...</p>';
    }

    if (searchOpenBtn) {
        searchOpenBtn.addEventListener('click', function (e) {
            e.preventDefault();
            searchOverlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            setTimeout(function () { if (searchInput) searchInput.focus(); }, 100);
        });
    }
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function (e) {
            if (e.target === searchOverlay) closeSearch();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeMenu(); closeSearch(); }
    });

    // 5. LIVE SEARCH
    var searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            var q = this.value.trim();
            if (!q) {
                searchResults.innerHTML = '<p class="search-placeholder-text">Start typing to search products...</p>';
                return;
            }
            searchResults.innerHTML = '<p class="search-placeholder-text">Searching...</p>';
            searchTimeout = setTimeout(function () {
                fetch('/search?q=' + encodeURIComponent(q))
                    .then(function (r) { return r.json(); })
                    .then(function (products) {
                        if (!products.length) {
                            searchResults.innerHTML = '<p class="search-no-results">No products found.</p>';
                            return;
                        }
                        var html = '<p class="search-results-label">PRODUCT RESULTS</p><div class="search-product-grid">';
                        products.forEach(function (p) {
                            html += '<a class="search-product-card" href="/product/' + p._id + '">' +
                                '<div class="search-product-img-wrap">' +
                                (p.badge ? '<span class="search-badge">' + p.badge + '</span>' : '') +
                                '<img src="' + (p.images && p.images[0] ? p.images[0] : '') + '" alt="' + p.name + '" loading="lazy">' +
                                '</div><div class="search-product-info">' +
                                '<p class="search-product-name">' + p.name + '</p>' +
                                '<p class="search-product-price">Rs ' + Number(p.price).toLocaleString() + '</p>' +
                                '</div></a>';
                        });
                        searchResults.innerHTML = html + '</div>';
                    })
                    .catch(function () {
                        searchResults.innerHTML = '<p class="search-no-results">Something went wrong.</p>';
                    });
            }, 300);
        });
    }

    // 6. NEWSLETTER
    window.handleNewsletterSubmit = function (e) {
        e.preventDefault();
        var btn = e.target.querySelector('button');
        var inp = e.target.querySelector('input');
        if (btn) btn.textContent = '✓ Subscribed!';
        if (inp) inp.value = '';
        setTimeout(function () { if (btn) btn.textContent = 'SUBSCRIBE'; }, 3000);
    };

}());






// ===== HERO SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
let heroTimer;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startHeroTimer() {
  heroTimer = setInterval(nextSlide, 5000);
}

if (slides.length > 0) {
  document.getElementById('heroNext')?.addEventListener('click', () => {
    clearInterval(heroTimer);
    nextSlide();
    startHeroTimer();
  });

  document.getElementById('heroPrev')?.addEventListener('click', () => {
    clearInterval(heroTimer);
    prevSlide();
    startHeroTimer();
  });

  startHeroTimer();
}


// ===== SHOW MORE PRODUCTS =====
const showMoreBtn = document.getElementById('showMoreBtn');
if (showMoreBtn) {
  showMoreBtn.addEventListener('click', () => {
    const hidden = document.querySelectorAll('.hidden-product');
    hidden.forEach(card => card.classList.remove('hidden-product'));
    showMoreBtn.style.display = 'none';
  });
}


// ===== REVIEWS CAROUSEL =====
const track = document.getElementById('reviewsTrack');
const carousel = document.getElementById('reviewsCarousel');

if (track) {
  let reviewIndex = 0;
  let reviewTimer;
  const cards = track.querySelectorAll('.review-card');

  // how many cards visible depends on screen size
  function getVisible() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisible());
  }

  function moveReviews() {
    const cardWidth = cards[0].offsetWidth + 20; // width + gap
    track.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
  }

  function nextReview() {
    reviewIndex = reviewIndex >= getMaxIndex() ? 0 : reviewIndex + 1;
    moveReviews();
  }

  function prevReview() {
    reviewIndex = reviewIndex <= 0 ? getMaxIndex() : reviewIndex - 1;
    moveReviews();
  }

  function startReviewTimer() {
    reviewTimer = setInterval(nextReview, 5000);
  }

  document.getElementById('reviewNext')?.addEventListener('click', () => {
    clearInterval(reviewTimer);
    nextReview();
    startReviewTimer();
  });

  document.getElementById('reviewPrev')?.addEventListener('click', () => {
    clearInterval(reviewTimer);
    prevReview();
    startReviewTimer();
  });

  // ✅ Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(reviewTimer));
  carousel.addEventListener('mouseleave', startReviewTimer);

  startReviewTimer();
  window.addEventListener('resize', moveReviews);
}