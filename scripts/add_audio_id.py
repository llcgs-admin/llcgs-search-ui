import json
from pathlib import Path

CONFIG_FILE = "config.json"
INDEX_FILENAME = "index.json"

def load_config():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def update_index(path: Path, minify: bool = False):
    if not path.exists():
        raise FileNotFoundError(f"index.json not found at: {path}")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    for key, record in data.items():
        # Only add audioId if missing entirely
        if "audioId" not in record:
            record["audioId"] = None
            updated += 1

    with open(path, "w", encoding="utf-8") as f:
        if minify:
            json.dump(data, f, separators=(",", ":"), ensure_ascii=False)
        else:
            json.dump(data, f, indent=2, ensure_ascii=False)

    return updated

def main():
    config = load_config()

    work_index_path = Path(config["index_folder"]) / INDEX_FILENAME
    dist_index_path = Path(config["dist_folder"]) / INDEX_FILENAME

    print("Updating work/index/index.json...")
    updated_work = update_index(work_index_path, minify=False)
    print(f"  → {updated_work} records updated")

    print("Updating dist/index.json (minified)...")
    updated_dist = update_index(dist_index_path, minify=True)
    print(f"  → {updated_dist} records updated")

    print("\nAudio ID fields added successfully to both index files.")

if __name__ == "__main__":
    main()