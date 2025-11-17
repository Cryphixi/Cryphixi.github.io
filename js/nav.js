// Navigation Management
(function() {
  function initNav() {
    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-text');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/index.html')) {
        link.classList.add('active');
      }
    });

    // Theme toggle handlers
    const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-horizontal');
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        if (window.themeManager) {
          window.themeManager.toggle();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

