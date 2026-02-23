Python Environment Setup (Portable SSD)
This document describes how to set up and use the portable Python environment used for building and maintaining the metadata indexes that power the LLCGS Oral History Search Interface. The environment is designed to run entirely from an external SSD so that volunteers can use the indexing tools on any Windows machine without installing system‑wide dependencies.

Goals of This Environment
- Provide a self‑contained Python toolchain for indexing
- Ensure reproducibility across different machines
- Avoid modifying or depending on the host computer
- Keep all scripts, dependencies, and outputs on the SSD
- Support long‑term stewardship as new metadata and audio files are added
This environment is used only for index generation and metadata processing, not for running the web interface.

1. Folder Structure on the SSD
A typical layout looks like:
LLCGS_Indexer/
    venv/                 # Portable Python virtual environment
    scripts/              # Indexing scripts (Python)
    work/
        pdf/              # OCR'd PDFs (input)
        text/             # Extracted text files (output)
    index.json            # Search index (output)
    audio/                # Audio metadata and planning (dev branch)


Everything needed for indexing lives inside this directory.

2. Creating the Virtual Environment
These steps only need to be done once per SSD.
Open PowerShell and navigate to the SSD:
cd E:\LLCGS_Indexer


Create the virtual environment:
python -m venv venv


Activate it:
.\venv\Scripts\activate


Your prompt should now show:
(venv) E:\LLCGS_Indexer>


This confirms you are using the portable Python installation.

3. Installing Required Libraries
With the environment active:
pip install pypdf tqdm chardet


These libraries support:
- PDF text extraction
- progress bars
- character encoding detection
Additional libraries may be added as the indexing pipeline evolves.

4. Running the Indexing Scripts
All indexing scripts live in:
/scripts/


Run them from the root of the SSD:
python scripts/build_index.py
python scripts/add_audio_id.py


Each script documents:
- its purpose
- its inputs
- its outputs
- any assumptions about folder structure

5. Updating the Environment
If new scripts require new libraries:
- Activate the venv
- Install the new dependency
- Commit the updated requirements.txt (if used)
Example:
pip install openpyxl
pip freeze > requirements.txt


This ensures future volunteers can recreate the environment.

6. Notes for Volunteers
- Always activate the venv before running scripts
- Never run indexing scripts from the host machine’s Python
- Do not manually edit index.json unless absolutely necessary
- Commit changes to the dev branch first
- Merge into main only after testing
- Keep the SSD folder structure intact
- If the SSD is moved to a new machine, simply activate the venv again

7. Future Enhancements
- Add a requirements.txt for dependency tracking
- Add a Makefile or PowerShell wrapper for common tasks
- Add scripts for merging audio metadata from spreadsheets
- Add validation scripts for Google Drive IDs
- Add automated tests for index integrity

8. Contact
For questions about the indexing environment or metadata pipeline, refer to the project documentation or contact the LLCGS technical steward.
