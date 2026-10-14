import { useState, useRef, type ReactEventHandler } from "react"
import { Volume2, VolumeX, Volume1 } from "lucide-react"

interface volumeProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeSlider({ volume, onVolumeChange }: volumeProps) {
  const audioRef = useRef(null)
  const [prevVolume, setPrevVolume] = useState(0.5) // Restore volume on unmute
  const [isPlaying, setIsPlaying] = useState(false)

  // Handle slider drag/change
  const handleVolumeChange = (e: any) => {
    //const newVolume = parseFloat(e.target.value);
    //setVolume(newVolume);
    //
    //if (audioRef.current) {
    //  audioRef.current.volume = newVolume; // Update actual HTML5 audio volume
    //}
  }

  
  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume) // Save current volume
      onVolumeChange(0)
      volume = 0
    } else {
      onVolumeChange(prevVolume); // Restore previous volume
      volume = prevVolume;
    }
  }
  

  return (
    <div className="flex flex-col items-center gap-4 p-6 text-white">
      <div className="flex items-center gap-3 w-full mt-2">
        <button 
          onClick={toggleMute} 
          className="text-gray-400 hover:text-white transition"
          aria-label="Mute Toggle"
        >
          {volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500"
        />

      </div>
    </div>
  );
}
