import { type Track } from "../store/usePlayerStore"

export interface MusicPlaylist {
  title?: string
  items: Track[]
}