/* 
    M3U is line-by-line plaintext format. Uses EXTINF for metadata
    #EXTM3U
    #EXTINF:220,Metallica - Enter Sandman
    C:\Users\Music\Metallica\Enter Sandman.mp3
    #EXTINF:180,Megadeth - Holy Wars
    https://stream.example.com/holywars.mp3
*/

import { type PlaylistItem, type ParsedPlaylist } from "../types/Music"

export function parseM3U(content: string): ParsedPlaylist {
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const items: PlaylistItem[] = [];

  let currentDuration = -1;
  let currentArtist = 'Unknown Artist';
  let currentTitle = 'Unknown Title';

  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      // Line format: #EXTINF:duration,Artist - Title OR #EXTINF:duration,Title
      const metadataStr = line.replace('#EXTINF:', '');
      const commaIndex = metadataStr.indexOf(',');

      if (commaIndex !== -1) {
        const rawDuration = metadataStr.substring(0, commaIndex);
        currentDuration = parseInt(rawDuration, 10) || -1;

        const infoStr = metadataStr.substring(commaIndex + 1).trim();
        const dashIndex = infoStr.indexOf(' - ');

        if (dashIndex !== -1) {
          currentArtist = infoStr.substring(0, dashIndex).trim();
          currentTitle = infoStr.substring(dashIndex + 3).trim();
        } else {
          currentArtist = 'Unknown Artist';
          currentTitle = infoStr;
        }
      }
    } else if (!line.startsWith('#')) {
      // Non-comment lines represent local file paths or web stream URLs
      items.push({
        durationSeconds: currentDuration,
        artist: currentArtist,
        title: currentTitle,
        pathOrUrl: line,
      });

      // Reset item metadata defaults for next entry
      currentDuration = -1;
      currentArtist = 'Unknown Artist';
      currentTitle = 'Unknown Title';
    }
  }

  return { items };
}