import React, { useState } from 'react';
import { LibrarySettingsModal } from '../components/LibraryModal'
import { useHydrateLibrary } from '../hooks/useHydrateLibrary';

const LeftSidebar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const library = useHydrateLibrary()

  return (
    <>
      <aside className="w-64 bg-neutral-900 rounded-lg flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="font-bold text-neutral-400 text-lg uppercase tracking-wider hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            Library
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      <LibrarySettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  )
}

export default LeftSidebar