import React, { useRef, useState } from 'react'

interface PlaybackBarProps {
  currentTime: number
  duration: number
  onSeek: (newTime: number) => void
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const barRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  const calculateTimeFromEvent = (clientX: number): number => {
    if (!barRef.current || duration <= 0) return 0
    const rect = barRef.current.getBoundingClientRect()
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return (clickX / rect.width) * duration
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    onSeek(calculateTimeFromEvent(e.clientX))
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const time = calculateTimeFromEvent(e.clientX)
    setHoverTime(time)
    if (isDragging) {
      onSeek(time)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false)
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div className="flex items-center gap-3 w-full max-w-xl select-none">
      {/* Current Time */}
      <span className="text-xs text-neutral-400 w-10 text-right tabular-nums">
        {formatTime(isDragging && hoverTime !== null ? hoverTime : currentTime)}
      </span>

      {/* Interactive Hit Area (tall enough to click easily, thin visual bar inside) */}
      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setHoverTime(null)}
        className="group relative flex-1 h-4 flex items-center cursor-pointer"
      >
        {/* Background "Total Time" Bar */}
        <div className="w-full h-1 group-hover:h-1.5 transition-all duration-150 bg-neutral-800 rounded-full overflow-hidden relative">
          
          {/* Foreground "Played" Bar with MusicBee-style lighter tip */}
          <div
            className="h-full rounded-full transition-[background-color] duration-150"
            style={{
              width: `${progressPercent}%`,
              // Smooth transition into a bright highlight on the far-right leading edge
              background: isDragging
                ? 'linear-gradient(90deg, #3b82f6 85%, #93c5fd 100%)'
                : 'linear-gradient(90deg, #e5e5e5 85%, #ffffff 100%)',
            }}
          />
        </div>
      </div>

      {/* Total Time */}
      <span className="text-xs text-neutral-400 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  )
}