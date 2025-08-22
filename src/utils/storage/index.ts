// Storage system exports
export { IStorageProvider } from './IStorageProvider';
export { BaseStorageProvider } from './BaseStorageProvider';
export { MobileStorageProvider } from './MobileStorageProvider';
export { StorageFactory } from './StorageFactory';

// Convenience function to get storage provider
export const getStorage = () => StorageFactory.getStorageProvider();
