import { findRecordById } from "./utils.js";
import { toggleAudio } from "./audio.js";
import { toggleSnippets } from "./snippets.js";
import { openPdfForRecord } from "./pdf.js";

export function setupEventHandlers(currentQueryRef) {
    const searchBtn = document.getElementById("searchBtn");
    const queryInput = document.getElementById("query");

    if (queryInput) {
        queryInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchBtn?.click();
            }
        });
    }
	
    const historyDropdown = document.getElementById("historyDropdown");

    if (historyDropdown) {
        historyDropdown.addEventListener("change", () => {
            const val = historyDropdown.value;
            if (val && queryInput) {
                queryInput.value = val;
            }
        });
    }



	document.addEventListener("click", e => {
        const target = e.target.closest(".open-audio, .open-pdf, .snippet-toggle");
		
		if (!target) return;

        if (target.classList.contains("open-pdf")) {
            const rec = findRecordById(target.dataset.id);
            openPdfForRecord(rec);
        }

        if (target.classList.contains("open-audio")) {
            toggleAudio(target, findRecordById);
        }

        if (target.classList.contains("snippet-toggle")) {
            toggleSnippets(target, currentQueryRef.value, findRecordById);
        }
    });
}
