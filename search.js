import { API_BASE } from './config.js';

let INDEX = null;

/************************************************************
 * LOAD INDEX FROM APPS SCRIPT
 ************************************************************/
async function loadIndex() {
  try {
    const response = await fetch('data/index.json');
    if (!response.ok) {
      throw new Error(`Failed to load index.json: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Loaded ${Object.keys(data).length} index records.`);
    return data;

  } catch (err) {
    console.error('Error loading index.json:', err);
    alert('Unable to load the search index. Please try again later.');
    return null;
  }
}

/************************************************************
 * SIMPLE SEARCH (we will enhance this later)
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
    const div = document.createElement('div');
    div.className = 'result';

    const title = document.createElement('div');
    title.textContent = rec.title;
    div.appendChild(title);

    const snippet = document.createElement('div');
    snippet.className = 'snippet';
    snippet.textContent = rec.text.slice(0, 200) + '…';
    div.appendChild(snippet);

    if (rec.file_id) {
      const link = document.createElement('a');
      link.className = 'open-link';
      link.textContent = 'Open PDF';
      link.href = `pdfviewer.html?id=${encodeURIComponent(rec.file_id)}`;
      link.target = '_blank';
      div.appendChild(link);
    }

    container.appendChild(div);
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

loadIndex();
