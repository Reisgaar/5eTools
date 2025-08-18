// MODELS
import { Spell, SpellIndex, SpellProcessingData } from 'src/models/interfaces/utils';

/**
 * Generate a safe filename from name and source
 */
export const generateSafeFilename = (name: string, source: string): string => {
    const safeName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const safeSource = source
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return `${safeName}-${safeSource}`;
};

/**
 * Generate a safe filename for combats
 */
export const generateCombatFilename = (id: string, name: string): string => {
    // Only use the ID for the filename to avoid issues with special characters in names
    return `${id}.json`;
};

/**
 * Process spell data to extract concentration, ritual, and available classes
 */
export const processSpellData = (spell: Spell): SpellProcessingData => {
    // Extract concentration from duration
    let concentration = false;
    if (spell.duration) {
        if (Array.isArray(spell.duration)) {
            concentration = spell.duration.some(d => d && d.concentration === true);
        } else if (typeof spell.duration === 'object') {
            concentration = spell.duration.concentration === true;
        } else {
            concentration = String(spell.duration).toLowerCase().includes('concentration');
        }
    }

    // Extract ritual from meta
    const ritual = spell.meta && spell.meta.ritual || false;

    // Use availableClasses or fallback to empty array
    const availableClasses = spell.availableClasses || [];

    return {
        concentration,
        ritual,
        availableClasses
    };
};

/**
 * Create spell index entry from spell data
 */
export const createSpellIndexEntry = (spell: Spell): SpellIndex => {
    const { concentration, ritual, availableClasses } = processSpellData(spell);

    return {
        id: generateSafeFilename(spell.name, spell.source),
        name: spell.name,
        level: spell.level,
        school: spell.school,
        source: spell.source,
        availableClasses,
        ritual,
        concentration,
        file: `${generateSafeFilename(spell.name, spell.source)}.json`
    };
};

/**
 * Create beast index entry from beast data
 */
export const createBeastIndexEntry = (beast: any) => {
    return {
        id: generateSafeFilename(beast.name, beast.source),
        name: beast.name,
        cr: beast.cr,
        type: beast.type,
        source: beast.source,
        ac: beast.ac,
        size: beast.size,
        alignment: beast.alignment,
        file: `${generateSafeFilename(beast.name, beast.source)}.json`
    };
};

/**
 * Create combat index entry from combat data
 */
export const createCombatIndexEntry = (combat: any) => {
    return {
        id: combat.id,
        name: combat.name,
        createdAt: combat.createdAt,
        file: `${combat.id}.json`
    };
};

/**
 * Debug logging for spell processing
 */
export const logSpellProcessing = (spell: Spell, spellData: SpellProcessingData, platform: 'web' | 'mobile') => {
    if (spell.name === 'Cure Wounds' || spell.name === 'Fireball') {
        console.log(`Spell ${spell.name} (${platform}):`, {
            duration: spell.duration,
            meta: spell.meta,
            availableClasses: spell.availableClasses,
            finalRitual: spellData.ritual,
            finalConcentration: spellData.concentration
        });
    }
};

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Safe localStorage operations with error handling
 */
export const safeLocalStorage = {
    setItem: (key: string, value: string): boolean => {
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
    },

    getItem: (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(`Error reading from localStorage for key: ${key}:`, error);
            return null;
        }
    },

    removeItem: (key: string): boolean => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Error removing from localStorage for key: ${key}:`, error);
            return false;
        }
    }
};
