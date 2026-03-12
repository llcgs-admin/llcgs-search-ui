import { loadConfig, loadIndex, INDEX } from "./config.js";
import { extractSnippetsForQuery } from "./snippets.js";
import { loadSearchHistory, saveSearchHistory } from "./history.js";
import { setupEventHandlers } from "./events.js";
import { populateNeighborhoodDropdown, boxesForNeighborhood } from "./neighborhoods.js";


let LAST_RESULTS = [];
let currentQuery = "";


export function runSearch(query, INDEX) {
    const q = query.trim();
    currentQuery = q;
    if (!q) return [];

    const qLower = q.toLowerCase();

    let results = INDEX.filter(rec =>
        rec.full_text &&
        rec.full_text.toLowerCase().includes(qLower)
    );

    // Neighborhood filtering
    const neighborhoodSelect = document.getElementById("neighborhoodFilter");
    const selectedNeighborhood = neighborhoodSelect?.value || "";

    if (selectedNeighborhood) {
        const allowedBoxes = boxesForNeighborhood(selectedNeighborhood);

        results = results.filter(rec => {
            if (!rec.box) return false;

            // Normalize rec.box to a number
            const boxNum = Number(String(rec.box).replace(/\D+/g, ""));
            return allowedBoxes.includes(boxNum);
        });
    }

    return results;
}

export function renderResults(results) {
    const container = document.getElementById("results");
    if (!container) return;
	
	console.log("DEBUG RESULTS:", results);

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
            ? `<button class="open-audio" data-id="${rec.id}">
                    <span class="chevron">▶</span>
                    <span class="audio-label">Play Audio</span>
               </button>`
            : `<button class="open-audio disabled" disabled>No Audio</button>`;

        const snippets = extractSnippetsForQuery(rec, currentQuery);
        const initial = snippets.slice(0, 3);

        let snippetHTML = initial.map(sn => `<div class="snippet">${sn}</div>`).join("");

        if (snippets.length > 3) {
            snippetHTML += `
                <button class="snippet-toggle" data-id="${rec.id}" data-expanded="false">
                    Show all snippets
                </button>`;
        }

        html += `
            <article class="result" data-id="${rec.id}">
                <header class="result-header">
                    <span class="result-id">${rec.id}</span>
                </header>

                <div class="snippet-container">${snippetHTML}</div>

                <div class="result-actions">
                    ${pdfBtn}
                    ${audioBtn}
                </div>

                <div class="audio-container" id="audio-${rec.id}">
                    <div class="audio-header">Audio Player</div>
                    <iframe src="" allow="autoplay"></iframe>
                </div>
            </article>`;
    });

    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadConfig();
    await loadIndex();
	populateNeighborhoodDropdown();
    loadSearchHistory();

    setupEventHandlers({ value: currentQuery });

    const searchBtn = document.getElementById("searchBtn");
    const queryInput = document.getElementById("query");

    searchBtn.addEventListener("click", () => {
        LAST_RESULTS = runSearch(queryInput.value, INDEX);
        renderResults(LAST_RESULTS);
        saveSearchHistory(queryInput.value);
    });

    queryInput.focus();
});
