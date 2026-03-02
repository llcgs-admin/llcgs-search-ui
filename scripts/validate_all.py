import os
from pathlib import Path
from utils import load_config


def check_exists(label, path_str, must_be_dir=False):
    path = Path(path_str)
    if not path.exists():
        print(f"[ERROR] {label} does not exist: {path}")
        return False
    if must_be_dir and not path.is_dir():
        print(f"[ERROR] {label} is not a directory: {path}")
        return False
    print(f"[OK] {label}: {path}")
    return True


def check_parent_writable(label, path_str):
    path = Path(path_str)
    parent = path.parent
    if not parent.exists():
        print(f"[ERROR] Parent folder for {label} does not exist: {parent}")
        return False
    try:
        test_file = parent / ".write_test.tmp"
        with open(test_file, "w") as f:
            f.write("test")
        test_file.unlink()
    except Exception as e:
        print(f"[ERROR] Cannot write to parent folder for {label}: {parent} ({e})")
        return False
    print(f"[OK] Writable output folder for {label}: {parent}")
    return True


def check_file_readable(path):
    try:
        with open(path, "rb"):
            return True
    except Exception:
        return False


def validate_data_completeness(pdf_folder, text_folder):
    print("\n=== Validating data completeness ===")

    pdf_folder = Path(pdf_folder)
    text_folder = Path(text_folder)

    pdf_files = sorted([p for p in pdf_folder.iterdir() if p.suffix.lower() == ".pdf"])
    text_files = sorted([p for p in text_folder.iterdir() if p.suffix.lower() == ".txt"])

    pdf_stems = {p.stem for p in pdf_files}
    text_stems = {t.stem for t in text_files}

    missing_text = pdf_stems - text_stems
    orphan_text = text_stems - pdf_stems

    print(f"[INFO] PDFs found: {len(pdf_files)}")
    print(f"[INFO] Text files found: {len(text_files)}")

    all_ok = True

    if missing_text:
        print("\n[ERROR] Missing OCR text files for:")
        for stem in sorted(missing_text):
            print(f"  - {stem}.pdf")
        all_ok = False
    else:
        print("[OK] All PDFs have matching text files.")

    if orphan_text:
        print("\n[ERROR] Orphan text files with no matching PDF:")
        for stem in sorted(orphan_text):
            print(f"  - {stem}.txt")
        all_ok = False
    else:
        print("[OK] No orphan text files.")

    # Check readability
    unreadable_pdfs = [p for p in pdf_files if not check_file_readable(p)]
    unreadable_texts = [t for t in text_files if not check_file_readable(t)]

    if unreadable_pdfs:
        print("\n[ERROR] Unreadable PDF files:")
        for p in unreadable_pdfs:
            print(f"  - {p}")
        all_ok = False

    if unreadable_texts:
        print("\n[ERROR] Unreadable text files:")
        for t in unreadable_texts:
            print(f"  - {t}")
        all_ok = False

    if not unreadable_pdfs and not unreadable_texts:
        print("[OK] All input files are readable.")

    return all_ok


def main():
    print("=== Validating configuration and data ===\n")

    config = load_config()

    # Validate input folders
    ok_pdf = check_exists("PDF folder", config["pdf_folder"], must_be_dir=True)
    ok_text = check_exists("Text folder", config["text_folder"], must_be_dir=True)

    # Validate output paths
    ok_index_pretty = check_parent_writable("index_output", config["index_output"])
    ok_pdfmap_pretty = check_parent_writable("pdf_map_output", config["pdf_map_output"])
    ok_index_min = check_parent_writable("dist_index_output", config["dist_index_output"])
    ok_pdfmap_min = check_parent_writable("dist_pdf_map_output", config["dist_pdf_map_output"])

    # Validate data completeness
    ok_data = validate_data_completeness(
        config["pdf_folder"],
        config["text_folder"]
    )

    all_ok = all([
        ok_pdf,
        ok_text,
        ok_index_pretty,
        ok_pdfmap_pretty,
        ok_index_min,
        ok_pdfmap_min,
        ok_data
    ])

    print("\n=== Final Result ===")
    if all_ok:
        print("All configuration paths and data files are valid. The pipeline is ready to run.")
    else:
        print("One or more issues detected. Fix the errors above before running the pipeline.")


if __name__ == "__main__":
    main()