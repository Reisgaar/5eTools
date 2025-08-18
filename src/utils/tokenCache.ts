// REACT
import { Platform } from 'react-native';

// EXPO
import * as FileSystem from 'expo-file-system';

// CONSTANTS
import { DATA_DIR } from 'src/constants/utils';

// Check if we're running on web
const isWeb = Platform.OS === 'web';

// Web storage keys
const WEB_STORAGE_KEYS = {
    TOKEN_CACHE: 'dnd_token_cache',
    TOKEN_CACHE_META: 'dnd_token_cache_meta',
};

// IndexedDB configuration for web image cache
const INDEXEDDB_CONFIG = {
    name: 'DnDToolsImageCache',
    version: 1,
    storeName: 'images',
    maxSize: 50 * 1024 * 1024, // 50MB for IndexedDB
};

// Initialize IndexedDB for web
const initIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (!isWeb) {
            reject(new Error('IndexedDB only available on web'));
            return;
        }

        const request = indexedDB.open(INDEXEDDB_CONFIG.name, INDEXEDDB_CONFIG.version);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG.storeName)) {
                db.createObjectStore(INDEXEDDB_CONFIG.storeName);
            }
        };
    });
};

// Store image in IndexedDB
const storeImageInIndexedDB = async (key: string, dataUrl: string): Promise<void> => {
    if (!isWeb) return;

    try {
        const db = await initIndexedDB();
        const transaction = db.transaction([INDEXEDDB_CONFIG.storeName], 'readwrite');
        const store = transaction.objectStore(INDEXEDDB_CONFIG.storeName);

        return new Promise((resolve, reject) => {
            const request = store.put(dataUrl, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error storing image in IndexedDB:', error);
        throw error;
    }
};

// Get image from IndexedDB
const getImageFromIndexedDB = async (key: string): Promise<string | null> => {
    if (!isWeb) return null;

    try {
        const db = await initIndexedDB();
        const transaction = db.transaction([INDEXEDDB_CONFIG.storeName], 'readonly');
        const store = transaction.objectStore(INDEXEDDB_CONFIG.storeName);

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error getting image from IndexedDB:', error);
        return null;
    }
};

// Remove image from IndexedDB
const removeImageFromIndexedDB = async (key: string): Promise<void> => {
    if (!isWeb) return;

    try {
        const db = await initIndexedDB();
        const transaction = db.transaction([INDEXEDDB_CONFIG.storeName], 'readwrite');
        const store = transaction.objectStore(INDEXEDDB_CONFIG.storeName);

        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error removing image from IndexedDB:', error);
    }
};

const TOKEN_CACHE_DIR = `${DATA_DIR}token_cache/`;

interface TokenCacheEntry {
    source: string;
    name: string;
    tokenUrl: string;
    cachedAt: number;
    dataUrl?: string; // For web, store as data URL
    localPath?: string; // For mobile, store local file path
    size?: number; // Size in bytes for quota management
    useIndexedDB?: boolean; // Flag to indicate IndexedDB storage
}

interface TokenCache {
    [key: string]: TokenCacheEntry;
}

interface TokenCacheMeta {
    totalSize: number;
    maxSize: number; // 4MB limit for token cache
    lastCleanup: number;
}

// Generate cache key from source and name
const generateCacheKey = (source: string, name: string): string => {
    return `${source}-${name}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

// Ensure token cache directory exists
const ensureTokenCacheDir = async (): Promise<void> => {
    if (isWeb) {
        return;
    }

    const dirInfo = await FileSystem.getInfoAsync(TOKEN_CACHE_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(TOKEN_CACHE_DIR, { intermediates: true });
    }
};

// Get cache metadata
const getCacheMeta = (): TokenCacheMeta => {
    try {
        const metaData = localStorage.getItem(WEB_STORAGE_KEYS.TOKEN_CACHE_META);
        if (metaData) {
            return JSON.parse(metaData);
        }
    } catch (error) {
        console.error('Error loading cache metadata:', error);
    }

    return {
        totalSize: 0,
        maxSize: 4 * 1024 * 1024, // 4MB limit
        lastCleanup: Date.now()
    };
};

// Save cache metadata
const saveCacheMeta = (meta: TokenCacheMeta): void => {
    try {
        localStorage.setItem(WEB_STORAGE_KEYS.TOKEN_CACHE_META, JSON.stringify(meta));
    } catch (error) {
        console.error('Error saving cache metadata:', error);
    }
};

// Clean up cache to make space
const cleanupCache = async (cache: TokenCache, requiredSize: number): Promise<TokenCache> => {
    const meta = getCacheMeta();
    const availableSpace = meta.maxSize - meta.totalSize;

    if (availableSpace >= requiredSize) {
        return cache;
    }

    // Sort entries by age (oldest first)
    const entries = Object.entries(cache).sort((a, b) => a[1].cachedAt - b[1].cachedAt);

    let newCache: TokenCache = {};
    let newTotalSize = 0;

    // Keep entries until we run out of space
    for (const [key, entry] of entries) {
        const entrySize = entry.size || 0;
        if (newTotalSize + entrySize + requiredSize <= meta.maxSize) {
            newCache[key] = entry;
            newTotalSize += entrySize;
        } else {
            // Remove from storage
            if (isWeb) {
                if (entry.useIndexedDB) {
                    // Remove from IndexedDB
                    try {
                        await removeImageFromIndexedDB(key);
                    } catch (error) {
                        console.warn('Error removing from IndexedDB:', error);
                    }
                } else if (entry.dataUrl) {
                    // Remove from localStorage if it's a web entry
                    try {
                        const imageCacheKey = `dnd_image_cache_${key}`;
                        localStorage.removeItem(imageCacheKey);
                    } catch (error) {
                        // Ignore errors when removing
                    }
                }
            }
        }
    }

    // Update metadata
    const newMeta: TokenCacheMeta = {
        ...meta,
        totalSize: newTotalSize,
        lastCleanup: Date.now()
    };
    saveCacheMeta(newMeta);

    console.log(`Cache cleanup: removed ${Object.keys(cache).length - Object.keys(newCache).length} entries`);
    return newCache;
};

// Safe localStorage setItem with quota handling
const safeSetItem = (key: string, value: string): boolean => {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.warn(`Storage quota exceeded for key: ${key}`);
            return false;
        }
        throw error;
    }
};

// Load token cache from storage
export const loadTokenCache = async (): Promise<TokenCache> => {
    try {
        if (isWeb) {
            const cacheData = localStorage.getItem(WEB_STORAGE_KEYS.TOKEN_CACHE);
            if (cacheData) {
                return JSON.parse(cacheData);
            }
        } else {
            await ensureTokenCacheDir();
            const cacheFile = `${TOKEN_CACHE_DIR}cache.json`;
            const fileInfo = await FileSystem.getInfoAsync(cacheFile);
            if (fileInfo.exists) {
                const jsonData = await FileSystem.readAsStringAsync(cacheFile);
                return JSON.parse(jsonData);
            }
        }
        return {};
    } catch (error) {
        console.error('Error loading token cache:', error);
        return {};
    }
};

// Save token cache to storage
export const saveTokenCache = async (cache: TokenCache): Promise<void> => {
    try {
        if (isWeb) {
            const cacheJson = JSON.stringify(cache);
            const success = safeSetItem(WEB_STORAGE_KEYS.TOKEN_CACHE, cacheJson);

            if (!success) {
                // If we can't save the cache, try to clean it up first
                const cleanedCache = await cleanupCache(cache, cacheJson.length);
                const cleanedJson = JSON.stringify(cleanedCache);
                safeSetItem(WEB_STORAGE_KEYS.TOKEN_CACHE, cleanedJson);
            }
        } else {
            await ensureTokenCacheDir();
            const cacheFile = `${TOKEN_CACHE_DIR}cache.json`;
            await FileSystem.writeAsStringAsync(cacheFile, JSON.stringify(cache));
        }
    } catch (error) {
        console.error('Error saving token cache:', error);
    }
};

// Check if token is cached
export const isTokenCached = async (source: string, name: string): Promise<boolean> => {
    const cache = await loadTokenCache();
    const key = generateCacheKey(source, name);
    return cache[key] !== undefined;
};

// Get cached token URL
export const getCachedTokenUrl = async (source: string, name: string): Promise<string | null> => {
    const cache = await loadTokenCache();
    const key = generateCacheKey(source, name);
    const entry = cache[key];

    if (!entry) {
        return null;
    }

    if (isWeb) {
        // Try to get from IndexedDB first, fallback to localStorage
        try {
            const indexedDBUrl = await getImageFromIndexedDB(key);
            if (indexedDBUrl) {
                return indexedDBUrl;
            }
        } catch (error) {
            console.warn('IndexedDB not available, falling back to localStorage');
        }

        return entry.dataUrl || null;
    } else {
        // Check if the local file still exists
        if (entry.localPath) {
            const fileInfo = await FileSystem.getInfoAsync(entry.localPath);
            if (fileInfo.exists) {
                return entry.localPath;
            }
        }
        return null;
    }
};

// Cache a token
export const cacheToken = async (source: string, name: string, tokenUrl: string): Promise<void> => {
    try {
        const cache = await loadTokenCache();
        const key = generateCacheKey(source, name);

        if (isWeb) {
            // For web, fetch the image and convert to data URL
            const response = await fetch(tokenUrl);
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });

            const entrySize = dataUrl.length;

            // Try to store in IndexedDB first (50MB limit)
            try {
                await storeImageInIndexedDB(key, dataUrl);

                // Store metadata in localStorage (small footprint)
                cache[key] = {
                    source,
                    name,
                    tokenUrl,
                    cachedAt: Date.now(),
                    size: entrySize,
                    useIndexedDB: true // Flag to indicate IndexedDB storage
                };

                await saveTokenCache(cache);
                console.log(`Token cached in IndexedDB for ${source}/${name}`);
                return;
            } catch (indexedDBError) {
                console.warn('IndexedDB failed, falling back to localStorage:', indexedDBError);
            }

            // Fallback to localStorage (5MB limit)
            const meta = getCacheMeta();

            // Check if we have enough space
            if (meta.totalSize + entrySize > meta.maxSize) {
                // Clean up cache to make space
                const cleanedCache = await cleanupCache(cache, entrySize);
                cleanedCache[key] = {
                    source,
                    name,
                    tokenUrl,
                    cachedAt: Date.now(),
                    dataUrl,
                    size: entrySize
                };

                // Update metadata
                meta.totalSize += entrySize;
                saveCacheMeta(meta);

                await saveTokenCache(cleanedCache);
            } else {
                // We have enough space
                cache[key] = {
                    source,
                    name,
                    tokenUrl,
                    cachedAt: Date.now(),
                    dataUrl,
                    size: entrySize
                };

                // Update metadata
                meta.totalSize += entrySize;
                saveCacheMeta(meta);

                await saveTokenCache(cache);
            }
        } else {
            // For mobile, download and save locally
            await ensureTokenCacheDir();
            const filename = `${key}.webp`;
            const localPath = `${TOKEN_CACHE_DIR}${filename}`;

            const downloadResult = await FileSystem.downloadAsync(tokenUrl, localPath);

            if (downloadResult.status === 200) {
                cache[key] = {
                    source,
                    name,
                    tokenUrl,
                    cachedAt: Date.now(),
                    localPath
                };
                await saveTokenCache(cache);
            } else {
                console.error('Failed to download token:', tokenUrl);
                return;
            }
        }

        console.log(`Token cached for ${source}/${name}`);
    } catch (error) {
        console.error('Error caching token:', error);
    }
};

// Get token URL (cached or original)
export const getTokenUrl = async (source: string, name: string, originalUrl: string): Promise<string> => {
    // First check if we have it cached
    const cachedUrl = await getCachedTokenUrl(source, name);
    if (cachedUrl) {
        console.log(`Using cached token for ${source}/${name}`);
        return cachedUrl;
    }

    // If not cached, cache it for next time
    console.log(`Caching token for ${source}/${name}`);
    cacheToken(source, name, originalUrl);

    return originalUrl;
};

// Clear old cache entries (older than 30 days)
export const cleanTokenCache = async (): Promise<void> => {
    try {
        const cache = await loadTokenCache();
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        let cleaned = false;
        let totalSizeRemoved = 0;

        for (const [key, entry] of Object.entries(cache)) {
            if (entry.cachedAt < thirtyDaysAgo) {
                if (!isWeb && entry.localPath) {
                    // Remove local file
                    const fileInfo = await FileSystem.getInfoAsync(entry.localPath);
                    if (fileInfo.exists) {
                        await FileSystem.deleteAsync(entry.localPath);
                    }
                }
                totalSizeRemoved += entry.size || 0;
                delete cache[key];
                cleaned = true;
            }
        }

        if (cleaned) {
            // Update metadata
            if (isWeb) {
                const meta = getCacheMeta();
                meta.totalSize = Math.max(0, meta.totalSize - totalSizeRemoved);
                saveCacheMeta(meta);
            }

            await saveTokenCache(cache);
            console.log('Token cache cleaned');
        }
    } catch (error) {
        console.error('Error cleaning token cache:', error);
    }
};

// Get cache statistics
export const getTokenCacheStats = async (): Promise<{ total: number; size: number; maxSize?: number }> => {
    const cache = await loadTokenCache();
    const stats = {
        total: Object.keys(cache).length,
        size: JSON.stringify(cache).length
    };

    if (isWeb) {
        const meta = getCacheMeta();
        return { ...stats, maxSize: meta.maxSize };
    }

    return stats;
};

// Image cache functions for large images (like full creature images)
const IMAGE_CACHE_DIR = `${DATA_DIR}image_cache/`;

// Ensure image cache directory exists
const ensureImageCacheDir = async (): Promise<void> => {
    if (isWeb) {
        return;
    }

    const dirInfo = await FileSystem.getInfoAsync(IMAGE_CACHE_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(IMAGE_CACHE_DIR, { intermediates: true });
    }
};

// Cache a large image (full creature image)
export const cacheLargeImage = async (source: string, name: string, imageUrl: string): Promise<string> => {
    try {
        const key = generateCacheKey(source, name);

        if (isWeb) {
            // For web, fetch the image and convert to data URL
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });

            // Try IndexedDB first (50MB limit)
            try {
                await storeImageInIndexedDB(`${key}_large`, dataUrl);
                console.log(`Large image cached in IndexedDB for ${source}/${name}`);
                return dataUrl;
            } catch (indexedDBError) {
                console.warn('IndexedDB failed for large image, falling back to localStorage:', indexedDBError);
            }

            // Fallback to localStorage (5MB limit)
            const imageCacheKey = `dnd_image_cache_${key}`;
            const success = safeSetItem(imageCacheKey, dataUrl);

            if (success) {
                console.log(`Large image cached in localStorage for ${source}/${name}`);
                return dataUrl;
            } else {
                console.warn(`Failed to cache large image for ${source}/${name} - storage quota exceeded`);
                return imageUrl; // Return original URL if caching fails
            }
        } else {
            // For mobile, download and save locally
            await ensureImageCacheDir();
            const filename = `${key}_large.webp`;
            const localPath = `${IMAGE_CACHE_DIR}${filename}`;

            const downloadResult = await FileSystem.downloadAsync(imageUrl, localPath);

            if (downloadResult.status === 200) {
                console.log(`Large image cached for ${source}/${name}`);
                return localPath;
            } else {
                console.error('Failed to download large image:', imageUrl);
                return imageUrl; // Return original URL if download fails
            }
        }
    } catch (error) {
        console.error('Error caching large image:', error);
        return imageUrl; // Return original URL if caching fails
    }
};

// Get cached large image URL
export const getCachedLargeImageUrl = async (source: string, name: string, originalUrl: string): Promise<string> => {
    try {
        const key = generateCacheKey(source, name);

        if (isWeb) {
            // Try IndexedDB first
            try {
                const indexedDBUrl = await getImageFromIndexedDB(`${key}_large`);
                if (indexedDBUrl) {
                    console.log(`Using cached large image from IndexedDB for ${source}/${name}`);
                    return indexedDBUrl;
                }
            } catch (error) {
                console.warn('IndexedDB not available for large image, checking localStorage');
            }

            // Fallback to localStorage
            const imageCacheKey = `dnd_image_cache_${key}`;
            const cachedDataUrl = localStorage.getItem(imageCacheKey);
            if (cachedDataUrl) {
                console.log(`Using cached large image from localStorage for ${source}/${name}`);
                return cachedDataUrl;
            }
        } else {
            // For mobile, check if file exists
            await ensureImageCacheDir();
            const filename = `${key}_large.webp`;
            const localPath = `${IMAGE_CACHE_DIR}${filename}`;

            const fileInfo = await FileSystem.getInfoAsync(localPath);
            if (fileInfo.exists) {
                console.log(`Using cached large image for ${source}/${name}`);
                return localPath;
            }
        }

        // If not cached, cache it and return the cached URL
        console.log(`Caching large image for ${source}/${name}`);
        const cachedUrl = await cacheLargeImage(source, name, originalUrl);
        return cachedUrl;
    } catch (error) {
        console.error('Error getting cached large image:', error);
        return originalUrl;
    }
};

// Clear all cached images
export const clearImageCache = async (): Promise<void> => {
    try {
        if (isWeb) {
            // Clear IndexedDB
            try {
                const db = await initIndexedDB();
                const transaction = db.transaction([INDEXEDDB_CONFIG.storeName], 'readwrite');
                const store = transaction.objectStore(INDEXEDDB_CONFIG.storeName);

                return new Promise((resolve, reject) => {
                    const request = store.clear();
                    request.onsuccess = () => {
                        console.log('IndexedDB image cache cleared');
                        resolve();
                    };
                    request.onerror = () => reject(request.error);
                });
            } catch (error) {
                console.warn('IndexedDB not available for clearing, clearing localStorage only');
            }

            // Clear all image cache keys from localStorage
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('dnd_image_cache_')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log('localStorage image cache cleared');
        } else {
            // Clear image cache directory
            const dirInfo = await FileSystem.getInfoAsync(IMAGE_CACHE_DIR);
            if (dirInfo.exists) {
                await FileSystem.deleteAsync(IMAGE_CACHE_DIR, { idempotent: true });
                console.log('Image cache cleared');
            }
        }
    } catch (error) {
        console.error('Error clearing image cache:', error);
    }
};
