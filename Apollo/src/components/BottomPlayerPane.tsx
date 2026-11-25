import { Play, Pause, SkipForward, SkipBack, Shuffle, MoveRight, AudioLines, Repeat, Repeat1, RepeatOff, Disc3 } from 'lucide-react'
import { GoHeart, GoHeartFill } from "react-icons/go"
import { VolumeSlider } from './VolumeSlider'
import { usePlayerStore } from '../store/usePlayerStore'
import { useLibraryStore } from '../store/useLibraryStore'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { convertFileSrc } from '@tauri-apps/api/core'
import { PlaybackBar } from './PlaybackBar'

export const BottomPlayerPane: React.FC = () => {
    const audioPlayer = useAudioPlayer()

    // Selector pattern: Component only re-renders when these specific properties change
    const currentTrack = usePlayerStore((state) => state.currentTrack)
    const currentTime = usePlayerStore((state) => state.currentTime)
    const isPlaying = usePlayerStore((state) => state.isPlaying)
    const isShuffle = usePlayerStore((state) => state.isShuffle)
    const repeatMode = usePlayerStore((state) => state.repeatMode)
    const togglePlay = usePlayerStore((state) => state.togglePlay)
    const toggleShuffle = usePlayerStore((state) => state.toggleShuffle)
    const cycleRepeatMode = usePlayerStore((state) => state.cycleRepeatMode)
    const nextTrack = usePlayerStore((state) => state.nextTrack)
    const previousTrack = usePlayerStore((state) => state.previousTrack)

    const isLiked = useLibraryStore((state) => currentTrack ? Boolean(state.likedIds[currentTrack.id]) : false)
    const toggleLike = useLibraryStore((state) => state.toggleLike)

  return (
    <footer className="h-20 bg-black border-t border-neutral-800 flex items-center justify-between">
        {/* Track Info */}
        <div className="flex gap-2 w-1/4 bg-black h-full items-center">
            <img src={currentTrack?.cover_path ? convertFileSrc(currentTrack?.cover_path) : ''} alt="" className='object-contain w-20 p-1'/>
            <div className='flex flex-col items-start justify-center'>
                <h1 className='font-bold'>{currentTrack?.title || ''}</h1>
                <h2 className='text-xs text-gray-400'>{currentTrack?.artist || ''}</h2>
                <h2 className='text-xs flex gap-1 items-center text-gray-400'><Disc3 className='w-4' /> {currentTrack?.album || ''}</h2>
            </div>
            {
                isLiked ? <GoHeartFill size={20} className='text-red-700 cursor-pointer' onClick={() => currentTrack && toggleLike(currentTrack?.id)} /> 
                : <GoHeart size={20} className='text-gray-400 cursor-pointer' onClick={() => currentTrack && toggleLike(currentTrack?.id)} />
            }
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col h-full items-center justify-evenly w-1/2 bg-black">
            <audio
                ref={audioPlayer.audioRef}
            />

            <div className='flex h-3/5 gap-6 items-center justify-between'>
                {
                    isShuffle ? <Shuffle size={16}  className='cursor-pointer text-gray-500 hover:text-primary' onClick={toggleShuffle} /> 
                    : <MoveRight size={16}  className='cursor-pointer text-gray-500 hover:text-primary' onClick={toggleShuffle} />
                }

                <div className='flex gap-4 items-center justify-between'>
                    <SkipBack size={20} className='cursor-pointer hover:text-primary' onClick={previousTrack}/>
                    {
                        isPlaying ? <Pause size={26} className='cursor-pointer hover:text-primary' onClick={togglePlay} /> 
                        : <Play size={26} className='cursor-pointer hover:text-primary' onClick={togglePlay}/>
                    }
                    <SkipForward size={20} className='cursor-pointer hover:text-primary' onClick={nextTrack}/>
                </div>

                {
                    repeatMode == 'off' ? <RepeatOff size={16}  className='cursor-pointer text-gray-500 hover:text-primary' onClick={cycleRepeatMode}/>
                    : repeatMode == 'all' ? <Repeat size={16}  className='cursor-pointer text-gray-500 hover:text-primary' onClick={cycleRepeatMode}/>
                    : <Repeat1 size={16}  className='cursor-pointer text-gray-500 hover:text-primary' onClick={cycleRepeatMode}/>
                }
            
            </div>

            <div className='flex w-full px-4 items-center justify-center'>
                <PlaybackBar 
                    currentTime={currentTime}
                    duration={audioPlayer.duration}
                    onSeek={audioPlayer.seek}
                />
            </div>

        </div>
        
        <div className='flex items-center justify-evenly w-1/4 bg-black h-full'>
            <div className='flex gap-3'>
                <AudioLines size={18} className='cursor-pointer hover:text-primary' />

                

            </div>
            <VolumeSlider />
        </div>
    </footer>
  )
}