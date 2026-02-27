import json
import re
from pathlib import Path
from tqdm import tqdm

def load_config():
    with open("config.json", "r", encoding="utf-8") as f:
        return json.load(f)

def load_pdf_map():
    with open("pdf_map.json", "r", encoding="utf-8") as f:
        return json.load(f)

def tokenize(text, min_length=3):
    tokens = re.findall(r"[A-Za-z0-9]+", text.lower())
    return [t for t in tokens if len(t) >= min_length]

def main():
    config = load_config()
    pdf_map = load_pdf_map()

    text_folder = Path(config["text_folder"])
    pdf_folder = Path(config["pdf_ocr_folder"])
    index_folder = Path(config["index_folder"])
    dist_folder = Path(config["dist_folder"])

    index_folder.mkdir(parents=True, exist_ok=True)
    dist_folder.mkdir(parents=True, exist_ok=True)

    text_files = list(text_folder.rglob("*.txt"))

    if not text_files:
        print("No text files found in", text_folder)
        return

    documents = {}
    tokens = {}

    print(f"Building index from {len(text_files)} documents...")

    for text_file in tqdm(text_files):
        doc_id = text_file.stem
        raw = text_file.read_text(encoding="utf-8")

        # Parse JSON with full_text + pages
        try:
            data = json.loads(raw)
            full_text = data.get("full_text", "")
            pages = data.get("pages", [])
        except json.JSONDecodeError:
            full_text = raw
            pages = [raw]

        # Find PDF path
        pdf_path_obj = next(pdf_folder.rglob(f"{doc_id}.pdf"), None)
        pdf_path = str(pdf_path_obj).replace("\\", "/") if pdf_path_obj else ""

        # Determine box name
        box_name = pdf_path_obj.parent.name if pdf_path_obj else "Unknown"

        # Attach file_id from pdf_map
        file_id = pdf_map.get(pdf_path, None)

        # Build document record
        documents[doc_id] = {
            "title": doc_id,
            "box": box_name,
            "pdf_path": pdf_path,
            "file_id": file_id,
            "text": full_text,
            "pages": pages
        }

        # Tokenization (optional for now)
        token_list = tokenize(
            full_text,
            min_length=config.get("token_min_length", 3)
        )

        for token in token_list:
            if token not in tokens:
                tokens[token] = {}
            tokens[token][doc_id] = tokens[token].get(doc_id, 0) + 1

    # FINAL OUTPUT: ONLY DOCUMENTS (flat dictionary)
    output_path = index_folder / "index.json"
    output_path.write_text(json.dumps(documents, indent=2, ensure_ascii=False), encoding="utf-8")

    dist_output = dist_folder / "index.json"
    dist_output.write_text(json.dumps(documents, ensure_ascii=False), encoding="utf-8")

    print("Index built successfully.")
    print("Output written to:")
    print(" -", output_path)
    print(" -", dist_output)

if __name__ == "__main__":
    main()