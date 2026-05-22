import { useEffect, useState } from 'react';
import { getStorageInfo } from '@/lib/storageUtils';
import { STORAGE_KEY } from '@/lib/smashCharacters';

export default function StorageDebugger() {
  const [storageInfo, setStorageInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateInfo = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const size = new Blob([stored]).size;
          setStorageInfo({
            size: size,
            sizeKB: (size / 1024).toFixed(2),
            timestamp: parsed.timestamp,
            version: parsed.version || 'legacy',
            screen: parsed.gameState?.screen || parsed.screen,
            playerCount: parsed.gameState?.playerCount || parsed.playerCount,
          });
        } else {
          setStorageInfo(null);
        }
      } catch (error) {
        console.error('Error actualizando storage info:', error);
      }
    };

    updateInfo();
    const interval = setInterval(updateInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!storageInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 font-mono text-xs z-40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-2 py-1 rounded bg-cyan-900/50 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/80 transition-colors"
        title="Storage Debugger"
      >
        💾 {storageInfo.sizeKB} KB
      </button>

      {isExpanded && (
        <div className="absolute bottom-8 right-0 bg-black/90 border border-cyan-500/50 rounded p-3 min-w-[220px] text-cyan-300 space-y-1">
          <div>Screen: <span className="text-yellow-400">{storageInfo.screen}</span></div>
          <div>Players: <span className="text-yellow-400">{storageInfo.playerCount}</span></div>
          <div>Version: <span className="text-yellow-400">{storageInfo.version}</span></div>
          <div>Size: <span className="text-yellow-400">{storageInfo.sizeKB} KB</span></div>
          <div className="text-cyan-500 text-[10px] mt-2">
            Updated: {new Date(storageInfo.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}
