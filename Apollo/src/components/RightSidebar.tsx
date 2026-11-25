import React from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import { convertFileSrc } from '@tauri-apps/api/core'

export const RightSidebar: React.FC = () => {
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const selectedView = usePlayerStore((state) => state.selectedView)

  // Derive title header based on current active view
  const headerTitle = 
    selectedView.type === 'GENRE' ? selectedView.genreName : ''

  return (
    <aside className="w-80 bg-neutral-900 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="font-bold text-sm text-neutral-400 truncate">{headerTitle}</h2>
      
      {/* Current Track Artwork */}
      <div className="w-full aspect-square bg-neutral-800 rounded-md border border-neutral-700 flex items-center justify-center overflow-hidden shadow-lg">
        {currentTrack?.cover_path ? (
          <img src={convertFileSrc(currentTrack.cover_path)} alt={currentTrack.title} className="w-full h-full object-cover"/>
        ) : (
          <>
          </>
        )}
      </div>

      {/* Track Meta Information */}
      <div>
        <h3 className="font-bold text-lg text-white truncate">
          {currentTrack ? currentTrack.title : ''}
        </h3>
        <p className="text-sm text-neutral-400 truncate">
          {currentTrack ? currentTrack.artist : ''}
        </p>
      </div>

      {/* Lyrics or Context Panel */}
      <div className="flex-1 bg-neutral-950/50 rounded-md p-3 border border-neutral-800/50 flex flex-col">
        <h4 className="text-xs font-bold text-neutral-400 mb-2">Lyrics</h4>
        <p className="text-sm text-neutral-500 italic">No synchronized lyrics available...</p>
      </div>
    </aside>
  )
}