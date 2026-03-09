export function extractSnippetsForQuery(rec, query) {
    if (!rec.pages || !query.trim()) return [];

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const snippets = [];
    const windowSize = 120;

    rec.pages.forEach((page, pageIndex) => {
        const lower = page.toLowerCase();

        terms.forEach(term => {
            let pos = lower.indexOf(term);
            while (pos !== -1) {
                const start = Math.max(0, pos - windowSize);
                const end = Math.min(page.length, pos + term.length + windowSize);

                const snippet = page.slice(start, end).replace(/\s+/g, " ").trim();
                snippets.push(`Page ${pageIndex + 1}: ${snippet}…`);
                pos = lower.indexOf(term, pos + term.length);
            }
        });
    });

    return [...new Set(snippets)];
}

export function toggleSnippets(target, currentQuery, findRecordById) {
    const id = target.dataset.id;
    const expanded = target.dataset.expanded === "true";
    const rec = findRecordById(id);
    if (!rec) return;

    const container = target.closest(".snippet-container");
    if (!container) return;

    const snippets = extractSnippetsForQuery(rec, currentQuery);
    const list = expanded ? snippets.slice(0, 3) : snippets;

    let html = list.map(sn => `<div class="snippet">${sn}</div>`).join("");

    html += `
        <button class="snippet-toggle" data-id="${id}" data-expanded="${!expanded}">
            ${expanded ? "Show all snippets" : "Show fewer snippets"}
        </button>
    `;

    container.innerHTML = html;
}
