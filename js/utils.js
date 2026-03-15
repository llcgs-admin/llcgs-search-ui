import { INDEX } from "./config.js";

export function findRecordById(id) {
    return INDEX.find(r => r.id === id);
}
