# LocalStorage Persistence - Sistema de Almacenamiento

## 📋 Descripción General

El juego Smash Gun Game ahora tiene un **sistema robusto de persistencia de datos** que permite guardar automáticamente:

✅ Configuración de la partida (número de jugadores, caracteres por jugador, etc.)  
✅ Progreso del juego (personajes seleccionados, rondas ganadas)  
✅ Nombres de jugadores  
✅ Pantalla actual  
✅ Estado de todo jugador

Si el usuario recarga la página, **vuelve exactamente donde estaba**.

---

## 🔧 Componentes Principales

### 1. **useGameStateStorage Hook** 📌
Ubicación: `src/hooks/useGameStateStorage.js`

Hook especializado que gestiona la persistencia del estado completo del juego.

```javascript
import { useGameStateStorage } from '@/hooks/useGameStateStorage';

function MyComponent() {
  const [gameState, setGameState] = useState(initialState);
  const storage = useGameStateStorage(gameState, setGameState);
  
  // storage.loadInitialState() - Carga estado inicial
  // storage.saveGameState(state) - Guarda manualmente
  // storage.clearStorage() - Limpia localStorage
  // storage.getStorageInfo() - Obtiene info del almacenamiento
}
```

**Características:**
- ✓ Guardado automático en cada cambio de estado
- ✓ Guardado preventivo al cerrar/recargar página
- ✓ Manejo robusto de errores
- ✓ Versionado de schema para migraciones futuras
- ✓ Manejo de cuota excedida de localStorage

---

### 2. **StorageUtils** 🛠️
Ubicación: `src/lib/storageUtils.js`

Utilidades generales para trabajar con localStorage.

```javascript
import { 
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  getStorageStats,
  isStorageAvailable 
} from '@/lib/storageUtils';

// Guardar datos
saveToStorage('myKey', { data: 'value' });

// Cargar datos con valor por defecto
const data = loadFromStorage('myKey', defaultValue);

// Obtener estadísticas
const stats = getStorageStats();
console.log(stats.totalSizeKB); // p.ej: "15.25"

// Verificar disponibilidad
if (isStorageAvailable()) {
  // localStorage está disponible
}
```

**Funciones disponibles:**
| Función | Descripción |
|---------|-------------|
| `saveToStorage(key, data)` | Guarda datos en localStorage |
| `loadFromStorage(key, default)` | Carga datos con fallback |
| `removeFromStorage(key)` | Elimina una clave |
| `getStorageStats()` | Estadísticas de uso |
| `clearAllStorage()` | Limpia todo localStorage |
| `isStorageAvailable()` | Verifica disponibilidad |

---

### 3. **StorageDebugger Component** 🐛
Ubicación: `src/components/smash/StorageDebugger.jsx`

Componente visual para debugging y monitoreo en tiempo real.

```javascript
import StorageDebugger from '@/components/smash/StorageDebugger';

function App() {
  return (
    <div>
      {/* ... contenido ... */}
      <StorageDebugger /> {/* Botón flotante en esquina inferior derecha */}
    </div>
  );
}
```

**Características:**
- 💾 Muestra tamaño actual en KB
- 📱 Pantalla actual
- 👥 Número de jugadores
- 🔢 Versión del schema
- ⏰ Timestamp de última actualización
- 🔄 Se actualiza cada 5 segundos

---

## 💾 Estructura del Almacenamiento

La clave `smashGunGameState` almacena:

```javascript
{
  version: 1,                    // Control de versión
  timestamp: 1234567890,         // Cuándo se guardó
  gameState: {
    screen: 'game',              // Pantalla actual
    playerCount: 2,              // Número de jugadores
    charactersPerPlayer: 3,      // Caracteres por jugador
    selectionMode: 'manual',     // manual | random
    listMode: 'shared',          // shared | unique
    players: [
      {
        name: 'Jugador 1',
        characters: [0, 5, 12],   // Índices de personajes
        currentCharIndex: 1,      // Personaje actual
        color: '#FFD700'
      },
      // ... más jugadores
    ],
    currentSelectionPlayer: 0,
    winnerIndex: -1
  }
}
```

