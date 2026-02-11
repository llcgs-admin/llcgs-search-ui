import { API_BASE } from './config.js';

let INDEX = null;

/************************************************************
 * NEIGHBORHOOD MAP
 ************************************************************/
const NEIGHBORHOOD_MAP = {
  "Box01": "Near South",
  "Box02": "Yankee Hill",
  "Box03": "South Salt Creek",
  "Box04": "North Bottoms",
  "Box05": "University Place",
  "Box06": "University Place",
  "Box07": "College View",
  "Box08": "College View",
  "Box09": "East Campus",
  "Box10": "East Campus"
};

/************************************************************
 * POPULATE NEIGHBORHOOD DROPDOWN
 ************************************************************/
function populateNeighborhoodDropdown() {
  const select = document.getElementById('neighborhoodFilter');
  if (!select) return;

  const neighborhoods = [...new Set(Object.values(NEIGHBORHOOD_MAP))];
  neighborhoods.sort().forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    select.appendChild(opt);
  });
}

/************************************************************
 * LOAD INDEX
 ************************************************************/
async function loadIndex() {
  try {
    const response = await fetch('data/index.json');
    if (!response.ok) throw new Error(`Failed to load index.json: ${response.status}`);

    const data = await response.json();
    console.log(`Index loaded (${Object.keys(data).length} records).`);

    return Object.values(data);

  } catch (err) {
    console.error('Error loading index.json:', err);
    alert('Unable to load the search index. Please try again later.');
    return [];
  }
}

/************************************************************
 * QUERY PARSER WITH OR GROUPS
 ************************************************************/
function parseQuery(raw) {
  const phrases = [];
  const terms = [];
  const excluded = [];
  const orGroups = [];

  let q = raw;

  // Extract OR groups inside parentheses
  const orRegex = /\(([^)]+)\)/g;
  let match;
  while ((match = orRegex.exec(raw)) !== null) {
    const inside = match[1];
    const parts = inside.split(/\s+OR\s+/i).map(s => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      orGroups.push(parts);
    }
    q = q.replace(match[0], ''); // remove OR group from main query
  }

  // Extract quoted phrases
  const phraseRegex = /"([^"]+)"/g;
  while ((match = phraseRegex.exec(q)) !== null) {
    phrases.push(match[1].trim());
  }
  q = q.replace(phraseRegex, '');

  // Remaining terms
  q.split(/\s+/).forEach(t => {
    if (!t) return;

    // Ignore bare OR tokens (outside parentheses)
    if (t.toUpperCase() === 'OR') return;

    if (t.startsWith('-"') && t.endsWith('"')) {
      excluded.push(t.slice(2, -1));
    } else if (t.startsWith('-')) {
      excluded.push(t.slice(1));
    } else {
      terms.push(t);
    }
  });

  return { phrases, terms, excluded, orGroups };
}

/************************************************************
 * SEARCH LOGIC
 ************************************************************/
function recordMatches(rec, parsed) {
  const hay = (rec.title + ' ' + rec.text).toLowerCase();

  // Must include all phrases
  for (const p of parsed.phrases) {
    if (!hay.includes(p.toLowerCase())) return false;
  }

  // Must include all standalone terms
  for (const t of parsed.terms) {
    if (!hay.includes(t.toLowerCase())) return false;
  }

  // Must satisfy each OR group
  for (const group of parsed.orGroups) {
    let ok = false;
    for (const g of group) {
      if (hay.includes(g.toLowerCase())) {
        ok = true;
        break;
      }
    }
    if (!ok) return false;
  }

  // Must NOT include excluded terms
  for (const ex of parsed.excluded) {
    if (hay.includes(ex.toLowerCase())) return false;
  }

  return true;
}

function searchIndex(rawQuery, neighborhoodFilter) {
  if (!INDEX) return [];

  const parsed = parseQuery(rawQuery);
  const q = rawQuery.trim();
  if (!q) return [];

  return INDEX.filter(rec => {
    const neighborhood = NEIGHBORHOOD_MAP[rec.box] || "Unknown";
    if (neighborhoodFilter && neighborhood !== neighborhoodFilter) return false;
    return recordMatches(rec, parsed);
  });
}

/************************************************************
 * SNIPPET HELPERS
 ************************************************************/
function findMatches(text, terms) {
  const matches = [];
  const lower = text.toLowerCase();

  terms.forEach(term => {
    const t = term.toLowerCase();
    let idx = lower.indexOf(t);
    while (idx !== -1) {
      matches.push({ index: idx, length: t.length });
      idx = lower.indexOf(t, idx + t.length);
    }
  });

  return matches.sort((a, b) => a.index - b.index);
}

function buildSnippet(text, match, radius = 80) {
  const start = Math.max(0, match.index - radius);
  const end = Math.min(text.length, match.index + match.length + radius);

  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = "…" + snippet;
  if (end < text.length) snippet = snippet + "…";

  return snippet;
}

function highlightTerms(text, terms) {
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  return text.replace(regex, m => `<mark>${m}</mark>`);
}

/************************************************************
 * RENDER RESULTS
 ************************************************************/
function renderResults(results, elapsedMs) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'result-header';
  header.textContent = `Found ${results.length} results in ${elapsedMs} ms`;
  container.appendChild(header);

  if (!results.length) return;

  const rawQuery = document.getElementById('query').value.trim();
  const parsed = parseQuery(rawQuery);
  const allTerms = [...parsed.terms, ...parsed.phrases, ...parsed.orGroups.flat()];

  for (const rec of results) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result';

    /******** TITLE ********/
    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = rec.title;
    resultDiv.appendChild(title);

    /******** PAGE-GROUPED SNIPPETS ********/
    const pageGroups = [];

    rec.pages.forEach((pageText, idx) => {
      const matches = findMatches(pageText, allTerms);
      if (matches.length === 0) return;

      const snippets = matches.map(m => {
        let sn = buildSnippet(pageText, m);
        sn = highlightTerms(sn, allTerms);
        return sn;
      });

      pageGroups.push({
        page: idx + 1,
        snippets
      });
    });

    const snippetContainer = document.createElement('div');
    snippetContainer
