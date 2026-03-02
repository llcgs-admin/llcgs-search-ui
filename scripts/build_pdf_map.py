from pathlib import Path
from tqdm import tqdm
from PyPDF2 import PdfReader

from utils import (
    load_config,
    resolve_path,
    write_pretty_json,
    write_minified_json,
    list_files,
)


def build_pdf_record(pdf_path):
    """
    Build a single record for the PDF map.
    Can be expanded later with more metadata.
    """
    try:
        reader = PdfReader(str(pdf_path))
        page_count = len(reader.pages)
    except Exception:
        page_count = None

    return {
        "id": pdf_path.stem,
        "filename": pdf_path.name,
        "pages": page_count,
    }


def main():
    config = load_config()

    pdf_folder = resolve_path(__file__, config["pdf_folder"])
    output_pretty = resolve_path(__file__, config["pdf_map_output"])
    output_min = resolve_path(__file__, config["dist_pdf_map_output"])

    pdf_files = list_files(pdf_folder, extensions=[".pdf"])

    print(f"Building PDF map from {len(pdf_files)} PDFs...")

    pdf_records = []

    for pdf_path in tqdm(pdf_files, desc="PDF map"):
        record = build_pdf_record(pdf_path)
        pdf_records.append(record)

    pdf_map_data = {
        "pdfs": pdf_records,
        "count": len(pdf_records),
    }

    write_pretty_json(pdf_map_data, output_pretty)
    write_minified_json(pdf_map_data, output_min)

    print("PDF map build complete.")


if __name__ == "__main__":
    main()