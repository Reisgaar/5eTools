// REACT
import { Platform } from 'react-native';

// UTILS
import { getTokenCacheStats, cleanTokenCache, clearImageCache } from 'src/utils/tokenCache';
import { getStorageInfo } from 'src/utils/fileStorage';
import { formatBytes } from 'src/utils/storageUtils';

// CONSTANTS
import { STORAGE_CONFIG } from 'src/constants/utils';

const isWeb = Platform.OS === 'web';

export interface StorageUsage {
    totalUsed: number;
    totalAvailable: number;
    tokenCache: {
        entries: number;
        size: number;
        maxSize?: number;
    };
    imageCache: {
        entries: number;
        size: number;
    };
    dataStorage: {
        beasts: number;
        spells: number;
        combats: number;
        players: number;
        spellbooks: number;
    };
}

// Get total storage usage information
export const getStorageUsage = async (): Promise<StorageUsage> => {
    try {
        const tokenStats = await getTokenCacheStats();
        const dataStats = await getStorageInfo();

        // Calculate image cache size
        let imageCacheEntries = 0;
        let imageCacheSize = 0;

        if (isWeb) {
            // Count image cache entries in localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('dnd_image_cache_')) {
                    imageCacheEntries++;
                    const value = localStorage.getItem(key);
                    if (value) {
                        imageCacheSize += value.length;
                    }
                }
            }
        }

        // Estimate total used storage
        const totalUsed = tokenStats.size + imageCacheSize +
            (dataStats.beastsIndexSize || 0) + (dataStats.spellsIndexSize || 0);

        // Estimate available storage (rough approximation)
        let totalAvailable = 0;
        if (isWeb) {
            // For web, use the appropriate limit based on what we're storing
            if (imageCacheSize > 0) {
                // If we have image cache, use IndexedDB limit
                totalAvailable = STORAGE_CONFIG.WEB_INDEXEDDB_LIMIT;
            } else {
                // Otherwise use localStorage limit
                totalAvailable = STORAGE_CONFIG.WEB_LOCAL_STORAGE_LIMIT;
            }
        } else {
            // For mobile, estimate available space (this is approximate)
            totalAvailable = 100 * 1024 * 1024; // 100MB estimate for mobile
        }

        return {
            totalUsed,
            totalAvailable,
            tokenCache: {
                entries: tokenStats.total,
                size: tokenStats.size,
                maxSize: tokenStats.maxSize
            },
            imageCache: {
                entries: imageCacheEntries,
                size: imageCacheSize
            },
            dataStorage: {
                beasts: dataStats.beastsCount || 0,
                spells: dataStats.spellsCount || 0,
                combats: 0, // Would need to implement this
                players: 0, // Would need to implement this
                spellbooks: 0 // Would need to implement this
            }
        };
    } catch (error) {
        console.error('Error getting storage usage:', error);
        return {
            totalUsed: 0,
            totalAvailable: 0,
            tokenCache: { entries: 0, size: 0 },
            imageCache: { entries: 0, size: 0 },
            dataStorage: { beasts: 0, spells: 0, combats: 0, players: 0, spellbooks: 0 }
        };
    }
};

// Clean up all caches
export const cleanupAllCaches = async (): Promise<{
    tokensCleaned: boolean;
    imagesCleaned: boolean;
    message: string;
}> => {
    try {
        // Clean token cache (removes old entries)
        await cleanTokenCache();

        // Clear image cache (removes all cached images)
        await clearImageCache();

        return {
            tokensCleaned: true,
            imagesCleaned: true,
            message: 'All caches cleaned successfully'
        };
    } catch (error) {
        console.error('Error cleaning caches:', error);
        return {
            tokensCleaned: false,
            imagesCleaned: false,
            message: `Error cleaning caches: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
};

// Check if storage is getting full
export const isStorageGettingFull = async (): Promise<{
    isFull: boolean;
    percentage: number;
    warning: string | null;
}> => {
    try {
        const usage = await getStorageUsage();

        if (usage.totalAvailable === 0) {
            return { isFull: false, percentage: 0, warning: null };
        }

        const percentage = (usage.totalUsed / usage.totalAvailable) * 100;
        const isFull = percentage > STORAGE_CONFIG.WARNING_THRESHOLD;

        let warning = null;
        if (percentage > STORAGE_CONFIG.CRITICAL_THRESHOLD) {
            warning = 'Storage is almost full! Consider cleaning caches.';
        } else if (percentage > STORAGE_CONFIG.WARNING_THRESHOLD) {
            warning = 'Storage usage is high. Consider cleaning caches soon.';
        }

        return { isFull, percentage, warning };
    } catch (error) {
        console.error('Error checking storage fullness:', error);
        return { isFull: false, percentage: 0, warning: null };
    }
};

// Re-export formatBytes from storageUtils for backward compatibility
export { formatBytes } from './storageUtils';

// Get storage usage summary for display
export const getStorageSummary = async (): Promise<{
    summary: string;
    details: string[];
    needsCleanup: boolean;
}> => {
    try {
        const usage = await getStorageUsage();
        const { isFull, percentage, warning } = await isStorageGettingFull();

        let summary: string;
        if (isWeb) {
            if (usage.imageCache.size > 0) {
                summary = `Storage Usage: ${formatBytes(usage.totalUsed)} / ${formatBytes(usage.totalAvailable)} (${percentage.toFixed(1)}%) - Using IndexedDB`;
            } else {
                summary = `Storage Usage: ${formatBytes(usage.totalUsed)} / ${formatBytes(usage.totalAvailable)} (${percentage.toFixed(1)}%) - Using localStorage`;
            }
        } else {
            summary = `Storage Usage: ${formatBytes(usage.totalUsed)} / ${formatBytes(usage.totalAvailable)} (${percentage.toFixed(1)}%) - Mobile storage`;
        }

        const details = [
            `Token Cache: ${usage.tokenCache.entries} entries (${formatBytes(usage.tokenCache.size)})`,
            `Image Cache: ${usage.imageCache.entries} entries (${formatBytes(usage.imageCache.size)})`,
            `Data Storage: ${usage.dataStorage.beasts} beasts, ${usage.dataStorage.spells} spells`,
        ];

        if (isWeb) {
            details.push(`Platform: Web (${usage.imageCache.size > 0 ? 'IndexedDB + localStorage' : 'localStorage only'})`);
        } else {
            details.push('Platform: Mobile (File System)');
        }

        if (warning) {
            details.push(`⚠️ ${warning}`);
        }

        return {
            summary,
            details,
            needsCleanup: isFull
        };
    } catch (error) {
        console.error('Error getting storage summary:', error);
        return {
            summary: 'Unable to get storage information',
            details: ['Error reading storage data'],
            needsCleanup: false
        };
    }
};
