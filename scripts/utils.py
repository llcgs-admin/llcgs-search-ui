import json
import os
from pathlib import Path


def load_config():
    """
    Load config.json from the scripts directory.
    Returns a dictionary with all configuration values.
    """
    script_dir = Path(__file__).parent
    config_path = script_dir / "config.json"

    if not config_path.exists():
        raise FileNotFoundError(f"Missing config.json at: {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def resolve_path(base_path, relative_path):
    """
    Resolve a path relative to the scripts directory.
    Ensures consistent behavior regardless of where the script is run from.
    """
    script_dir = Path(base_path).parent
    return (script_dir / relative_path).resolve()


def ensure_parent_folder(path):
    """
    Ensure the parent folder exists before writing output.
    """
    Path(path).parent.mkdir(parents=True, exist_ok=True)


def write_pretty_json(data, output_path):
    """
    Write human-readable JSON with indentation.
    Used for authoritative files in llcgs-loh/work/.
    """
    ensure_parent_folder(output_path)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def write_minified_json(data, output_path):
    """
    Write compact JSON for UI consumption.
    Used for llcgs-loh/dist/.
    """
    ensure_parent_folder(output_path)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"), ensure_ascii=False)


def load_json(path):
    """
    Load a JSON file from disk.
    """
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def list_files(folder, extensions=None):
    """
    Return a list of files in a folder, optionally filtered by extension.
    extensions: list like [".pdf", ".txt"]
    """
    folder = Path(folder)
    if not folder.exists():
        return []

    if extensions is None:
        return [p for p in folder.iterdir() if p.is_file()]

    return [p for p in folder.iterdir() if p.suffix.lower() in extensions]