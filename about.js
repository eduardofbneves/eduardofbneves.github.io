
// Theme toggle: cycles auto → dark → light
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  function cycleTheme() {
    const current = root.getAttribute('data-theme') || 'auto';
    const next = current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.setAttribute('aria-label', `Theme: ${next}`);
  }

  btn?.addEventListener('click', cycleTheme);
})();

// Mobile menu toggle
(function () {
  const menuBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuBtn?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Count-up animation for quick facts
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nums = document.querySelectorAll('.quick-facts .num');

  if (prefersReduced || !('IntersectionObserver' in window)) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count || el.textContent);
    const isPercent = el.textContent.includes('%');
    let current = 0;
    const duration = 900; // ms
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target * (isPercent ? 100 : 1)) / (isPercent ? 100 : 1);
      el.textContent = isPercent ? `${value.toFixed(2)}%` : Math.floor(value).toString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  nums.forEach((el) => observer.observe(el));
})();
