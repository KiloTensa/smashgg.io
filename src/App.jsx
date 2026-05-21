import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import SmashGunGame from './pages/SmashGunGame';
import Intro from '@/components/Intro';

import smashCharacters from '@/lib/smashCharacters';
import { preloadImages } from '@/lib/preloadImages';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [cacheLoaded, setCacheLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const urls = smashCharacters.map(char => char.image);
    let loadedCount = 0;
    const total = urls.length;

    // Modificamos la lógica para seguir el progreso real de la GPU
    const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
    
    const promises = uniqueUrls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          setProgress(Math.floor((loadedCount / total) * 100));
          resolve();
        };
        img.src = url;
      });
    });

    Promise.all(promises).then(() => {
      console.log('✓ [Cache Total]: Roster blindado en memoria.');
      setCacheLoaded(true);
    });
  }, []);

  
  const readyToPlay = !showIntro && cacheLoaded;

  return (
    <QueryClientProvider client={queryClientInstance}>
      {showIntro && <Intro onFinish={() => setShowIntro(false)} />}
      
      {!showIntro && !cacheLoaded && (
        <div className="fixed inset-0 bg-[#04040e] z-50 flex flex-col items-center justify-center font-smash">
          <div className="text-white text-xl tracking-widest mb-4 animate-pulse">
            PREPARANDO COMBATIENTES
          </div>
          <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <div 
              className="h-full bg-cyan-500 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white/40 text-xs mt-2 tracking-wide font-mono">
            {progress}% CACHED
          </div>
        </div>
      )}

      {readyToPlay && (
        <Router basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<SmashGunGame />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </Router>
      )}
    </QueryClientProvider>
  )
}

export default App;