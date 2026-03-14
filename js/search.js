// ------------------------------------------------------------
// Imports
// ------------------------------------------------------------
import { boxesForNeighborhood } from "./neighborhoods.js";

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

            // Normalize box number
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

    console.log("DEBUG RESULTS:", results);

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
        // SNIPPET BLOCK (fully fixed toggle)
        // --------------------------------------------------------

        // Build snippet array (from rec.snippets or fallback)
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

        // Create container
        const snippetContainer = document.createElement("div");
        snippetContainer.className = "snippet-container";

        // Initial render (first 3)
        const initialSnippets = snippets.slice(0, 3);
        initialSnippets.forEach(sn => {
            const snDiv = document.createElement("div");
            snDiv.className = "snippet";
            snDiv.textContent = sn + "…";
            snippetContainer.appendChild(snDiv);
        });

        resultDiv.appendChild(snippetContainer);

        // Toggle button
        if (snippets.length > 3) {
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "snippet-toggle";
            toggleBtn.textContent = "Show all snippets";

            let expanded = false;

            toggleBtn.addEventListener("click", () => {
                expanded = !expanded;

                // Clear container
                snippetContainer.innerHTML = "";

                // Choose which snippets to show
                const toShow = expanded ? snippets : snippets.slice(0, 3);

                // Re-render
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

        // --------------------------------------------------------
        // END SNIPPET BLOCK
        // --------------------------------------------------------

        container.appendChild(resultDiv);
    });
}