import { create } from "zustand"
import { invoke } from "@tauri-apps/api/core"

interface TrackStatRow {
    track_id: string
    is_liked: boolean
    play_count: number
}

interface LibraryState {
    likedIds: Record<string, boolean> // 0(1) lookup: likedIds[track.id]
    playCounts: Record<string, number>
    isLoaded: boolean
    
    loadStats: () => Promise<void>
    toggleLike: (trackId: string) => Promise<void>
    incrementPlayCount: (trackId: string) => Promise<void>
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    // Initial state
    likedIds: {},
    playCounts: {},
    isLoaded: false,

    // Actions
    loadStats: async () => {
        try {
            const rows = await invoke<TrackStatRow[]>("get_track_stats")
            const likedIds: Record<string, boolean> = {}
            const playCounts: Record<string, number> = {}

            for (const row of rows) {
                likedIds[row.track_id] = row.is_liked
                playCounts[row.track_id] = row.play_count
            }

            set({ likedIds, playCounts, isLoaded: true })
        } catch (err) {
            console.error("Failed to load track stats:", err)
        }
    },

    toggleLike: async (trackId) => {
        const nextLiked = !get().likedIds[trackId]
        // Optimistic UI update
        set((state) => ({ 
            likedIds: {
                ...state.likedIds,
                [trackId]: nextLiked
            },
        }))

        // Persist to SQLite
        try {
            await invoke("set_track_liked", {
                trackId,
                isLiked: nextLiked
            })
        } catch(err) {
            console.log("Failed to persist like:", err)
        }
    },

    incrementPlayCount: async (trackId) => {
        const nextCount = (get().playCounts[trackId] ?? 0) + 1

        // Optimistic UI update
        set((state) => ({ 
            playCounts: {
                ...state.playCounts,
                [trackId]: nextCount
            },
        }))

        // Persist to SQLite
        try {
            const dbCount = await invoke<number>("increment_track_play_count", {
                trackId,
            })

            set((state) => ({
                playCounts: {
                    ...state.playCounts,
                    [trackId]: dbCount,
                }
            }))
        } catch(err) {
            console.log("Failed to persist playcount:", err)
        }
    },
}))