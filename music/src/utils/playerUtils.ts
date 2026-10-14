export interface PlayerState {
    currentIndex: number;
    queueLength: number;
    isRepeat: boolean;
    isShuffle: boolean;
}

// Formats track duration in seconds to MM:SS format
export function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Determines the next track index based on playback state
export function getNextTrackIndex(state: PlayerState) {
  const { currentIndex, queueLength, isRepeat, isShuffle } = state;
  
  if (queueLength === 0) return -1;
  if (isRepeat) return currentIndex;
  
  if (isShuffle) {
    if (queueLength === 1) return 0;
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * queueLength);
    } while (nextIndex === currentIndex);
    return nextIndex;
  }

  // Standard sequential queue wrap
  return (currentIndex + 1) % queueLength;
}