import { create } from "zustand"

export type MainView =
    | { type: 'ALL_TRACKS' }
    | { type: 'GENRE'; genreName: string }
    | { type: 'ALBUM'; albumName: string }
    | { type: 'ARTIST'; artistName: string }


/* Sorting Type - Left Sidebar */
export interface GenreSummary {
    name: string
    albumCount: number
    trackCount: number
    cover_path?: string
}
export interface AlbumSummary {
    name: string
    genre: string
    cover_path?: string
}
export interface ArtistSummary {
    name: string
    albumCount: number
    cover_path?: string
}

export interface Track {
    id: string
    title: string
    artist: string
    album: string
    genre: string
    duration: number // seconds
    file_size: number // bytes
    file_path: string
    cover_path?: string
}

export type RepeatMode = 'off' | 'all' | 'one'

interface PlayerState {
    // Data State
    musicLibrary: Track[] // All tracks scanned from SQLite
    playbackQueue: Track[] // Temporary playlist / queue
    queueIndex: number
    currentTrack: Track | null
    selectedView: MainView

    // Playback State
    isPlaying: boolean
    isShuffle: boolean
    volume: number
    isMuted: boolean
    currentTime: number
    repeatMode: RepeatMode

    // Actions
    setMusicLibrary: (tracks: Track[]) => void
    setPlaybackQueue: (tracks: Track[], initialIndex?: number) => void
    addToPlaybackQueue: (track: Track) => void // "Queue Last"
    setSelectedView: (view: MainView) => void
    setCurrentTrack: (track: Track) => void

    togglePlay: () => void
    setVolume: (volume: number) => void
    toggleMute: () => void
    setCurrentTime: (time: number) => void
    nextTrack: () => void
    previousTrack: () => void
    toggleShuffle: () => void
    cycleRepeatMode: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    // Initial state
    musicLibrary: [],
    playbackQueue: [],
    queueIndex: -1,
    currentTrack: null,
    selectedView: { type: 'GENRE' } as MainView,

    isPlaying: false,
    isShuffle: false,
    volume: 0.8,
    isMuted: false,
    currentTime: 0,
    repeatMode: 'off',


    // Actions
    setMusicLibrary: (tracks: Track[]) => set({ musicLibrary: tracks }),
    setPlaybackQueue: (tracks: Track[], initialIndex = 0) => 
        set({
            playbackQueue: tracks,
            queueIndex: initialIndex,
            currentTrack: tracks[initialIndex] || null,
            currentTime: 0
        }),
    addToPlaybackQueue: (track: Track) => 
        set((state) => ({
            playbackQueue: [...state.playbackQueue, track],
            currentTrack: state.currentTrack || track, // Play immediately if queue empty
        })),
    setCurrentTrack: (track: Track) => set({ currentTrack: track, currentTime: 0 }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setVolume: (volume: number) => set({ volume, isMuted: volume === 0 }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    setCurrentTime: (time: number) => set({ currentTime: time }),
    setQueue: (tracks: Track[], initialIndex = 0) =>
        set({
            playbackQueue: tracks,
            queueIndex: initialIndex,
            currentTrack: tracks[initialIndex] || null,
            currentTime: 0,
        }),
    nextTrack: () => {
        const { playbackQueue, queueIndex, isShuffle, repeatMode } = get()
        // No other tracks in queue
        if (playbackQueue.length === 0) {
            return
        }
        // Restart current song
        if (repeatMode == 'one') {
            set({ currentTime: 0})
            return;
        }

        let nextIndex = queueIndex + 1
        if (isShuffle) {
            // Get random track
            nextIndex = Math.floor(Math.random() * playbackQueue.length)
        } else if (nextIndex >= playbackQueue.length) {
            // Last index & repeat all on => 0. Else => current index
            nextIndex = repeatMode === 'all' ? 0 : queueIndex
        }

        set({
            queueIndex: nextIndex,
            currentTrack: playbackQueue[nextIndex] || null,
            currentTime: 0,
            isPlaying: true
        })
    },
    previousTrack: () => {
        const { playbackQueue, queueIndex, currentTime } = get()
        // Less than 3 seconds in => Restart
        if (currentTime > 3) {
            set({ currentTime: 0 })
            return
        }

        const prevIndex = queueIndex > 0 ? queueIndex - 1 : 0
        set({
            queueIndex: prevIndex,
            currentTrack: playbackQueue[prevIndex] || null,
            currentTime: 0,
        })
    },
    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
    cycleRepeatMode: () =>
        set((state) => {
            const modes: RepeatMode[] = ['off', 'all', 'one']
            const currentIndex = modes.indexOf(state.repeatMode)
            const nextMode = modes[(currentIndex + 1) % modes.length]
            return { repeatMode: nextMode }
        }),
    setSelectedView: (view: MainView) => set({ selectedView: view }),
}))