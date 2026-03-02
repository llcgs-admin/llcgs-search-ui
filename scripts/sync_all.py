import subprocess
from pathlib import Path


def run_script(script_name):
    """
    Run another Python script in the same folder.
    """
    script_path = Path(__file__).parent / script_name
    print(f"\n=== Running {script_name} ===")
    result = subprocess.run(
        ["python", str(script_path)],
        capture_output=True,
        text=True,
    )

    if result.stdout:
        print(result.stdout)

    if result.stderr:
        print(result.stderr)

    if result.returncode != 0:
        raise RuntimeError(f"{script_name} failed with exit code {result.returncode}")


def main():
    # Order is intentional:
    # 1) Extract text from PDFs
    # 2) Build index from text
    # 3) Build PDF map from PDFs
    run_script("extract_text.py")
    run_script("build_index.py")
    run_script("build_pdf_map.py")

    print("\nAll pipeline steps completed successfully.")


if __name__ == "__main__":
    main()