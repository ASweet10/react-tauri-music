
import { BottomPlayerBar } from './components/BottomPlayerBar'
import CenterPane from './components/CenterPane'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import { useHydrateLibrary } from './hooks/useHydrateLibrary'
import coolcat from './assets/coolcat.jpg'

export default function App() {
  const { isLoading } = useHydrateLibrary()

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 text-white overflow-hidden select-none">
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        <LeftSidebar />
        <CenterPane />
        <RightSidebar />

        {
          isLoading && (
            <div className="h-screen w-screen bg-neutral-950 text-white flex items-center justify-center">
              <span className="text-sm text-neutral-400">Loading library...</span>
            </div>
          )
        }
      </div>

      <BottomPlayerBar />
    </div>
  );
}