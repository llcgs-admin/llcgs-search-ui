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
 * RENDER RESULTS
 ************************************************************/
function renderResults(results) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  if (!results.length) {
    container.textContent = 'No results.';
    return;
  }

  for (const rec of results) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result';

    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = rec.title;
    resultDiv.appendChild(title);

// Snippet container
// Snippet container
const snippetContainer = document.createElement('div');
snippetContainer.className = 'snippet-container';

// Build a snippets array from either rec.snippets or rec.text
let snippets = [];

if (Array.isArray(rec.snippets) && rec.snippets.length > 0) {
  // Future-friendly: if you later add real snippet arrays to the index
  snippets = rec.snippets;
} else if (rec.text) {
  // Fallback: derive pseudo-snippets from the full text
  const chunkSize = 200;
  for (let i = 0; i < rec.text.length; i += chunkSize) {
    snippets.push(rec.text.slice(i, i + chunkSize));
    if (snippets.length >= 10) break; // safety cap
  }
}

// If somehow still no snippets, bail out gracefully
if (!snippets.length) {
  const snDiv = document.createElement('div');
  snDiv.className = 'snippet';
  snDiv.textContent = '(No snippet available)';
  snippetContainer.appendChild(snDiv);
  resultDiv.appendChild(snippetContainer);
} else {
  // Show first 3 snippets
  const initialSnippets = snippets.slice(0, 3);

  initialSnippets.forEach(sn => {
    const snDiv = document.createElement('div');
    snDiv.className = 'snippet';
    snDiv.textContent = sn + '…';
    snippetContainer.appendChild(snDiv);
  });

  resultDiv.appendChild(snippetContainer);

  // Toggle button if more than 3
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
        snDiv.textContent = sn + '…';
        snippetContainer.appendChild(snDiv);
      });

      toggleBtn.textContent = expanded ? 'Show fewer snippets' : 'Show all snippets';
    });

    resultDiv.appendChild(toggleBtn);
  }
}
resultDiv.appendChild(snippetContainer);

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
  } // <-- closes the for-loop
} // <-- closes renderResults()
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
