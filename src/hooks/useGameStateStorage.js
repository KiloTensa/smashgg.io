import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'smashGunGameState';
const STORAGE_VERSION = 1;
const MAX_STORAGE_ATTEMPTS = 3;

export function useGameStateStorage(gameState, setGameState) {
  const loadInitialState = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      if (parsed.version && parsed.version !== STORAGE_VERSION) {
        console.warn(`⚠️ [Storage] Versión anterior detectada (v${parsed.version}), usando estado por defecto`);
        return null;
      }

      return parsed.gameState || null;
    } catch (error) {
      console.error('❌ [Storage] Error cargando estado:', error);
      return null;
    }
  }, []);

  const saveGameState = useCallback((state) => {
    let attempts = 0;
    
    const trySave = () => {
      try {
        const toStore = {
          version: STORAGE_VERSION,
          timestamp: Date.now(),
          gameState: state,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          attempts++;
          if (attempts < MAX_STORAGE_ATTEMPTS) {
            console.warn(`⚠️ [Storage] Cuota excedida, intento ${attempts} de ${MAX_STORAGE_ATTEMPTS}`);
            try {
              localStorage.removeItem(STORAGE_KEY);
              return trySave();
            } catch (e) {
              console.error('❌ [Storage] No se pudo limpiar datos:', e);
              return false;
            }
          }
          console.error('❌ [Storage] Cuota de localStorage excedida después de', MAX_STORAGE_ATTEMPTS, 'intentos');
          return false;
        } else {
          console.error('❌ [Storage] Error guardando estado:', error);
          return false;
        }
      }
    };

    return trySave();
  }, []);

  useEffect(() => {
    if (gameState && Object.keys(gameState).length > 0) {
      const success = saveGameState(gameState);
      if (success) {
        console.debug('✓ [Storage] Estado guardado (screen:', gameState.screen, ')');
      }
    }
  }, [gameState, saveGameState]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameState) {
        saveGameState(gameState);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState, saveGameState]);

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('✓ [Storage] Estado limpiado');
      return true;
    } catch (error) {
      console.error('❌ [Storage] Error limpiando estado:', error);
      return false;
    }
  }, []);

  const getStorageInfo = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        size: new Blob([stored]).size,
        timestamp: parsed.timestamp,
        version: parsed.version,
        screen: parsed.gameState?.screen,
        playerCount: parsed.gameState?.playerCount,
      };
    } catch (error) {
      console.error('❌ [Storage] Error obteniendo info:', error);
      return null;
    }
  }, []);

  return {
    loadInitialState,
    saveGameState,
    clearStorage,
    getStorageInfo,
  };
}
