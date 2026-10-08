export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 text-white overflow-hidden select-none">
      {/* Upper Main Workspace */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* Left Sidebar: Nav & Playlists */}
        <aside className="w-64 bg-neutral-900 rounded-lg flex flex-col p-4 gap-4">
          <nav className="flex flex-col gap-2">
            <div className="font-bold text-neutral-400">Navigation</div>
            <button className="text-left px-2 py-1 hover:bg-neutral-800 rounded">Home</button>
            <button className="text-left px-2 py-1 hover:bg-neutral-800 rounded">Library</button>
          </nav>
          <div className="flex-1 overflow-y-auto">
            <div className="font-bold text-neutral-400 mb-2">Playlists / Genres</div>
            {/* Playlist list mapping */}
          </div>
        </aside>

        {/* Center Main View */}
        <main className="flex-1 bg-neutral-900 rounded-lg overflow-y-auto flex flex-col">
          {/* Spotify-style Header Section */}
          <div className="p-8 flex items-end gap-6 bg-gradient-to-b from-indigo-900/50 to-transparent">
            <div className="w-48 h-48 bg-neutral-800 rounded-md shadow-2xl flex-shrink-0 flex items-center justify-center border border-neutral-700">
              {/* Large Playlist Image */}
              <span className="text-neutral-500">Cover Art</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase font-bold tracking-wider">Playlist</span>
              <h1 className="text-6xl font-black tracking-tight">Heavy Metal Essentials</h1>
              <p className="text-sm text-neutral-400">Curated local tracks • 42 songs, 2 hr 15 min</p>
            </div>
          </div>

          {/* Song Table Area */}
          <div className="p-6">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="border-b border-neutral-800 uppercase text-xs">
                <tr>
                  <th className="p-2 w-12">#</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Album</th>
                  <th className="p-2 w-20">Duration</th>
                </tr>
              </thead>
              <tbody>
                {/* Song row mappings go here */}
              </tbody>
            </table>
          </div>
        </main>

        {/* Right Sidebar: Current Song & Lyrics */}
        <aside className="w-80 bg-neutral-900 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
          <h2 className="font-bold text-sm text-neutral-400">Now Playing</h2>
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
      </div>

      {/* Bottom Player Bar */}
      <footer className="h-20 bg-black border-t border-neutral-800 px-4 flex items-center justify-between">
        <div className="w-1/4">Track Info</div>
        <div className="w-2/4 flex flex-col items-center">Playback Controls & Progress</div>
        <div className="w-1/4 flex justify-end">Volume</div>
      </footer>
    </div>
  );
}