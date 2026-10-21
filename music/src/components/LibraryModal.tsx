import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog'

interface LibrarySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LibrarySettingsModal: React.FC<LibrarySettingsModalProps> = ({ isOpen, onClose }) => {
  const [libraryPaths, setLibraryPaths] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  // Trigger Native Folder Picker via Tauri Dialog Plugin
  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Music Library Directory',
      });

      if (selected && typeof selected === 'string') {
        if (!libraryPaths.includes(selected)) {
          setLibraryPaths((prev) => [...prev, selected]);
          await handleScanFolder(selected);
        }
      }
    } catch (err) {
      console.error('Error selecting folder:', err);
    }
  };

  // Invoke Rust Scan Command
  const handleScanFolder = async (path: string) => {
    setIsScanning(true);
    setStatusMessage(`Scanning ${path}...`);

    try {
      const count = await invoke<number>('scan_directory', { dirPath: path });
      setStatusMessage(`Successfully scanned ${count} tracks!`);
    } catch (err) {
      setStatusMessage(`Scan failed: ${String(err)}`);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-bold text-white">Library Settings</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white font-bold cursor-pointer">
            ✕
          </button>
        </div>

        {/* Managed Library Folders List */}
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
                  <span className="truncate text-neutral-300 w-3/4">{path}</span>
                  <button 
                    onClick={() => handleScanFolder(path)} 
                    disabled={isScanning}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded text-white disabled:opacity-50"
                  >
                    Rescan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSelectFolder}
          disabled={isScanning}
          className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded text-sm transition disabled:opacity-50 cursor-pointer"
        >
          {isScanning ? 'Scanning...' : 'Add Path'}
        </button>

        {/* Status Message */}
        {statusMessage && (
          <p className="text-xs text-neutral-400 text-center mt-1">{statusMessage}</p>
        )}
      </div>
    </div>
  );
};