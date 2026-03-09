export let CONFIG = null;
export let INDEX = [];

export async function loadConfig() {
    const res = await fetch("config.json");
    if (!res.ok) throw new Error("Failed to load config.json");
    CONFIG = await res.json();
}

export async function loadIndex() {
    const indexPath = CONFIG.index_path || "dist/index.json";
    const res = await fetch(indexPath);
    if (!res.ok) throw new Error("Failed to load index.json");
    const data = await res.json();
    INDEX = Array.isArray(data) ? data : (data.records || []);
}
