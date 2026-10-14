import React from 'react'

const LeftSidebar = () => {
  return (
    <aside className="w-64 bg-neutral-900 rounded-lg flex flex-col p-4 gap-4">
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
            <div className="font-bold text-neutral-400">Navigation</div>
            <button className="text-left px-2 py-1 hover:bg-neutral-800 rounded">Home</button>
            <button className="text-left px-2 py-1 hover:bg-neutral-800 rounded">Library</button>
        </nav>

        {/* Playlists */}
        <div className="flex-1 overflow-y-auto">

        <div className="font-bold text-neutral-400 mb-2">Playlists / Genres</div>

        </div>
    </aside>
  )
}

export default LeftSidebar