import { describe, it, expect } from 'vitest';
import { parseM3U } from './m3uParser';

describe('parseM3U', () => {
  it('parses standard Extended M3U playlist text correctly', () => {
    const sampleM3U = `
      #EXTM3U
      #EXTINF:331,Metallica - Master of Puppets
      C:\\Music\\Metallica\\MasterOfPuppets.mp3
      #EXTINF:240,Iron Maiden - The Trooper
      /home/user/music/trooper.flac
    `;

    const result = parseM3U(sampleM3U);

    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({
      durationSeconds: 331,
      artist: 'Metallica',
      title: 'Master of Puppets',
      pathOrUrl: 'C:\\Music\\Metallica\\MasterOfPuppets.mp3',
    });
    expect(result.items[1].artist).toBe('Iron Maiden');
    expect(result.items[1].pathOrUrl).toBe('/home/user/music/trooper.flac');
  });

  it('handles simple M3U files without #EXTINF metadata tags', () => {
    const simpleM3U = `
      /music/song1.mp3
      /music/song2.mp3
    `;

    const result = parseM3U(simpleM3U);

    expect(result.items).toHaveLength(2);
    expect(result.items[0].title).toBe('Unknown Title');
    expect(result.items[0].artist).toBe('Unknown Artist');
    expect(result.items[0].pathOrUrl).toBe('/music/song1.mp3');
  });
});