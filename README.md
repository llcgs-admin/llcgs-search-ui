Project Scope
This search interface is specifically designed for the Lincoln Oral History Project, a collection of OCR‑processed interview transcripts organized by neighborhood and box number. The search logic, UI structure, and viewer integration are optimized for long‑form narrative documents. Other LLCGS collections (such as cemetery records, marriage records, and probate indexes) will require their own tailored search interfaces, as their structure and metadata differ significantly from the oral history corpus.

A lightweight, volunteer‑friendly search interface for the Lincoln‑Lancaster County Genealogical Society (LLCGS).
This project provides a clean, fast, browser‑based way to search the society’s Lincoln Oral History Transcripts using whole‑word matching, Boolean logic, and clear PDF access.

🌿 Features
Search Engine
- Whole‑word matching (no substring false positives)
- Boolean operators:
- AND (implicit)
- OR groups using parentheses
- NOT for exclusions
- Phrase search using quotes
- Clean, readable result snippets
- Header showing the active search query and match count
PDF Viewer Integration
- Each result links directly to the corresponding PDF in Google Drive
- Viewer header displays:
- Document title
- Page number
- Return‑to‑search link
- Clear fallback behavior when Google Drive forces preview mode
UI / UX
- Color palette and typography matched to LLCGS.INFO
- Optional snippet toggle
- Parchment‑style favicon featuring the Nebraska State Capitol tower

📁 Repository Structure
/
|data/
|     ├── index.json          # File index generated from Google Drive IDs
├── index.html          # Main search UI
├── search.js           # Boolean parser, search logic, snippet builder
├── favicon.ico         # Multi-resolution favicon
├── favicon-32x32.png   # Modern browser icon
└── styles.css          # UI styling (if separate)



🔧 How It Works
- index.json is generated from the society’s Google Drive folder and contains:
  - File IDs
  - Titles
  - Page counts
  - Metadata
- search.js loads index.json and performs:
  - Tokenization
  - Boolean parsing
  - Whole‑word matching
  - Snippet extraction
- Results are displayed in index.html, with links to:
https://drive.google.com/file/d/<FILE_ID>/view
- The viewer page reads URL parameters to display:
  - Title
  - Page number
  - Return link

🚀 Deployment
This project is hosted using GitHub Pages.
To deploy updates:
- Commit changes to the main branch
- Push to GitHub
- GitHub Pages automatically serves the updated site at:
https://<username>.github.io/<repository>/


If index.json changes (e.g., new PDFs added), simply update the file and redeploy.

🖼 Favicon
The favicon is a custom‑designed 64×64 icon featuring a simplified silhouette of the Nebraska State Capitol tower, bordered in muted gold on a parchment background.
Files included:
- favicon.ico (multi‑resolution)
- favicon-32x32.png
These are referenced in index.html:
<link rel="icon" type="image/png" href="favicon-32x32.png">
<link rel="shortcut icon" href="favicon.ico">



🤝 Contributing
This project is designed to be volunteer‑friendly.
If you’d like to help improve the search engine, UI, or indexing workflow, feel free to open an issue or submit a pull request.

📜 License
This project is maintained by the Lincoln‑Lancaster County Genealogical Society.
Please contact LLCGS for permissions regarding reuse or redistribution.
