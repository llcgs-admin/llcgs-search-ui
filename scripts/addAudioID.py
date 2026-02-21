import json

# Path to your existing index.json
INPUT_FILE = "index.json"
OUTPUT_FILE = "index.json"   # overwrite in place; change if you prefer a backup

def add_audio_id_field():
    # Load the existing index
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Modify each record
    updated = 0
    for key, record in data.items():
        if "audioId" not in record:
            record["audioId"] = None
            updated += 1

    # Write the updated index back out
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {updated} records with audioId: null")

if __name__ == "__main__":
    add_audio_id_field()
