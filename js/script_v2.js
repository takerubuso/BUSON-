/**
 * BUSON STUDIO v2 — Radical Redesign Script
 * Full-width character showcases, editorial news, filmstrip stamps
 */
document.addEventListener('DOMContentLoaded', () => {

    // ── Reveal on scroll (Intersection Observer) ───────────
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    function observeAll() {
        document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el => obs.observe(el));
    }
    observeAll();

    // ── Parallax hero ───────────────────────────────────────
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.pageYOffset;
            if (y < window.innerHeight) heroBg.style.transform = `scale(1.08) translateY(${y * 0.3}px)`;
        }, { passive: true });
    }

    // ── Nav scroll state ───────────────────────────────────
    const nav = document.getElementById('topnav');
    if (nav) window.addEventListener('scroll', () => nav.classList.toggle('stuck', window.pageYOffset > 50), { passive: true });

    // ── Mobile menu ────────────────────────────────────────
    const burger = document.getElementById('burger');
    const links = document.getElementById('nav-links');
    if (burger && links) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('on');
            links.classList.toggle('open');
            document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
        });
        links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            burger.classList.remove('on'); links.classList.remove('open'); document.body.style.overflow = '';
        }));
    }

    // ── Data loader ────────────────────────────────────────
    async function load(url, fb = []) {
        try { const r = await fetch(url); if (!r.ok) throw ''; return await r.json(); }
        catch { return fb; }
    }

    // ═══════════ CHARACTERS — Full-width showcase ══════════
    let allChars = [];

    load('data/characters.json').then(data => {
        allChars = data;
        renderCharShowcase(data);
        setupCharModal(data);
    });

    function renderCharShowcase(chars) {
        const showcase = document.getElementById('char-showcase');
        const strip = document.getElementById('char-strip');
        if (!showcase || !strip) return;

        // Top 3 get HUGE full-width alternating rows
        const featured = chars.slice(0, 3);
        const rest = chars.slice(3);

        showcase.innerHTML = featured.map((c, i) => {
            const hobbies = Array.isArray(c.hobbies) ? c.hobbies.join(', ') : (c.hobbies || '—');
            const socials = (c.socialLinks || []).map(s =>
                `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`
            ).join('');
            return `
      <div class="char-row rv-s">
        <div class="char-visual">
          <img src="${c.image}" alt="${c.name}" loading="lazy">
        </div>
        <div class="char-text">
          <div class="char-num">${String(i + 1).padStart(2, '0')}</div>
          <h3>${c.name}</h3>
          <p class="char-desc">${c.profile || ''}</p>
          <div class="char-meta">
            <div class="char-meta-item"><div class="label">性格</div><div class="val">${c.personality || '—'}</div></div>
            <div class="char-meta-item"><div class="label">誕生日</div><div class="val">${c.birthday || '—'}</div></div>
            <div class="char-meta-item"><div class="label">好物</div><div class="val">${c.favoriteFood || '—'}</div></div>
          </div>
          <div class="char-socials">${socials}</div>
        </div>
      </div>`;
        }).join('');

        // Remaining chars as a scrollable strip
        strip.innerHTML = rest.map(c => `
      <div class="char-mini" data-id="${c.id}">
        <img src="${c.image}" alt="${c.name}" loading="lazy">
        <div class="char-mini-name">${c.name}</div>
      </div>
    `).join('');

        observeAll();
    }

    // ── Character modal ────────────────────────────────────
    function setupCharModal(data) {
        const modal = document.getElementById('modal-v2');
        if (!modal) return;
        let idx = 0;

        function show(id) {
            idx = data.findIndex(c => c.id === id);
            if (idx < 0) idx = 0;
            fill(data[idx]);
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function fill(c) {
            const hobbies = Array.isArray(c.hobbies) ? c.hobbies.join(', ') : (c.hobbies || '—');
            modal.querySelector('.m-img img').src = c.image;
            modal.querySelector('.m-name').textContent = c.name;
            modal.querySelector('.m-desc').textContent = c.profile || '';
            modal.querySelector('.m-stats').innerHTML = `
        <div class="m-stat"><div class="ms-label">性格</div><div class="ms-val">${c.personality || '—'}</div></div>
        <div class="m-stat"><div class="ms-label">誕生日</div><div class="ms-val">${c.birthday || '—'}</div></div>
        <div class="m-stat"><div class="ms-label">デビュー</div><div class="ms-val">${c.debutYear || '—'}</div></div>
        <div class="m-stat"><div class="ms-label">趣味</div><div class="ms-val">${hobbies}</div></div>
        <div class="m-stat"><div class="ms-label">特技</div><div class="ms-val">${c.skills || '—'}</div></div>
        <div class="m-stat"><div class="ms-label">好物</div><div class="ms-val">${c.favoriteFood || '—'}</div></div>`;
            modal.querySelector('.m-links').innerHTML = (c.socialLinks || []).map(s =>
                `<a href="${s.url}" target="_blank">${s.name}</a>`).join('');
        }

        function close() { modal.classList.remove('open'); document.body.style.overflow = ''; }

        // Click on mini strip cards
        document.addEventListener('click', e => {
            const mini = e.target.closest('.char-mini');
            if (mini) show(parseInt(mini.dataset.id));
        });
        // Click on featured row
        document.addEventListener('click', e => {
            const visual = e.target.closest('.char-visual');
            if (visual) {
                const row = visual.closest('.char-row');
                const rows = [...document.querySelectorAll('.char-row')];
                const rowIdx = rows.indexOf(row);
                if (rowIdx >= 0 && rowIdx < allChars.length) show(allChars[rowIdx].id);
            }
        });

        modal.querySelector('.m-close').addEventListener('click', close);
        modal.addEventListener('click', e => { if (e.target === modal) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        const prev = modal.querySelector('.m-prev');
        const next = modal.querySelector('.m-next');
        if (prev) prev.addEventListener('click', () => { idx = (idx - 1 + data.length) % data.length; fill(data[idx]); });
        if (next) next.addEventListener('click', () => { idx = (idx + 1) % data.length; fill(data[idx]); });
    }

    // ═══════════ WORKS — Staggered masonry ═════════════════
    Promise.all([load('data/goods.json'), load('data/books.json')]).then(([goods, books]) => {
        const all = [...goods.map(g => ({ ...g, type: 'goods' })), ...books.map(b => ({ ...b, type: 'books' }))];
        renderWorks(all);
    });

    function renderWorks(items) {
        const el = document.getElementById('works-layout');
        if (!el) return;
        const sizes = ['big', 'med', 'sm', 'sm', 'big', 'med'];
        el.innerHTML = items.map((w, i) => `
      <div class="work-item ${sizes[i % sizes.length]} rv d${(i % 5) + 1}">
        <div class="wi-img"><img src="${w.image}" alt="${w.name}" loading="lazy"></div>
        <div class="wi-info">
          <h4>${w.name}</h4>
          <div class="wi-price">${w.price ? w.price.toLocaleString() + '円' : ''}</div>
          <a href="${w.url}" class="wi-btn" target="_blank" rel="noopener noreferrer">詳しく見る →</a>
        </div>
      </div>
    `).join('');
        observeAll();
    }

    // ═══════════ LINE STAMPS — Filmstrip ═══════════════════
    load('data/line.json').then(data => renderStamps(data));

    function renderStamps(items) {
        const el = document.getElementById('stamps-strip');
        if (!el) return;
        el.innerHTML = items.map(s => `
      <div class="film-card">
        <div class="fc-img"><img src="${s.image}" alt="${s.name}" loading="lazy"></div>
        <div class="fc-info">
          <h4>${s.name}</h4>
          <div class="fc-price">${s.price ? s.price + '円' : ''}</div>
          <a href="${s.url}" class="fc-btn" target="_blank" rel="noopener noreferrer">LINEストアで見る</a>
        </div>
      </div>
    `).join('');
        // Drag scroll
        setupDrag(el);
    }

    // ═══════════ NEWS — Magazine editorial ═════════════════
    load('data/news.json').then(data => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderNews(sorted);
    });

    function renderNews(items) {
        const el = document.getElementById('news-editorial');
        if (!el) return;
        if (items.length === 0) return;

        const big = items[0];
        const rest = items.slice(1);

        const fmt = d => { const dt = new Date(d); return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`; };

        el.innerHTML = `
      <a href="${big.url}" class="news-big rv-l" target="_blank" rel="noopener noreferrer">
        ${big.thumbnail ? `<img src="${big.thumbnail}" alt="">` : '<div style="background:var(--bg3);position:absolute;inset:0"></div>'}
        <div class="nb-content">
          <div class="nb-date">${fmt(big.date)}</div>
          <h3 class="nb-title">${big.title}</h3>
          <p class="nb-summary">${big.summary || ''}</p>
        </div>
      </a>
      <div class="news-list rv-r">
        ${rest.map(n => `
          <a href="${n.url}" class="news-sm" target="_blank" rel="noopener noreferrer">
            ${n.thumbnail ? `<div class="ns-thumb"><img src="${n.thumbnail}" alt="" loading="lazy"></div>` : ''}
            <div class="ns-body">
              <div class="ns-date">${fmt(n.date)}</div>
              <h4 class="ns-title">${n.title}</h4>
            </div>
          </a>
        `).join('')}
      </div>
    `;
        observeAll();
    }

    // ═══════════ YOUTUBE ═══════════════════════════════════
    const defaultVids = window.SITE_CONFIG?.youtube?.defaultVideos || [];
    load('data/youtube.json', defaultVids).then(data => {
        const has = data.some(v => !v.url && (!v.id || v.id.startsWith('VIDEO_ID')));
        renderYT(has ? defaultVids : data);
    });

    function renderYT(items) {
        const el = document.getElementById('yt-stack');
        if (!el) return;
        el.innerHTML = items.slice(0, 3).map(v => {
            const src = v.url || `https://www.youtube.com/embed/${v.id}`;
            return `
      <div class="yt-item rv d${items.indexOf(v) + 1}">
        <iframe src="${src}" title="${v.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
        <div class="yt-title">${v.title}</div>
      </div>`;
        }).join('');
        observeAll();
    }

    // ── Drag scroll utility ────────────────────────────────
    function setupDrag(el) {
        let down = false, sx, sl;
        el.addEventListener('mousedown', e => { down = true; sx = e.pageX - el.offsetLeft; sl = el.scrollLeft; });
        el.addEventListener('mouseleave', () => down = false);
        el.addEventListener('mouseup', () => down = false);
        el.addEventListener('mousemove', e => { if (!down) return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - el.offsetLeft - sx) * 1.5; });
        let ts = 0;
        el.addEventListener('touchstart', e => { ts = e.touches[0].clientX; sl = el.scrollLeft; }, { passive: true });
        el.addEventListener('touchmove', e => { el.scrollLeft = sl + (ts - e.touches[0].clientX); }, { passive: true });
    }
    // Setup drag for char strip too
    const cs = document.getElementById('char-strip');
    if (cs) setupDrag(cs);

    // ── Smooth scroll ─────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

});
