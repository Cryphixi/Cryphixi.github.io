// Navigation Management
(function() {
  function initNav() {
    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-text');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/index.html') || 
          (currentPath.endsWith('/') && href === 'index.html') ||
          (currentPath.includes('index.html') && href === 'index.html')) {
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

    // Sidebar collapse toggle
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const siteNavbar = document.getElementById('site-navbar');
    if (navToggleBtn && siteNavbar) {
      const isCollapsed = localStorage.getItem('nav-collapsed') === 'true';
      updateCollapseState(isCollapsed);

      navToggleBtn.addEventListener('click', () => {
        const currentlyCollapsed = document.body.classList.contains('nav-collapsed');
        const nextCollapsed = !currentlyCollapsed;
        updateCollapseState(nextCollapsed);
        localStorage.setItem('nav-collapsed', nextCollapsed.toString());
      });
    }

    // Settings dropdown (only on pages where it exists)
    const dropdownToggle = document.getElementById('settings-toggle-btn');
    const dropdownMenu = document.getElementById('settings-menu');
    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        dropdownToggle.setAttribute('aria-expanded', (!expanded).toString());
        dropdownMenu.classList.toggle('open');
      });

      document.addEventListener('click', (event) => {
        if (
          dropdownMenu.classList.contains('open') &&
          !dropdownMenu.contains(event.target) &&
          !dropdownToggle.contains(event.target)
        ) {
          dropdownMenu.classList.remove('open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Sticky toggle for index page navbar
    const stickyToggleBtn = document.getElementById('sticky-toggle-btn');
    const indexNavbar = document.getElementById('index-navbar');
    
    if (stickyToggleBtn && indexNavbar) {
      // Load saved preference
      const isSticky = localStorage.getItem('navbar-sticky') !== 'false';
      updateStickyState(isSticky);
      
      stickyToggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const currentSticky = indexNavbar.classList.contains('not-sticky');
        const newSticky = !currentSticky;
        updateStickyState(newSticky);
        localStorage.setItem('navbar-sticky', newSticky.toString());
        if (dropdownMenu && dropdownToggle) {
          dropdownMenu.classList.remove('open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  function updateStickyState(isSticky) {
    const stickyToggleBtn = document.getElementById('sticky-toggle-btn');
    const indexNavbar = document.getElementById('index-navbar');
    const stickyIcon = document.getElementById('sticky-icon');
    const stickyText = document.getElementById('sticky-text');
    
    if (!stickyToggleBtn || !indexNavbar) return;
    
    if (isSticky) {
      indexNavbar.classList.remove('not-sticky');
      stickyToggleBtn.classList.add('active');
      if (stickyIcon) stickyIcon.textContent = '📌';
      if (stickyText) stickyText.textContent = 'Sticky';
    } else {
      indexNavbar.classList.add('not-sticky');
      stickyToggleBtn.classList.remove('active');
      if (stickyIcon) stickyIcon.textContent = '📍';
      if (stickyText) stickyText.textContent = 'Not Sticky';
    }
  }

  function updateCollapseState(isCollapsed) {
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    document.body.classList.toggle('nav-collapsed', isCollapsed);
    if (navToggleBtn) {
      navToggleBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
      navToggleBtn.textContent = isCollapsed ? '>>' : '<<';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

