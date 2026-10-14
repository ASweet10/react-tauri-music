
import BottomPlayerBar from './components/BottomPlayerBar'
import CenterPane from './components/CenterPane'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import type { MusicTrack } from './types/Music'
import coolcat from './assets/coolcat.jpg'

export default function App() {
  const currentTrack: MusicTrack = {
      id: `${Date.now()}`,
      artist: "Meshuggah",
      title: "Dancers to a Discordant System",
      album: "Obzen",
      durationSeconds: 264,
      artPath: coolcat,
      musicPath: coolcat
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 text-white overflow-hidden select-none">
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        <LeftSidebar />
        <CenterPane currentTrack={currentTrack} />
        <RightSidebar />
      </div>

      <BottomPlayerBar currentTrack={currentTrack} />
    </div>
  );
}