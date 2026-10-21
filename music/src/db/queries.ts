import { getDatabase } from './database'
import { type Track, type GenreSummary, type AlbumSummary, type ArtistSummary } from '../store/usePlayerStore'

export async function fetchAllTracks(): Promise<Track[]> {
  const db = await getDatabase();
  return await db.select<Track[]>(`
    SELECT 
      id,
      file_path AS filePathOrUrl,
      title,
      artist,
      album,
      genre,
      duration,
      cover_art_url AS coverArtUrl
    FROM tracks
    ORDER BY title ASC
  `);
}

export async function fetchGenreSummaries(): Promise<GenreSummary[]> {
  const db = await getDatabase();
  return await db.select<GenreSummary[]>(`
    SELECT 
      COALESCE(NULLIF(genre, ''), 'Unknown Genre') AS name,
      COUNT(DISTINCT album) AS albumCount,
      COUNT(id) AS trackCount,
      MAX(cover_art_url) AS coverArtUrl
    FROM tracks
    GROUP BY COALESCE(NULLIF(genre, ''), 'Unknown Genre')
    ORDER BY name ASC
  `);
}

export async function saveScannedTrack(track: Track): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    `INSERT INTO tracks (id, file_path, title, artist, album, genre, duration, cover_art_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT(file_path) DO UPDATE SET
        title=excluded.title,
        artist=excluded.artist,
        album=excluded.album,
        genre=excluded.genre,
        duration=excluded.duration,
        cover_art_url=excluded.cover_art_url`,
    [
      track.id,
      track.filePathOrUrl,
      track.title,
      track.artist,
      track.album,
      track.genre,
      track.duration,
      track.coverArtUrl || null,
    ]
  );
}