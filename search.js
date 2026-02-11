import { API_BASE } from './config.js';

let INDEX = null;

/************************************************************
 * LOAD INDEX (static JSON from GitHub Pages)
 ************************************************************/
async function loadIndex() {
  try {
    const response = await fetch('data/index.json');
    if (!response.ok) {
      throw new Error(`Failed to load index.json: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Index loaded (${Object.keys(data).length} records).`);

    // Convert object → array
    return Object.values(data);

  } catch (err) {
    console.error('Error loading index.json:', err);
    alert('Unable to load the search index. Please try again later.');
    return [];
  }
}

/************************************************************
 * SIMPLE SEARCH
 ************************************************************/
function searchIndex(query) {
  if (!INDEX) return [];

  const q = query.trim().toLowerCase();
  if (!q) return [];

  return INDEX.filter(rec => {
    const hay = (rec.title + ' ' + rec.text).toLowerCase();
    return hay.includes(q);
  });
}

/************************************************************
 * SNIPPET HELPERS
 ************************************************************/

// Find all match positions for the search terms
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

// Build centered snippets around each match
function buildSnippets(text, matches, radius = 80) {
  const snippets = [];

  for (const m of matches) {
    const start = Math.max(0, m.index - radius);
    const end = Math.min(text.length, m.index + m.length + radius);

    let snippet = text.slice(start, end).trim();

    if (start > 0) snippet = "…" + snippet;
    if (end < text.length) snippet = snippet + "…";

    snippets.push(snippet);
  }

  return snippets;
}

// Highlight matched terms
function highlightTerms(text, terms) {
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

/************************************************************
 * RENDER RESULTS
 ************************************************************/
function renderResults(results) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  if (!results.length) {
    container.textContent = 'No results.';
    return;
  }

  const query = document.getElementById('query').value.trim();
  const terms = query.split(/\s+/).filter(t => t.length > 0);

  for (const rec of results) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result';

    /******** TITLE ********/
    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = rec.title;
    resultDiv.appendChild(title);

    /******** SMART SNIPPETS ********/
    const matches = findMatches(rec.text, terms);
    let snippets = buildSnippets(rec.text, matches);

    // Highlight terms
    snippets = snippets.map(sn => highlightTerms(sn, terms));

    const snippetContainer = document.createElement('div');
    snippetContainer.className = 'snippet-container';

    const initial = snippets.slice(0, 3);
    initial.forEach(sn => {
      const snDiv = document.createElement('div');
      snDiv.className = 'snippet';
      snDiv.innerHTML = sn;
      snippetContainer.appendChild(snDiv);
    });

    resultDiv.appendChild(snippetContainer);

    // Toggle button
    if (snippets.length > 3) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'snippet-toggle';
      toggleBtn.textContent = 'Show all snippets';

      let expanded = false;

      toggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        snippetContainer.innerHTML = '';

        const toShow = expanded ? snippets : snippets.slice(0, 3);

        toShow.forEach(sn => {
          const snDiv = document.createElement('div');
          snDiv.className = 'snippet';
          snDiv.innerHTML = sn;
          snippetContainer.appendChild(snDiv);
        });

        toggleBtn.textContent = expanded ? 'Show fewer snippets' : 'Show all snippets';
      });

      resultDiv.appendChild(toggleBtn);
    }

    /******** OPEN PDF LINK ********/
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

      // Check toggle for multi-popup mode
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
  const results = searchIndex(q);
  renderResults(results);
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
});
