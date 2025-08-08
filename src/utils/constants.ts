import * as FileSystem from 'expo-file-system';
import { STORAGE_KEYS } from './types';

// Platform detection
export const isWeb = typeof window !== 'undefined' && window.document;

// File paths for mobile
export const DATA_DIR = `${FileSystem.documentDirectory}dnd_data/`;
export const MONSTERS_DIR = `${DATA_DIR}monsters/`;
export const SPELLS_DIR = `${DATA_DIR}spells/`;
export const COMBATS_DIR = `${DATA_DIR}combats/`;

// Index files for mobile
export const BEASTS_INDEX_FILE = `${DATA_DIR}beasts_index.json`;
export const SPELLS_INDEX_FILE = `${DATA_DIR}spells_index.json`;
export const COMBATS_INDEX_FILE = `${DATA_DIR}combats_index.json`;
export const PLAYERS_FILE = `${DATA_DIR}players.json`;
export const SPELLBOOKS_FILE = `${DATA_DIR}spellbooks.json`;

// Storage keys (re-export from types for convenience)
export { STORAGE_KEYS };

// Debug configuration
export const DEBUG_CONFIG = {
    LOG_SPELL_PROCESSING: true,
    LOG_STORAGE_OPERATIONS: true,
    SPELLS_TO_LOG: ['Cure Wounds', 'Fireball', 'Magic Missile']
};

// Storage limits and configuration
export const STORAGE_CONFIG = {
    WEB_LOCAL_STORAGE_LIMIT: 5 * 1024 * 1024, // 5MB
    TOKEN_CACHE_MAX_SIZE: 50 * 1024 * 1024, // 50MB
    IMAGE_CACHE_MAX_SIZE: 100 * 1024 * 1024, // 100MB
    WARNING_THRESHOLD: 80, // 80% usage triggers warning
    CRITICAL_THRESHOLD: 90 // 90% usage triggers critical warning
};

// File naming patterns
export const FILE_PATTERNS = {
    BEAST: (name: string, source: string) => `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`,
    SPELL: (name: string, source: string) => `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`,
    COMBAT: (id: string, name: string) => `${id}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`
};
