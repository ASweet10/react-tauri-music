CREATE TABLE IF NOT EXISTS directories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    last_scanned_at DATETIME
)

CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY, -- Hash (SHA256 of file head) or UUID
    file_path TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL DEFAULT 'Unknown Artist',
    album TEXT NOT NULL DEFAULT 'Unknown Album',
    genre TEXT NOT NULL DEFAULT 'Unknown Genre',
    duration INTEGER DEFAULT 0, -- in seconds
    file_size INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre)
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist)
CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album)

-- Fetch all genres
SELECT
    COALESCE(NULLIF(genre, ''), 'Unknown Genre') as name,
    COUNT(DISTINCT album) AS albumCount,
    COUNT(id) AS trackCount,
    MAX(cover_art_url) AS coverArtUrl
FROM tracks
GROUP BY COALESCE(NULLIF(genre, ''), 'Unknown Genre')
ORDER BY name ASC

-- Fetch all artists
SELECT
    COALESCE(NULLIF(artist, ''), 'Unknown Artist') as name,
    COUNT(DISTINCT album) AS albumCount,
    MAX(cover_art_url) AS coverArtUrl
FROM tracks
GROUP BY COALESCE(NULLIF(artist, ''), 'Unknown Artist')
ORDER BY name ASC

-- Fetch all albums
SELECT
    COALESCE(NULLIF(album, ''), 'Unknown Album') as name,
    COALESCE(NULLIF(genre, ''), 'Unknown Genre') as genre,
    MAX(cover_art_url) AS coverArtUrl
FROM tracks
GROUP BY COALESCE(NULLIF(album, ''), 'Unknown Album'), COALESCE(NULLIF(artist, '')),
ORDER BY name ASC

-- SELECTED VIEW
SELECT * FROM tracks WHERE genre = ? ORDER BY track_number, title ASC
SELECT * FROM tracks WHERE artist = ? ORDER BY track_number, title ASC
SELECT * FROM tracks WHERE album = ? ORDER BY track_number, title ASC