// ------------------------------------------------------------
// Imports
// ------------------------------------------------------------
import { boxesForNeighborhood, NEIGHBORHOOD_MAP } from "./neighborhoods.js";

// ------------------------------------------------------------
// State
// ------------------------------------------------------------
export let INDEX = [];
let currentQuery = "";

// ------------------------------------------------------------
// Load index.json
// ------------------------------------------------------------
export async function loadIndex() {
    const res = await fetch("dist/index.json");
    const data = await res.json();
    INDEX = data.records; // preserve all fields including box
}

// ------------------------------------------------------------
// Populate Neighborhood Dropdown
// ------------------------------------------------------------
function populateNeighborhoodDropdown() {
    const select = document.getElementById("neighborhoodFilter");
    if (!select) return;

    const neighborhoods = [...new Set(Object.values(NEIGHBORHOOD_MAP))];
    neighborhoods.sort();

    neighborhoods.forEach(n => {
        const opt = document.createElement("option");
        opt.value = n;
        opt.textContent = n;
        select.appendChild(opt);
    });
}

// ------------------------------------------------------------
// Run search
// ------------------------------------------------------------
export function runSearch(query, INDEX) {
    const q = query.trim();
    currentQuery = q;
    if (!q) return { results: [], elapsed: 0 };

    const start = performance.now();
    const qLower = q.toLowerCase();

    // Basic text match
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

            const boxNum = Number(String(rec.box).replace(/\D+/g, ""));
            return allowedBoxes.includes(boxNum);
        });
    }

    const elapsed = performance.now() - start;
    return { results, elapsed };
}

// ------------------------------------------------------------
// Render results
// ------------------------------------------------------------
export function renderResults(results, elapsed = 0) {
    const container = document.getElementById("results");
    if (!container) return;

    // Update result count + elapsed time
    const info = document.getElementById("resultInfo");
    if (info) {
        const count = results.length;
        const ms = Math.round(elapsed);
        info.textContent = `${count} result${count !== 1 ? "s" : ""} in ${ms} ms`;
    }

    container.innerHTML = "";

    results.forEach(rec => {
        const resultDiv = document.createElement("div");
        resultDiv.className = "result";

        // Title
        const title = document.createElement("div");
        title.className = "result-title";
        title.textContent = rec.id;
        resultDiv.appendChild(title);

        // --------------------------------------------------------
        // PDF + AUDIO BUTTONS
        // --------------------------------------------------------

        // PDF button
        if (rec.file_id) {
            const pdfBtn = document.createElement("button");
            pdfBtn.className = "pdf-button";
            pdfBtn.textContent = "Open PDF";

            pdfBtn.addEventListener("click", () => {
                const usePreview = document.getElementById("usePreviewToggle")?.checked;
                const allowMulti = document.getElementById("multiPopupToggle")?.checked;

                const base = `https://drive.google.com/file/d/${rec.file_id}`;
                const url = usePreview ? `${base}/preview` : `${base}/view`;

                if (allowMulti) {
                    window.open(url, "_blank");
                } else {
                    window.open(url, "pdfWindow");
                }
            });

            resultDiv.appendChild(pdfBtn);
        }

        // Audio button
        if (rec.audioId) {
            const audioBtn = document.createElement("button");
            audioBtn.className = "audio-button";
            audioBtn.textContent = "Play Audio";

            let audioVisible = false;
            const audioContainer = document.createElement("div");
            audioContainer.className = "inline-audio";
            audioContainer.style.display = "none";

            audioBtn.addEventListener("click", () => {
                audioVisible = !audioVisible;

                if (audioVisible) {
                    audioContainer.innerHTML = `
                        <iframe
                            src="https://drive.google.com/file/d/${rec.audioId}/preview"
                            width="640"
                            height="80"
                            allow="autoplay"
                        ></iframe>
                    `;
                    audioContainer.style.display = "block";
                    audioBtn.textContent = "Close Audio";
                } else {
                    audioContainer.innerHTML = "";
                    audioContainer.style.display = "none";
                    audioBtn.textContent = "Play Audio";
                }
            });

            resultDiv.appendChild(audioBtn);
            resultDiv.appendChild(audioContainer);
        }

        // --------------------------------------------------------
        // SNIPPET BLOCK (fixed toggle)
        // --------------------------------------------------------

        let snippets = [];

        if (Array.isArray(rec.snippets) && rec.snippets.length > 0) {
            snippets = rec.snippets;
        } else if (rec.full_text) {
            const chunkSize = 200;
            for (let i = 0; i < rec.full_text.length; i += chunkSize) {
                snippets.push(rec.full_text.slice(i, i + chunkSize));
                if (snippets.length >= 10) break;
            }
        }

        const snippetContainer = document.createElement("div");
        snippetContainer.className = "snippet-container";

        const initialSnippets = snippets.slice(0, 3);
        initialSnippets.forEach(sn => {
            const snDiv = document.createElement("div");
            snDiv.className = "snippet";
            snDiv.textContent = sn + "…";
            snippetContainer.appendChild(snDiv);
        });

        resultDiv.appendChild(snippetContainer);

        if (snippets.length > 3) {
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "snippet-toggle";
            toggleBtn.textContent = "Show all snippets";

            let expanded = false;

            toggleBtn.addEventListener("click", () => {
                expanded = !expanded;
                snippetContainer.innerHTML = "";

                const toShow = expanded ? snippets : snippets.slice(0, 3);

                toShow.forEach(sn => {
                    const snDiv = document.createElement("div");
                    snDiv.className = "snippet";
                    snDiv.textContent = sn + "…";
                    snippetContainer.appendChild(snDiv);
                });

                toggleBtn.textContent = expanded
                    ? "Show fewer snippets"
                    : "Show all snippets";
            });

            resultDiv.appendChild(toggleBtn);
        }

        container.appendChild(resultDiv);
    });
}

// ------------------------------------------------------------
// Wiring / Initialization
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {

    await loadIndex();
    populateNeighborhoodDropdown();

    const queryInput = document.getElementById("query");
    const searchBtn = document.getElementById("searchBtn");
    const neighborhoodFilter = document.getElementById("neighborhoodFilter");
    const historyDropdown = document.getElementById("historyDropdown");
    const helpBtn = document.getElementById("helpBtn");
    const helpModal = document.getElementById("helpModal");
    const closeHelp = document.getElementById("closeHelp");

    // Search button
    searchBtn.addEventListener("click", () => {
        const { results, elapsed } = runSearch(queryInput.value, INDEX);
        renderResults(results, elapsed);
    });

    // Enter key
    queryInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const { results, elapsed } = runSearch(queryInput.value, INDEX);
            renderResults(results, elapsed);
        }
    });

    // Neighborhood filter
    neighborhoodFilter.addEventListener("change", () => {
        const { results, elapsed } = runSearch(queryInput.value, INDEX);
        renderResults(results, elapsed);
    });

    // History dropdown
    historyDropdown.addEventListener("change", () => {
        if (historyDropdown.value) {
            queryInput.value = historyDropdown.value;
            const { results, elapsed } = runSearch(queryInput.value, INDEX);
            renderResults(results, elapsed);
        }
    });

    // Help modal
    helpBtn.addEventListener("click", () => {
        helpModal.style.display = "block";
    });

    closeHelp.addEventListener("click", () => {
        helpModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = "none";
        }
    });
});