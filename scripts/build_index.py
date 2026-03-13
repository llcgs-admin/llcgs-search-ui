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
# Build a single index record
# ------------------------------------------------------------
def build_record(txt_path, pdf_map, audio_map, text_folder):
    rel_txt = txt_path.relative_to(text_folder)
    record_id = txt_path.stem

    # Convert .txt → .pdf
    rel_pdf = rel_txt.with_suffix(".pdf")
    rel_pdf_str = str(rel_pdf).replace("\\", "/")

    # Convert .txt → .mp3
    rel_audio = rel_txt.with_suffix(".mp3")
    rel_audio_str = str(rel_audio).replace("\\", "/")

    # PDF lookup
    pdf_key = f"work/pdf_ocr/{rel_pdf_str}"
    file_id = pdf_map.get(pdf_key)

    # Audio lookup
    audio_key = f"work/audio/{rel_audio_str}"
    audio_id = audio_map.get(audio_key)

    # Load text
    full_text = txt_path.read_text(encoding="utf-8", errors="ignore")
    pages = split_into_pages(full_text)
    tokens = tokenize(full_text)

    # --------------------------------------------------------
    # Extract box number from ID (e.g., RG4831AUb007f009 → 7)
    # --------------------------------------------------------
    box_match = re.search(r"b(\d{3})", record_id, re.IGNORECASE)
    box_num = int(box_match.group(1)) if box_match else None

    return {
        "id": record_id,
        "box": box_num,          # <-- REQUIRED FOR NEIGHBORHOOD FILTERING
        "full_text": full_text,
        "pages": pages,
        "tokens": tokens,
        "file_id": file_id,      # PDF Drive ID
        "audioId": audio_id,     # Audio Drive ID
        "source": rel_pdf_str,
        "snippets": []           # placeholder; UI fills dynamically
    }

# ------------------------------------------------------------
# Main
# ------------------------------------------------------------
def main():
    config = load_config()

    text_folder = resolve_path(__file__, config["text_folder"])
    pdf_map_path = resolve_path(__file__, config["pdf_map"])
    audio_map_path = resolve_path(__file__, config["audio_map"])

    output_pretty = resolve_path(__file__, config["index_output"])
    output_min = resolve_path(__file__, config["dist_index_output"])

    # Load PDF map
    with open(pdf_map_path, "r", encoding="utf-8") as f:
        pdf_map = json.load(f)

    # Load Audio map
    with open(audio_map_path, "r", encoding="utf-8") as f:
        audio_map = json.load(f)

    txt_files = list_files(text_folder, extensions=[".txt"])

    print(f"Building index from {len(txt_files)} text files...")

    records = []
    for txt_path in tqdm(txt_files, desc="Indexing"):
        try:
            record = build_record(txt_path, pdf_map, audio_map, text_folder)
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