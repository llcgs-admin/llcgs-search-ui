import os
from pathlib import Path
from tqdm import tqdm
from PyPDF2 import PdfReader

from utils import load_config, resolve_path, ensure_parent_folder


def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF using PyPDF2.
    Returns a single string containing all pages.
    """
    try:
        reader = PdfReader(str(pdf_path))
    except Exception as e:
        print(f"Error opening {pdf_path.name}: {e}")
        return ""

    text_chunks = []
    for page in reader.pages:
        try:
            text_chunks.append(page.extract_text() or "")
        except Exception:
            text_chunks.append("")

    return "\n".join(text_chunks)


def main():
    config = load_config()

    pdf_folder = resolve_path(__file__, config["pdf_folder"])
    text_folder = resolve_path(__file__, config["text_folder"])

    ensure_parent_folder(text_folder)

    pdf_files = [p for p in Path(pdf_folder).iterdir() if p.suffix.lower() == ".pdf"]

    print(f"Extracting text from {len(pdf_files)} PDFs...")

    for pdf_path in tqdm(pdf_files, desc="Extracting"):
        output_path = Path(text_folder) / (pdf_path.stem + ".txt")

        text = extract_text_from_pdf(pdf_path)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)

    print("Text extraction complete.")


if __name__ == "__main__":
    main()