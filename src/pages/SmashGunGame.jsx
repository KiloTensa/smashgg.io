import { useState, useEffect, useCallback } from 'react';
import Particles from '@/components/smash/Particles';
import LogoHeader from '@/components/smash/LogoHeader';
import ScreenTransition from '@/components/smash/ScreenTransition';
import MainMenu from '@/components/smash/MainMenu';
import ConfigScreen from '@/components/smash/ConfigScreen';
import SelectionScreen from '@/components/smash/SelectionScreen';
import GameScreen from '@/components/smash/GameScreen';
import WinnerModal from '@/components/smash/WinnerModal';
import smashCharacters, { DEFAULT_PLAYER_COLORS, STORAGE_KEY } from '@/lib/smashCharacters';

function getInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) { /* ignore */ }
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
  };
}

export default function SmashGunGame() {
  const [gameState, setGameState] = useState(() => {
    const saved = getInitialState();
    return saved || createDefaultState();
  });

  // Save to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Save on beforeunload
  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [gameState]);

  const goToScreen = useCallback((screen) => {
    setGameState(prev => ({ ...prev, screen }));
  }, []);

  // Menu handlers
  const handleStart = () => goToScreen('config');
  const handleExit = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  // Config handler
  const handleConfigContinue = (config) => {
    const players = config.playerNames.map((name, i) => ({
      name,
      characters: [],
      currentCharIndex: 0,
      color: DEFAULT_PLAYER_COLORS[i % DEFAULT_PLAYER_COLORS.length],
    }));

    const newState = {
      ...gameState,
      playerCount: config.playerCount,
      charactersPerPlayer: config.charactersPerPlayer,
      selectionMode: config.selectionMode,
      listMode: config.listMode,
      players,
      currentSelectionPlayer: 0,
      winnerIndex: -1,
    };

    if (config.selectionMode === 'random') {
      // Random selection
      doRandomSelection(newState);
      newState.screen = 'game';
    } else {
      newState.screen = 'selection';
    }

    setGameState(newState);
  };

  const doRandomSelection = (state) => {
    state.players.forEach(p => { p.characters = []; p.currentCharIndex = 0; });

    if (state.listMode === 'shared') {
      const available = [...Array(smashCharacters.length).keys()];
      const shared = [];
      for (let i = 0; i < state.charactersPerPlayer && available.length > 0; i++) {
        const rIdx = Math.floor(Math.random() * available.length);
        shared.push(available.splice(rIdx, 1)[0]);
      }
      state.players.forEach(p => { p.characters = [...shared]; });
    } else {
      const used = new Set();
      state.players.forEach(player => {
        let available = [...Array(smashCharacters.length).keys()].filter(i => !used.has(i));
        for (let i = 0; i < state.charactersPerPlayer && available.length > 0; i++) {
          const rIdx = Math.floor(Math.random() * available.length);
          const charIdx = available.splice(rIdx, 1)[0];
          player.characters.push(charIdx);
          used.add(charIdx);
        }
      });
    }
    state.currentSelectionPlayer = state.playerCount;
  };

  // Selection handlers
  const handleSelectionUpdate = (newState) => {
    setGameState({ ...newState, screen: 'selection' });
  };

  const handleSelectionReady = () => {
    setGameState(prev => ({ ...prev, screen: 'game' }));
  };

  const handleSelectionBack = () => {
    setGameState(prev => ({
      ...prev,
      screen: 'config',
      currentSelectionPlayer: 0,
      players: prev.players.map(p => ({ ...p, characters: [], currentCharIndex: 0 })),
    }));
  };

  // Game handler
  const handleWinRound = (playerIndex) => {
    setGameState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const player = newState.players[playerIndex];
      player.currentCharIndex++;

      if (player.currentCharIndex >= player.characters.length) {
        newState.winnerIndex = playerIndex;
        newState.screen = 'winner';
      }

      return newState;
    });
  };

  // Restart
  const handleRestart = () => {
    const fresh = createDefaultState();
    fresh.screen = 'menu';
    setGameState(fresh);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Particles />
      <LogoHeader />

      <ScreenTransition screenKey={gameState.screen}>
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

        {(gameState.screen === 'game' || gameState.screen === 'winner') && (
          <GameScreen
            players={gameState.players}
            onWinRound={handleWinRound}
          />
        )}
      </ScreenTransition>

      {gameState.screen === 'winner' && gameState.winnerIndex >= 0 && (
        <WinnerModal
          winnerName={gameState.players[gameState.winnerIndex]?.name}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}