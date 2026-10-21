import React from 'react'

const RightSidebar = () => {
  return (
    <aside className="w-80 bg-neutral-900 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
        <h2 className="font-bold text-sm text-neutral-400">CurrentGenreOrPlaylistNameHere</h2>
        <div className="w-full aspect-square bg-neutral-800 rounded-md border border-neutral-700 flex items-center justify-center">
            {/* Large Current Song Art */}
            <span className="text-neutral-500">Track Art</span>
        </div>
        <div>
            <h3 className="font-bold text-lg text-white">Song Title</h3>
            <p className="text-sm text-neutral-400">Artist Name</p>
        </div>
        <div className="flex-1 bg-neutral-950/50 rounded-md p-3 border border-neutral-800/50">
            <h4 className="text-xs font-bold text-neutral-400 mb-2">Lyrics</h4>
            <p className="text-sm text-neutral-500 italic">No synchronized lyrics available...</p>
        </div>
    </aside>
  )
}

export default RightSidebar