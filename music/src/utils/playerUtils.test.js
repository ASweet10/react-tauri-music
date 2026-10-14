import { describe, it, expect } from 'vitest';
import { formatTime, getNextTrackIndex } from './playerUtils';

describe('formatTime', () => {
  it('formats seconds into MM:SS format correctly', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(3599)).toBe('59:59');
  });

  it('handles invalid inputs gracefully', () => {
    expect(formatTime(-10)).toBe('0:00');
    expect(formatTime(NaN)).toBe('0:00');
  });
});

describe('getNextTrackIndex', () => {
  it('advances sequentially under normal playback', () => {
    const state = { currentIndex: 0, queueLength: 3, isRepeat: false, isShuffle: false };
    expect(getNextTrackIndex(state)).toBe(1);
  });

  it('wraps to the start when reaching the end of the queue', () => {
    const state = { currentIndex: 2, queueLength: 3, isRepeat: false, isShuffle: false };
    expect(getNextTrackIndex(state)).toBe(0);
  });

  it('returns current index when repeat is enabled', () => {
    const state = { currentIndex: 1, queueLength: 5, isRepeat: true, isShuffle: false };
    expect(getNextTrackIndex(state)).toBe(1);
  });
});