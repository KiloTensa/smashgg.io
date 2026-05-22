import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'smashGunGameState';
const STORAGE_VERSION = 1;
const MAX_STORAGE_ATTEMPTS = 3;

/**
 * Hook para gestionar la persistencia del gameState en localStorage
 * Maneja: guardado automático, recuperación, versionado y errores
 */
export function useGameStateStorage(gameState, setGameState) {
  // Cargar estado inicial desde localStorage
  const loadInitialState = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Validar versión
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

  // Guardar estado a localStorage
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
            // Intentar limpiar datos viejos
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

  // Guardar automáticamente cada cambio de gameState
  useEffect(() => {
    if (gameState && Object.keys(gameState).length > 0) {
      const success = saveGameState(gameState);
      if (success) {
        console.debug('✓ [Storage] Estado guardado (screen:', gameState.screen, ')');
      }
    }
  }, [gameState, saveGameState]);

  // Guardar antes de descargar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameState) {
        saveGameState(gameState);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState, saveGameState]);

  // Limpiar localStorage manualmente
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

  // Obtener información del almacenamiento
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
