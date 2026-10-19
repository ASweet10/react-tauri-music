import React, { useRef } from 'react'
import { usePlayerStore, type Track } from '../store/usePlayerStore'

const LeftSidebar = () => {
const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setQueue = usePlayerStore((state) => state.setQueue);
  const queue = usePlayerStore((state) => state.queue);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newTracks: Track[] = Array.from(files).map((file, idx) => ({
      id: `${file.name}-${Date.now()}-${idx}`,
      title: file.name.replace(/\.[^/.]+$/, ''), // strip extension
      artist: 'Local Artist',
      album: 'Local Files',
      duration: 0, // Will update when loaded
      filePathOrUrl: URL.createObjectURL(file), // Generate browser blob URL
      artPathOrUrl: ''
    }));

    // Append to existing queue or initialize queue
    setQueue([...queue, ...newTracks], queue.length === 0 ? 0 : undefined);
  };

  return (
    <aside className="w-64 bg-neutral-900 rounded-lg flex flex-col p-4 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-neutral-400 text-xs uppercase tracking-wider">Library</h2>
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          multiple
          className="hidden"
        />

        {/* Add Music Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded border border-neutral-700 flex items-center gap-1 transition"
        >
          <span>+</span> Add Music
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        <button className="text-left text-sm px-2 py-1.5 hover:bg-neutral-800 rounded font-medium text-white">
          🎵 All Songs ({queue.length})
        </button>
      </nav>
    </aside>
  )
}

export default LeftSidebar