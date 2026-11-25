import { Volume2, VolumeX, Volume1 } from "lucide-react"
import { usePlayerStore } from '../store/usePlayerStore'


export const VolumeSlider: React.FC = () => {
  const volume = usePlayerStore((state) => state.volume)
  const setVolume = usePlayerStore((state) => state.setVolume)
  const isMuted = usePlayerStore((state) => state.isMuted)
  const toggleMute = usePlayerStore((state) => state.toggleMute)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume) // update store directly
  }

  const currentDisplayVolume = isMuted ? 0 : volume

  return (
    <div className="flex flex-col items-center gap-4 text-white">
      <div className="flex items-center gap-3 w-full">
        <button onClick={toggleMute} aria-label="Mute Toggle" className="text-white transition">
          {volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentDisplayVolume}
          onChange={handleVolumeChange}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500"
        />

      </div>
    </div>
  );
}
