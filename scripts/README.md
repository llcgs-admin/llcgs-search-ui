Scripts for Indexing and Metadata Management
This directory contains the Python scripts used to build, update, and maintain the metadata indexes that power the LLCGS Oral History Search Interface. These scripts are part of the reproducible indexing pipeline and ensure that future volunteers can regenerate or update the index files as the collection grows.
The scripts here apply specifically to the Lincoln Oral History Project. Other LLCGS datasets (cemetery records, marriage records, probate indexes, etc.) will require their own indexing scripts and metadata models.

Purpose of This Directory
The goal of /scripts/ is to:
- document the indexing workflow
- preserve the logic used to generate index.json
- provide tools for updating metadata as digitization continues
- ensure long‑term reproducibility and transparency
- support future volunteers who may not have context for earlier decisions
Only scripts that are part of the official indexing pipeline belong here.
One‑off experiments or personal utilities should remain local.

Current Scripts
1. add_audio_id.py
Adds an "audioId": null field to every entry in index.json if it does not already exist.
This prepares the index for future audio integration without altering existing metadata.
Inputs:
- index.json (existing transcript index)
Outputs:
- updated index.json with "audioId": null added where missing
Usage:
python add_audio_id.py



Future Scripts (Planned)
These scripts will be added as the audio digitization and metadata accumulation progress.
2. merge_audio_metadata.py (planned)
Will merge fields from the audio metadata spreadsheet into the main index.
Expected fields may include:
- audio Drive file ID
- interviewee name
- recording date
- duration
- transcript/audio linkage
3. validate_drive_links.py (planned)
Will check that all Drive file IDs in the index:
- exist
- are accessible
- have the correct MIME type
- match expected naming conventions
4. build_audio_index.py (planned)
Will generate a standalone audio-index.json if needed for future UI features.

Workflow Overview
- Digitization
Audio files are digitized from cassette tape and uploaded to Google Drive.
- Metadata Accumulation
Metadata is maintained in a spreadsheet and updated as new audio becomes available.
- Index Updating
Scripts in this directory are used to:
- add new fields
- merge metadata
- validate Drive IDs
- regenerate the index
- Search Engine Integration
The updated index.json is committed to the dev branch for testing.
- Deployment
Once stable, changes are merged into main and deployed via GitHub Pages.

Notes for Future Volunteers
- The indexing pipeline is evolving as new audio files and metadata become available.
- Always run scripts in this directory from the repository root unless otherwise noted.
- Do not manually edit index.json unless absolutely necessary; use scripts instead.
- Commit changes to the dev branch first, then merge into main after testing.
- If you add a new script, document it in this README.

Contact
For questions about the indexing pipeline or metadata structure, refer to the project documentation or contact the LLCGS technical steward.
