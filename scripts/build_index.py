import json
from pathlib import Path
import re

CONFIG_FILE = "config.json"

def load_config():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def tokenize(text):
    tokens = re.findall(r"\b[a-zA-Z0-9']+\b", text.lower())
    return tokens

def extract_snippets(pages, max_snippets=5):
    snippets = []
    for i, page in enumerate(pages):
        clean = " ".join(page.split())
        if clean:
            snippets.append({"page": i + 1, "text": clean[:300]})
        if len(snippets) >= max_snippets:
            break
    return snippets

def main():
    config = load_config()

    text_folder = Path(config["text_folder"]).resolve()
    index_folder = Path(config["index_folder"]).resolve()
    dist_folder = Path(config["dist_folder"]).resolve()

    index_folder.mkdir(parents=True, exist_ok=True)
    dist_folder.mkdir(parents=True, exist_ok=True)

    existing_index_path = index_folder / "index.json"
    if existing_index_path.exists():
        with open(existing_index_path, "r", encoding="utf-8") as f:
            existing_index = json.load(f)
    else:
        existing_index = {}

    new_index = {}

    for json_file in sorted(text_folder.glob("*.json")):
        record_id = json_file.stem

        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        full_text = data.get("full_text", "")
        pages = data.get("pages", [])

        record = {
            "id": record_id,
            "full_text": full_text,
            "pages": pages,
            "tokens": tokenize(full_text),
            "snippets": extract_snippets(pages)
        }

        if record_id in existing_index and "audioId" in existing_index[record_id]:
            record["audioId"] = existing_index[record_id]["audioId"]
        else:
            record["audioId"] = None

        new_index[record_id] = record

    with open(index_folder / "index.json", "w", encoding="utf-8") as f:
        json.dump(new_index, f, indent=2, ensure_ascii=False)

    with open(dist_folder / "index.json", "w", encoding="utf-8") as f:
        json.dump(new_index, f, separators=(",", ":"), ensure_ascii=False)

    print("Index build complete.")

if __name__ == "__main__":
    main()