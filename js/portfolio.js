(function () {
  var root = document.documentElement;
  var saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  var toggle = document.querySelector('.theme-toggle');
  function label() { if (toggle) toggle.textContent = root.dataset.theme === 'light' ? 'Dark mode' : 'Light mode'; }
  label();
  if (toggle) toggle.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('portfolio-theme', root.dataset.theme);
    label();
  });
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px 40px 0px' });
    items.forEach(function (item) { observer.observe(item); });
  }
})();
