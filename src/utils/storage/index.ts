// Storage system exports
// NOTE: `export { X } from` re-exports without a local binding, so StorageFactory must also be
// imported here to be referenced by getStorage() below (otherwise it throws at runtime).
import { StorageFactory } from './StorageFactory';

export { IStorageProvider } from './IStorageProvider';
export { BaseStorageProvider } from './BaseStorageProvider';
export { MobileStorageProvider } from './MobileStorageProvider';
export { StorageFactory } from './StorageFactory';

// Convenience function to get storage provider
export const getStorage = () => StorageFactory.getStorageProvider();
