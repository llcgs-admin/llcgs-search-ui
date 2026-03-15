// ------------------------------------------------------------
// Imports
// ------------------------------------------------------------
import { boxesForNeighborhood, NEIGHBORHOOD_MAP } from "./neighborhoods.js";

// ------------------------------------------------------------
// State
// ------------------------------------------------------------
export let INDEX = [];
let currentQuery = "";

let SEARCH_HISTORY = [];
const MAX_HISTORY = 20;

// ------------------------------------------------------------
// Load index.json
// ------------------------------------------------------------
export async function loadIndex() {
    const res = await fetch("dist/index.json");
    const data = await res.json();
    INDEX = data.records;
}

// ------------------------------------------------------------
// Load history from localStorage
// ------------------------------------------------------------
function loadHistoryFromStorage() {
    try {
        const stored = JSON.parse(localStorage.getItem("searchHistory"));
        if (Array.isArray(stored)) SEARCH_HISTORY = stored;
    } catch (e) {
        SEARCH_HISTORY = [];
    }
}

// ------------------------------------------------------------
// Save history to localStorage
// ------------------------------------------------------------
function saveHistoryToStorage() {
    localStorage.setItem("searchHistory", JSON.stringify(SEARCH_HISTORY));
}

// ------------------------------------------------------------
// Add query to history
// ------------------------------------------------------------
function addToSearchHistory(query) {
    const q = query.trim();
    if (!q) return;

    SEARCH_HISTORY = SEARCH_HISTORY.filter(item => item !== q);
    SEARCH_HISTORY.unshift(q);

    if (SEARCH_HISTORY.length > MAX_HISTORY) {
        SEARCH_HISTORY = SEARCH_HISTORY.slice(0, MAX_HISTORY);
    }

    saveHistoryToStorage();
    populateHistoryDropdown();
}

// ------------------------------------------------------------
// Clear history
// ------------------------------------------------------------
function clearSearchHistory() {
    SEARCH_HISTORY = [];
    saveHistoryToStorage();
    populateHistoryDropdown();
}

