import React, { useMemo } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import { formatTotalDuration } from '../utils/formatters'
import { convertFileSrc } from '@tauri-apps/api/core'
import { useLibraryStore } from '../store/useLibraryStore'
import { GoHeart, GoHeartFill } from "react-icons/go"
import cat from '../cat.webp'

export const CenterPane: React.FC = () => {

  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const queue = usePlayerStore((state) => state.playbackQueue)
  const selectedView = usePlayerStore((state) => state.selectedView) 
  //const setQueue = usePlayerStore((state) => state.setPlaybackQueue)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack)

  const likedIds = useLibraryStore((state) => state.likedIds)
  const toggleLike = useLibraryStore((state) => state.toggleLike)

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
            {filteredTracks.map((track, idx) => {
              const rowIsLiked = Boolean(likedIds[track.id])
              return (
              <tr key={track.id} onDoubleClick={() => { setCurrentTrack(track); !isPlaying && togglePlay(); }}
                className="hover:bg-neutral-800/60 cursor-pointer rounded transition"
              >
                {/* <td className="p-2 text-neutral-500">{idx + 1}</td> */}
                <td className="h-10 w-10 object-contain">
                  <img src={track.cover_path ? convertFileSrc(track.cover_path) : cat} alt={viewTitle} className="w-full h-full object-cover" />
                </td>
                <td className="p-2 text-[13px]  text-white font-medium">{track.title}</td>
                <td className="p-2 text-[13px] ">{track.artist}</td>
                <td className="p-2 text-[13px] ">{track.album}</td>
                <td className="p-2 text-[13px]  text-center">{ Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</td>
                <td className="p-2 text-[13px]  w-12">
                  {            
                    rowIsLiked ? <GoHeartFill size={20} className='text-red-700 cursor-pointer' onClick={(e) => { e.stopPropagation(); toggleLike(track.id)}} /> 
                    : <GoHeart size={20} className='text-gray-400 cursor-pointer' onClick={(e) => { e.stopPropagation(); toggleLike(track.id)}} />
                  }
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </main>
  )
}