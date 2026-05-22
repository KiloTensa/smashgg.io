// 🎮 SMASH GUN GAME - QUICK STORAGE REFERENCE
// ============================================

// ✅ AUTOMATIZADO (No requiere código adicional):
// - El estado se guarda automáticamente en cada cambio
// - Se guarda al recargar la página
// - Se guarda antes de cerrar la pestaña

// 📌 USAR EN TUS COMPONENTES:

// 1. Acceder al hook en SmashGunGame.jsx:
import { useGameStateStorage } from '@/hooks/useGameStateStorage';

const storage = useGameStateStorage(gameState, setGameState);

// 2. Funciones disponibles:
storage.loadInitialState()    // Carga estado guardado
storage.saveGameState(state)  // Guarda manualmente
storage.clearStorage()        // Elimina todo del storage
storage.getStorageInfo()      // Info del almacenamiento


// 🛠️ FUNCIONES UTILITARIAS (Para cualquier clave):

import { 
  saveToStorage,      // saveToStorage('key', data)
  loadFromStorage,    // loadFromStorage('key', defaultValue)
  removeFromStorage,  // removeFromStorage('key')
  getStorageStats,    // getStorageStats()
  isStorageAvailable  // isStorageAvailable()
} from '@/lib/storageUtils';


// 🐛 DEBUGGING:

// Agregar en SmashGunGame.jsx para ver estado en tiempo real:
import StorageDebugger from '@/components/smash/StorageDebugger';
// <StorageDebugger />


// 📊 QUÉ SE GUARDA:
// {
//   version: 1,
//   timestamp: Date.now(),
//   gameState: {
//     screen: 'game',
//     playerCount: 2,
//     charactersPerPlayer: 3,
//     selectionMode: 'manual',
//     listMode: 'shared',
//     players: [...],
//     currentSelectionPlayer: 0,
//     winnerIndex: -1
//   }
// }


// 🔧 LIMPAR MANUALMENTE (Consola del navegador):
// localStorage.removeItem('smashGunGameState');
// location.reload();
