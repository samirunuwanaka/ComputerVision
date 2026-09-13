import os
import sys
import zipfile
import urllib.request

DATASETS = {
    "1": {
        "name": "data_release.zip (Real Labeled & Benchmark Evaluation Datasets ~10.7 GB)",
        "url": "https://www.dropbox.com/sh/1s6r4slurc5ei2n/AACg6TqoDfGdKe8t40Em1fgxa?dl=1",
        "filename": "data_release.zip"
    },
    "2": {
        "name": "data_lmdb_release.zip (Synthetic Training Datasets MJ & ST ~23.3 GB)",
        "url": "https://www.dropbox.com/sh/i39abvnefllx2si/AAAbAYRvxzRp3cIE5HzqUw3ra?dl=1",
        "filename": "data_lmdb_release.zip"
    }
}

def download_file(url, target_path):
    print(f"\n[*] Starting download from: {url}")
    print(f"[*] Saving to: {target_path}\n")
    
    def reporthook(count, block_size, total_size):
        downloaded = count * block_size
        if total_size > 0:
            percent = downloaded * 100 / total_size
            mb_downloaded = downloaded / (1024 * 1024)
            mb_total = total_size / (1024 * 1024)
            sys.stdout.write(f"\rDownloading: {mb_downloaded:.1f} MB / {mb_total:.1f} MB ({percent:.1f}%)")
        else:
            mb_downloaded = downloaded / (1024 * 1024)
            sys.stdout.write(f"\rDownloading: {mb_downloaded:.1f} MB")
        sys.stdout.flush()

    opener = urllib.request.build_opener(urllib.request.HTTPRedirectHandler)
    urllib.request.install_opener(opener)
    
    # Use User-Agent header for Dropbox redirect compatibility
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response, open(target_path, 'wb') as out_file:
        total_size = int(response.headers.get('Content-Length', 0))
        block_size = 1024 * 1024  # 1 MB blocks
        downloaded = 0
        while True:
            buffer = response.read(block_size)
            if not buffer:
                break
            downloaded += len(buffer)
            out_file.write(buffer)
            if total_size > 0:
                percent = downloaded * 100 / total_size
                mb_downloaded = downloaded / (1024 * 1024)
                mb_total = total_size / (1024 * 1024)
                sys.stdout.write(f"\rDownloading: {mb_downloaded:.1f} MB / {mb_total:.1f} MB ({percent:.1f}%)")
            else:
                mb_downloaded = downloaded / (1024 * 1024)
                sys.stdout.write(f"\rDownloading: {mb_downloaded:.1f} MB")
            sys.stdout.flush()
    print("\n[*] Download completed successfully!")

def extract_zip(zip_path, extract_to):
    print(f"\n[*] Extracting {zip_path} to {extract_to}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print("[*] Extraction complete!")

def main():
    print("=" * 60)
    print("           StrDA Dataset Downloader")
    print("=" * 60)
    print("Available dataset packages:")
    for key, data in DATASETS.items():
        print(f"  [{key}] {data['name']}")
    print("  [3] Exit")
    print()
    
    choice = input("Select dataset to download (1-3): ").strip()
    if choice not in DATASETS:
        print("Exiting.")
        return
        
    ds = DATASETS[choice]
    target_dir = os.path.join(os.path.dirname(__file__), "downloads")
    os.makedirs(target_dir, exist_ok=True)
    zip_filepath = os.path.join(target_dir, ds["filename"])
    
    download_file(ds["url"], zip_filepath)
    
    extract_choice = input("\nDo you want to extract the zip file now? (y/n): ").strip().lower()
    if extract_choice == 'y':
        extract_dir = os.path.join(os.path.dirname(__file__), "data")
        extract_zip(zip_filepath, extract_dir)
        
        remove_choice = input("Do you want to delete the zip file to free up disk space? (y/n): ").strip().lower()
        if remove_choice == 'y':
            os.remove(zip_filepath)
            print(f"[*] Deleted {zip_filepath}")

if __name__ == "__main__":
    main()
