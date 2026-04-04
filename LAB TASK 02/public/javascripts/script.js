
document.addEventListener('DOMContentLoaded', function () {

 
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav      = document.getElementById('main-nav');
    const overlay      = document.querySelector('.nav-overlay');
    const navLinks     = document.querySelectorAll('.menu li a');

   
    function openMenu() {
        mainNav.classList.add('nav-open');
        hamburgerBtn.classList.add('is-active');
        overlay.classList.add('is-visible');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; 
    }

   
    function closeMenu() {
        mainNav.classList.remove('nav-open');
        hamburgerBtn.classList.remove('is-active');
        overlay.classList.remove('is-visible');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; 
    }

    hamburgerBtn.addEventListener('click', function () {
        if (mainNav.classList.contains('nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    
    overlay.addEventListener('click', closeMenu);

    
    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mainNav.classList.contains('nav-open')) {
            closeMenu();
            hamburgerBtn.focus(); 
        }
    });

 

    const quicklinksBtn  = document.getElementById('quicklinks-btn');
    const quicklinksBody = document.getElementById('quicklinks-body');

    if (quicklinksBtn && quicklinksBody) {
        quicklinksBtn.addEventListener('click', function () {
            const isOpen = quicklinksBody.classList.toggle('is-open');
            quicklinksBtn.classList.toggle('is-open', isOpen);
            quicklinksBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

});





// ===== SEARCH OVERLAY =====
const searchOpenBtn  = document.getElementById('searchOpenBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const searchOverlay  = document.getElementById('searchOverlay');
const searchInput    = document.getElementById('searchInput');
const searchResults  = document.getElementById('searchResults');

// Open overlay
if (searchOpenBtn) {
  searchOpenBtn.addEventListener('click', function() {
    searchOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    setTimeout(() => searchInput.focus(), 100);
  });
}

// Close overlay
if (searchCloseBtn) {
  searchCloseBtn.addEventListener('click', closeSearch);
}

// Close on clicking outside the box
searchOverlay.addEventListener('click', function(e) {
  if (e.target === searchOverlay) closeSearch();
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeSearch();
});

function closeSearch() {
  searchOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
  searchInput.value = '';
  searchResults.innerHTML = '<p class="search-placeholder-text">Start typing to search products...</p>';
}

// Live search on typing
let searchTimeout;
searchInput.addEventListener('input', function() {
  clearTimeout(searchTimeout);
  const query = this.value.trim();

  if (query.length === 0) {
    searchResults.innerHTML = '<p class="search-placeholder-text">Start typing to search products...</p>';
    return;
  }

  // Debounce — wait 300ms after user stops typing
  searchTimeout = setTimeout(() => {
    fetchResults(query);
  }, 300);
});

function fetchResults(query) {
  searchResults.innerHTML = '<p class="search-placeholder-text">Searching...</p>';

  fetch(`/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(products => {
      if (products.length === 0) {
        searchResults.innerHTML = '<p class="search-no-results">No products found for "<strong>' + query + '</strong>"</p>';
        return;
      }
      renderResults(products);
    })
    .catch(() => {
      searchResults.innerHTML = '<p class="search-no-results">Something went wrong. Please try again.</p>';
    });
}

function renderResults(products) {
  let html = '<p class="search-results-label">PRODUCT RESULTS</p><div class="search-product-grid">';

  products.forEach(p => {
    html += `
      <a href="${p.url}" class="search-product-card">
        <div class="search-product-img-wrap">
          ${p.badge ? `<span class="search-badge">${p.badge}</span>` : ''}
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="search-product-info">
          <p class="search-product-name">${p.name}</p>
          <p class="search-product-price">Rs.${p.price.toLocaleString()}</p>
        </div>
      </a>
    `;
  });

  html += '</div>';
  searchResults.innerHTML = html;
}



// ===== MOBILE DROPDOWN ACCORDION =====
// Add this to the bottom of your existing script.js
 
document.addEventListener('DOMContentLoaded', function () {
    const dropdownItems = document.querySelectorAll('.has-dropdown > a');
 
    dropdownItems.forEach(function (link) {
        link.addEventListener('click', function (e) {
            // Only activate accordion on mobile
            if (window.innerWidth > 768) return;
 
            e.preventDefault();
            const parent = this.parentElement;
            const isOpen = parent.classList.contains('mobile-open');
 
            // Close all others
            document.querySelectorAll('.has-dropdown').forEach(function (el) {
                el.classList.remove('mobile-open');
            });
 
            // Toggle current
            if (!isOpen) {
                parent.classList.add('mobile-open');
            }
        });
    });
});