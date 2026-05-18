$(document).ready(function () {

    var ITEMS_PER_PAGE = 10;
    var $cards         = $('#product-list .onsale-card');
    var totalItems     = $cards.length;
    var totalPages     = Math.ceil(totalItems / ITEMS_PER_PAGE);
    var currentPage    = 1;   // start at page 1

    // ── Helper: show the correct slice of cards ───────
    function showPage(page) {
        // 1. Hide ALL cards first
        $cards.hide();

        // 2. Calculate which cards to reveal (0-based indices)
        var startIndex = (page - 1) * ITEMS_PER_PAGE;   // e.g. page 1 → 0
        var endIndex   = startIndex + ITEMS_PER_PAGE;    // e.g. page 1 → 10

        // 3. Use .slice() to select only this chunk and show them
        $cards.slice(startIndex, endIndex).show();

        // 4. Update the page indicator text
        $('#page-indicator').text('Page ' + page + ' of ' + totalPages);

        // 5. Manage button disabled states
        $('#prev-btn').prop('disabled', page === 1);
        $('#next-btn').prop('disabled', page === totalPages);
    }

    // ── NEXT button click ─────────────────────────────
    $('#next-btn').on('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            // Scroll to top of product list for better UX
            $('html, body').animate({ scrollTop: $('#product-list').offset().top - 80 }, 300);
        }
    });

    // ── PREVIOUS button click ─────────────────────────
    $('#prev-btn').on('click', function () {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            $('html, body').animate({ scrollTop: $('#product-list').offset().top - 80 }, 300);
        }
    });

    // ── Initial render ────────────────────────────────
    if (totalItems > 0) {
        showPage(1);
        // Hide pagination entirely if everything fits on one page
        if (totalPages <= 1) {
            $('.onsale-pagination').hide();
        }
    }

});

