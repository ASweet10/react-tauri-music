use serde::Serialize;
use tauri::Manager;
use rusqlite::{params, Connection, OptionalExtension};

// Library Store
#[derive(Serialize)]
pub struct TrackStatRow {
    pub track_id: String,
    pub is_liked: bool,
    pub play_count: i64
}

// Shared helper to avoid repeat db path / connection setup
fn open_db(app_handle: &tauri::AppHandle) -> Result<Connection, String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    let db_path = app_dir.join("app.db");
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Ensure the table exists before querying/updating
    conn.execute(
        "CREATE TABLE IF NOT EXISTS track_stats (
            track_id TEXT PRIMARY KEY,
            is_liked INTEGER NOT NULL DEFAULT 0,
            play_count INTEGER NOT NULL DEFAULT 0,
            last_played_at INTEGER
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

    Ok(conn)
}

#[tauri::command]
pub async fn get_track_stats(app_handle: tauri::AppHandle) -> Result<Vec<TrackStatRow>, String> {
    let conn = open_db(&app_handle)?;

    let mut stmt = conn
        .prepare("SELECT track_id, is_liked, play_count FROM track_stats")
        .map_err(|e| e.to_string())?;
    
        let rows = stmt
            .query_map([], |row| {
                let liked_int: i64 = row.get(1)?;
                Ok(TrackStatRow {
                    track_id: row.get(0)?,
                    is_liked: liked_int != 0,
                    play_count: row.get(2)?,
                })
            })
            .map_err(|e| e.to_string())?;
        
        let mut result = Vec::new();
        for r in rows {
            result.push(r.map_err(|e| e.to_string())?);
        }

        Ok(result)
}
#[tauri::command]
pub async fn set_track_liked(app_handle: tauri::AppHandle, track_id: String, is_liked: bool) -> Result<(), String> {
    let conn = open_db(&app_handle)?;
    let liked_int: i64 = if is_liked { 1 } else { 0 };

    // Inserts a new row if track_id isn't in track_stats yet; otherwise updates is_liked
    conn.execute(
        "INSERT INTO track_stats (track_id, is_liked)
         VALUES (?1, ?2)
         ON CONFLICT(track_id) DO UPDATE SET
            is_liked = excluded.is_liked",
        params![track_id, liked_int],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
#[tauri::command]
pub async fn increment_track_play_count(app_handle: tauri::AppHandle, track_id: String) -> Result<i64, String> {
    let conn = open_db(&app_handle)?;

    // Increments play_count by 1 and records timestamp; RETURNING gives us the new total
    let updated_count: Option<i64> = conn
        .query_row(
            "INSERT INTO track_stats (track_id, play_count, last_played_at)
             VALUES (?1, 1, unixepoch())
             ON CONFLICT(track_id) DO UPDATE SET
                play_count = track_stats.play_count + 1,
                last_played_at = unixepoch()
             RETURNING play_count",
            params![track_id],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| e.to_string())?;

    Ok(updated_count.unwrap_or(1))
}