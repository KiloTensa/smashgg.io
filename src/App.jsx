import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import SmashGunGame from './pages/SmashGunGame';
import IntroLanding from '@/components/IntroLanding';
import { useState } from 'react';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <QueryClientProvider client={queryClientInstance}>
      {showIntro && <IntroLanding onIntroComplete={() => setShowIntro(false)} />}
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<SmashGunGame />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}

export default App