export interface MusicTrack {
  id: string;
  artist: string;
  title: string;
  album: string;
  durationSeconds: number;
  artPath: string;
  musicPath: string;
}

export interface MusicPlaylist {
  title?: string;
  items: MusicTrack[];
}