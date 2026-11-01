use std::path::Path;
use walkdir::WalkDir; // Recursively traverse subdirectories in path
use rusqlite::params;
use tauri::Manager;
use sha2::{Sha256, Digest};
use serde::{Serialize, Deserialize};

pub fn clean_track_title(raw_title: &str) -> String {
  raw_title.trim().to_string()
}

pub fn clean_title_command(title: &str) -> String {
  clean_track_title(title)
}

#[derive(Serialize, Deserialize)]
pub struct Track {
    pub id: String,
    pub file_path: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub genre: Option<String>,
    pub duration: Option<i64>,
    pub file_size: Option<i64>,
}

#[tauri::command]
pub async fn fetch_all_tracks(app_handle: tauri::AppHandle) -> Result<Vec<Track>, String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = app_dir.join("app.db");
    let conn = rusqlite::Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT id, file_path, title, artist, album, genre, duration, file_size FROM tracks"
    ).map_err(|e| e.to_string())?;

    let tracks = stmt.query_map([], |row| {
        Ok(Track {
            id: row.get(0)?,
            file_path: row.get(1)?,
            title: row.get(2)?,
            artist: row.get(3)?,
            album: row.get(4)?,
            genre: row.get(5)?,
            duration: row.get(6)?,
            file_size: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?
      .filter_map(|r| r.ok())
      .collect();

    Ok(tracks)
}

#[tauri::command]
pub async fn get_directories(app_handle: tauri::AppHandle) -> Result<Vec<String>, String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = app_dir.join("app.db");
    let conn = rusqlite::Connection::open(db_path).map_err(|e| e.to_string())?;

    // Ensure table exists
    conn.execute(
        "CREATE TABLE IF NOT EXISTS directories (path TEXT PRIMARY KEY NOT NULL)",
        [],
    ).map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare("SELECT path FROM directories").map_err(|e| e.to_string())?;
    let paths = stmt.query_map([], |row| row.get(0))
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(paths)
}

#[tauri::command]
pub async fn add_directory(app_handle: tauri::AppHandle, path: String) -> Result<(), String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = app_dir.join("app.db");
    let conn = rusqlite::Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS directories (path TEXT PRIMARY KEY NOT NULL)",
        [],
    ).map_err(|e| e.to_string())?;

    conn.execute("INSERT OR IGNORE INTO directories (path) VALUES (?1)", rusqlite::params![path])
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn delete_directory(app_handle: tauri::AppHandle, path: String) -> Result<(), String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = app_dir.join("app.db");
    let conn = rusqlite::Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM directories WHERE path = ?1", rusqlite::params![path])
        .map_err(|e| e.to_string())?;

    Ok(())
}



// #[tauri::command]: Turns Rust async function into Inter-Process Communication (IPC) endpoint
// Callable from TypeScript via @tauri-apps/api/core
// Async: Tauri runs async thread pool (Tokio) to keep main UI thread responsive
#[tauri::command]
pub async fn scan_directory(app_handle: tauri::AppHandle, dir_path: String) -> Result<usize, String> {
    let path = Path::new(&dir_path);
    if !path.exists() {
        return Err("Directory does not exist".to_string());
    }

    // Get path to SQLite app.db
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    let db_path = app_dir.join("app.db");
    
    let mut conn = rusqlite::Connection::open(db_path).map_err(|e| e.to_string())?;
    
    // Ensure table exists
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tracks (
            id TEXT PRIMARY KEY,
            file_path TEXT UNIQUE NOT NULL,
            title TEXT,
            artist TEXT,
            album TEXT,
            genre TEXT,
            duration INTEGER,
            file_size INTEGER
        )",
        [],
    ).map_err(|e| e.to_string())?;

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    let mut scanned_count = 0;

    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        if entry.file_type().is_file() {
            if let Some(ext) = entry.path().extension() {
                let ext_str = ext.to_string_lossy().to_lowercase();
                if ["mp3", "flac", "m4a", "ogg", "wav"].contains(&ext_str.as_str()) {
                    let file_path = entry.path().to_string_lossy().to_string();
                    let file_name = entry.file_name().to_string_lossy().to_string();
                    let file_size = entry.metadata().map(|m| m.len()).unwrap_or(0);

                    let title = file_name.clone();
                    let artist = "Unknown Artist".to_string();
                    let album = "Unknown Album".to_string();
                    let genre = "Unknown Genre".to_string();
                    let duration = 180; // Placeholder
                    
                    // Hashing path gives unique 64-character hex string; Rescanning produces same ID, avoids duplicates
                    let mut hasher = Sha256::new();
                    hasher.update(file_path.as_bytes());
                    let id = format!("{:x}", hasher.finalize());

                    tx.execute(
                        "INSERT INTO tracks (id, file_path, title, artist, album, genre, duration, file_size)
                         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
                         ON CONFLICT(file_path) DO UPDATE SET
                            title=excluded.title,
                            file_size=excluded.file_size",
                        params![id, file_path, title, artist, album, genre, duration as i64, file_size as i64], // Cast u64 to i64 to fix error[E0277]
                    ).map_err(|e| e.to_string())?;

                    scanned_count += 1;
                }
            }
        }
    }

    tx.commit().map_err(|e| e.to_string())?;
    Ok(scanned_count)
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