
const PROJECTS = [
  {
    title: 'QoS Dataset Quality Dashboard',
    blurb: 'Automated checks (freshness, completeness, anomalies) with Power BI overview for service-level KPIs.',
    tags: ['analytics', 'dashboard', 'etl'],
    tech: ['Power BI', 'Python', 'SQL'],
    links: [{ label: 'Repo', href: 'https://github.com/YOUR_GITHUB/qos-dataset-quality' }]
  },
  {
    title: 'Smart Traffic Light Integration',
    blurb: 'Data model & ingestion pipeline for signal telemetry; visual KPIs for congestion and cycle efficiency.',
    tags: ['etl', 'analytics'],
    tech: ['Python', 'PostgreSQL', 'DBT'],
    links: [{ label: 'Case Study', href: '#' }]
  }
];



// Mobile menu toggle
(function(){
  const btn = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if(!btn || !links) return;
  btn.addEventListener('click', () => { links.classList.toggle('show'); });
})();

// Back to top button
(function(){
  const toTop = document.getElementById('toTop');
  if(!toTop) return;
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600; toTop.style.display = show ? 'inline-flex' : 'none';
  });
  toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth'}));
})();

// Animate KPI numbers (simple count-up)
(function(){
  const nums = document.querySelectorAll('.kpi .num');
  const once = { done:false };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting && !once.done){
        once.done = true;
        nums.forEach(el => {
          const target = parseFloat(el.getAttribute('data-count'));
          const isPercent = String(el.textContent).includes('%');
          const duration = 900; const steps = 30; let current = 0; let tick = 0;
          const inc = target / steps;
          const timer = setInterval(() => {
            tick++; current = Math.min(target, current + inc);
            el.textContent = isPercent ? current.toFixed(2) + '%' : Math.round(current);
            if(tick>=steps) clearInterval(timer);
          }, duration/steps);
        });
      }
    });
  }, { threshold: .4 });
  nums.forEach(n => obs.observe(n));
})();

// Smooth scroll for internal links
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){ e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
   })
  }
)
