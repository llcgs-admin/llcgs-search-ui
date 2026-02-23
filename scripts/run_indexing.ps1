<#
    run_indexing.ps1
    Wrapper for the LLCGS indexing pipeline.
    Run this from the root of the SSD environment.
#>

# Stop on errors
$ErrorActionPreference = "Stop"

Write-Host "=== LLCGS Indexing Pipeline ===" -ForegroundColor Cyan

# 1. Activate the virtual environment
Write-Host "Activating virtual environment..."
$venvPath = ".\venv\Scripts\Activate.ps1"

if (Test-Path $venvPath) {
    . $venvPath
    Write-Host "Virtual environment activated."
} else {
    Write-Host "ERROR: Could not find venv at $venvPath" -ForegroundColor Red
    exit 1
}

# 2. Run extract_text.py
Write-Host "Running extract_text.py..."
python scripts/extract_text.py
Write-Host "Text extraction complete.`n"

# 3. Run build_index.py
Write-Host "Running build_index.py..."
python scripts/build_index.py
Write-Host "Index build complete.`n"

# 4. Add audioId fields
Write-Host "Running Add_Audio_ID.py..."
python scripts/add_audio_id.py
Write-Host "Audio ID fields updated.`n"

Write-Host "=== Indexing pipeline completed successfully ===" -ForegroundColor Green