// ------------------------------------------------------------
// Populate history dropdown
// ------------------------------------------------------------
function populateHistoryDropdown() {
    const dropdown = document.getElementById("historyDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Recent searches…</option>`;

    SEARCH_HISTORY.forEach(q => {
        const opt = document.createElement("option");
        opt.value = q;
        opt.textContent = q;
        dropdown.appendChild(opt);
    });
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
// Boolean Query Parser (whole‑word matching)
// ------------------------------------------------------------
function parseQuery(q) {
    const phrases = [];
    const orGroups = [];
    const excluded = [];
    const required = [];

    let working = q.toLowerCase();

    const phraseRegex = /"([^"]+)"/g;
    working = working.replace(phraseRegex, (_, p) => {
        const phrase = p.trim();
        if (phrase) phrases.push(phrase);
        return " ";
    });

    const orRegex = /\(([^)]+)\)/g;
    working = working.replace(orRegex, (_, group) => {
        const terms = group
            .split(/\s+or\s+/i)
            .map(t => t.trim())
            .filter(Boolean);
        if (terms.length > 0) orGroups.push(terms);
        return " ";
    });

    const notRegex = /-(\w+)/g;
    working = working.replace(notRegex, (_, term) => {
        const t = term.trim();
        if (t) excluded.push(t);
        return " ";
    });

    const reqTerms = working.match(/\b[\p{L}\p{N}']+\b/gu) || [];
    reqTerms.forEach(t => {
        const term = t.trim();
        if (term) required.push(term);
    });

    return { phrases, orGroups, excluded, required };
}

// ------------------------------------------------------------
// Record Matcher (whole‑word logic)
// ------------------------------------------------------------
function matchesRecord(rec, parsed) {
    const text = rec.full_text?.toLowerCase() || "";
    if (!text) return false;

    const words = text.match(/\b[\p{L}\p{N}']+\b/gu) || [];
    const wordSet = new Set(words);

    for (const term of parsed.required) {
        if (!wordSet.has(term)) return false;
    }

    for (const phrase of parsed.phrases) {
        if (!text.includes(phrase)) return false;
    }

    for (const group of parsed.orGroups) {
        const ok = group.some(term => wordSet.has(term));
        if (!ok) return false;
    }

    for (const term of parsed.excluded) {
        if (wordSet.has(term)) return false;
    }

    return true;
}

// ------------------------------------------------------------
// Query‑aware snippet extraction
// ------------------------------------------------------------
function extractQueryAwareSnippets(fullText, parsed, maxSnippets = 3) {
    if (!fullText) return [];

    const text = fullText.toLowerCase();
    const snippets = [];
    const windowSize = 120;

    const tokens = new Set();
    parsed.required.forEach(t => tokens.add(t));
    parsed.phrases.forEach(p => tokens.add(p));
    parsed.orGroups.forEach(group => group.forEach(t => tokens.add(t)));

    const positions = [];

    for (const token of tokens) {
        if (!token) continue;

        if (token.includes(" ")) {
            let idx = text.indexOf(token);
            while (idx !== -1) {
                positions.push(idx);
                idx = text.indexOf(token, idx + 1);
            }
        } else {
            const regex = new RegExp(`\\b${token}\\b`, "gi");
            let match;
            while ((match = regex.exec(fullText)) !== null) {
                positions.push(match.index);
            }
        }
    }

    if (positions.length === 0) {
        const chunkSize = 200;
        for (let i = 0; i < fullText.length && snippets.length < maxSnippets; i += chunkSize) {
            snippets.push(fullText.slice(i, i + chunkSize));
        }
        return snippets;
    }

    positions.sort((a, b) => a - b);

    for (const pos of positions) {
        if (snippets.length >= maxSnippets) break;

        const start = Math.max(0, pos - windowSize);
        const end = Math.min(fullText.length, pos + windowSize);

        let snippet = fullText.slice(start, end).trim();
        if (start > 0) snippet = "…" + snippet;
        if (end < fullText.length) snippet = snippet + "…";

        snippets.push(snippet);
    }

    return snippets;
}

// ------------------------------------------------------------
// Run search
// ------------------------------------------------------------
export function runSearch(query, INDEX) {
    const q = query.trim();
    currentQuery = q;
    if (!q) return { results: [], elapsed: 0, parsed: parseQuery("") };

    const parsed = parseQuery(q);
    const start = performance.now();

    let results = INDEX.filter(rec => matchesRecord(rec, parsed));

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
    return { results, elapsed, parsed };
}

// ------------------------------------------------------------
// Highlight matched terms inside snippets
// ------------------------------------------------------------
function highlightMatches(snippet, parsed) {
    if (!snippet) return snippet;

    // Build a unified list of tokens to highlight
    const tokens = new Set();

    parsed.required.forEach(t => tokens.add(t));
    parsed.phrases.forEach(p => tokens.add(p));
    parsed.orGroups.forEach(group => group.forEach(t => tokens.add(t)));

    // Excluded terms are NOT highlighted

    // Sort longest-first so phrases win over single words
    const sorted = [...tokens].sort((a, b) => b.length - a.length);

    let highlighted = snippet;

    for (const token of sorted) {
        if (!token) continue;

        // Escape regex characters
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        let regex;
        if (token.includes(" ")) {
            // Phrase match (simple substring)
            regex = new RegExp(escaped, "gi");
        } else {
            // Whole-word match
            regex = new RegExp(`\\b${escaped}\\b`, "gi");
        }

        highlighted = highlighted.replace(regex, match => `<mark>${match}</mark>`);
    }

    return highlighted;
}

// ------------------------------------------------------------
// Render results
// ------------------------------------------------------------
export function renderResults(results, elapsed = 0, parsedQuery = null) {
    const container = document.getElementById("results");
    if (!container) return;

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

        const title = document.createElement("div");
        title.className = "result-title";
        title.textContent = rec.id;
        resultDiv.appendChild(title);

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
					// Multiple windows/tabs allowed
					window.open(url, "_blank");
				} else {
					// Single reusable popup window
					window.open(
						url,
						"pdfWindow",
						"width=900,height=1100,resizable=yes,scrollbars=yes,noopener,noreferrer"
					);
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

        // Snippets
        let snippets = [];

        if (rec.full_text && parsedQuery) {
            snippets = extractQueryAwareSnippets(rec.full_text, parsedQuery, 3);
        }

        const snippetContainer = document.createElement("div");
        snippetContainer.className = "snippet-container";

        const initialSnippets = snippets.slice(0, 3);
        initialSnippets.forEach(sn => {
            const snDiv = document.createElement("div");
            snDiv.className = "snippet";
            snDiv.innerHTML = highlightMatches(sn, parsedQuery);
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
                    snDiv.innerHTML = highlightMatches(sn, parsedQuery);
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
    loadHistoryFromStorage();
    populateNeighborhoodDropdown();
    populateHistoryDropdown();

    const queryInput = document.getElementById("query");
    const searchBtn = document.getElementById("searchBtn");
    const neighborhoodFilter = document.getElementById("neighborhoodFilter");
    const historyDropdown = document.getElementById("historyDropdown");
    const helpBtn = document.getElementById("helpBtn");
    const helpModal = document.getElementById("helpModal");
    const closeHelp = document.getElementById("closeHelp");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    function runAndRender() {
        const query = queryInput.value;
        const { results, elapsed, parsed } = runSearch(query, INDEX);
        renderResults(results, elapsed, parsed);
        addToSearchHistory(query);
    }

    searchBtn.addEventListener("click", runAndRender);

    queryInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runAndRender();
    });

    neighborhoodFilter.addEventListener("change", runAndRender);

    historyDropdown.addEventListener("change", () => {
        if (historyDropdown.value) {
            queryInput.value = historyDropdown.value;
            runAndRender();
        }
    });

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            clearSearchHistory();
        });
    }

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