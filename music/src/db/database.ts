import Database from '@tauri-apps/plugin-sql'

let dbInstance: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance

  // Automatically create app.db in user's AppData/Config folder
  dbInstance = await Database.load('sqlite:app.db')
  await runMigrations(dbInstance)
  return dbInstance
}

async function runMigrations(db: Database) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS directories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE NOT NULL,
        last_scanned_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS tracks (
        id TEXT PRIMARY KEY,
        file_path TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL DEFAULT 'Unknown Artist',
        album TEXT NOT NULL DEFAULT 'Unknown Album',
        genre TEXT NOT NULL DEFAULT 'Unknown Genre',
        duration INTEGER DEFAULT 0,
        cover_art_url TEXT,
        file_size INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
    CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist);
    CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album);
  `);
}