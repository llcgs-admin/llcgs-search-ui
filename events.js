import { findRecordById } from "./utils.js";
import { toggleAudio } from "./audio.js";
import { toggleSnippets } from "./snippets.js";
import { openPdfForRecord } from "./pdf.js";

export function setupEventHandlers(currentQueryRef) {
    document.addEventListener("click", e => {
        const target = e.target;

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
