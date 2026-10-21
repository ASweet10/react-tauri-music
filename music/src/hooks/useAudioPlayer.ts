import { useEffect, useRef } from "react"
import { usePlayerStore } from "../store/usePlayerStore"

export function useAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentTrack = usePlayerStore((state) => state.currentTrack)
    const isPlaying = usePlayerStore((state) => state.isPlaying)
    const volume = usePlayerStore((state) => state.volume)
    const isMuted = usePlayerStore((state) => state.isMuted)
    const currentTime = usePlayerStore((state) => state.currentTime)
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime)
    const nextTrack = usePlayerStore((state) => state.nextTrack)

    useEffect(() => {
        // Initialize audio object once
        const audio = new Audio()
        audioRef.current = audio
        
        // Track current time
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        // Check if listener finished
        const handleEnded = () => {
            nextTrack()
        }

        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('ended', handleEnded)
            audio.pause()
        }
    }, [setCurrentTime, nextTrack])

    // Sync Track Source
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) {
            return
        }

        if (audio.src !== currentTrack.filePathOrUrl) {
            audio.src = currentTrack.filePathOrUrl
            if (isPlaying) {
                audio.play().catch((err) => console.error('Playback error:', err))
            }
        }
    }, [currentTrack])

    // Sync Play/Pause State
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) {
            return
        }

        if (isPlaying) {
            audio.play().catch((err) => console.error('Playback error:', err))
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

    // Sync explicit seeks (Clicking seek bar)
    useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If state is reset to 0, seek the audio element back to start
    if (audio.currentTime === 0 && audio.currentTime !== 0) {
        audio.currentTime = 0;
        if (isPlaying) audio.play().catch(console.error);
    }
    }, [currentTime, isPlaying]);

    return { audioRef }
}