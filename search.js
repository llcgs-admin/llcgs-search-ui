// search.js

let CONFIG = null;
let INDEX = [];
let SEARCH_HISTORY = [];
let LAST_RESULTS = [];
let currentQuery = "";

// ============================================================
// CONFIG + INDEX LOADING
// ============================================================
async function loadConfig() {
    const res = await fetch("config.json");
    if (!res.ok) throw new Error("Failed to load config.json");
    CONFIG = await res.json();
    console.log("Config loaded:", CONFIG);
}

async function loadIndex() {
    const indexPath = CONFIG.index_path || "dist/index.json";
    const res = await fetch(indexPath);
    if (!res.ok) throw new Error("Failed to load index.json");
    const data = await res.json();
    INDEX = Array.isArray(data) ? data : (data.records || []);
    console.log(`Index loaded (${INDEX.length} records).`);
}

// ============================================================
// QUERY-AWARE SNIPPET EXTRACTION
// ============================================================
function extractSnippetsForQuery(rec, query) {
    if (!rec.pages || !query.trim()) return [];

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const snippets = [];
    const windowSize = 120;

    rec.pages.forEach((page, pageIndex) => {
        const lowerPage = page.toLowerCase();

        terms.forEach(term => {
            let pos = lowerPage.indexOf(term);

            while (pos !== -1) {
                const start = Math.max(0, pos - windowSize);
                const end = Math.min(page.length, pos + term.length + windowSize);

                const snippet = page
                    .slice(start, end)
                    .replace(/\s+/g, " ")
                    .trim();

                snippets.push(`Page ${pageIndex + 1}: ${snippet}…`);

                pos = lowerPage.indexOf(term, pos + term.length);
            }
        });
    });

    const seen = new Set();
    return snippets.filter(sn => {
        if (seen.has(sn)) return false;
        seen.add(sn);
        return true;
    });
}

// ============================================================
// SEARCH LOGIC
// ============================================================
function runSearch(query) {
    const q = query.trim();
    currentQuery = q;
    if (!q) return [];

    const qLower = q.toLowerCase();

    return INDEX.filter(rec =>
        rec.full_text &&
        rec.full_text.toLowerCase().includes(qLower)
    );
}

