import json
from pathlib import Path
import PyPDF2

CONFIG_FILE = "config.json"

def load_config():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def extract_pdf_to_json(pdf_path: Path, output_path: Path):
    pages = []
    full_text_parts = []

    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)

        for page in reader.pages:
            text = page.extract_text() or ""
            pages.append(text)
            full_text_parts.append(text)

    data = {
        "full_text": "\n".join(full_text_parts),
        "pages": pages
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    config = load_config()

    pdf_folder = Path(config["pdf_folder"]).resolve()
    text_folder = Path(config["text_folder"]).resolve()

    text_folder.mkdir(parents=True, exist_ok=True)
    
    print(pdf_folder)

    for pdf_file in pdf_folder.rglob("*.pdf"):
        base = pdf_file.stem
        output_file = text_folder / f"{base}.json"

        print(f"Extracting {pdf_file.name} → {output_file.name}")
        extract_pdf_to_json(pdf_file, output_file)

    print("Extraction complete.")

if __name__ == "__main__":
    main()