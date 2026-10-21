use std::path::Path;
use walkdir::WalkDir; // Recursively traverse subdirectories in path

pub fn clean_track_title(raw_title: &str) -> String {
  raw_title.trim().to_string()
}

pub fn clean_title_command(title: &str) -> String {
  clean_track_title(title)
}


// #[tauri::command]: Turns Rust async function into Inter-Process Communication (IPC) endpoint
// Callable from TypeScript via @tauri-apps/api/core
// Async: Tauri runs async thread pool (Tokio) to keep main UI thread responsive
#[tauri::command]
pub async fn scan_directory(dir_path: String) -> Result<usize, String> {
    let path = Path::new(&dir_path); // Converts incoming string to borrowed Path slice to use filesystem
    if !path.exists() {
        return Err("Directory does not exist".into()); // into: convert string literal in quotes to String type
    }

    let mut scanned_count = 0;

    // filter_map: Ignore/discard permission-denial & unreadable file errors
    // Unwrap only valid entry items (e.ok())
    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if entry.file_type().is_file() { // Ensure .mp3 file type, not directory/file named mp3
            if let Some(ext) = entry.path().extension() {
                if ext == "mp3" || ext == "flac" || ext == "wav" {
                    // 1. Extract ID3 tags using lofty or id3 crate
                    // 2. Check SQLite: Does entry with matching file_name + size exist?
                    // 3. If exists at old path -> UPDATE file_path
                    // 4. If new -> INSERT INTO tracks
                    scanned_count += 1;
                }
            }
        }
    }

    Ok(scanned_count) // Returns number of scanned audio files to JS caller as int on success
}

// Rust testing setup
#[cfg(test)]
mod tests {
    use super::clean_track_title; // Import only what test needs

  #[test]
  fn test_clean_title() {
    let result = clean_track_title("      Hangar 18    \n".to_string());
    assert_eq!(result, "Hangar 18");
  }
}