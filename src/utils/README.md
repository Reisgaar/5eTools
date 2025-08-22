# Utils - Storage Management System

## Overview
This directory contains a refactored and organized storage management system for the 5eTools app. The system has been designed to eliminate code duplication, improve type safety, and provide a cleaner architecture.

## File Structure

### Core Files
- **`types.ts`** - Centralized TypeScript interfaces and types
- **`constants.ts`** - Configuration constants and platform detection
- **`storageUtils.ts`** - Common utility functions shared between platforms
- **`index.ts`** - Barrel export file for easy imports

### Platform-Specific Storage
- **`fileStorage.ts`** - Mobile/React Native storage implementation
- **`fileStorage.web.ts`** - Web storage implementation using IndexedDB

### Specialized Utilities
- **`storageManager.ts`** - High-level storage management and monitoring
- **`beastUtils.ts`** - Beast-specific utility functions
- **`imageManager.ts`** - Image caching and management
- **`stringUtils.ts`** - String manipulation utilities
- **`tokenCache.ts`** - Token caching system
- **`replaceTags.tsx`** - Tag replacement utilities

## Key Improvements

### 1. **Type Safety**
- Centralized types in `types.ts`
- Proper TypeScript interfaces for all data structures
- Eliminated `any` types where possible

### 2. **Code Deduplication**
- Common functions moved to `storageUtils.ts`
- Shared constants in `constants.ts`
- Unified naming conventions

### 3. **Better Organization**
- Clear separation of concerns
- Platform-specific implementations isolated
- Consistent API across platforms

### 4. **Configuration Management**
- Centralized configuration in `constants.ts`
- Easy to modify storage limits and thresholds
- Debug configuration options

## Usage Examples

### Basic Storage Operations
```typescript
import { 
    storeSpellsToFile, 
    loadSpellsIndexFromFile,
    createSpellIndexEntry 
} from '../utils';

// Store spells with automatic processing
await storeSpellsToFile(spells);

// Load spell index
const spellIndex = await loadSpellsIndexFromFile();

// Create individual spell index entry
const spellEntry = createSpellIndexEntry(spell);
```

### Type-Safe Operations
```typescript
import { Spell, SpellIndex, StorageInfo } from '../utils/types';

// Type-safe spell processing
const spell: Spell = { /* ... */ };
const indexEntry: SpellIndex = createSpellIndexEntry(spell);

// Storage info with proper typing
const info: StorageInfo = await getStorageInfo();
```

### Storage Management
```typescript
import { 
    getStorageUsage, 
    cleanupAllCaches,
    isStorageGettingFull 
} from '../utils';

// Monitor storage usage
const usage = await getStorageUsage();
const { isFull, percentage, warning } = await isStorageGettingFull();

// Clean up when needed
if (isFull) {
    await cleanupAllCaches();
}
```

## Configuration

### Storage Limits
```typescript
// In constants.ts
export const STORAGE_CONFIG = {
    WEB_LOCAL_STORAGE_LIMIT: 5 * 1024 * 1024, // 5MB
    TOKEN_CACHE_MAX_SIZE: 50 * 1024 * 1024,   // 50MB
    WARNING_THRESHOLD: 80,                     // 80% usage
    CRITICAL_THRESHOLD: 90                     // 90% usage
};
```

### Debug Configuration
```typescript
// In constants.ts
export const DEBUG_CONFIG = {
    LOG_SPELL_PROCESSING: true,
    LOG_STORAGE_OPERATIONS: true,
    SPELLS_TO_LOG: ['Cure Wounds', 'Fireball', 'Magic Missile']
};
```

## Migration Guide

### From Old Structure
1. **Import Changes**: Use the new barrel exports from `../utils`
2. **Type Safety**: Replace `any` types with proper interfaces
3. **Constants**: Use centralized constants instead of hardcoded values
4. **Utilities**: Use shared utility functions instead of duplicated code

### Benefits
- **Reduced Bundle Size**: Eliminated code duplication
- **Better Maintainability**: Centralized logic and types
- **Improved Debugging**: Better logging and error handling
- **Type Safety**: Compile-time error detection
- **Consistency**: Unified API across platforms

## Future Enhancements

1. **Caching Strategy**: Implement more sophisticated caching
2. **Compression**: Add data compression for large datasets
3. **Sync**: Add cloud sync capabilities
4. **Validation**: Add runtime data validation
5. **Performance**: Optimize for large datasets
