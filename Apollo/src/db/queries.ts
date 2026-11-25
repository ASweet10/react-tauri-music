import { invoke } from '@tauri-apps/api/core'
import { type Track, type GenreSummary, type AlbumSummary, type ArtistSummary } from '../store/usePlayerStore'

export async function fetchAllTracks(): Promise<Track[]> {
  return await invoke<Track[]>('fetch_all_tracks')
}

export async function fetchGenreSummaries(): Promise<GenreSummary[]> {
  return await invoke<GenreSummary[]>('fetch_genres')
}

export async function saveScannedTrack(track: Track): Promise<Track> {
  return await invoke<Track>('save_track')
}