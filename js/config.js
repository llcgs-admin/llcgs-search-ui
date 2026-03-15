export let CONFIG = null;
export let INDEX = [];

export async function loadConfig() {
    const res = await fetch("config.json");
    if (!res.ok) throw new Error("Failed to load config.json");
    CONFIG = await res.json();
}

export async function loadIndex() {
    const res = await fetch("dist/index.json");
    const data = await res.json();
    INDEX = data.records;   // <-- KEEP RECORDS AS-IS
}
