import { useEffect, useRef, useCallback, useState } from "react"
import { usePlayerStore } from "../store/usePlayerStore"
import { useLibraryStore } from "../store/useLibraryStore"
import { convertFileSrc } from "@tauri-apps/api/core"

export function useAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const countCurrentPlayRef = useRef(false)
    const [ duration, setDuration ] = useState(0)

    const incrementPlayCount = useLibraryStore((state) => state.incrementPlayCount)

    const currentTrack = usePlayerStore((state) => state.currentTrack)
    const isPlaying = usePlayerStore((state) => state.isPlaying)
    const volume = usePlayerStore((state) => state.volume)
    const isMuted = usePlayerStore((state) => state.isMuted)
    const currentTime = usePlayerStore((state) => state.currentTime)
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime)
    const nextTrack = usePlayerStore((state) => state.nextTrack)

    // Keep latest currentTrack accessible inside event listeners without recreating <audio>
    const currentTrackRef = useRef(currentTrack)
    useEffect(() => {
        currentTrackRef.current = currentTrack
    }, [currentTrack])

    // Initialize audio object once
    useEffect(() => {
        const audio = new Audio()
        audioRef.current = audio
        
        const handleLoadedMetadata = () => {
            setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
        }
        const handleTimeUpdate = () => {
            const current = audio.currentTime
            const total = Number.isFinite(audio.duration) ? audio.duration : 0
            const track = currentTrackRef.current

            setCurrentTime(current)
            
             // Add to local play count if past 50%
            if (track && !countCurrentPlayRef.current && total > 0 && current / total >= 0.5) {
                countCurrentPlayRef.current = true
                incrementPlayCount(track.id)
            }
        }

        // Check if listener finished
        const handleEnded = () => {
            nextTrack()
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('ended', handleEnded)
            audio.pause()
        }
    }, [setCurrentTime, nextTrack, incrementPlayCount])

    // Sync Track Source & reset play-count flag on track change
    useEffect(() => {
        const audio = audioRef.current
        countCurrentPlayRef.current = false

        if (!audio || !currentTrack) {
            setDuration(0)
            return
        }
        
        const assetUrl = convertFileSrc(currentTrack.file_path)
        if (audio.src !== assetUrl) {
            audio.src = assetUrl
            setCurrentTime(0)
        }

        if (isPlaying) {
            audio.play().catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Playback error:', err)
                }
            })
        }
    }, [currentTrack, setCurrentTime])

    // Sync Play/Pause State
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) {
            return
        }
        
        if (isPlaying) {
            audio.play().catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Playback error:', err)
                }
            })
        } else {
            audio.pause()
        }
    }, [isPlaying, currentTrack])

    // Sync Volume & Mute
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) {
            return
        }

        audio.volume = isMuted ? 0 : volume
    }, [volume, isMuted])

    // Scrub / seek handler passed to <PlaybackBar onSeek={} />
    const seek = useCallback(
        (newTime: number) => {
            const audio = audioRef.current
            if(!audio) {
                return
            }

            const maxDuration = Number.isFinite(audio.duration) ? audio.duration : duration
            const clampedTime = Math.max(0, Math.min(newTime, maxDuration || newTime))

            audio.currentTime = clampedTime
            setCurrentTime(clampedTime)
        },
        [duration, setCurrentTime]
    )

    return { audioRef, duration, seek }
}