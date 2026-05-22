import { useState, useEffect, useCallback, useMemo } from 'react';
import Particles from '@/components/smash/Particles';
import LogoHeader from '@/components/smash/LogoHeader';
import ScreenTransition from '@/components/smash/ScreenTransition';
import MainMenu from '@/components/smash/MainMenu';
import ConfigScreen from '@/components/smash/ConfigScreen';
import SelectionScreen from '@/components/smash/SelectionScreen';
import GameScreen from '@/components/smash/GameScreen';
import WinnerModal from '@/components/smash/WinnerModal';
import VersusScreen from '@/components/smash/VersusScreen';
import BattleLog from '@/components/smash/BattleLog';
import LoadingScreen from '@/components/smash/LoadingScreen';
import smashCharacters, { DEFAULT_PLAYER_COLORS, STORAGE_KEY, DLC_CHARACTER_NAMES } from '@/lib/smashCharacters';
import { preloadImages } from '@/lib/preloadImages';
import { useGameStateStorage } from '@/hooks/useGameStateStorage';
import { isStorageAvailable } from '@/lib/storageUtils';

function getInitialState() {
  if (!isStorageAvailable()) {
    console.warn('⚠️ localStorage no disponible, usando estado por defecto');
    return null;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const gameState = parsed.gameState || parsed;
      if (!gameState.logs) gameState.logs = [];
      if (!gameState.bannedCharacters) gameState.bannedCharacters = [];
      if (!gameState.players) gameState.players = [];
      console.log('✓ Estado recuperado desde localStorage');
      return gameState;
    } catch (e) {
      console.error('❌ Error parseando estado guardado:', e);
    }
  }
  return null;
}

function createDefaultState() {
  return {
    screen: 'menu',
    playerCount: 2,
    charactersPerPlayer: 3,
    selectionMode: 'manual',
    listMode: 'shared',
    players: [],
    currentSelectionPlayer: 0,
    winnerIndex: -1,
    logs: [],
  };
}

