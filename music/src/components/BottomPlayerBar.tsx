import { Play, Pause, SkipForward, SkipBack, Shuffle, MoveRight, Star, AudioLines, Maximize, Minimize2, Repeat, Repeat1, RepeatOff } from 'lucide-react'
import { VolumeSlider } from './VolumeSlider'
import { usePlayerStore } from '../store/usePlayerStore'
import { useAudioPlayer } from '../hooks/useAudioPlayer'

export const BottomPlayerBar: React.FC = () => {
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

  return (
    <footer className="h-20 bg-black border-t border-neutral-800 px-4 flex items-center justify-between">
        {/* Track Info */}
        <div className="flex gap-3 w-1/5 bg-red-950">
            <img src={currentTrack?.coverArtUrl} alt="" className='object-contain w-10'/>
            <div className='flex flex-col items-start'>
                <h1 className='text-sm font-bold'>{currentTrack?.title || ''}</h1>
                <h2 className='text-xs'>{currentTrack?.artist || ''}</h2>
                <h2 className='text-xs'>{currentTrack?.album || ''}</h2>
            </div>
        </div>

        {/* Playback Controls */}
        <div className="flex h-full items-center justify-evenly w-3/5 bg-green-950">
            <audio
                ref={audioPlayer.audioRef}
            />

            <div className='flex gap-4 items-center justify-between'>
                <SkipBack className='cursor-pointer hover:text-primary' onClick={previousTrack}/>
                {
                    isPlaying ? <Pause className='cursor-pointer hover:text-primary' onClick={togglePlay} /> 
                    : <Play className='cursor-pointer hover:text-primary' onClick={togglePlay}/>
                }
                <SkipForward className='cursor-pointer hover:text-primary' onClick={nextTrack}/>
            </div>
            <div className='flex text-sm gap-2'>
                <div>Time {currentTime}</div>
                <div>Rep {repeatMode}</div>
                <div>Shuf {isShuffle.toString()}</div>
                <div>Play {isPlaying.toString()}</div>
            </div>
        </div>
        
        <div className='flex items-center justify-evenly w-1/5 bg-orange-950 h-full'>
            <div className='flex gap-3'>
                <AudioLines size={18} className='cursor-pointer hover:text-primary' />
                {
                    isShuffle ? <Shuffle size={18}  className='cursor-pointer hover:text-primary' onClick={toggleShuffle} /> 
                    : <MoveRight size={18}  className='cursor-pointer hover:text-primary' onClick={toggleShuffle} />
                }
                
                {
                    repeatMode == 'off' ? <RepeatOff size={18}  className='cursor-pointer hover:text-primary' onClick={cycleRepeatMode}/>
                    : repeatMode == 'all' ? <Repeat size={18}  className='cursor-pointer hover:text-primary' onClick={cycleRepeatMode}/>
                    : <Repeat1 size={18}  className='cursor-pointer hover:text-primary' onClick={cycleRepeatMode}/>
                }
            </div>
            <VolumeSlider />
        </div>
    </footer>
  )
}