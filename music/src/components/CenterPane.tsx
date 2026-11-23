import React, { useMemo } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import { formatTotalDuration } from '../utils/formatters'
import { convertFileSrc } from '@tauri-apps/api/core'
import { Heart } from 'lucide-react'
import cat from '../../public/cat.webp'

export const CenterPane: React.FC = () => {
  const queue = usePlayerStore((state) => state.playbackQueue)
  const selectedView = usePlayerStore((state) => state.selectedView) 
  //const setQueue = usePlayerStore((state) => state.setPlaybackQueue)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack)

  // Filter tracks based on current selectedView
  const filteredTracks = useMemo(() => {
    if (selectedView.type === 'GENRE') {
      return queue.filter((t) => (t.genre?.trim() || 'Unknown Genre') === selectedView.genreName)
    }
    return queue
  }, [queue, selectedView])

  // Aggregate stats (Track count, Duration, File size)
  const stats = useMemo(() => {
    const totalSeconds = filteredTracks.reduce((acc, t) => acc + (t.duration || 0), 0)

    return {
      count: filteredTracks.length,
      durationStr: formatTotalDuration(totalSeconds),
    }
  }, [filteredTracks])

  const viewTitle =
    selectedView.type === 'GENRE' ? selectedView.genreName : 'All Tracks'
  const representativeArt = (filteredTracks.find((t) => t.cover_path)?.cover_path)

  return (
    <main className="flex-1 bg-neutral-900 rounded-lg overflow-y-auto scrollbar-none flex flex-col">
      {/* Featured Header Banner */}
      <div className="p-6 flex items-end gap-6 bg-linear-to-b from-indigo-900/40 to-transparent">
        <div className="w-44 h-44 bg-neutral-800 rounded-md border border-neutral-700 shadow-2xl overflow-hidden shrink-0 flex items-center justify-center">
          {representativeArt ? (
            <img src={convertFileSrc(representativeArt)} alt={viewTitle} className="w-full h-full object-cover" />
          ) : (
            <img src={cat} alt={viewTitle} className="w-full h-full object-cover" />       
          )}
        </div>

        <div className="flex flex-col gap-1">
          {/*
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
            {selectedView.type === 'GENRE' ? 'Genre' : 'Library'}
          </span>
          */}
          <h1 className="text-5xl font-black text-white">{viewTitle}</h1>
          <p className="text-sm text-neutral-400 font-medium">
            {stats.count} tracks • {stats.durationStr}
          </p>
        </div>
      </div>

      {/* Song List Table */}
      <div className="p-6">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="border-b border-neutral-800 uppercase text-xs">
            <tr>
              {/* <th className="p-2">#</th> */}
              <th className="p-2 w-14"></th>
              <th className="p-2">Title</th>
              <th className="p-2">Artist</th>
              <th className="p-2">Album</th>
              <th className="p-2">Duration</th>
              <th className="p-2 w-12">Love</th>
            </tr>
          </thead>
          <tbody>
            {filteredTracks.map((track, idx) => (
              <tr key={track.id} onDoubleClick={() => { setCurrentTrack(track); !isPlaying && togglePlay(); }}
                className="hover:bg-neutral-800/60 cursor-pointer rounded transition"
              >
                {/* <td className="p-2 text-neutral-500">{idx + 1}</td> */}
                <td className="h-10 w-10 object-contain">
                  <img src={track.cover_path ? convertFileSrc(track.cover_path) : cat} alt={viewTitle} className="w-full h-full object-cover" />
                </td>
                <td className="p-2 text-white font-medium">{track.title}</td>
                <td className="p-2">{track.artist}</td>
                <td className="p-2">{track.album}</td>
                <td className="p-2 text-center">{ Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</td>
                <td className="p-2 w-12"><Heart /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}