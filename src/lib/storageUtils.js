const LOG_PREFIX = '[Storage Utils]';

export function saveToStorage(key, data) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    console.debug(`✓ ${LOG_PREFIX} Guardado: ${key} (${(serialized.length / 1024).toFixed(2)} KB)`);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error(`❌ ${LOG_PREFIX} Cuota excedida para clave: ${key}`);
    } else {
      console.error(`❌ ${LOG_PREFIX} Error guardando ${key}:`, error);
    }
    return false;
  }
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }
    const data = JSON.parse(item);
    console.debug(`✓ ${LOG_PREFIX} Cargado: ${key}`);
    return data;
  } catch (error) {
    console.error(`❌ ${LOG_PREFIX} Error cargando ${key}:`, error);
    return defaultValue;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    console.debug(`✓ ${LOG_PREFIX} Eliminado: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ ${LOG_PREFIX} Error eliminando ${key}:`, error);
    return false;
  }
}

export function getStorageStats() {
  let totalSize = 0;
  const items = [];

  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        totalSize += size;
        items.push({
          key,
          size,
          sizeKB: (size / 1024).toFixed(2),
        });
      }
    }

    return {
      totalItems: items.length,
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      items,
    };
  } catch (error) {
    console.error(`❌ ${LOG_PREFIX} Error obteniendo estadísticas:`, error);
    return null;
  }
}

export function clearAllStorage() {
  try {
    localStorage.clear();
    console.warn(`✓ ${LOG_PREFIX} Almacenamiento local limpiado completamente`);
    return true;
  } catch (error) {
    console.error(`❌ ${LOG_PREFIX} Error limpiando almacenamiento:`, error);
    return false;
  }
}

export function isStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn(`⚠️ ${LOG_PREFIX} localStorage no disponible:`, e.message);
    return false;
  }
}
