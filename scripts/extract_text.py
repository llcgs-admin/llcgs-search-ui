import PyPDF2
from pathlib import Path
from tqdm import tqdm

from utils import (
    load_config,
    resolve_path,
    list_files,
)


def extract_pdf_to_text(pdf_path):
    """Extract text from each page and join with form-feed markers."""
    reader = PyPDF2.PdfReader(str(pdf_path))
    pages = []

    for page in reader.pages:
        try:
            text = page.extract_text() or ""
        except Exception as e:
            text = f"[Error extracting page: {e}]"
        pages.append(text)

    # Insert form-feed between pages so the indexer can split accurately
    return "\f".join(pages)


def main():
    config = load_config()

    pdf_folder = resolve_path(__file__, config["pdf_folder"])
    text_folder = resolve_path(__file__, config["text_folder"])

    pdf_files = list_files(pdf_folder, extensions=[".pdf"])

    print(f"Extracting text from {len(pdf_files)} PDFs...")

    for pdf_path in tqdm(pdf_files, desc="Extracting"):
        rel_path = pdf_path.relative_to(pdf_folder)
        out_path = text_folder / rel_path.with_suffix(".txt")

        out_path.parent.mkdir(parents=True, exist_ok=True)

        if out_path.exists():
            continue

        try:
            full_text = extract_pdf_to_text(pdf_path)
            out_path.write_text(full_text, encoding="utf-8")
        except Exception as e:
            print(f"Error extracting {pdf_path}: {e}")

    print("Text extraction complete.")


if __name__ == "__main__":
    main()