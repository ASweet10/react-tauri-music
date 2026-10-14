import { useState } from 'react'
import { Play, SkipForward, SkipBack, Shuffle, Star, AudioLines, Maximize, Minimize2 } from 'lucide-react'
import VolumeSlider from './VolumeSlider'
import type { MusicTrack } from '../types/Music'

interface BottomPlayerProps {
    currentTrack: MusicTrack
}

const BottomPlayerBar = ({ currentTrack }: BottomPlayerProps) => {
    const [ volume, setVolume ] = useState(0.5)

  return (
    <footer className="h-20 bg-black border-t border-neutral-800 px-4 flex items-center justify-between">
        {/* Track Info */}
        <div className="flex gap-3">
            <img src={currentTrack.artPath} alt="" className='object-contain w-10'/>
            <div className='flex flex-col items-start'>
                <h1 className='text-sm font-bold'>{currentTrack.title}</h1>
                <h2 className='text-xs'>{currentTrack.artist}</h2>
                <h2 className='text-xs'>{currentTrack.album}</h2>
            </div>
        </div>

        {/* Playback Controls */}
        <div className="w-2/4 flex flex-col items-center">
            Playback Controls & Progress
            <h1>{volume}</h1>
        </div>

        <VolumeSlider volume={volume} onVolumeChange={setVolume}/>
    </footer>
  )
}

export default BottomPlayerBar