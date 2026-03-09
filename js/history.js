export let SEARCH_HISTORY = [];

export function loadSearchHistory() {
    try {
        SEARCH_HISTORY = JSON.parse(localStorage.getItem("searchHistory")) || [];
    } catch {
        SEARCH_HISTORY = [];
    }

    const dropdown = document.getElementById("historyDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Recent searches…</option>` +
        SEARCH_HISTORY.map(q => `<option value="${q}">${q}</option>`).join("");
}

export function saveSearchHistory(query) {
    const q = query.trim();
    if (!q) return;

    SEARCH_HISTORY = [q, ...SEARCH_HISTORY.filter(x => x !== q)].slice(0, 20);

    try {
        localStorage.setItem("searchHistory", JSON.stringify(SEARCH_HISTORY));
    } catch {}

    loadSearchHistory();
}
