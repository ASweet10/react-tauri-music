// src/components/CenterView.tsx
import React, { use, useMemo } from 'react'
import { usePlayerStore, type Track } from '../store/usePlayerStore'
import { formatBytes, formatTotalDuration } from '../utils/formatters'
import { convertFileSrc } from '@tauri-apps/api/core'

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
    const totalBytes = filteredTracks.reduce((acc, t) => acc + (t.file_size || 0), 0)
    const totalSeconds = filteredTracks.reduce((acc, t) => acc + (t.duration || 0), 0)

    return {
      count: filteredTracks.length,
      sizeStr: formatBytes(totalBytes),
      durationStr: formatTotalDuration(totalSeconds),
    }
  }, [filteredTracks])

  const viewTitle =
    selectedView.type === 'GENRE' ? selectedView.genreName : 'All Tracks'
  const representativeArt = (filteredTracks.find((t) => t.coverPath)?.coverPath)

  return (
    <main className="flex-1 bg-neutral-900 rounded-lg overflow-y-auto flex flex-col m-2">
      {/* Featured Header Banner */}
      <div className="p-8 flex items-end gap-6 bg-linear-to-b from-indigo-900/40 to-transparent">
        <div className="w-44 h-44 bg-neutral-800 rounded-md border border-neutral-700 shadow-2xl overflow-hidden shrink-0 flex items-center justify-center">
          {representativeArt ? (
            <img src={convertFileSrc(representativeArt)} alt={viewTitle} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-neutral-600 font-black">
              {viewTitle?.substring(0, 1)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
            {selectedView.type === 'GENRE' ? 'Genre' : 'Library'}
          </span>
          <h1 className="text-5xl font-black text-white">{viewTitle}</h1>
          <p className="text-sm text-neutral-400 font-medium">
            {stats.count} tracks • {stats.durationStr} • {stats.sizeStr}
          </p>
        </div>
      </div>

      {/* Song List Table */}
      <div className="p-6">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="border-b border-neutral-800 uppercase text-xs">
            <tr>
              <th className="p-2 w-12">#</th>
              <th className="p-2">Title</th>
              <th className="p-2">Artist</th>
              <th className="p-2">Album</th>
              <th className="p-2 w-24">Size</th>
            </tr>
          </thead>
          <tbody>
            {filteredTracks.map((track, idx) => (
              <tr
                key={track.id}
                onDoubleClick={() => {
                  setCurrentTrack(track);
                  !isPlaying && togglePlay();
                }}
                className="hover:bg-neutral-800/60 cursor-pointer rounded transition"
              >
                <td className="p-2 text-neutral-500">{idx + 1}</td>
                <td className="p-2 text-white font-medium">{track.title}</td>
                <td className="p-2">{track.artist}</td>
                <td className="p-2">{track.album}</td>
                <td className="p-2 text-xs text-neutral-500">{formatBytes(track.file_size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}