// REACT
import { Platform } from 'react-native';

// UTILS
import { getTokenUrl, getCachedTokenUrl, getCachedLargeImageUrl } from 'src/utils/tokenCache';

const isWeb = Platform.OS === 'web';

export interface ImageInfo {
    tokenUrl: string;
    fullImageUrl: string;
    cachedTokenUrl?: string;
    cachedFullImageUrl?: string;
}

// Generate URLs for a creature
export const generateCreatureUrls = (source: string, name: string): ImageInfo => {
    const encodedName = encodeURIComponent(name);
    const tokenUrl = `https://5e.tools/img/bestiary/tokens/${source}/${encodedName}.webp`;
    const fullImageUrl = `https://5e.tools/img/bestiary/${source}/${encodedName}.webp`;

    return {
        tokenUrl,
        fullImageUrl
    };
};

// Get cached token URL, cache if not available
export const getCachedToken = async (source: string, name: string, originalUrl: string): Promise<string> => {
    try {
        // First check if we have it cached
        const cachedUrl = await getCachedTokenUrl(source, name);
        if (cachedUrl) {
            console.log(`Using cached token for ${source}/${name}`);
            return cachedUrl;
        }

        // If not cached, cache it and return original URL for now
        console.log(`Caching token for ${source}/${name}`);
        await getTokenUrl(source, name, originalUrl);
        return originalUrl;
    } catch (error) {
        console.error('Error getting cached token:', error);
        return originalUrl;
    }
};

// Get cached full image URL, cache if not available
export const getCachedFullImage = async (source: string, name: string, originalUrl: string): Promise<string> => {
    try {
        // Use getCachedLargeImageUrl which handles caching internally
        const cachedUrl = await getCachedLargeImageUrl(source, name, originalUrl);
        return cachedUrl;
    } catch (error) {
        console.error('Error getting cached full image:', error);
        return originalUrl;
    }
};

// Get both token and full image URLs with caching
export const getCachedCreatureImages = async (source: string, name: string): Promise<ImageInfo> => {
    const urls = generateCreatureUrls(source, name);

    try {
        // Get cached token
        const cachedTokenUrl = await getCachedToken(source, name, urls.tokenUrl);

        // Get cached full image
        const cachedFullImageUrl = await getCachedFullImage(source, name, urls.fullImageUrl);

        return {
            ...urls,
            cachedTokenUrl,
            cachedFullImageUrl
        };
    } catch (error) {
        console.error('Error getting cached creature images:', error);
        return urls;
    }
};

// Get the best available image for a creature (full image preferred, token as fallback)
export const getBestCreatureImage = async (source: string, name: string): Promise<{
    url: string;
    type: 'full' | 'token';
    isCached: boolean;
}> => {
    try {
        const urls = generateCreatureUrls(source, name);

        // Try to get cached full image first
        const cachedFullImage = await getCachedLargeImageUrl(source, name, urls.fullImageUrl);
        if (cachedFullImage && cachedFullImage !== urls.fullImageUrl) {
            return {
                url: cachedFullImage,
                type: 'full',
                isCached: true
            };
        }

        // Try to get cached token
        const cachedToken = await getCachedTokenUrl(source, name);
        if (cachedToken) {
            return {
                url: cachedToken,
                type: 'token',
                isCached: true
            };
        }

        // If nothing is cached, return token for now (caching will happen in background)
        return {
            url: urls.tokenUrl,
            type: 'token',
            isCached: false
        };
    } catch (error) {
        console.error('Error getting best creature image:', error);
        const urls = generateCreatureUrls(source, name);
        return {
            url: urls.tokenUrl,
            type: 'token',
            isCached: false
        };
    }
};

// Preload images for a creature (both token and full image)
export const preloadCreatureImages = async (source: string, name: string): Promise<void> => {
    try {
        const urls = generateCreatureUrls(source, name);

        // Cache both token and full image
        await Promise.all([
            getCachedToken(source, name, urls.tokenUrl),
            getCachedFullImage(source, name, urls.fullImageUrl)
        ]);

        console.log(`Preloaded images for ${source}/${name}`);
    } catch (error) {
        console.error('Error preloading creature images:', error);
    }
};

// Get image for combat tracker (token for display, full image for modal)
export const getCombatTrackerImages = async (source: string, name: string): Promise<{
    displayUrl: string; // Token for display
    modalUrl: string;   // Full image for modal
    displayType: 'token' | 'full';
    modalType: 'token' | 'full';
}> => {
    try {
        const urls = generateCreatureUrls(source, name);

        // Get cached token for display
        const cachedToken = await getCachedTokenUrl(source, name);
        const displayUrl = cachedToken || urls.tokenUrl;
        const displayType = cachedToken ? 'token' : 'token';

        // Get cached full image for modal
        const cachedFullImage = await getCachedLargeImageUrl(source, name, urls.fullImageUrl);
        const modalUrl = cachedFullImage && cachedFullImage !== urls.fullImageUrl ? cachedFullImage : urls.fullImageUrl;
        const modalType = cachedFullImage && cachedFullImage !== urls.fullImageUrl ? 'full' : 'full';

        // Start caching if not already cached
        if (!cachedToken) {
            getCachedToken(source, name, urls.tokenUrl);
        }
        if (!cachedFullImage || cachedFullImage === urls.fullImageUrl) {
            getCachedFullImage(source, name, urls.fullImageUrl);
        }

        return {
            displayUrl,
            modalUrl,
            displayType,
            modalType
        };
    } catch (error) {
        console.error('Error getting combat tracker images:', error);
        const urls = generateCreatureUrls(source, name);
        return {
            displayUrl: urls.tokenUrl,
            modalUrl: urls.fullImageUrl,
            displayType: 'token',
            modalType: 'full'
        };
    }
};

// Check if an image is cached
export const isImageCached = async (source: string, name: string, type: 'token' | 'full'): Promise<boolean> => {
    try {
        if (type === 'token') {
            const cachedUrl = await getCachedTokenUrl(source, name);
            return !!cachedUrl;
        } else {
            const urls = generateCreatureUrls(source, name);
            const cachedUrl = await getCachedLargeImageUrl(source, name, urls.fullImageUrl);
            return !!(cachedUrl && cachedUrl !== urls.fullImageUrl);
        }
    } catch (error) {
        console.error('Error checking if image is cached:', error);
        return false;
    }
};

// Get cache status for a creature
export const getCreatureCacheStatus = async (source: string, name: string): Promise<{
    tokenCached: boolean;
    fullImageCached: boolean;
}> => {
    try {
        const [tokenCached, fullImageCached] = await Promise.all([
            isImageCached(source, name, 'token'),
            isImageCached(source, name, 'full')
        ]);

        return {
            tokenCached,
            fullImageCached
        };
    } catch (error) {
        console.error('Error getting creature cache status:', error);
        return {
            tokenCached: false,
            fullImageCached: false
        };
    }
};
