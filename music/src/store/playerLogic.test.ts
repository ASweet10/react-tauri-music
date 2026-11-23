import { describe, it, expect, beforeEach } from 'vitest'
import { usePlayerStore, type Track } from './usePlayerStore'

const mockTracks: Track[] = [
  {
    id: '1',
    file_path: '/music/song1.mp3',
    title: 'Track One',
    artist: 'Artist A',
    album: 'Album A',
    genre: 'Metal',
    duration: 200,
    file_size: 5_000_000,
  },
  {
    id: '2',
    file_path: '/music/song2.mp3',
    title: 'Track Two',
    artist: 'Artist B',
    album: 'Album B',
    genre: '',
    duration: 180,
    file_size: 4_000_000,
  },
];

describe('Player Store Logic', () => {
  beforeEach(() => {
    // Reset store to a clean baseline before each test
    usePlayerStore.setState({
      musicLibrary: mockTracks,
      playbackQueue: mockTracks,
      queueIndex: 0,
      currentTrack: mockTracks[0],
      currentTime: 0,
      isPlaying: false,
      isShuffle: false,
      repeatMode: 'off',
    });
  });

  it('advances to the next track sequentially', () => {
    usePlayerStore.getState().nextTrack();

    const state = usePlayerStore.getState();
    expect(state.queueIndex).toBe(1);
    expect(state.currentTrack?.id).toBe('2');
    expect(state.currentTime).toBe(0);
  });

  it('restarts current track when repeatMode is one', () => {
    usePlayerStore.setState({ repeatMode: 'one', currentTime: 84 });
    usePlayerStore.getState().nextTrack();

    const state = usePlayerStore.getState();
    expect(state.queueIndex).toBe(0);
    expect(state.currentTrack?.id).toBe('1');
    expect(state.currentTime).toBe(0);
  });

  it('restarts track if currentTime is greater than 3 seconds on previousTrack', () => {
    usePlayerStore.setState({ queueIndex: 1, currentTrack: mockTracks[1], currentTime: 12 });
    usePlayerStore.getState().previousTrack();

    const state = usePlayerStore.getState();
    expect(state.queueIndex).toBe(1);
    expect(state.currentTime).toBe(0);
  });

  it('moves to previous track when currentTime is 3 seconds or less', () => {
    usePlayerStore.setState({ queueIndex: 1, currentTrack: mockTracks[1], currentTime: 2 });
    usePlayerStore.getState().previousTrack();

    const state = usePlayerStore.getState();
    expect(state.queueIndex).toBe(0);
    expect(state.currentTrack?.id).toBe('1');
  });
});