// ============================================================
// RENDERING
// ============================================================
function renderResults(results) {
    const container = document.getElementById("results");
    if (!container) return;

    if (!results.length) {
        container.innerHTML = `<p class="no-results">No results found.</p>`;
        return;
    }

    let html = "";

    results.forEach(rec => {
        const pdfBtn = rec.file_id
            ? `<button class="open-pdf" data-id="${rec.id}">Open PDF</button>`
            : `<button class="open-pdf disabled" disabled>No PDF</button>`;

        const audioBtn = rec.audioId
            ? `<button class="open-audio" data-id="${rec.id}">Play Audio</button>`
            : `<button class="open-audio disabled" disabled>No Audio</button>`;

        const snippets = extractSnippetsForQuery(rec, currentQuery);
        const initial = snippets.slice(0, 3);

        let snippetHTML = initial
            .map(sn => `<div class="snippet">${sn}</div>`)
            .join("");

        const needsToggle = snippets.length > 3;

        if (needsToggle) {
            snippetHTML += `
                <button class="snippet-toggle" data-id="${rec.id}" data-expanded="false">
                    Show all snippets
                </button>
            `;
        }

        html += `
            <article class="result" data-id="${rec.id}">
                <header class="result-header">
                    <span class="result-id">${rec.id}</span>
                </header>

                <div class="snippet-container">
                    ${snippetHTML}
                </div>

                <div class="result-actions">
                    ${pdfBtn}
                    ${audioBtn}
                </div>

                <!-- INLINE AUDIO PLAYER WITH TITLE BAR -->
                <div class="audio-container" id="audio-${rec.id}">
                    <div class="audio-header">Audio Player</div>
                    <iframe
                        src=""
                        allow="autoplay"
                    ></iframe>
                </div>

            </article>
        `;
    });

    container.innerHTML = html;
}
// ============================================================
// HISTORY
// ============================================================
function loadSearchHistory() {
    try {
        const stored = localStorage.getItem("searchHistory");
        SEARCH_HISTORY = stored ? JSON.parse(stored) : [];
    } catch {
        SEARCH_HISTORY = [];
    }

    const dropdown = document.getElementById("historyDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Recent searches…</option>` +
        SEARCH_HISTORY.map(q => `<option value="${q}">${q}</option>`).join("");
}

function saveSearchHistory(query) {
    const q = query.trim();
    if (!q) return;

    SEARCH_HISTORY = [q, ...SEARCH_HISTORY.filter(x => x !== q)].slice(0, 20);

    try {
        localStorage.setItem("searchHistory", JSON.stringify(SEARCH_HISTORY));
    } catch {
        // ignore
    }

    loadSearchHistory();
}

// ============================================================
// PDF / AUDIO OPEN HELPERS
// ============================================================
function findRecordById(id) {
    return INDEX.find(r => r.id === id);
}

function openPdfForRecord(rec) {
    if (!rec || !rec.file_id) return;

    const multi = document.getElementById("multiPopupToggle")?.checked;
    const usePreview = document.getElementById("usePreviewToggle")?.checked;

    let url;
    let target;

    if (usePreview) {
        // PREVIEW MODE → popup using /preview
        url = `https://drive.google.com/file/d/${rec.file_id}/preview`;

        // Multi-window toggle applies here
        target = multi ? "_blank" : "pdfPopup";

        window.open(url, target, "width=900,height=1100");
    } else {
        // VIEW MODE → new tab using /view (never download)
        url = `https://drive.google.com/file/d/${rec.file_id}/view`;

        // Multi-window toggle applies here too
        target = multi ? "_blank" : "pdfTab";

        window.open(url, target);
    }
}

function openAudioForRecord(rec) {
    if (!rec || !rec.audioId) return;

    const multi = document.getElementById("multiPopupToggle")?.checked;
    const url = `https://drive.google.com/file/d/${rec.audioId}/preview`;
    const target = multi ? "_blank" : "audioWindow";
    window.open(url, target);
}

// ============================================================
// EVENT HANDLERS
// ============================================================
function setupEventHandlers() {
    const searchBtn = document.getElementById("searchBtn");
    const queryInput = document.getElementById("query");
    const historyDropdown = document.getElementById("historyDropdown");
    const helpBtn = document.getElementById("helpBtn");
    const helpModal = document.getElementById("helpModal");
    const closeHelp = document.getElementById("closeHelp");

    if (searchBtn) {
        searchBtn.addEventListener("click", e => {
            e.preventDefault();
            const query = queryInput ? queryInput.value : "";
            LAST_RESULTS = runSearch(query);
            renderResults(LAST_RESULTS);
            saveSearchHistory(query);
        });
    }

    if (queryInput) {
        queryInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchBtn?.click();
            }
        });
    }

    if (historyDropdown) {
        historyDropdown.addEventListener("change", () => {
            const val = historyDropdown.value;
            if (val && queryInput) {
                queryInput.value = val;
            }
        });
    }

    // Global click delegation
    document.addEventListener("click", e => {
        const target = e.target;

        if (target.classList.contains("open-pdf")) {
            const id = target.dataset.id;
            const rec = findRecordById(id);
            openPdfForRecord(rec);
        }

if (target.classList.contains("open-audio")) {
    const id = target.dataset.id;
    const rec = findRecordById(id);
    if (!rec || !rec.audioId) return;

    const resultEl = target.closest(".result");
    const container = resultEl.querySelector(".audio-container");
    const iframe = container.querySelector("iframe");
    const isOpen = container.classList.contains("open");

	if (isOpen) {
		// CLOSE AUDIO (animated)
		container.classList.remove("open");
		iframe.src = ""; // stop playback
		target.textContent = "Play Audio";
		return;
	}

	// OPEN AUDIO (animated)
	const previewUrl = `https://drive.google.com/file/d/${rec.audioId}/preview`;

	iframe.src = previewUrl; // only update the iframe
	container.classList.add("open");
	target.textContent = "Close Audio";
	}
        if (target.classList.contains("snippet-toggle")) {
            const id = target.dataset.id;
            const expanded = target.dataset.expanded === "true";
            const rec = findRecordById(id);
            if (!rec) return;

            const container = target.closest(".snippet-container");
            if (!container) return;

            const snippets = extractSnippetsForQuery(rec, currentQuery);
            const list = expanded ? snippets.slice(0, 3) : snippets;

            let snippetHTML = list
                .map(sn => `<div class="snippet">${sn}</div>`)
                .join("");

            snippetHTML += `
                <button class="snippet-toggle" data-id="${id}" data-expanded="${!expanded}">
                    ${expanded ? "Show all snippets" : "Show fewer snippets"}
                </button>
            `;

            container.innerHTML = snippetHTML;
        }
    });

    // Help modal
    if (helpBtn && helpModal) {
        helpBtn.addEventListener("click", () => {
            helpModal.style.display = "block";
        });
    }

    if (closeHelp && helpModal) {
        closeHelp.addEventListener("click", () => {
            helpModal.style.display = "none";
        });
    }

    if (helpModal) {
        window.addEventListener("click", e => {
            if (e.target === helpModal) {
                helpModal.style.display = "none";
            }
        });
    }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadConfig();
        await loadIndex();
        loadSearchHistory();
        setupEventHandlers();

        const queryInput = document.getElementById("query");
        if (queryInput) queryInput.focus();
    } catch (err) {
        console.error(err);
        const container = document.getElementById("results");
        if (container) {
            container.innerHTML = `<p class="error">Failed to initialize search. See console for details.</p>`;
        }
    }
});