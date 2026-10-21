import { useEffect, useState } from 'react';
import { fetchAllTracks } from '../db/queries';
import { usePlayerStore } from '../store/usePlayerStore';

export function useHydrateLibrary() {
  const [isLoading, setIsLoading] = useState(true);
  const setQueue = usePlayerStore((state) => state.setQueue);

  useEffect(() => {
    async function loadStoredLibrary() {
      try {
        const tracks = await fetchAllTracks();
        if (tracks.length > 0) {
          // Populates initial queue without starting playback
          setQueue(tracks, 0);
        }
      } catch (err) {
        console.error('Failed to hydrate library from SQLite:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredLibrary();
  }, [setQueue]);

  return { isLoading };
}