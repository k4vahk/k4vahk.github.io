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
            } else if (['easy', 'medium', 'hard'].includes(f)) {
                activeFilters.diff = (activeFilters.diff === f) ? 'all' : f;
            } else {
                activeFilters.platform = (activeFilters.platform === f) ? 'all' : f;
            }

            filterBtns.forEach(b => {
                const bf = b.dataset.filter;
                if (bf === 'all') {
                    b.classList.toggle('active', activeFilters.diff === 'all' && activeFilters.platform === 'all');
                } else if (['easy', 'medium', 'hard'].includes(bf)) {
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