import { useEffect, useState } from 'react'
import { fetchAllTracks } from '../db/queries'
import { usePlayerStore } from '../store/usePlayerStore'

export function useHydrateLibrary() {
  const [isLoading, setIsLoading] = useState(true)
  const setQueue = usePlayerStore((state) => state.setPlaybackQueue)
  const setMusicLibrary = usePlayerStore((state) => state.setMusicLibrary)

  useEffect(() => {
    async function loadStoredLibrary() {
      try {
        const tracks = await fetchAllTracks()
        if (tracks.length > 0) {
          // Populates initial queue without starting playback
          setQueue(tracks, 0)
          setMusicLibrary(tracks)
        }
      } catch (err) {
        console.error('Failed to hydrate library from SQLite:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredLibrary()
  }, [setQueue, setMusicLibrary])

  return { isLoading }
}