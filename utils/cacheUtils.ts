// File: /src/utils/cacheUtils.ts

interface CachedData<T> {
  data: T;
  timestamp: number;
}

const CACHE_EXPIRATION = 30 * 60 * 1000; // 30 minutes

const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const setCachedData = <T>(key: string, data: T): void => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available. Caching disabled.");
    return;
  }

  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error setting cached data:", error);
  }
};

export const getCachedData = <T>(key: string): T | null => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available. Caching disabled.");
    return null;
  }

  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return null;

    const { data, timestamp }: CachedData<T> = JSON.parse(cachedItem);
    if (Date.now() - timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting cached data:", error);
    return null;
  }
};
