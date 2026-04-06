// Run this code only after the full HTML document is loaded
document.addEventListener('DOMContentLoaded', function () {

    // =========================================================
    // SECTION 1: SELECT HTML ELEMENTS FROM THE DOM
    // =========================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav      = document.getElementById('main-nav');
    const overlay      = document.querySelector('.nav-overlay');
    const navLinks     = document.querySelectorAll('.menu li a');


    // =========================================================
    // SECTION 2: OPEN MENU
    // =========================================================
    function openMenu() {
        mainNav.classList.add('nav-open');
        hamburgerBtn.classList.add('is-active');
        overlay.classList.add('is-visible');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    // =========================================================
    // SECTION 3: CLOSE MENU
    // =========================================================
    function closeMenu() {
        mainNav.classList.remove('nav-open');
        hamburgerBtn.classList.remove('is-active');
        overlay.classList.remove('is-visible');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // =========================================================
    // SECTION 4: HAMBURGER TOGGLE
    // =========================================================
    hamburgerBtn.addEventListener('click', function () {
        if (mainNav.classList.contains('nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // =========================================================
    // SECTION 5: CLOSE ON OVERLAY CLICK
    // =========================================================
    overlay.addEventListener('click', closeMenu);

    // =========================================================
    // SECTION 6: CLOSE ON NAV LINK CLICK
    // =========================================================
    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // =========================================================
    // SECTION 7: CLOSE ON ESC KEY
    // =========================================================
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mainNav.classList.contains('nav-open')) {
            closeMenu();
            hamburgerBtn.focus();
        }
    });

    // =========================================================
    // SECTION 8: QUICK LINKS ACCORDION
    // =========================================================
    var quicklinksBtn  = document.getElementById('quicklinks-btn');
    var quicklinksBody = document.getElementById('quicklinks-body');

    if (quicklinksBtn && quicklinksBody) {
        quicklinksBtn.addEventListener('click', function () {
            var isOpen = quicklinksBody.classList.toggle('is-open');
            quicklinksBtn.classList.toggle('is-open', isOpen);
            quicklinksBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }


    // =========================================================
    // SECTION 9: BACK-TO-TOP BUTTON (jQuery)
    // =========================================================
    var $topBtn = $('<button id="back-to-top" title="Back to top">&#8679;</button>').appendTo('body');

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $topBtn.addClass('visible');
        } else {
            $topBtn.removeClass('visible');
        }
    });

    $topBtn.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    });


    // =========================================================
    // SECTION 10: PRODUCT CAROUSEL  (jQuery, no Promises)
    // =========================================================

    var $track      = $('#carousel-track');
    var $slides     = $track.find('.carousel-slide');
    var $prevBtn    = $('#carousel-prev');
    var $nextBtn    = $('#carousel-next');
    var $dotsWrap   = $('#carousel-dots');
    var $counterCur = $('#counter-current');
    var $counterTot = $('#counter-total');

    var totalSlides  = $slides.length;   // 8 original cards
    var currentIndex = 0;                // logical index (0-based, into originals)
    var isAnimating  = false;
    var autoTimer    = null;
    var AUTOPLAY_MS  = 5000;
    var ANIM_MS      = 420;

    // ── Helper: how many cards visible right now ──────────────
    function visibleCount() {
        var w = $(window).width();
        if (w <= 768)  return 1;
        if (w <= 1024) return 2;
        return 3;
    }

    // ── Build cloned infinite loop track ──────────────────────
    // Clone enough slides before & after for smooth looping.
    function buildTrack() {
        // Remove previously injected clones so rebuild is safe
        $track.find('.clone').remove();

        var vis   = visibleCount();
        var clone = Math.max(vis, 3);   // how many clones on each side

        // Append clones at END  (first `clone` originals)
        $slides.slice(0, clone).each(function () {
            $track.append($(this).clone(true).addClass('clone'));
        });

        // Prepend clones at START (last `clone` originals)
        var $before = [];
        $slides.slice(-clone).each(function () {
            $before.unshift($(this).clone(true).addClass('clone'));
        });
        $.each($before, function (i, el) {
            $track.prepend(el);
        });
    }

    // ── Calculate pixel offset for a given logical index ──────
    function offsetForIndex(idx) {
        var vis        = visibleCount();
        var clone      = Math.max(vis, 3);
        var $allSlides = $track.children('.carousel-slide, .clone');
        var slideW     = $allSlides.first().outerWidth(true);
        // Real slides start after the prepended clones
        return -((clone + idx) * slideW);
    }

    // ── Move track (animated) ─────────────────────────────────
    function goTo(idx, useAnimation) {
        if (isAnimating) return;
        isAnimating = true;

        var vis        = visibleCount();
        var clone      = Math.max(vis, 3);
        var $allSlides = $track.children('.carousel-slide, .clone');
        var slideW     = $allSlides.first().outerWidth(true);
        var targetX    = -((clone + idx) * slideW);

        if (useAnimation === false) {
            $track.css({ left: targetX + 'px' });
            isAnimating = false;
        } else {
            $track.animate({ left: targetX + 'px' }, ANIM_MS, 'swing', function () {
                // If we went past the last real slide → jump silently to first
                if (idx >= totalSlides) {
                    currentIndex = 0;
                    $track.css({ left: offsetForIndex(0) + 'px' });
                }
                // If we went before the first real slide → jump silently to last
                else if (idx < 0) {
                    currentIndex = totalSlides - 1;
                    $track.css({ left: offsetForIndex(totalSlides - 1) + 'px' });
                } else {
                    currentIndex = idx;
                }
                updateUI();
                isAnimating = false;
            });
        }
    }

    // ── Update counter + dots ─────────────────────────────────
    function updateUI() {
        $counterCur.text(currentIndex + 1);
        $dotsWrap.find('.dot').removeClass('active')
            .eq(currentIndex).addClass('active');
    }

    // ── Build dot indicators ──────────────────────────────────
    function buildDots() {
        $dotsWrap.empty();
        for (var d = 0; d < totalSlides; d++) {
            (function (dotIdx) {
                var $dot = $('<button class="dot" aria-label="Go to slide ' + (dotIdx + 1) + '"></button>');
                if (dotIdx === 0) $dot.addClass('active');
                $dot.on('click', function () {
                    if (dotIdx === currentIndex || isAnimating) return;
                    currentIndex = dotIdx;
                    goTo(currentIndex, true);
                });
                $dotsWrap.append($dot);
            }(d));
        }
    }

    // ── Set track width & initial position ───────────────────
    function layoutTrack() {
        var $allSlides = $track.children('.carousel-slide, .clone');
        var vis        = visibleCount();
        var slideW     = ($track.parent().width()) / vis;

        $allSlides.css({ width: slideW + 'px' });
        $track.css({
            width: ($allSlides.length * slideW) + 'px',
            left : offsetForIndex(currentIndex) + 'px'
        });
    }

    // ── Full initialisation / re-init on resize ───────────────
    function initCarousel() {
        buildTrack();
        layoutTrack();
        buildDots();
        updateUI();
    }

    initCarousel();

    // ── PREVIOUS button ───────────────────────────────────────
    $prevBtn.on('click', function () {
        var next = currentIndex - 1;
        if (next < 0) next = -1;   // triggers clone jump inside goTo callback
        goTo(next, true);
        if (next >= 0) currentIndex = next;
        updateUI();
    });

    // ── NEXT button ───────────────────────────────────────────
    $nextBtn.on('click', function () {
        var next = currentIndex + 1;
        if (next >= totalSlides) next = totalSlides; // triggers clone jump
        goTo(next, true);
        if (next < totalSlides) currentIndex = next;
        updateUI();
    });

    // ── AUTOPLAY ──────────────────────────────────────────────
    function startAutoplay() {
        stopAutoplay();
        autoTimer = setInterval(function () {
            var next = currentIndex + 1;
            if (next >= totalSlides) next = totalSlides;
            goTo(next, true);
            if (next < totalSlides) currentIndex = next;
            updateUI();
        }, AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    startAutoplay();

    // Pause on hover over any product card
    $track.on('mouseenter', '.carousel-slide', stopAutoplay);
    $track.on('mouseleave', '.carousel-slide', startAutoplay);

    // ── TOUCH / SWIPE support ─────────────────────────────────
    var touchStartX = 0;
    var touchEndX   = 0;

    $track[0].addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    $track[0].addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff  = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {           // minimum swipe distance
            if (diff > 0) {
                $nextBtn.trigger('click');   // swipe left → next
            } else {
                $prevBtn.trigger('click');   // swipe right → prev
            }
        }
    }, { passive: true });

    // ── RESPONSIVE: re-layout on window resize ────────────────
    var resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            initCarousel();
        }, 200);
    });

});