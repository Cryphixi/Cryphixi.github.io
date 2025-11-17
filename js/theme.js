// Theme Management
(function() {
  const THEME_KEY = 'theme';
  const DEFAULT_THEME = 'professional';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeToggle(theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    const newTheme = currentTheme === 'professional' ? 'pixel' : 'professional';
    setTheme(newTheme);
  }

  function updateThemeToggle(theme) {
    const toggles = document.querySelectorAll('.theme-toggle, .theme-toggle-horizontal');
    toggles.forEach(toggle => {
      toggle.textContent = theme === 'professional' ? '🎮' : '💼';
      toggle.setAttribute('aria-label', `Switch to ${theme === 'professional' ? 'pixel' : 'professional'} theme`);
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Export for use in other scripts
  window.themeManager = {
    toggle: toggleTheme,
    set: setTheme,
    get: () => document.documentElement.getAttribute('data-theme') || DEFAULT_THEME
  };
})();

