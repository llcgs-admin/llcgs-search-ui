import { API_BASE } from './config.js';
let indexData = null;
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
    console.log(`Index loaded (${Object.keys(data).length} records).`);
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
   // Create "Open PDF" link
const link = document.createElement('a');
link.href = `pdfviewer.html?id=${encodeURIComponent(rec.file_id)}`;
link.textContent = 'Open PDF';

// Inline viewer container
const viewer = document.createElement('div');
viewer.className = 'pdf-inline-viewer';
viewer.id = `viewer-${rec.file_id}`;
viewer.innerHTML = `
  <iframe class="pdf-frame"></iframe>
`;

// Toggle inline viewer
link.addEventListener('click', e => {
  e.preventDefault();

  const iframe = viewer.querySelector('.pdf-frame');

  if (!viewer.dataset.loaded) {
    iframe.src = `https://drive.google.com/file/d/${rec.file_id}/preview`;
    viewer.dataset.loaded = "true";
  }

  viewer.style.display =
    viewer.style.display === 'none' ? 'block' : 'none';

  if (viewer.style.display === 'block') {
    viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Append to result block
resultDiv.appendChild(link);
resultDiv.appendChild(viewer);
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
 * INITIALIZE INDEX
 ************************************************************/
loadIndex().then(data => {
  INDEX = Object.values(data);
});

