import re
import json
import unicodedata
from pathlib import Path
from tqdm import tqdm

from utils import (
    load_config,
    resolve_path,
    list_files,
    write_pretty_json,
    write_minified_json,
)

# ------------------------------------------------------------
# Stopword list
# ------------------------------------------------------------
STOPWORDS = {
    "the", "and", "a", "an", "of", "to", "in", "is", "it", "that", "for", "on",
    "with", "as", "at", "by", "from", "this", "be", "or", "are", "was", "were",
    "but", "not", "have", "has", "had", "they", "you", "we", "he", "she", "them",
    "his", "her", "their", "our", "its", "which", "who", "whom", "what", "when",
    "where", "why", "how", "can", "could", "should", "would", "do", "does", "did"
}

# ------------------------------------------------------------
# Tokenizer
# ------------------------------------------------------------
def normalize_text(text):
    text = unicodedata.normalize("NFKC", text)
    return text.lower()

def tokenize(text):
    text = normalize_text(text)
    tokens = re.findall(r"[a-z0-9']+", text)
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 1]
    return sorted(set(tokens))

# ------------------------------------------------------------
# Page splitting
# ------------------------------------------------------------
def split_into_pages(text):
    if "\f" in text:
        pages = text.split("\f")
        return [p.strip() for p in pages if p.strip()]

    chunk_size = 2000
    pages = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    return [p.strip() for p in pages if p.strip()]

# ------------------------------------------------------------
# Snippet generation
# ------------------------------------------------------------
def make_snippet(text, length=240):
    t = text.strip().replace("\n", " ")
    if len(t) <= length:
        return t
    return t[:length].rsplit(" ", 1)[0] + "…"

# ------------------------------------------------------------
# Build a single index record
# ------------------------------------------------------------
def build_record(txt_path, pdf_folder, text_folder, pdf_map):
    rel_txt = txt_path.relative_to(text_folder)
    record_id = txt_path.stem

    # Convert .txt → .pdf
    rel_pdf = rel_txt.with_suffix(".pdf")
    rel_pdf_str = str(rel_pdf).replace("\\", "/")

    # Lookup Drive file ID
    file_id = pdf_map.get(rel_pdf_str)

    # Load text
    full_text = txt_path.read_text(encoding="utf-8", errors="ignore")
    pages = split_into_pages(full_text)
    tokens = tokenize(full_text)
    snippet = make_snippet(full_text)

    return {
        "id": record_id,
        "full_text": full_text,
        "pages": pages,
        "tokens": tokens,
        "snippets": [snippet],
        "audioId": None,
        "file_id": file_id,
        "source": rel_pdf_str
    }

# ------------------------------------------------------------
# Main
# ------------------------------------------------------------
def main():
    config = load_config()

    text_folder = resolve_path(__file__, config["text_folder"])
    pdf_folder = resolve_path(__file__, config["pdf_folder"])
    pdf_map_path = resolve_path(__file__, config["pdf_map"])

    output_pretty = resolve_path(__file__, config["index_output"])
    output_min = resolve_path(__file__, config["dist_index_output"])

    # Load PDF → Drive ID map
    with open(pdf_map_path, "r", encoding="utf-8") as f:
        pdf_map = json.load(f)

    txt_files = list_files(text_folder, extensions=[".txt"])

    print(f"Building index from {len(txt_files)} text files...")

    records = []
    for txt_path in tqdm(txt_files, desc="Indexing"):
        try:
            record = build_record(txt_path, pdf_folder, text_folder, pdf_map)
            records.append(record)
        except Exception as e:
            print(f"Error indexing {txt_path}: {e}")

    index_data = {
        "records": records,
        "count": len(records),
    }

    write_pretty_json(index_data, output_pretty)
    write_minified_json(index_data, output_min)

    print("Index build complete.")

if __name__ == "__main__":
    main()