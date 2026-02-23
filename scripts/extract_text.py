import json
from pathlib import Path
from pypdf import PdfReader
from tqdm import tqdm

def load_config():
    with open("config.json", "r", encoding="utf-8") as f:
        return json.load(f)

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    pages = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or "")
        except Exception as e:
            pages.append(f"[Error extracting page: {e}]")
    full_text = "\n".join(pages)
    return {
        "full_text": full_text,
        "pages": pages
    }

def main():
    config = load_config()

    pdf_folder = Path(config["pdf_ocr_folder"])
    text_folder = Path(config["text_folder"])

    text_folder.mkdir(parents=True, exist_ok=True)

    pdf_files = list(pdf_folder.rglob("*.pdf"))

    if not pdf_files:
        print("No PDFs found in", pdf_folder)
        return

    print(f"Found {len(pdf_files)} PDFs across all subfolders. Extracting text...")

    for pdf_file in tqdm(pdf_files):
        doc_id = pdf_file.stem
        output_file = text_folder / f"{doc_id}.txt"

        # Skip if already extracted
        if output_file.exists():
            continue

        data = extract_text_from_pdf(pdf_file)

        # Store as JSON so we keep per-page text
        output_file.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

    print("Text extraction complete.")

if __name__ == "__main__":
    main()
