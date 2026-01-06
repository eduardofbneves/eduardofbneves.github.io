
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

// Download CV button
/*
const downloadCV = () => {
  const link = document.createElement("a");
  const content = document.querySelector("textarea").value;
  const file = new Blob([content], { type: 'pdf'});
  link.href = URL.createObjectURL(file);
  link.download = "files/EduardoNeves_CV_EN.pdf";
  link.click();
  URL.revokeObjectURL(link.href);
};
*/

const downloadCV = () =>{
  const cv = document.createElement("a");
  cv.href = "files/EduardoNeves_CV_EN.pdf";
  cv.target="_blank"
  cv.download = "EduardoNeves_CV_EN";
  document.body.appendChild(cv);
  cv.click();
  document.body.removeChild(a);
}

const download_button =
    document.getElementById('download_Btn');
const content =
    document.getElementById('content');

download_button.addEventListener
    ('click', async function () {
        const filename = 'files/EduardoNeves_CV_EN.pdf';

        try {
            const opt = {
                margin: 1,
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: {
                    unit: 'in', format: 'letter',
                    orientation: 'portrait'
                }
            };
            await html2pdf().set(opt).
                from(content).save();
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

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

/*
// Theme toggle: auto → dark → light
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'auto';
    const next = current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.setAttribute('aria-label', `Theme: ${next}`);
  });
})();

// Mobile menu toggle
(function () {
  const menuBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuBtn?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Close on link click (mobile)
  navLinks?.addEventListener('click', e => {
    if (e.target.matches('a')) navLinks.classList.remove('open');
  });
})();

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Back to top button
(function () {
  const btn = document.getElementById('toTop');
  const toggle = () => { if (window.scrollY > 600) btn.classList.add('show'); else btn.classList.remove('show'); };
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggle();
})();
*/