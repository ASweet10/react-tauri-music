import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { fetchAllTracks } from '../db/queries';
import { usePlayerStore } from '../store/usePlayerStore';

interface LibrarySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LibrarySettingsModal: React.FC<LibrarySettingsModalProps> = ({ isOpen, onClose }) => {
  const [libraryPaths, setLibraryPaths] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  const setMusicLibrary = usePlayerStore((state) => state.setMusicLibrary);

  useEffect(() => {
    if (isOpen) {
      loadDirectories();
    }
  }, [isOpen]);

  const loadDirectories = async () => {
    try {
      const paths = await invoke<string[]>('get_directories');
      setLibraryPaths(paths);
    } catch (err) {
      console.error('Failed to load directories from DB:', err);
    }
  };

  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Music Library Directory',
      });

      if (selected && typeof selected === 'string') {
        if (!libraryPaths.includes(selected)) {
          // Save directory via Rust command
          await invoke('add_directory', { path: selected });
          
          setLibraryPaths((prev) => [...prev, selected]);
          await handleScanFolder(selected);
        }
      }
    } catch (err) {
      console.error('Error selecting folder:', err);
    }
  };

  const handleDeletePath = async (pathToRemove: string) => {
    try {
      await invoke('delete_directory', { path: pathToRemove });
      setLibraryPaths((prev) => prev.filter((p) => p !== pathToRemove));
      setStatusMessage(`Removed ${pathToRemove} from library.`);
    } catch (err) {
      console.error('Failed to delete directory:', err);
    }
  };

  const handleScanFolder = async (path: string) => {
    setIsScanning(true);
    setStatusMessage(`Scanning ${path}...`);

    try {
      const count = await invoke<number>('scan_directory', { dirPath: path });
      setStatusMessage(`Successfully scanned ${count} tracks!`);

      const updatedTracks = await fetchAllTracks();
      if (updatedTracks.length > 0) {
        setMusicLibrary(updatedTracks);
      }
    } catch (err) {
      setStatusMessage(`Scan failed: ${String(err)}`);
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-bold text-white">Library Settings</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Music Folders
          </label>
          
          {libraryPaths.length === 0 ? (
            <p className="text-sm text-neutral-500 italic">No music folders added yet.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {libraryPaths.map((path) => (
                <div key={path} className="flex items-center justify-between bg-neutral-950 p-2.5 rounded border border-neutral-800 text-xs">
                  <span className="truncate text-neutral-300 w-2/3" title={path}>{path}</span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleScanFolder(path)} 
                      disabled={isScanning}
                      className="text-xs bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded text-white disabled:opacity-50 cursor-pointer"
                    >
                      Rescan
                    </button>
                    <button 
                      onClick={() => handleDeletePath(path)} 
                      disabled={isScanning}
                      className="text-xs bg-red-950/60 hover:bg-red-900 text-red-300 px-2 py-1 rounded transition cursor-pointer"
                      title="Remove folder path"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSelectFolder}
          disabled={isScanning}
          className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded text-sm transition disabled:opacity-50 cursor-pointer"
        >
          {isScanning ? 'Scanning...' : 'Add Path'}
        </button>

        {statusMessage && (
          <p className="text-xs text-neutral-400 text-center mt-1">{statusMessage}</p>
        )}
      </div>
    </div>
  );
};