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
    coverArtUrl?: string
}
export interface AlbumSummary {
    name: string
    genre: string
    coverArtUrl?: string
}
export interface ArtistSummary {
    name: string
    albumCount: number
    coverArtUrl?: string
}

export interface Track {
    id: string
    title: string
    artist: string
    album: string
    genre: string
    duration: number
    filePathOrUrl: string
    coverArtUrl?: string
}

export type RepeatMode = 'off' | 'all' | 'one'

interface PlayerState {
    // State
    currentTrack: Track | null
    isPlaying: boolean
    volume: number
    isMuted: boolean
    currentTime: number
    queue: Track[]
    queueIndex: number
    isShuffle: boolean
    repeatMode: RepeatMode
    selectedView: MainView

    // Actions
    setCurrentTrack: (track: Track) => void
    togglePlay: () => void
    setVolume: (volume: number) => void
    toggleMute: () => void
    setCurrentTime: (time: number) => void
    setQueue: (tracks: Track[], initialIndex?: number) => void
    nextTrack: () => void
    previousTrack: () => void
    toggleShuffle: () => void
    cycleRepeatMode: () => void

    setSelectedView: (view: MainView) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    // Initial state
    currentTrack: null,
    isPlaying: false,
    volume: 0.8,
    isMuted: false,
    currentTime: 0,
    queue: [],
    queueIndex: -1,
    isShuffle: false,
    repeatMode: 'off',
    selectedView: { type: 'GENRE' } as MainView,

    // Actions
    setCurrentTrack: (track: Track) => set({ currentTrack: track, currentTime: 0 }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setVolume: (volume: number) => set({ volume, isMuted: volume === 0 }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    setCurrentTime: (time: number) => set({ currentTime: time }),
    setQueue: (tracks: Track[], initialIndex = 0) =>
        set({
            queue: tracks,
            queueIndex: initialIndex,
            currentTrack: tracks[initialIndex] || null,
            currentTime: 0,
        }),
    nextTrack: () => {
        const { queue, queueIndex, isShuffle, repeatMode } = get()
        // No other tracks in queue
        if (queue.length === 0) {
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
            nextIndex = Math.floor(Math.random() * queue.length)
        } else if (nextIndex >= queue.length) {
            // Last index & repeat all on => 0. Else => current index
            nextIndex = repeatMode === 'all' ? 0 : queueIndex
        }

        set({
            queueIndex: nextIndex,
            currentTrack: queue[nextIndex] || null,
            currentTime: 0,
        })
    },
    previousTrack: () => {
        const { queue, queueIndex, currentTime } = get()
        // Less than 3 seconds in => Restart
        if (currentTime > 3) {
            set({ currentTime: 0 })
            return
        }

        const prevIndex = queueIndex > 0 ? queueIndex - 1 : 0
        set({
            queueIndex: prevIndex,
            currentTrack: queue[prevIndex] || null,
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