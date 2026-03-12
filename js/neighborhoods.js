// neighborhoods.js

// Fixed authoritative mapping
export const NEIGHBORHOOD_MAP = {
    1: "Near South",
    2: "Yankee Hill",
    3: "South Salt Creek",
    4: "North Bottoms",
    5: "University Place",
    6: "University Place",
    7: "College View",
    8: "College View",
    9: "East Campus",
    10: "East Campus"
};

// Populate dropdown from the fixed map
export function populateNeighborhoodDropdown() {
    const select = document.getElementById("neighborhoodFilter");
    if (!select) return;

    const neighborhoods = [...new Set(Object.values(NEIGHBORHOOD_MAP))].sort();

    select.innerHTML =
        `<option value="">All Neighborhoods</option>` +
        neighborhoods.map(n => `<option value="${n}">${n}</option>`).join("");
}

// return an array of box numbers for a neighborhood
export function boxesForNeighborhood(name) {
    if (!name) return [];
    return Object.entries(NEIGHBORHOOD_MAP)
        .filter(([box, n]) => n === name)
        .map(([box]) => Number(box));
}
