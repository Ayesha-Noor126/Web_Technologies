
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