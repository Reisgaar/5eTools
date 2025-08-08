import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Check if we're running on web
const isWeb = Platform.OS === 'web';

// Web storage keys
const WEB_STORAGE_KEYS = {
    TOKEN_CACHE: 'dnd_token_cache',
};

const TOKEN_CACHE_DIR = `${FileSystem.documentDirectory}dnd_data/token_cache/`;

interface TokenCacheEntry {
    source: string;
    name: string;
    tokenUrl: string;
    cachedAt: number;
    dataUrl?: string; // For web, store as data URL
    localPath?: string; // For mobile, store local file path
}

interface TokenCache {
    [key: string]: TokenCacheEntry;
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
            localStorage.setItem(WEB_STORAGE_KEYS.TOKEN_CACHE, JSON.stringify(cache));
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
        return entry.dataUrl || null;
    } else {
        // Check if the local file still exists
        if (entry.localPath) {
            const fileInfo = await FileSystem.getInfoAsync(entry.localPath);
            if (fileInfo.exists) {
                return entry.localPath;
            }
        }
        // If file doesn't exist, remove from cache
        delete cache[key];
        await saveTokenCache(cache);
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
            
            cache[key] = {
                source,
                name,
                tokenUrl,
                cachedAt: Date.now(),
                dataUrl
            };
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
            } else {
                console.error('Failed to download token:', tokenUrl);
                return;
            }
        }
        
        await saveTokenCache(cache);
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
        
        for (const [key, entry] of Object.entries(cache)) {
            if (entry.cachedAt < thirtyDaysAgo) {
                if (!isWeb && entry.localPath) {
                    // Remove local file
                    const fileInfo = await FileSystem.getInfoAsync(entry.localPath);
                    if (fileInfo.exists) {
                        await FileSystem.deleteAsync(entry.localPath);
                    }
                }
                delete cache[key];
                cleaned = true;
            }
        }
        
        if (cleaned) {
            await saveTokenCache(cache);
            console.log('Token cache cleaned');
        }
    } catch (error) {
        console.error('Error cleaning token cache:', error);
    }
};

// Get cache statistics
export const getTokenCacheStats = async (): Promise<{ total: number; size: number }> => {
    const cache = await loadTokenCache();
    return {
        total: Object.keys(cache).length,
        size: JSON.stringify(cache).length
    };
};

// Image cache functions for large images (like full creature images)
const IMAGE_CACHE_DIR = `${FileSystem.documentDirectory}dnd_data/image_cache/`;

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

// Cache large image (for full creature images)
export const cacheLargeImage = async (source: string, name: string, imageUrl: string): Promise<string> => {
    try {
        const key = generateCacheKey(source, name);
        
        if (isWeb) {
            // For web, convert to data URL
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
            
            // Store in localStorage with a different key
            const imageCacheKey = `dnd_image_cache_${key}`;
            localStorage.setItem(imageCacheKey, dataUrl);
            console.log(`Large image cached for ${source}/${name}`);
            return dataUrl;
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
            // For web, check localStorage
            const imageCacheKey = `dnd_image_cache_${key}`;
            const cachedDataUrl = localStorage.getItem(imageCacheKey);
            if (cachedDataUrl) {
                console.log(`Using cached large image for ${source}/${name}`);
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
        
        // If not cached, cache it and return original URL for now
        console.log(`Caching large image for ${source}/${name}`);
        cacheLargeImage(source, name, originalUrl);
        return originalUrl;
    } catch (error) {
        console.error('Error getting cached large image:', error);
        return originalUrl;
    }
};

