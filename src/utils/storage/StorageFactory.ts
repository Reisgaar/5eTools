import { Platform } from 'react-native';
import { IStorageProvider } from './IStorageProvider';
import { WebStorageProvider } from './WebStorageProvider';
import { MobileStorageProvider } from './MobileStorageProvider';

/**
 * Factory for creating the appropriate storage provider based on platform
 */
export class StorageFactory {
    private static instance: IStorageProvider | null = null;
    
    /**
     * Get the appropriate storage provider for the current platform
     */
    public static getStorageProvider(): IStorageProvider {
        if (!StorageFactory.instance) {
            if (Platform.OS === 'web') {
                StorageFactory.instance = new WebStorageProvider();
            } else {
                StorageFactory.instance = new MobileStorageProvider();
            }
        }
        return StorageFactory.instance;
    }
    
    /**
     * Reset the singleton instance (useful for testing)
     */
    public static resetInstance(): void {
        StorageFactory.instance = null;
    }
    
    /**
     * Get the platform name
     */
    public static getPlatformName(): string {
        return Platform.OS === 'web' ? 'web' : 'mobile';
    }
}
