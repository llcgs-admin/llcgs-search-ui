Python Environment and Indexing Pipeline Guide
This document describes how to set up the Python environment, run the indexing scripts, and understand how data flows through the system. It is written for future volunteers as well as for maintainers working on the indexing pipeline.

1. Overview
The indexing pipeline generates the JSON files used by the LLCGS Local Oral History Search Interface. It produces two categories of output:
- Human‑readable JSON stored in work/
- Minified UI‑ready JSON stored in dist/
All scripts use a shared configuration file (scripts/config.json) to locate source PDFs, OCR text, and output folders.
The Python environment lives outside the GitHub repo to keep the repository clean and portable.

2. Directory Layout
The environment assumes the following structure on the external SSD:
D:/
├── llcgs-loh/                  ← GitHub clone (main + dev)
│   ├── dist/                   ← UI-ready JSON (minified)
│   ├── work/                   ← Human-readable JSON (authoritative)
│   ├── scripts/                ← Python indexing pipeline
│   └── search.html/js/css      ← UI
│
├── venv/                       ← Python virtual environment
│
├── source_pdfs/                ← Original PDFs (not in repo)
├── source_text/                ← OCR text files (not in repo)
└── audio_test/                 ← Local MP3s for dev testing


The scripts in llcgs-loh/scripts/ reference these folders using relative paths defined in config.json.

3. Creating the Virtual Environment
Run these commands from the root of the SSD (D:/) or any folder you prefer, as long as the venv ends up at D:/venv/.
Windows (PowerShell)
python -m venv D:\venv


Activate the environment
D:\venv\Scripts\activate


When active, your prompt will show (venv).

4. Installing Dependencies
With the environment active:
pip install -r D:\llcgs-loh\scripts\requirements.txt


If requirements.txt does not yet exist, create it by freezing the current environment:
pip freeze > D:\llcgs-loh\scripts\requirements.txt


This ensures reproducibility for future volunteers.

5. Configuration File
All scripts read paths from:
llcgs-loh/scripts/config.json


A typical configuration looks like:
{
  "pdf_folder": "../../source_pdfs",
  "text_folder": "../../source_text",
  "index_output": "../work/index/index.json",
  "pdf_map_output": "../work/pdf_map/pdf_map.json",
  "dist_index_output": "../dist/index.json",
  "dist_pdf_map_output": "../dist/pdf_map.json"
}


Paths are relative to the scripts/ folder.

6. Running the Pipeline
Option A — Run scripts individually
Generate the human‑readable index:
python build_index.py


Generate the full PDF map:
python build_pdf_map.py


Generate audio metadata (future):
python add_audio_id.py


Option B — Run the entire pipeline
If sync_all.py is present:
python sync_all.py


This script:
- Loads config.json
- Builds the authoritative JSON in work/
- Builds the minified JSON in dist/
- Ensures the UI sees the latest data

7. JSON Flow Through the System
The pipeline produces two parallel outputs:
Human‑readable (authoritative)
llcgs-loh/work/index/index.json
llcgs-loh/work/pdf_map/pdf_map.json


These files are:
- Pretty‑printed
- Full‑fidelity
- Intended for debugging, auditing, and long‑term preservation
UI‑ready (minified)
llcgs-loh/dist/index.json
llcgs-loh/dist/pdf_map.json


These files are:
- Minified
- Reduced (for PDF map)
- Loaded directly by the UI
- Served by GitHub Pages
GitHub Desktop tracks only the llcgs-loh/ folder, so committing updated JSON automatically updates the live site.

8. Updating Dependencies
When adding new Python packages:
- Activate the venv
- Install the package
- Update requirements.txt
Example:
pip install PyPDF2
pip freeze > D:\llcgs-loh\scripts\requirements.txt


This keeps the environment reproducible for future contributors.

9. Troubleshooting
- Scripts can’t find PDFs or text files
Check that config.json paths are correct relative to scripts/.
- JSON not updating in the UI
Ensure the minified files in dist/ were regenerated and committed.
- Virtual environment not activating
PowerShell may require:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
- GitHub Desktop shows venv changes
The venv must live outside the repo (as shown above).


Updating requirements.txt
Keeping requirements.txt current ensures that every volunteer can recreate the same Python environment and run the indexing pipeline without surprises. Any time a script begins using a new library—or stops using one—this file should be updated.
When to update it
- A script imports a new library (for example, import PyPDF2).
- You remove a library from the codebase.
- You upgrade packages in the virtual environment.
- You want to ensure the environment is reproducible for new volunteers.
How to update it
- Activate the virtual environment
D:\venv\Scripts\activate
- Install or remove packages as needed
Example:
pip install PyPDF2
- Regenerate requirements.txt
Run this from anywhere while the venv is active:
pip freeze > D:\llcgs-loh\scripts\requirements.txt
- Commit the updated file
GitHub Desktop will show the change inside llcgs-loh/scripts/.
Commit and push so all volunteers stay in sync.
What this accomplishes
- Ensures every contributor uses the same versions.
- Prevents “works on my machine” errors.
- Keeps the indexing pipeline predictable and stable.
- Makes onboarding new volunteers straightforward.
Common pitfalls to avoid
- Do not place requirements.txt inside the venv.
- Do not manually edit version numbers unless you know why.
- Do not commit the venv/ folder—only the requirements file.
- Do not forget to regenerate the file after installing new packages

