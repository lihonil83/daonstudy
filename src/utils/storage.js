import { LEARNING_STORAGE_KEYS } from '../config/storageKeys.js';

const STORAGE_EVENT_NAME = 'eduapp:storage-change';
const memoryStorage = new Map();

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function canUseLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const testKey = '__eduapp_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readRawItem(key) {
  if (canUseLocalStorage()) {
    return window.localStorage.getItem(key);
  }

  return memoryStorage.get(key) ?? null;
}

function writeRawItem(key, value) {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }

  memoryStorage.set(key, value);
}

function removeRawItem(key) {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(key);
    return;
  }

  memoryStorage.delete(key);
}

function emitStorageChange(key) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(STORAGE_EVENT_NAME, {
        detail: { key },
      }),
    );
  }
}

export function readStorageJSON(key, fallbackValue) {
  const rawValue = readRawItem(key);

  if (!rawValue) {
    return cloneValue(fallbackValue);
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return cloneValue(fallbackValue);
  }
}

export function writeStorageJSON(key, value) {
  writeRawItem(key, JSON.stringify(value));
  emitStorageChange(key);
}

export function removeStorageKey(key) {
  removeRawItem(key);
  emitStorageChange(key);
}

export function clearStorageKeys(keys) {
  keys.forEach((key) => {
    removeStorageKey(key);
  });
}

export function clearLearningData() {
  clearStorageKeys(LEARNING_STORAGE_KEYS);
}

export function subscribeStorageKey(key, callback) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleCustomEvent = (event) => {
    if (event.detail?.key === key) {
      callback();
    }
  };

  const handleNativeEvent = (event) => {
    if (event.key === key) {
      callback();
    }
  };

  window.addEventListener(STORAGE_EVENT_NAME, handleCustomEvent);
  window.addEventListener('storage', handleNativeEvent);

  return () => {
    window.removeEventListener(STORAGE_EVENT_NAME, handleCustomEvent);
    window.removeEventListener('storage', handleNativeEvent);
  };
}
