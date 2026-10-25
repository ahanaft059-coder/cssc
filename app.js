/* Shared helpers: theme, mobile menu, toast, header scroll, reveal, active link */
(function () {
  var root = document.documentElement;

  try {
    var saved = localStorage.getItem('kcasn_theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}

  function ensureToast() {
    var box = document.getElementById('toastBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toastBox';
      box.innerHTML = '<i class="fas fa-circle-check"></i><span id="toastMsg"></span>';
      document.body.appendChild(box);
    }
    return box;
  }

  var toastTimer;
  window.showToast = function (msg) {
    var box = ensureToast();
    document.getElementById('toastMsg').textContent = msg;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.classList.remove('show'); }, 3200);
  };

  window.toggleTheme = function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('kcasn_theme', next); } catch (e) {}
    window.showToast('Switched to ' + next + ' mode');
  };

  window.toggleMobileMenu = function () {
    var panel = document.getElementById('mobileNavPanel');
    var icon = document.getElementById('menuIcon');
    if (!panel) return;
    panel.classList.toggle('active');
    if (icon) icon.className = panel.classList.contains('active') ? 'fas fa-xmark' : 'fas fa-bars';
  };

  document.addEventListener('DOMContentLoaded', function () {
    // header shadow on scroll
    var header = document.querySelector('header');
    function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 12); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // active nav link
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (page.indexOf('.') === -1) page = 'index.html';
      if (href === page) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
    });

    // scroll reveal
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  });
})();