Updating the Pipeline Scripts Safely
The indexing pipeline powers the JSON files used by the search interface. Because the UI depends on specific paths, field names, and output formats, changes to the Python scripts must be made carefully. This section explains how to update the scripts without breaking the UI or the reproducibility of the project.
When to update the scripts
- You need to add new metadata fields to the index or PDF map.
- You want to improve performance or readability.
- You are fixing a bug in the extraction or normalization logic.
- You are adding support for new data types (e.g., audio metadata).
Core principles
- Never hardcode paths. All file locations must come from config.json.
- Preserve JSON structure. The UI expects specific keys and formats.
- Keep pretty and minified outputs in sync. Both must reflect the same data.
- Avoid breaking changes. If a field must change, update the UI and documentation at the same time.
- Keep scripts readable. Future volunteers should be able to understand the logic without deep Python knowledge.
Safe update workflow
- Activate the virtual environment
D:\venv\Scripts\activate
- Open the scripts in llcgs-loh/scripts/
Work only inside this folder so GitHub Desktop tracks your changes.
- Load configuration dynamically
Every script should begin by loading config.json and using its paths.
If you add new paths or settings, update both:
- config.json
- The script that reads it
- Test changes using the authoritative outputs
Run the script and inspect the files in:
llcgs-loh/work/index/index.json
llcgs-loh/work/pdf_map/pdf_map.json
- These should remain:
- Pretty‑printed
- Complete
- Human‑readable
- Verify the UI‑ready outputs
Ensure the minified versions in dist/ are:
- Valid JSON
- Synchronized with the pretty versions
- Free of unnecessary whitespace
- Open the UI locally
Load search.html in a browser and confirm:
- The UI loads without errors
- Search results appear correctly
- PDF links and metadata behave as expected
- Commit changes with a clear message
GitHub Desktop will show updates to:
- Python scripts
- JSON outputs
- Possibly config.json
- Use descriptive commit messages such as:
“Refactor build_pdf_map to use shared helpers; update config.json accordingly.”
What to avoid- Do not change JSON field names without updating the UI.
- Do not write directly into dist/ without also updating work/.
- Do not introduce new dependencies without updating requirements.txt.
- Do not run scripts from outside the scripts/ folder unless you understand how relative paths resolve.
- Do not commit the virtual environment or large source files.
Tips for maintainability- Keep functions small and focused.
- Add comments explaining non‑obvious logic.
- Use shared helper functions for repeated tasks (loading config, writing JSON).
- Keep error messages clear so volunteers can diagnose issues quickly.
- Prefer explicit, readable code over clever one‑liners.


Pipeline readiness checklist
This checklist helps ensure that the indexing pipeline will run cleanly and produce valid JSON for the UI. Volunteers should complete these steps before running sync_all.py.
Configuration and environment
- The virtual environment is activated using D:\venv\Scripts\activate.
- config.json contains the correct absolute paths for PDFs, OCR text, and all JSON outputs.
- requirements.txt is installed and up to date with the current environment.
- The llcgs-loh/scripts/ folder contains the full set of refactored scripts, including utils.py and validate_all.py.
Folder structure
- D:/source_pdfs/ contains the original PDFs.
- D:/source_text/ contains OCR text files, one per PDF.
- D:/llcgs-loh/work/index/ and D:/llcgs-loh/work/pdf_map/ exist and are writable.
- D:/llcgs-loh/dist/ exists and is writable.
Data completeness
- Every PDF in source_pdfs/ has a matching .txt file in source_text/.
- No orphan .txt files exist without a corresponding PDF.
- All PDFs open without errors.
- All text files are readable.
JSON output expectations
- Pretty JSON will be written to llcgs-loh/work/.
- Minified JSON will be written to llcgs-loh/dist/.
- The UI loads JSON only from dist/.
Validation step
- python validate_all.py runs without errors.
- All [OK] checks pass.
- No [ERROR] messages appear for paths, readability, or data completeness.
Final confirmation
- GitHub Desktop shows no unexpected changes.
- The volunteer understands that sync_all.py will:
- regenerate all OCR text (if needed),
- rebuild the index,
- rebuild the PDF map,
- update the UI‑ready JSON in dist/.


Running the pipeline during normal development
Volunteers follow a short, repeatable sequence whenever new PDFs, new OCR text, or updated metadata need to be incorporated into the search interface. The goal is to ensure that the authoritative JSON in work/ and the UI‑ready JSON in dist/ stay synchronized and valid.
Environment setup
- Activate the virtual environment using D:\venv\Scripts\activate.
- Confirm that llcgs-loh/scripts/requirements.txt is installed and up to date.
- Ensure that config.json contains the correct absolute paths for all inputs and outputs.
Preparing source data
- Place new PDFs into D:/source_pdfs/.
- Place matching OCR text files into D:/source_text/.
- Confirm that filenames match exactly (e.g., Smith_Interview.pdf → Smith_Interview.txt).
Validating readiness
- Run python validate_all.py from inside llcgs-loh/scripts/.
- Confirm that all [OK] checks pass for:
- folder existence,
- folder writability,
- PDF/text completeness,
- file readability.
- Resolve any [ERROR] messages before continuing.
Running the pipeline
- Execute python sync_all.py to run the full sequence:
- extract text (if needed),
- build the index,
- build the PDF map,
- update the UI‑ready JSON in dist/.
Reviewing results
- Inspect the updated JSON in llcgs-loh/work/ for readability and completeness.
- Confirm that the minified JSON in llcgs-loh/dist/ is present and valid.
- Open search.html in a browser to verify that the UI loads the new data without errors.
Committing changes
- Open GitHub Desktop and review the updated files in llcgs-loh/dist/.
- Commit with a clear message describing the update.
- Push to the appropriate branch (usually dev).

