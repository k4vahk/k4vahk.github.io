// ── Filtros de writeups ──
const filterBtns = document.querySelectorAll('.filter-btn');
const writeupRows = document.querySelectorAll('.writeup-row');
const noResults = document.getElementById('no-results');
let activeFilters = { diff: 'all', platform: 'all' };

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;

            if (f === 'all') {
                activeFilters = { diff: 'all', platform: 'all' };
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            } else if (['very-easy', 'easy', 'medium', 'hard', 'insane'].includes(f)) {
                activeFilters.diff = (activeFilters.diff === f) ? 'all' : f;
            } else {
                activeFilters.platform = (activeFilters.platform === f) ? 'all' : f;
            }

            filterBtns.forEach(b => {
                const bf = b.dataset.filter;
                if (bf === 'all') {
                    b.classList.toggle('active', activeFilters.diff === 'all' && activeFilters.platform === 'all');
                } else if (['very-easy', 'easy', 'medium', 'hard', 'insane'].includes(bf)) {
                    b.classList.toggle('active', activeFilters.diff === bf);
                } else {
                    b.classList.toggle('active', activeFilters.platform === bf);
                }
            });

            applyFilters();
        });
    });
}

function applyFilters() {
    let visible = 0;
    writeupRows.forEach(row => {
        const diffOk = activeFilters.diff === 'all' || row.dataset.diff === activeFilters.diff;
        const platformOk = activeFilters.platform === 'all' || row.dataset.platform === activeFilters.platform;
        const show = diffOk && platformOk;
        row.classList.toggle('hidden', !show);
        if (show) visible++;
    });
    if (noResults) noResults.classList.toggle('visible', visible === 0);
}

// ── Buscador global ──
const searchInput = document.getElementById('global-search');
const searchDropdown = document.getElementById('search-dropdown');

function closeSearch() {
    if (searchDropdown) searchDropdown.classList.remove('visible');
    if (searchInput) searchInput.value = '';
}

function highlight(text, query) {
    if (!query) return text;
    const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(re, '<mark>$1</mark>');
}

if (searchInput) {
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) { searchDropdown.classList.remove('visible'); return; }

        fetch('/search.json')
            .then(r => r.json())
            .then(index => {
                const matches = index.filter(item =>
                    item.title.toLowerCase().includes(q) ||
                    (item.desc && item.desc.toLowerCase().includes(q)) ||
                    (item.tags && item.tags.toLowerCase().includes(q))
                );

                if (matches.length === 0) {
                    searchDropdown.innerHTML = '<div class="sr-empty">Sin resultados para "' + searchInput.value + '"</div>';
                } else {
                    searchDropdown.innerHTML = matches.slice(0, 6).map(item => `
            <a class="search-result-item" href="${item.url}">
              <div class="sr-section">${item.section}</div>
              <div class="sr-title">${highlight(item.title, searchInput.value)}</div>
              <div class="sr-desc">${highlight(item.desc || '', searchInput.value)}</div>
            </a>
          `).join('');
                }
                searchDropdown.classList.add('visible');
            });
    });

    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeSearch();
    });
}

document.addEventListener('click', e => {
    if (searchInput && !e.target.closest('.search-wrap')) closeSearch();
});

// ── Hover Preview (WikiLinks) ──
const tooltip = document.createElement('div');
tooltip.id = 'wiki-tooltip';
tooltip.style.cssText = `
  display: none;
  position: fixed;
  z-index: 1000;
  max-width: 320px;
  background: #161614;
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  font-size: 13px;
  color: #888880;
  line-height: 1.6;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  pointer-events: none;
`;
document.body.appendChild(tooltip);

let tooltipTimeout;

document.querySelectorAll('a.wiki-link').forEach(link => {
    link.addEventListener('mouseenter', async (e) => {
        clearTimeout(tooltipTimeout);
        const url = link.getAttribute('href');
        if (!url) return;

        try {
            const res = await fetch(url);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const title = doc.querySelector('.post-title')?.textContent?.trim() || link.textContent;
            const content = doc.querySelector('.post-content p')?.textContent?.trim() || 'Sin descripción.';

            tooltip.innerHTML = `
        <div style="font-family:'DM Mono',monospace;font-size:11px;color:#55554f;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Vista previa</div>
        <div style="font-size:14px;font-weight:500;color:#e8e6e0;margin-bottom:6px;">${title}</div>
        <div>${content.slice(0, 180)}${content.length > 180 ? '...' : ''}</div>
      `;

            const x = e.clientX + 16;
            const y = e.clientY + 16;
            tooltip.style.left = (x + 320 > window.innerWidth ? x - 340 : x) + 'px';
            tooltip.style.top = (y + 150 > window.innerHeight ? y - 160 : y) + 'px';
            tooltip.style.display = 'block';
        } catch (err) {
            console.error('Tooltip error:', err);
        }
    });

    link.addEventListener('mousemove', (e) => {
        const x = e.clientX + 16;
        const y = e.clientY + 16;
        tooltip.style.left = (x + 320 > window.innerWidth ? x - 340 : x) + 'px';
        tooltip.style.top = (y + 150 > window.innerHeight ? y - 160 : y) + 'px';
    });

    link.addEventListener('mouseleave', () => {
        tooltipTimeout = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 150);
    });
});