import re
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
# Stopword list (expandable)
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
    """Unicode normalize and lowercase."""
    text = unicodedata.normalize("NFKC", text)
    return text.lower()


def tokenize(text):
    """Regex-based tokenizer with stopword filtering."""
    text = normalize_text(text)

    # Extract words: letters, numbers, apostrophes inside words
    tokens = re.findall(r"[a-z0-9']+", text)

    # Remove stopwords and single-character noise
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 1]

    # Deduplicate + sort for stable output
    return sorted(set(tokens))


# ------------------------------------------------------------
# Page splitting
# ------------------------------------------------------------
def split_into_pages(text):
    """
    Split text into pages.
    Priority:
    1. Form-feed markers (\f)
    2. Fallback: split every ~2000 characters (heuristic)
    """
    if "\f" in text:
        pages = text.split("\f")
        return [p.strip() for p in pages if p.strip()]

    # Fallback heuristic
    chunk_size = 2000
    pages = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    return [p.strip() for p in pages if p.strip()]


# ------------------------------------------------------------
# Snippet generation
# ------------------------------------------------------------
def make_snippet(text, length=240):
    """Return a short preview snippet."""
    t = text.strip().replace("\n", " ")
    if len(t) <= length:
        return t
    return t[:length].rsplit(" ", 1)[0] + "…"


# ------------------------------------------------------------
# Build a single index record
# ------------------------------------------------------------
def build_record(txt_path, pdf_folder, text_folder):
    rel_path = txt_path.relative_to(text_folder)
    record_id = txt_path.stem

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
        "source": str(rel_path).replace("\\", "/")
    }


# ------------------------------------------------------------
# Main
# ------------------------------------------------------------
def main():
    config = load_config()

    text_folder = resolve_path(__file__, config["text_folder"])
    output_pretty = resolve_path(__file__, config["index_output"])
    output_min = resolve_path(__file__, config["dist_index_output"])

    txt_files = list_files(text_folder, extensions=[".txt"])

    print(f"Building index from {len(txt_files)} text files...")

    records = []
    for txt_path in tqdm(txt_files, desc="Indexing"):
        try:
            record = build_record(txt_path, None, text_folder)
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