---

## 🚀 Cómo Funciona

### Guardado Automático
El estado se guarda automáticamente en **3 momentos**:

1. **En tiempo real**: Cada cambio de `gameState`
2. **Al navegar**: Evento `beforeunload` antes de cerrar/recargar
3. **Manual**: Llamando a `storage.saveGameState(state)`

### Recuperación
Al cargar la aplicación:
1. Lee localStorage con la clave `smashGunGameState`
2. Valida la versión del schema
3. Restaura el estado completo
4. Si no hay estado o es inválido, comienza nuevo

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Guardar estado personalizado
```javascript
const handleCustomSave = () => {
  const customData = {
    ...gameState,
    customField: 'value'
  };
  storage.saveGameState(customData);
};
```

### Ejemplo 2: Obtener información del storage
```javascript
const info = storage.getStorageInfo();
if (info) {
  console.log(`${info.size} bytes`);
  console.log(`Screen: ${info.screen}`);
  console.log(`${info.playerCount} jugadores`);
}
```

### Ejemplo 3: Limpiar storage
```javascript
const handleClearData = () => {
  storage.clearStorage();
  // Luego recargar página
  window.location.reload();
};
```

### Ejemplo 4: Verificar cuota disponible
```javascript
const stats = getStorageStats();
const maxSize = 5 * 1024 * 1024; // 5 MB (típico)
const available = maxSize - stats.totalSize;
console.log(`Disponible: ${(available / 1024).toFixed(2)} KB`);
```

---

## ⚠️ Límites y Consideraciones

| Aspecto | Detalles |
|---------|----------|
| **Cuota** | 5-10 MB por dominio (varía por navegador) |
| **Sincronización** | No sincroniza entre tabs automáticamente |
| **Privado** | No persiste en navegación privada/incógnita |
| **Tiempo** | localStorage es síncrono, evitar grandes datos |
| **Seguridad** | No cifrado, evitar datos sensibles |

---

## 🔄 Migraciones Futuras

El sistema soporta versionado para futuras migraciones:

```javascript
// En useGameStateStorage.js
const STORAGE_VERSION = 2; // Incrementar versión

// Agregar lógica de migración
if (parsed.version === 1) {
  // Migrar datos del formato v1 al v2
  newState = migrateFromV1(parsed);
}
```

---

## 🧪 Testing y Debugging

### Limpiar estado manualmente (DevTools)
```javascript
// En la consola del navegador:
localStorage.removeItem('smashGunGameState');
location.reload();
```

### Ver todo el almacenamiento
```javascript
console.table(
  Object.entries(localStorage).map(([k, v]) => ({ key: k, size: new Blob([v]).size }))
);
```

### Usar StorageDebugger
Importar en `SmashGunGame.jsx`:
```javascript
import StorageDebugger from '@/components/smash/StorageDebugger';

// En el return:
return (
  <div>
    {/* ... contenido ... */}
    <StorageDebugger />
  </div>
);
```

---

## ✅ Checklist de Implementación

- [x] Hook `useGameStateStorage` creado
- [x] Utilidades `storageUtils.js` creadas
- [x] Componente `StorageDebugger` creado
- [x] `SmashGunGame.jsx` mejorado con el hook
- [x] Manejo robusto de errores
- [x] Versionado de schema
- [x] Manejo de cuota excedida
- [x] Guardado preventivo en beforeunload
- [ ] Tests unitarios (opcional)
- [ ] Sincronización entre tabs (mejora futura)

---

## 📝 Notas de Desarrollo

**Console Logs:**
- ✓ Indica guardado exitoso
- ❌ Indica error
- ⚠️ Indica advertencia
- 💾 Debugger visual

Todos los logs incluyen prefijo `[Storage]` o `[Storage Utils]` para fácil filtrado en DevTools.

