import os
from pathlib import Path
from tqdm import tqdm

from utils import (
    load_config,
    resolve_path,
    write_pretty_json,
    write_minified_json,
    list_files,
)


def build_document_record(text_path):
    """
    Build a single record for the index.
    This is intentionally simple and can be expanded later.
    """
    with open(text_path, "r", encoding="utf-8") as f:
        text = f.read()

    return {
        "id": text_path.stem,
        "text": text,
        "source": text_path.name,
    }


def main():
    config = load_config()

    text_folder = resolve_path(__file__, config["text_folder"])
    output_pretty = resolve_path(__file__, config["index_output"])
    output_min = resolve_path(__file__, config["dist_index_output"])

    text_files = list_files(text_folder, extensions=[".txt"])

    print(f"Building index from {len(text_files)} text files...")

    index_records = []

    for text_path in tqdm(text_files, desc="Indexing"):
        record = build_document_record(text_path)
        index_records.append(record)

    index_data = {
        "documents": index_records,
        "count": len(index_records),
    }

    write_pretty_json(index_data, output_pretty)
    write_minified_json(index_data, output_min)

    print("Index build complete.")


if __name__ == "__main__":
    main()