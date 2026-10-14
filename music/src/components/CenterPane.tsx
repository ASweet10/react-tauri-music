import { Heart,  } from 'lucide-react'
import { type MusicTrack } from '../types/Music'

interface CenterPaneProps {
    currentTrack: MusicTrack
}

const CenterPane = ({ currentTrack }: CenterPaneProps) => {
  return (
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
            <p className="text-sm text-neutral-400">42 songs • 2 hr 15 min</p>
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
                <th className="p-2 w-6"><Heart /></th>
            </tr>
            </thead>
            <tbody>
            {/* Song row mappings go here */}
            </tbody>
        </table>
        </div>
    </main>
  )
}

export default CenterPane