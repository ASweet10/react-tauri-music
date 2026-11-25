CREATE TABLE IF NOT EXISTS track_stats (
    track_id TEXT PRIMARY KEY,
    is_liked INTEGER NOT NULL DEFAULT 0,
    play_count INTEGER NOT NULL DEFAULT 0,
    last_played_at INTEGER
);