export default function SmashGunGame() {
  const [rosterReady, setRosterReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [pendingScreen, setPendingScreen] = useState(null);

  const [gameState, setGameState] = useState(() => {
    const saved = getInitialState();
    return saved || createDefaultState();
  });

  useEffect(() => {
    let loadedCount = 0;
    const total = smashCharacters.length;
    
    smashCharacters.forEach(char => {
      const img = new Image();
      img.src = char.image;
      
      const onComplete = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / total) * 100));
        if (loadedCount === total) {
            setTimeout(() => setRosterReady(true), 600);
        }
      };

      if (img.complete) onComplete();
      else {
        img.onload = onComplete;
        img.onerror = onComplete;
      }
    });
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('✓ PWA: Service Worker activo'))
          .catch(err => console.error('❌ PWA: Error al registrar SW', err));
      });
    }
  }, []);

  // Usar hook para gestionar persistencia
  const storage = useGameStateStorage(gameState, setGameState);

  // Start preloading character images as soon as the component mounts
  // so transitions to selection/game screens are instant.
  useEffect(() => {
    const urls = smashCharacters.map(c => c.image);
    preloadImages(urls);
  }, []);

  const goToScreen = useCallback((screen) => {
    setGameState(prev => ({ ...prev, screen }));
  }, []);

  // Listen for clicks on the global logo header to return to menu
  useEffect(() => {
    const handler = () => goToScreen('menu');
    window.addEventListener('smash:goToMenu', handler);
    return () => window.removeEventListener('smash:goToMenu', handler);
  }, [goToScreen]);


  // Menu handlers
  const handleStart = () => goToScreen('config');
  const handleExit = () => {
    storage.clearStorage();
    console.log('✓ Partida anterior eliminada');
    window.location.reload();
  };

  const handleConfigContinue = (config) => {
    const players = config.players.map((p) => ({
      name: p.name,
      color: p.color,
      characters: [],
      currentCharIndex: 0,
    }));

    const newState = {
      ...gameState,
      playerCount: config.playerCount,
      charactersPerPlayer: config.charactersPerPlayer,
      selectionMode: config.selectionMode,
      listMode: config.listMode,
      excludeDLC: config.excludeDLC,
      isTeamMode: config.isTeamMode,
      bannedCharacters: config.bannedCharacters || [],
      players,
      currentSelectionPlayer: 0,
      winnerIndex: -1,
    };

    const targetScreen = config.selectionMode === 'random' ? 'versus' : 'selection';
    
    if (config.selectionMode === 'random') doRandomSelection(newState);

    if (!rosterReady) {
      setPendingScreen(targetScreen);
      newState.screen = 'loading';
    } else {
      newState.screen = targetScreen;
    }

    setGameState(newState);
  };

  useEffect(() => {
    if (rosterReady && gameState.screen === 'loading' && pendingScreen) {
      setGameState(prev => ({ ...prev, screen: pendingScreen }));
      setPendingScreen(null);
    }
  }, [rosterReady, gameState.screen, pendingScreen]);

  const doRandomSelection = (state) => {
    state.players.forEach(p => { p.characters = []; p.currentCharIndex = 0; });

    let availablePool = [...Array(smashCharacters.length).keys()];
    
    if (state.excludeDLC) {
      availablePool = availablePool.filter(idx => !DLC_CHARACTER_NAMES.includes(smashCharacters[idx].name));
    }
    
    if (state.bannedCharacters?.length > 0) {
      availablePool = availablePool.filter(idx => !state.bannedCharacters.includes(idx));
    }

    if (state.listMode === 'shared') {
      const available = [...availablePool];
      const shared = [];
      for (let i = 0; i < state.charactersPerPlayer && available.length > 0; i++) {
        const rIdx = Math.floor(Math.random() * available.length);
        shared.push(available.splice(rIdx, 1)[0]);
      }
      state.players.forEach(p => { p.characters = [...shared]; });
    } else {
      const used = new Set();
      state.players.forEach(player => {
        let available = [...availablePool].filter(i => !used.has(i));
        for (let i = 0; i < state.charactersPerPlayer && available.length > 0; i++) {
          const rIdx = Math.floor(Math.random() * available.length);
          const charIdx = available.splice(rIdx, 1)[0];
          player.characters.push(charIdx);
          used.add(charIdx);
        }
      });
    }
    state.currentSelectionPlayer = state.playerCount;
    try {
      const selectedIndices = new Set();
      state.players.forEach(p => p.characters.forEach(ci => selectedIndices.add(ci)));
      const urls = Array.from(selectedIndices).map(i => smashCharacters[i]?.image).filter(Boolean);
      if (urls.length) preloadImages(urls);
    } catch (e) {
    }
  };

  const handleSelectionUpdate = (newState) => {
    setGameState({ ...newState, screen: 'selection' });
  };

  const handleSelectionReady = () => {
    setGameState(prev => ({ ...prev, screen: 'versus' }));
  };

  const handleSelectionBack = () => {
    setGameState(prev => ({
      ...prev,
      screen: 'config',
      currentSelectionPlayer: 0,
      players: prev.players.map(p => ({ ...p, characters: [], currentCharIndex: 0 })),
    }));
  };

  const handleWinRound = (playerIndex) => {
    setGameState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const player = newState.players[playerIndex];

      const nextIndex = player.currentCharIndex + 1;
      try {
        const nextCharIdx = player.characters[nextIndex];
        if (typeof nextCharIdx === 'number') {
          const url = smashCharacters[nextCharIdx]?.image;
          if (url) preloadImages([url]);
        }
      } catch (e) {
      }

      const charName = smashCharacters[player.characters[player.currentCharIndex]]?.name || '???';
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      newState.logs.unshift({
        id: Date.now(),
        text: `${time} - ${charName} (${player.name}) fue derrotado`,
        color: player.color
      });

      if (newState.isTeamMode && (playerIndex === 0 || playerIndex === 1)) {
        newState.players[0].currentCharIndex++;
        newState.players[1].currentCharIndex++;
      } else {
        player.currentCharIndex++;
      }

      if (player.currentCharIndex >= player.characters.length) {
        newState.winnerIndex = playerIndex;
        newState.screen = 'winner';
      }

      return newState;
    });
  };

  const handleUndoRound = (playerIndex) => {
    setGameState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const player = newState.players[playerIndex];

      if (player.currentCharIndex <= 0) {
        console.warn('❌ No hay ronda anterior para deshacer');
        return prev;
      }

      if (newState.screen === 'winner') {
        console.warn('❌ No se puede deshacer después de que hay ganador');
        return prev;
      }

      player.currentCharIndex--;

      try {
        const prevCharIdx = player.characters[player.currentCharIndex];
        if (typeof prevCharIdx === 'number') {
          const url = smashCharacters[prevCharIdx]?.image;
          if (url) preloadImages([url]);
        }
      } catch (e) {
      }

      newState.logs.unshift({
        id: Date.now(),
        text: `↶ Se deshizo la derrota de ${player.name}`,
        color: '#ff4040'
      });

      console.log(`↶ [${player.name}] Ronda revertida a ${player.currentCharIndex + 1}`);
      return newState;
    });
  };

  const handleRestart = () => {
    const fresh = createDefaultState();
    fresh.screen = 'menu';
    setGameState(fresh);
  };

  const leaderColor = useMemo(() => {
    if ((gameState.screen !== 'game' && gameState.screen !== 'winner') || !gameState.players?.length) {
      return null;
    }

    let leader = gameState.players[0];
    let maxProgress = leader.currentCharIndex / (leader.characters.length || 1);

    gameState.players.forEach(p => {
      const progress = p.currentCharIndex / (p.characters.length || 1);
      if (progress > maxProgress) {
        maxProgress = progress;
        leader = p;
      }
    });

    return maxProgress > 0 ? leader.color : null;
  }, [gameState.players, gameState.screen]);

  const isFinalStretch = useMemo(() => {
    if ((gameState.screen !== 'game' && gameState.screen !== 'winner') || !gameState.players?.length) {
        return false;
    }
    return gameState.players.every(p => p.currentCharIndex === p.characters.length - 1);
  }, [gameState.players, gameState.screen]);

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden transition-all duration-1000 ease-in-out"
      style={{
        backgroundColor: isFinalStretch ? '#0a0000' : 'rgba(6, 4, 14, 1)',
        backgroundImage: isFinalStretch 
          ? `radial-gradient(circle at 50% 50%, #ff000022 0%, #0a0000 100%)`
          : leaderColor 
            ? `radial-gradient(circle at 50% 50%, ${leaderColor}15 0%, rgba(6, 4, 14, 1) 100%)`
            : 'radial-gradient(circle at 50% 50%, rgba(20, 18, 45, 1) 0%, rgba(6, 4, 14, 1) 100%)'
      }}
    >
      <Particles leaderColor={leaderColor} isFinalStretch={isFinalStretch} />
      <LogoHeader />

      <ScreenTransition screenKey={gameState.screen}>
        {gameState.screen === 'loading' && (
          <LoadingScreen progress={loadProgress} />
        )}

        {gameState.screen === 'menu' && (
          <MainMenu onStart={handleStart} onExit={handleExit} />
        )}

        {gameState.screen === 'config' && (
          <ConfigScreen
            onContinue={handleConfigContinue}
            onBack={() => goToScreen('menu')}
            savedConfig={gameState}
          />
        )}

        {gameState.screen === 'selection' && (
          <SelectionScreen
            gameState={gameState}
            onUpdateState={handleSelectionUpdate}
            onReady={handleSelectionReady}
            onBack={handleSelectionBack}
          />
        )}

        {gameState.screen === 'versus' && (
          <VersusScreen 
            players={gameState.players} 
            onComplete={() => goToScreen('game')} 
          />
        )}

        {(gameState.screen === 'game' || gameState.screen === 'winner') && (
          <GameScreen
            players={gameState.players}
            onWinRound={handleWinRound}
            onUndoRound={handleUndoRound}
          />
        )}
      </ScreenTransition>

      {gameState.screen === 'game' && (
        <BattleLog 
          logs={gameState.logs} 
          onClear={() => setGameState(prev => ({ ...prev, logs: [] }))} 
        />
      )}

      {gameState.screen === 'winner' && gameState.winnerIndex >= 0 && (
        <WinnerModal
          winnerName={gameState.players[gameState.winnerIndex]?.name}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}