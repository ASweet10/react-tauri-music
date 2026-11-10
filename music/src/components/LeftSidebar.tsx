import React, { useState, useMemo } from 'react'
import { LibrarySettingsModal } from './LibrarySettingsModal'
import { usePlayerStore } from '../store/usePlayerStore'
import { convertFileSrc } from '@tauri-apps/api/core'

export const LeftSidebar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const musicLibrary = usePlayerStore((state) => state.musicLibrary)
  const selectedView = usePlayerStore((state) => state.selectedView)
  const setSelectedView = usePlayerStore((state) => state.setSelectedView)

  // Genre summaries directly from hydrated queue state
  const genreSummaries = useMemo(() => {
    const map = new Map<string, { name: string; trackCount: number; coverArtUrl?: string }>()

    for (const track of musicLibrary) {
      const genreName = track.genre?.trim() || 'Unknown Genre'
      const existing = map.get(genreName)

      if (existing) {
        existing.trackCount += 1;
        if (!existing.coverArtUrl && track.cover_path) {
          existing.coverArtUrl = track.cover_path
        }
      } else {
        map.set(genreName, {
          name: genreName,
          trackCount: 1,
          coverArtUrl: track.cover_path,
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [musicLibrary])

  return (
    <aside className="w-64 bg-neutral-900 rounded-lg flex flex-col p-3 gap-3 overflow-hidden">
      {/* Settings */}
      <div className="w-64 bg-neutral-900 rounded-lg flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="font-bold text-neutral-400 text-lg uppercase tracking-wider hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            Library
          </button>
        </div>

        <LibrarySettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>

      {/* Dynamic Genre Item List */}
      {genreSummaries.map((genre) => {
        const isSelected = selectedView.type === 'GENRE' && selectedView.genreName === genre.name

        return (
          <button key={genre.name} onClick={() => setSelectedView({ type: 'GENRE', genreName: genre.name })}
            className={`flex items-center gap-3 text-white font-bold ${ isSelected ? 'bg-red-950' : ''}`}
          >
            <div className="w-12 h-12 bg-neutral-800 rounded shrink-0 flex items-center justify-center overflow-hidden border border-neutral-700">
              {genre.coverArtUrl ? (<img src={convertFileSrc(genre.coverArtUrl)} alt={genre.name} className="w-full h-full object-cover" />) 
                : (
                <span className="text-xs text-neutral-500 font-bold">
                  {genre.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="truncate flex flex-col items-start">
              <div className="text-sm truncate">{genre.name}</div>
              <div className="text-xs text-neutral-500">{genre.trackCount} tracks</div>
            </div>
          </button>
        )
      })}
    </aside>
  )
}

export default LeftSidebar