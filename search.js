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

    const snippet = document.createElement('div');
    snippet.className = 'result-snippet';
    snippet.textContent = rec.text.slice(0, 200) + '…';
    resultDiv.appendChild(snippet);

    const link = document.createElement('a');
    link.href = `pdfviewer.html?id=${encodeURIComponent(rec.file_id)}`;
    link.textContent = 'Open PDF';
link.addEventListener('click', e => {
  e.preventDefault();

  const fileId = rec.file_id;
  const viewerUrl = `pdfviewer.html?id=${encodeURIComponent(fileId)}`;
  const driveUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  // Sizes
  const viewerWidth = 500;
  const viewerHeight = 200;
  const pdfWidth = 900;
  const pdfHeight = 700;

  // Centering
  const viewerLeft = (screen.width - viewerWidth) / 2;
  const viewerTop = (screen.height - viewerHeight) / 2;
  const pdfLeft = (screen.width - pdfWidth) / 2;
  const pdfTop = (screen.height - pdfHeight) / 2;

  // 1. Open viewer popup
  const viewerWin = window.open(
    viewerUrl,
    'viewerPopup',
    `width=${viewerWidth},height=${viewerHeight},left=${viewerLeft},top=${viewerTop},resizable=no`
  );

  // 2. Open PDF popup
  window.open(
    driveUrl,
    'pdfPopup',
    `width=${pdfWidth},height=${pdfHeight},left=${pdfLeft},top=${pdfTop},resizable=yes,scrollbars=yes`
  );

  // 3. Close viewer popup (after it loads)
  setTimeout(() => {
    if (viewerWin && !viewerWin.closed) {
      viewerWin.close();
    }
  }, 2500);
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
