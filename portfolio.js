/* ========= CONFIGURE ME ========= */
const CONFIG = {
  username: 'eduardofbneves', // <-- set your GitHub handle
  role: 'Data & AI Engineer',        // title shown in hero
  perPage: 10,                       // repos per page (1..100)
  pinned: [                          // optional pinned repos (owner/name OR just name)
    // 'your-repo-1',
    // 'your-repo-2'
  ],
  token: null                        // optional: 'ghp_xxx' (for higher rate limits). Avoid committing this.
};
/* ================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Role text
  const roleEl = document.getElementById('roleText');
  if (roleEl) roleEl.textContent = CONFIG.role;

  // Theme toggle
  initThemeToggle();

  // Mobile menu
  initMobileMenu();

  // Back to top
  initToTop();

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Load GitHub profile + repos
  loadProfile();
  loadRepos({ reset: true });

  // Filters
  //setupFilters();
});

/* ===== Utilities ===== */
const headers = CONFIG.token
  ? { Authorization: `Bearer ${CONFIG.token}`, Accept: 'application/vnd.github+json' }
  : { Accept: 'application/vnd.github+json' };

function setStatus(msg) {
  const el = document.getElementById('status');
  if (el) el.textContent = msg || '';
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expiry } = JSON.parse(raw);
    if (expiry && Date.now() > expiry) { localStorage.removeItem(key); return null; }
    return value;
  } catch { return null; }
}

function cacheSet(key, value, ttlMs = 30 * 60 * 1000) { // default 30 min
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ttlMs }));
  } catch {}
}

function byStarsDesc(a, b) { return (b.stargazers_count || 0) - (a.stargazers_count || 0); }
function byUpdatedDesc(a, b) { return new Date(b.updated_at) - new Date(a.updated_at); }
function byNameAsc(a, b) { return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }); }

/* ===== Profile ===== */
async function loadProfile() {
  const key = `gh:user:${CONFIG.username}`;
  const cached = cacheGet(key);
  if (cached) return renderProfile(cached);

  try {
    const res = await fetch(`https://api.github.com/users/${CONFIG.username}`, { headers });
    if (!res.ok) throw new Error(`Profile request failed: ${res.status}`);
    const data = await res.json();
    cacheSet(key, data, 4 * 60 * 60 * 1000); // 4h
    renderProfile(data);
  } catch (err) {
    console.error(err);
    setStatus('Could not load GitHub profile. You may be rate-limited. Try again later.');
  }
}

function renderProfile(u) {
  const name = u.name || CONFIG.username;
  const avatar = u.avatar_url;
  const bio = u.bio || '';
  const html = u.html_url;

  const avatarEl = document.getElementById('profileAvatar');
  const nameEl = document.getElementById('profileName');
  const bioEl = document.getElementById('profileBio');
  const linkEl = document.getElementById('profileLink');
  const followersEl = document.getElementById('followersCount');
  const reposEl = document.getElementById('reposCount');

  if (avatarEl && avatar) avatarEl.src = avatar;
  if (nameEl) nameEl.textContent = name;
  if (bioEl) bioEl.textContent = bio;
  if (linkEl) linkEl.href = html;
  if (followersEl) followersEl.textContent = `${u.followers ?? '—'} followers`;
  if (reposEl) reposEl.textContent = `${u.public_repos ?? '—'} repos`;
}

/* ===== Repos with pagination ===== */
let state = {
  page: 1,
  allRepos: [],
  languages: new Set(),
  loading: false,
  done: false,
};

async function loadRepos({ reset = false } = {}) {
  if (state.loading) return;
  if (reset) {
    state = { page: 1, allRepos: [], languages: new Set(), loading: false, done: false };
    document.getElementById('reposGrid').innerHTML = '';
    //document.getElementById('languageSelect').innerHTML = '<option value="">All</option>';
  }

  state.loading = true;
  setStatus('Loading repositories…');

  const key = `gh:repos:${CONFIG.username}:page:${state.page}:per:${CONFIG.perPage}`;
  const cached = cacheGet(key);

  let repos;
  try {
    if (cached) {
      repos = cached;
    } else {
      const url = new URL(`https://api.github.com/users/${CONFIG.username}/repos`);
      url.searchParams.set('sort', 'updated');
      url.searchParams.set('direction', 'desc');
      url.searchParams.set('page', String(state.page));
      url.searchParams.set('per_page', String(CONFIG.perPage));

      const res = await fetch(
        url.toString(), 
        { headers }
      );
      if (!res.ok) throw new Error(`Repos request failed: ${res.status}`);
      repos = await res.json();
      cacheSet(key, repos);
    }

    const clean = repos
      .map(r => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        html_url: r.html_url,
        description: r.description,
        language: r.language,
        topics: r.topics || [],
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        updated_at: r.updated_at,
        homepage: r.homepage
      }));
      
    state.allRepos = state.allRepos.concat(clean);
    renderRepos();
    state.page += 1;
    
  } catch (err) {
    //console.error(err);
    setStatus('Could not load repositories. You may be rate-limited (60 req/hr unauthenticated).');
  } finally {
    state.loading = false;
  }
}


function renderRepos() {
  let repos = state.allRepos // hide pinned from the main list
  repos.sort(byNameAsc);
  /*
  if (sort === 'stars') repos.sort(byStarsDesc);
  else if (sort === 'name') repos.sort(byNameAsc);
  else repos.sort(byUpdatedDesc);
  */
  const grid = document.getElementById('reposGrid');
  grid.innerHTML = repos.map(repoCardHTML).join('');
}

function repoCardHTML(r) {
  const desc = r.description ? escapeHTML(r.description) : 'No description';
  const homepage = r.homepage && !/^https?:\/\/$/.test(r.homepage) ? r.homepage : null;
  const updated = new Date(r.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  const topics = (r.topics || []).slice(0, 6);

  // ? `<span class="badge">${r.language}</span>` : ''}
  // <p> ${topics.map(t => `<p>#${t}</p>`).join('')}
  return `
  <article class="repo-card">
    <div class="repo-info">
      <h3><a href=${r.html_url}>${r.name}</a></h3>
      <p>${desc}</p>
      <div class="badges">
        <p>${r.language}</p> 
      </div>
      <div class="repo-meta">
        <span>★ ${r.stargazers_count ?? 0}</span>
        <span>⑂ ${r.forks_count ?? 0}</span>
        <span>Updated ${updated}</span>
      </div>
    </div>
  </article>`;
}
/*
    <div class="repo-actions">
      <a href="${r.html_url}">page</a>
      ${homepage ? `${homepage}Live ↗</a>` : ''}
    </div>
*/
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c]));
}

/* ===== Filters & Actions ===== */
/*
function setupFilters() {
  document.getElementById('searchInput').addEventListener('input', debounce(renderRepos, 120));
  document.getElementById('languageSelect').addEventListener('change', renderRepos);
  document.getElementById('sortSelect').addEventListener('change', renderRepos);
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('languageSelect').value = '';
    document.getElementById('sortSelect').value = 'updated';
    renderRepos();
  });

  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    if (!state.done) loadRepos();
  });
}

function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
}
*/
/* ===== Theme & chrome ===== */
function initThemeToggle() {
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
}

function initMobileMenu() {
  const menuBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuBtn?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks?.addEventListener('click', e => {
    if (e.target.matches('a')) navLinks.classList.remove('open');
  });
}

function initToTop() {
  const btn = document.getElementById('toTop');
  const toggle = () => { if (window.scrollY > 600) btn.classList.add('show'); else btn.classList.remove('show'); };
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggle();
}
