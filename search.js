// ============================================================
// GLOBAL STATE
// ============================================================
let INDEX = [];
let LAST_RESULTS = [];
let SEARCH_HISTORY = [];

// Expose INDEX for debugging
window.INDEX = INDEX;

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    await loadConfig();
    await loadIndex();
    loadSearchHistory();
    setupEventHandlers();
});

let CONFIG = null;

async function loadConfig() {
    try {
        const res = await fetch("config.json");
        CONFIG = await res.json();
        console.log("Config loaded:", CONFIG);
    } catch (err) {
        console.error("Failed to load config.json", err);
    }
}

// Load index.json using CONFIG
async function loadIndex() {
    try {
        if (!CONFIG || !CONFIG.index_path) {
            throw new Error("CONFIG.index_path missing");
        }

        const res = await fetch(CONFIG.index_path);
        const data = await res.json();

        INDEX = data.records || [];
        window.INDEX = INDEX; // debugging

        console.log(`Index loaded (${INDEX.length} records).`);
    } catch (err) {
        console.error("Failed to load index.json", err);
    }
}
// ============================================================
// SEARCH ENGINE (PURE LOGIC)
// ============================================================
function runSearch(query, neighborhood = null) {
    if (!query.trim()) return [];

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    return INDEX.filter(rec => {
        // Neighborhood filter
        if (neighborhood && !rec.source.includes(neighborhood)) return false;

        // Boolean AND search across tokens
        return terms.every(t => rec.tokens.includes(t));
    });
}

// ============================================================
// RENDERING
// ============================================================
function renderResults(results) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (!results.length) {
        container.innerHTML = `<p class="no-results">No results found.</p>`;
        return;
    }

    results.forEach(rec => {
        const div = document.createElement("div");
        div.className = "result";

        const pdfBtn = rec.file_id
            ? `<button class="open-pdf" data-id="${rec.file_id}">Open PDF</button>`
            : `<button class="open-pdf disabled">No PDF</button>`;

        const audioBtn = rec.audioId
            ? `<button class="open-audio" data-id="${rec.audioId}">Play Audio</button>`
            : `<button class="open-audio disabled">No Audio</button>`;

        div.innerHTML = `
            <div class="result-header">
                <span class="result-id">${rec.id}</span>
            </div>

            <div class="result-snippet">
                ${rec.snippets[0] || ""}
            </div>

            <div class="result-actions">
                ${pdfBtn}
                ${audioBtn}
            </div>
        `;

        container.appendChild(div);
    });
}

// ============================================================
// EVENT HANDLERS
// ============================================================
function setupEventHandlers() {
    // Search form
    document.getElementById("searchForm").addEventListener("submit", e => {
        e.preventDefault();
        const query = document.getElementById("query").value;
        const neighborhood = document.getElementById("neighborhood").value || null;

        LAST_RESULTS = runSearch(query, neighborhood);
        renderResults(LAST_RESULTS);

        saveSearchHistory(query);
    });

    // PDF + Audio buttons (event delegation)
    document.addEventListener("click", e => {
        if (e.target.classList.contains("open-pdf")) {
            const id = e.target.dataset.id;
            if (id) window.open(`https://drive.google.com/file/d/${id}/preview`, "_blank");
        }

        if (e.target.classList.contains("open-audio")) {
            const id = e.target.dataset.id;
            if (id) window.open(`https://drive.google.com/file/d/${id}/preview`, "_blank");
        }
    });
}

// ============================================================
// SEARCH HISTORY
// ============================================================
function saveSearchHistory(query) {
    if (!query.trim()) return;

    SEARCH_HISTORY.unshift(query);
    SEARCH_HISTORY = SEARCH_HISTORY.slice(0, 20);

    localStorage.setItem("searchHistory", JSON.stringify(SEARCH_HISTORY));
    loadSearchHistory();
}

function loadSearchHistory() {
    const stored = localStorage.getItem("searchHistory");
    SEARCH_HISTORY = stored ? JSON.parse(stored) : [];

    const list = document.getElementById("history");
    if (!list) return;

    list.innerHTML = SEARCH_HISTORY
        .map(q => `<li class="history-item">${q}</li>`)
        .join("");

    list.querySelectorAll(".history-item").forEach(item => {
        item.addEventListener("click", () => {
            document.getElementById("query").value = item.textContent;
        });
    });
}