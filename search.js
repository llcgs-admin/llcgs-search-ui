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
 * STRICT WHOLE-WORD MATCHING
 ************************************************************/
function makeWordRegex(term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`, "gi");
}

/************************************************************
 * QUERY PARSER WITH ROBUST OR GROUPS
 ************************************************************/
function parseQuery(raw) {
  const phrases = [];
  const terms = [];
  const excluded = [];
  const orGroups = [];

  let q = raw;

  // Extract parentheses groups
  const parenRegex = /\(([^)]+)\)/g;
  let match;
  const groupsToRemove = [];

  while ((match = parenRegex.exec(raw)) !== null) {
    const inside = match[1].trim();

    if (/\bOR\b/i.test(inside)) {
      const parts = inside
        .split(/OR/i)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (parts.length > 1) {
        orGroups.push(parts);
        groupsToRemove.push(match[0]);
      }
    }
  }

  // Remove OR groups AFTER phrase extraction
  groupsToRemove.forEach(g => {
    q = q.replace(g, " ");
  });

  // Extract quoted phrases
  const phraseRegex = /"([^"]+)"/g;
  while ((match = phraseRegex.exec(q)) !== null) {
    phrases.push(match[1].trim());
  }
  q = q.replace(phraseRegex, '');

  // Remaining terms
  q.split(/\s+/).forEach(t => {
    if (!t) return;

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
 * SEARCH LOGIC — STRICT WHOLE-WORD BOOLEAN MATCHING
 ************************************************************/
function recordMatches(rec, parsed) {
  const hay = (rec.title + ' ' + rec.text).toLowerCase();

  // Phrases (substring OK)
  for (const p of parsed.phrases) {
    if (!hay.includes(p.toLowerCase())) return false;
  }

  // Standalone terms (whole-word only)
  for (const t of parsed.terms) {
    const r = makeWordRegex(t);
    if (!r.test(hay)) return false;
  }

  // OR groups (at least one term must match whole-word)
  for (const group of parsed.orGroups) {
    let ok = false;
    for (const g of group) {
      const r = makeWordRegex(g);
      if (r.test(hay)) {
        ok = true;
        break;
      }
    }
    if (!ok) return false;
  }

  // Excluded terms (whole-word)
  for (const ex of parsed.excluded) {
    const r = makeWordRegex(ex);
    if (r.test(hay)) return false;
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
 * SNIPPET HELPERS — FIXED MATCH LENGTH
 ************************************************************/
function findMatches(text, terms) {
  const matches = [];
  const lower = text.toLowerCase();

  terms.forEach(term => {
    const r = makeWordRegex(term);
    let match;
    while ((match = r.exec(lower)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length
      });
      r.lastIndex = match.index + match[0].length;
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
  if (!terms.length) return text;

  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(?<![A-Za-z])(${escaped.join("|")})(?![A-Za-z])`, "gi");

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

    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = rec.title;
    resultDiv.appendChild(title);

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
    snippetContainer.className = 'snippet-container';

    const totalSnippets = pageGroups.reduce(
      (sum, pg) => sum + pg.snippets.length,
      0
    );
    let showingAll = false;

    pageGroups.forEach((pg, i) => {
      const pageHeader = document.createElement('div');
      pageHeader.className = 'page-header';
      pageHeader.textContent = `Page ${pg.page} (${pg.snippets.length} matches)`;

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = i === 0 ? '▼' : '▶';
      pageHeader.prepend(arrow);

      const pageBlock = document.createElement('div');
      pageBlock.className = 'page-block';
      pageBlock.style.display = i === 0 ? 'block' : 'none';

      pageHeader.addEventListener('click', () => {
        const open = pageBlock.style.display === 'block';
        pageBlock.style.display = open ? 'none' : 'block';
        arrow.textContent = open ? '▶' : '▼';
      });

      pg.snippets.forEach(sn => {
        const snDiv = document.createElement('div');
        snDiv.className = 'snippet';
        snDiv.innerHTML = sn;
        pageBlock.appendChild(snDiv);
      });

      snippetContainer.appendChild(pageHeader);
      snippetContainer.appendChild(pageBlock);
    });

    resultDiv.appendChild(snippetContainer);

    if (totalSnippets > 3) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'snippet-toggle';
      toggleBtn.textContent = 'Show all snippets';

      toggleBtn.addEventListener('click', () => {
        showingAll = !showingAll;

        const blocks = snippetContainer.querySelectorAll('.page-block');
        blocks.forEach(block => {
          block.style.display = showingAll ? 'block' : 'none';
        });

        const arrows = snippetContainer.querySelectorAll('.arrow');
        arrows.forEach(a => {
          a.textContent = showingAll ? '▼' : '▶';
        });

        toggleBtn.textContent = showingAll
          ? 'Show fewer snippets'
          : 'Show all snippets';
      });

      resultDiv.appendChild(toggleBtn);
    }

    const link = document.createElement('a');
    link.href = `pdfviewer.html?id=${encodeURIComponent(rec.file_id)}`;
    link.textContent = 'Open PDF';

    link.addEventListener('click', e => {
      e.preventDefault();

      const fileId = rec.file_id;
      const viewerUrl = `pdfviewer.html?id=${encodeURIComponent(fileId)}`;

      const width = 900;
      const height = 700;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 2;

      const multi = document.getElementById('multiPopupToggle').checked;
      const windowName = multi ? '_blank' : 'pdfPopup';

      window.open(
        viewerUrl,
        windowName,
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
    });

    resultDiv.appendChild(link);

    container.appendChild(resultDiv);
  }
}

/************************************************************
 * EVENT HANDLERS
 ************************************************************/
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('query').value;
  const neighborhood =
    document.getElementById('neighborhoodFilter')?.value || null;

  const start = performance.now();
  const results = searchIndex(q, neighborhood);
  const elapsed = Math.round(performance.now() - start);

  renderResults(results, elapsed);
});

document.getElementById('query').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});

/************************************************************
 * INITIALIZE
 ************************************************************/
loadIndex().then(data => {
  INDEX = data;
  populateNeighborhoodDropdown();
});
