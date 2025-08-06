import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { resolveMonster } from '../data/resolveMonster';

// Check if we're running on web
const isWeb = Platform.OS === 'web';

// Web storage keys
const WEB_STORAGE_KEYS = {
    BEASTS_INDEX: 'dnd_beasts_index',
    SPELLS_INDEX: 'dnd_spells_index',
    COMBATS_INDEX: 'dnd_combats_index',
    PLAYERS: 'dnd_players',
    MONSTERS_PREFIX: 'dnd_monster_',
    SPELLS_PREFIX: 'dnd_spell_',
    COMBATS_PREFIX: 'dnd_combat_',
    SPELLBOOKS: 'dnd_spellbooks'
};

const DATA_DIR = `${FileSystem.documentDirectory}dnd_data/`;
const MONSTERS_DIR = `${DATA_DIR}monsters/`;
const SPELLS_DIR = `${DATA_DIR}spells/`;
const BEASTS_INDEX_FILE = `${DATA_DIR}beasts_index.json`;
const SPELLS_INDEX_FILE = `${DATA_DIR}spells_index.json`;
const COMBATS_DIR = `${DATA_DIR}combats/`;
const COMBATS_INDEX_FILE = `${DATA_DIR}combats_index.json`;
const PLAYERS_FILE = `${DATA_DIR}players.json`;
const SPELLBOOKS_FILE = `${DATA_DIR}spellbooks.json`;

// Ensure data directories exist (add combats dir)
const ensureDataDir = async (): Promise<void> => {
    if (isWeb) {
        // No need to create directories on web
        return;
    }
    
    const dirInfo = await FileSystem.getInfoAsync(DATA_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
    }
    const monstersDirInfo = await FileSystem.getInfoAsync(MONSTERS_DIR);
    if (!monstersDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(MONSTERS_DIR, { intermediates: true });
    }
    const spellsDirInfo = await FileSystem.getInfoAsync(SPELLS_DIR);
    if (!spellsDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(SPELLS_DIR, { intermediates: true });
    }
    // Add combats dir
    const combatsDirInfo = await FileSystem.getInfoAsync(COMBATS_DIR);
    if (!combatsDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(COMBATS_DIR, { intermediates: true });
    }
};

// Generate a safe filename from monster name and source
const generateSafeFilename = (name: string, source: string): string => {
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

// Generate a safe filename for combats
const generateCombatFilename = (id: string, name: string): string => {
    const safeName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return `${id}-${safeName}.json`;
};

// Store beasts data to individual files
export const storeBeastsToFile = async (beasts: any[]): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            // 1. Separate monsters with and without _copy
            const monstersWithoutCopy = beasts.filter(beast => !beast._copy);
            let monstersWithCopy = beasts.filter(beast => beast._copy);
            const allResolvedMonsters: any[] = [...monstersWithoutCopy];

            // 2. Iteratively resolve all monsters with _copy
            let unresolved = [...monstersWithCopy];
            let lastUnresolvedCount = -1;
            while (unresolved.length > 0 && unresolved.length !== lastUnresolvedCount) {
                lastUnresolvedCount = unresolved.length;
                const stillUnresolved: any[] = [];
                for (const beast of unresolved) {
                    try {
                        const resolved = resolveMonster(beast, [...allResolvedMonsters, ...unresolved]);
                        allResolvedMonsters.push(resolved);
                    } catch (e) {
                        // If base not found yet, try in next pass
                        stillUnresolved.push(beast);
                    }
                }
                unresolved = stillUnresolved;
            }
            if (unresolved.length > 0) {
                console.warn(`Some monsters with _copy could not be resolved:`, unresolved.map(b => b.name));
            }

            // 3. Create index data
            const indexData = {
                monsters: allResolvedMonsters.map(beast => ({
                    id: generateSafeFilename(beast.name, beast.source),
                    name: beast.name,
                    cr: beast.cr,
                    type: beast.type,
                    source: beast.source,
                    ac: beast.ac,
                    size: beast.size,
                    alignment: beast.alignment,
                    file: `${generateSafeFilename(beast.name, beast.source)}.json`
                }))
            };

            // 4. Save index to localStorage
            localStorage.setItem(WEB_STORAGE_KEYS.BEASTS_INDEX, JSON.stringify(indexData));
            console.log(`Stored index with ${allResolvedMonsters.length} monsters`);

            // 5. Save individual monster files to localStorage
            for (const beast of allResolvedMonsters) {
                const key = `${WEB_STORAGE_KEYS.MONSTERS_PREFIX}${generateSafeFilename(beast.name, beast.source)}`;
                localStorage.setItem(key, JSON.stringify(beast));
            }

            console.log(`Stored ${allResolvedMonsters.length} individual monster files`);
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();

            // 1. Separate monsters with and without _copy
            const monstersWithoutCopy = beasts.filter(beast => !beast._copy);
            let monstersWithCopy = beasts.filter(beast => beast._copy);
            const allResolvedMonsters: any[] = [...monstersWithoutCopy];

            // 2. Iteratively resolve all monsters with _copy
            let unresolved = [...monstersWithCopy];
            let lastUnresolvedCount = -1;
            while (unresolved.length > 0 && unresolved.length !== lastUnresolvedCount) {
                lastUnresolvedCount = unresolved.length;
                const stillUnresolved: any[] = [];
                for (const beast of unresolved) {
                    try {
                        const resolved = resolveMonster(beast, [...allResolvedMonsters, ...unresolved]);
                        allResolvedMonsters.push(resolved);
                    } catch (e) {
                        // If base not found yet, try in next pass
                        stillUnresolved.push(beast);
                    }
                }
                unresolved = stillUnresolved;
            }
            if (unresolved.length > 0) {
                console.warn(`Some monsters with _copy could not be resolved:`, unresolved.map(b => b.name));
            }

            // 3. Create index data
            const indexData = {
                monsters: allResolvedMonsters.map(beast => ({
                    id: generateSafeFilename(beast.name, beast.source),
                    name: beast.name,
                    cr: beast.cr,
                    type: beast.type,
                    source: beast.source,
                    ac: beast.ac,
                    size: beast.size,
                    alignment: beast.alignment,
                    file: `${generateSafeFilename(beast.name, beast.source)}.json`
                }))
            };

            // 4. Save index file
            await FileSystem.writeAsStringAsync(BEASTS_INDEX_FILE, JSON.stringify(indexData));
            console.log(`Stored index with ${allResolvedMonsters.length} monsters`);

            // 5. Save individual monster files (resolved, no _copy)
            for (const beast of allResolvedMonsters) {
                const filename = `${generateSafeFilename(beast.name, beast.source)}.json`;
                const filePath = `${MONSTERS_DIR}${filename}`;
                await FileSystem.writeAsStringAsync(filePath, JSON.stringify(beast));
            }

            console.log(`Stored ${allResolvedMonsters.length} individual monster files`);
        }
    } catch (error) {
        console.error('Error storing beasts to files:', error);
        throw error;
    }
};

// Store spells data to individual files
export const storeSpellsToFile = async (spells: any[]): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            // Create index data
            const indexData = {
                spells: spells.map(spell => ({
                    id: generateSafeFilename(spell.name, spell.source),
                    name: spell.name,
                    level: spell.level,
                    school: spell.school,
                    source: spell.source,
                    classes: spell.classes,
                    ritual: spell.ritual,
                    concentration: spell.concentration,
                    file: `${generateSafeFilename(spell.name, spell.source)}.json`
                }))
            };
            
            // Save index to localStorage
            localStorage.setItem(WEB_STORAGE_KEYS.SPELLS_INDEX, JSON.stringify(indexData));
            console.log(`Stored index with ${spells.length} spells`);
            
            // Save individual spell files to localStorage
            for (const spell of spells) {
                const key = `${WEB_STORAGE_KEYS.SPELLS_PREFIX}${generateSafeFilename(spell.name, spell.source)}`;
                localStorage.setItem(key, JSON.stringify(spell));
            }
            
            console.log(`Stored ${spells.length} individual spell files`);
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();
            
            // Create index data
            const indexData = {
                spells: spells.map(spell => ({
                    id: generateSafeFilename(spell.name, spell.source),
                    name: spell.name,
                    level: spell.level,
                    school: spell.school,
                    source: spell.source,
                    classes: spell.classes,
                    ritual: spell.ritual,
                    concentration: spell.concentration,
                    file: `${generateSafeFilename(spell.name, spell.source)}.json`
                }))
            };
            
            // Save index file
            await FileSystem.writeAsStringAsync(SPELLS_INDEX_FILE, JSON.stringify(indexData));
            console.log(`Stored index with ${spells.length} spells`);
            
            // Save individual spell files
            for (const spell of spells) {
                const filename = `${generateSafeFilename(spell.name, spell.source)}.json`;
                const filePath = `${SPELLS_DIR}${filename}`;
                await FileSystem.writeAsStringAsync(filePath, JSON.stringify(spell));
            }
            
            console.log(`Stored ${spells.length} individual spell files`);
        }
    } catch (error) {
        console.error('Error storing spells to files:', error);
        throw error;
    }
};

// Store a single combat to file and update index
export const storeCombatToFile = async (combat: any): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const filename = generateCombatFilename(combat.id, combat.name);
            const key = `${WEB_STORAGE_KEYS.COMBATS_PREFIX}${combat.id}`;
            localStorage.setItem(key, JSON.stringify(combat));
            
            // Update index
            let indexData: { combats: any[] } = { combats: [] };
            const indexJson = localStorage.getItem(WEB_STORAGE_KEYS.COMBATS_INDEX);
            if (indexJson) {
                indexData = JSON.parse(indexJson);
            }
            // Remove any old entry with same id
            indexData.combats = indexData.combats.filter((c: any) => c.id !== combat.id);
            indexData.combats.push({
                id: combat.id,
                name: combat.name,
                createdAt: combat.createdAt,
                file: filename
            });
            localStorage.setItem(WEB_STORAGE_KEYS.COMBATS_INDEX, JSON.stringify(indexData));
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();
            const filename = generateCombatFilename(combat.id, combat.name);
            const filePath = `${COMBATS_DIR}${filename}`;
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(combat));
            // Update index
            let indexData: { combats: any[] } = { combats: [] };
            const indexInfo = await FileSystem.getInfoAsync(COMBATS_INDEX_FILE);
            if (indexInfo.exists) {
                const jsonData = await FileSystem.readAsStringAsync(COMBATS_INDEX_FILE);
                indexData = JSON.parse(jsonData);
            }
            // Remove any old entry with same id
            indexData.combats = indexData.combats.filter((c: any) => c.id !== combat.id);
            indexData.combats.push({
                id: combat.id,
                name: combat.name,
                createdAt: combat.createdAt,
                file: filename
            });
            await FileSystem.writeAsStringAsync(COMBATS_INDEX_FILE, JSON.stringify(indexData));
        }
    } catch (error) {
        console.error('Error storing combat to file:', error);
        throw error;
    }
};

// Load beasts index from file
export const loadBeastsIndexFromFile = async (): Promise<any[] | null> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const jsonData = localStorage.getItem(WEB_STORAGE_KEYS.BEASTS_INDEX);
            if (!jsonData) {
                return null;
            }
            
            const indexData = JSON.parse(jsonData);
            console.log(`Loaded index with ${indexData.monsters.length} monsters`);
            return indexData.monsters;
        } else {
            // Mobile implementation using expo-file-system
            const fileInfo = await FileSystem.getInfoAsync(BEASTS_INDEX_FILE);
            if (!fileInfo.exists) {
                return null;
            }
            
            const jsonData = await FileSystem.readAsStringAsync(BEASTS_INDEX_FILE);
            const indexData = JSON.parse(jsonData);
            console.log(`Loaded index with ${indexData.monsters.length} monsters`);
            return indexData.monsters;
        }
    } catch (error) {
        console.error('Error loading beasts index from file:', error);
        return null;
    }
};

// Load spells index from file
export const loadSpellsIndexFromFile = async (): Promise<any[] | null> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const jsonData = localStorage.getItem(WEB_STORAGE_KEYS.SPELLS_INDEX);
            if (!jsonData) {
                return null;
            }
            
            const indexData = JSON.parse(jsonData);
            console.log(`Loaded index with ${indexData.spells.length} spells`);
            return indexData.spells;
        } else {
            // Mobile implementation using expo-file-system
            const fileInfo = await FileSystem.getInfoAsync(SPELLS_INDEX_FILE);
            if (!fileInfo.exists) {
                return null;
            }
            
            const jsonData = await FileSystem.readAsStringAsync(SPELLS_INDEX_FILE);
            const indexData = JSON.parse(jsonData);
            console.log(`Loaded index with ${indexData.spells.length} spells`);
            return indexData.spells;
        }
    } catch (error) {
        console.error('Error loading spells index from file:', error);
        return null;
    }
};

// Load combats index from file
export const loadCombatsIndexFromFile = async (): Promise<any[] | null> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const jsonData = localStorage.getItem(WEB_STORAGE_KEYS.COMBATS_INDEX);
            if (!jsonData) {
                return null;
            }
            const indexData = JSON.parse(jsonData);
            return indexData.combats;
        } else {
            // Mobile implementation using expo-file-system
            const fileInfo = await FileSystem.getInfoAsync(COMBATS_INDEX_FILE);
            if (!fileInfo.exists) {
                return null;
            }
            const jsonData = await FileSystem.readAsStringAsync(COMBATS_INDEX_FILE);
            const indexData = JSON.parse(jsonData);
            return indexData.combats;
        }
    } catch (error) {
        console.error('Error loading combats index from file:', error);
        return null;
    }
};

// Load individual monster from file
export const loadMonsterFromFile = async (filename: string): Promise<any | null> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const monsterId = filename.replace('.json', '');
            const key = `${WEB_STORAGE_KEYS.MONSTERS_PREFIX}${monsterId}`;
            const jsonData = localStorage.getItem(key);
            if (!jsonData) {
                return null;
            }
            const monster = JSON.parse(jsonData);
            return monster;
        } else {
            // Mobile implementation using expo-file-system
            const filePath = `${MONSTERS_DIR}${filename}`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                return null;
            }
            const jsonData = await FileSystem.readAsStringAsync(filePath);
            const monster = JSON.parse(jsonData);
            return monster;
        }
    } catch (error) {
        console.error(`Error loading monster from file ${filename}:`, error);
        return null;
    }
};

// Load individual spell from file
export const loadSpellFromFile = async (filename: string): Promise<any | null> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const spellId = filename.replace('.json', '');
            const key = `${WEB_STORAGE_KEYS.SPELLS_PREFIX}${spellId}`;
            const jsonData = localStorage.getItem(key);
            if (!jsonData) {
                return null;
            }
            const spell = JSON.parse(jsonData);
            return spell;
        } else {
            // Mobile implementation using expo-file-system
            const filePath = `${SPELLS_DIR}${filename}`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                return null;
            }
            
            const jsonData = await FileSystem.readAsStringAsync(filePath);
            const spell = JSON.parse(jsonData);
            return spell;
        }
    } catch (error) {
        console.error(`Error loading spell from file ${filename}:`, error);
        return null;
    }
};

// Load individual combat from file
export const loadCombatFromFile = async (filename: string): Promise<any | null> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            // Extract combat ID from filename (format: id-name.json)
            const combatId = filename.split('-')[0];
            const key = `${WEB_STORAGE_KEYS.COMBATS_PREFIX}${combatId}`;
            const jsonData = localStorage.getItem(key);
            if (!jsonData) {
                return null;
            }
            const combat = JSON.parse(jsonData);
            return combat;
        } else {
            // Mobile implementation using expo-file-system
            const filePath = `${COMBATS_DIR}${filename}`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                return null;
            }
            const jsonData = await FileSystem.readAsStringAsync(filePath);
            const combat = JSON.parse(jsonData);
            return combat;
        }
    } catch (error) {
        console.error(`Error loading combat from file ${filename}:`, error);
        return null;
    }
};

// Load multiple monsters from files (for search/filter results)
export const loadMonstersFromFiles = async (filenames: string[]): Promise<any[]> => {
    try {
        const monsters: any[] = [];
        for (const filename of filenames) {
            const monster = await loadMonsterFromFile(filename);
            if (monster) {
                monsters.push(monster);
            }
        }
        return monsters;
    } catch (error) {
        console.error('Error loading monsters from files:', error);
        return [];
    }
};

// Load multiple spells from files (for search/filter results)
export const loadSpellsFromFiles = async (filenames: string[]): Promise<any[]> => {
    try {
        const spells: any[] = [];
        for (const filename of filenames) {
            const spell = await loadSpellFromFile(filename);
            if (spell) {
                spells.push(spell);
            }
        }
        return spells;
    } catch (error) {
        console.error('Error loading spells from files:', error);
        return [];
    }
};

// Delete a combat file and update index
export const deleteCombatFile = async (id: string): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            let indexData: { combats: any[] } = { combats: [] };
            const indexJson = localStorage.getItem(WEB_STORAGE_KEYS.COMBATS_INDEX);
            if (indexJson) {
                indexData = JSON.parse(indexJson);
            }
            const combatEntry = indexData.combats.find((c: any) => c.id === id);
            if (combatEntry) {
                const key = `${WEB_STORAGE_KEYS.COMBATS_PREFIX}${id}`;
                localStorage.removeItem(key);
            }
            indexData.combats = indexData.combats.filter((c: any) => c.id !== id);
            localStorage.setItem(WEB_STORAGE_KEYS.COMBATS_INDEX, JSON.stringify(indexData));
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();
            let indexData: { combats: any[] } = { combats: [] };
            const indexInfo = await FileSystem.getInfoAsync(COMBATS_INDEX_FILE);
            if (indexInfo.exists) {
                const jsonData = await FileSystem.readAsStringAsync(COMBATS_INDEX_FILE);
                indexData = JSON.parse(jsonData);
            }
            const combatEntry = indexData.combats.find((c: any) => c.id === id);
            if (combatEntry) {
                const filePath = `${COMBATS_DIR}${combatEntry.file}`;
                await FileSystem.deleteAsync(filePath, { idempotent: true });
            }
            indexData.combats = indexData.combats.filter((c: any) => c.id !== id);
            await FileSystem.writeAsStringAsync(COMBATS_INDEX_FILE, JSON.stringify(indexData));
        }
    } catch (error) {
        console.error('Error deleting combat file:', error);
    }
};

// Clear all data files
export const clearAllFiles = async (): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            // Clear all localStorage keys that start with our prefixes
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (
                    key.startsWith(WEB_STORAGE_KEYS.MONSTERS_PREFIX) ||
                    key.startsWith(WEB_STORAGE_KEYS.SPELLS_PREFIX) ||
                    key.startsWith(WEB_STORAGE_KEYS.COMBATS_PREFIX) ||
                    key === WEB_STORAGE_KEYS.BEASTS_INDEX ||
                    key === WEB_STORAGE_KEYS.SPELLS_INDEX ||
                    key === WEB_STORAGE_KEYS.COMBATS_INDEX ||
                    key === WEB_STORAGE_KEYS.PLAYERS ||
                    key === WEB_STORAGE_KEYS.SPELLBOOKS
                )) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log('Cleared all data files');
        } else {
            // Mobile implementation using expo-file-system
            await FileSystem.deleteAsync(DATA_DIR, { idempotent: true });
            console.log('Cleared all data files');
        }
    } catch (error) {
        console.error('Error clearing data files:', error);
    }
};

// Clear only beasts and spells data
export const clearBeastsAndSpellsOnly = async (): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            // Clear all localStorage keys that start with our prefixes for beasts and spells
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (
                    key.startsWith(WEB_STORAGE_KEYS.MONSTERS_PREFIX) ||
                    key.startsWith(WEB_STORAGE_KEYS.SPELLS_PREFIX) ||
                    key === WEB_STORAGE_KEYS.BEASTS_INDEX ||
                    key === WEB_STORAGE_KEYS.SPELLS_INDEX
                )) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log('Cleared only beasts and spells data');
        } else {
            // Mobile implementation using expo-file-system
            // Delete monsters directory
            const monstersDirInfo = await FileSystem.getInfoAsync(MONSTERS_DIR);
            if (monstersDirInfo.exists) {
                await FileSystem.deleteAsync(MONSTERS_DIR, { idempotent: true });
            }
            // Delete spells directory
            const spellsDirInfo = await FileSystem.getInfoAsync(SPELLS_DIR);
            if (spellsDirInfo.exists) {
                await FileSystem.deleteAsync(SPELLS_DIR, { idempotent: true });
            }
            // Delete beasts index file
            const beastsIndexInfo = await FileSystem.getInfoAsync(BEASTS_INDEX_FILE);
            if (beastsIndexInfo.exists) {
                await FileSystem.deleteAsync(BEASTS_INDEX_FILE, { idempotent: true });
            }
            // Delete spells index file
            const spellsIndexInfo = await FileSystem.getInfoAsync(SPELLS_INDEX_FILE);
            if (spellsIndexInfo.exists) {
                await FileSystem.deleteAsync(SPELLS_INDEX_FILE, { idempotent: true });
            }
            console.log('Cleared only beasts and spells data');
        }
    } catch (error) {
        console.error('Error clearing beasts and spells data:', error);
    }
};

// Get storage info
export const getStorageInfo = async (): Promise<{ 
    beastsIndexSize: number; 
    beastsCount: number; 
    spellsIndexSize: number; 
    spellsCount: number; 
}> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const beastsIndexJson = localStorage.getItem(WEB_STORAGE_KEYS.BEASTS_INDEX);
            const spellsIndexJson = localStorage.getItem(WEB_STORAGE_KEYS.SPELLS_INDEX);
            
            let beastsCount = 0;
            let beastsIndexSize = 0;
            if (beastsIndexJson) {
                const index = JSON.parse(beastsIndexJson);
                beastsCount = index.monsters?.length || 0;
                beastsIndexSize = beastsIndexJson.length;
            }
            
            let spellsCount = 0;
            let spellsIndexSize = 0;
            if (spellsIndexJson) {
                const index = JSON.parse(spellsIndexJson);
                spellsCount = index.spells?.length || 0;
                spellsIndexSize = spellsIndexJson.length;
            }
            
            return {
                beastsIndexSize,
                beastsCount,
                spellsIndexSize,
                spellsCount
            };
        } else {
            // Mobile implementation using expo-file-system
            const beastsIndexInfo = await FileSystem.getInfoAsync(BEASTS_INDEX_FILE);
            const spellsIndexInfo = await FileSystem.getInfoAsync(SPELLS_INDEX_FILE);
            
            let beastsCount = 0;
            if (beastsIndexInfo.exists) {
                const indexData = await FileSystem.readAsStringAsync(BEASTS_INDEX_FILE);
                const index = JSON.parse(indexData);
                beastsCount = index.monsters?.length || 0;
            }
            
            let spellsCount = 0;
            if (spellsIndexInfo.exists) {
                const indexData = await FileSystem.readAsStringAsync(SPELLS_INDEX_FILE);
                const index = JSON.parse(indexData);
                spellsCount = index.spells?.length || 0;
            }
            
            return {
                beastsIndexSize: beastsIndexInfo.exists ? beastsIndexInfo.size || 0 : 0,
                beastsCount,
                spellsIndexSize: spellsIndexInfo.exists ? spellsIndexInfo.size || 0 : 0,
                spellsCount
            };
        }
    } catch (error) {
        console.error('Error getting storage info:', error);
        return { beastsIndexSize: 0, beastsCount: 0, spellsIndexSize: 0, spellsCount: 0 };
    }
}; 

// Save the full players list
export const savePlayersList = async (players: any[]): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            localStorage.setItem(WEB_STORAGE_KEYS.PLAYERS, JSON.stringify(players));
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();
            await FileSystem.writeAsStringAsync(PLAYERS_FILE, JSON.stringify(players));
        }
    } catch (error) {
        console.error('Error saving players list:', error);
        throw error;
    }
};

// Load the full players list
export const loadPlayersList = async (): Promise<any[]> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const jsonData = localStorage.getItem(WEB_STORAGE_KEYS.PLAYERS);
            if (!jsonData) return [];
            return JSON.parse(jsonData);
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();
            const fileInfo = await FileSystem.getInfoAsync(PLAYERS_FILE);
            if (!fileInfo.exists) return [];
            const jsonData = await FileSystem.readAsStringAsync(PLAYERS_FILE);
            return JSON.parse(jsonData);
        }
    } catch (error) {
        console.error('Error loading players list:', error);
        return [];
    }
};

// Add a player
export const addPlayer = async (player: { name: string, race: string, class: string, maxHp: number, ac: number, tokenUrl?: string }): Promise<void> => {
    const players = await loadPlayersList();
    players.push({
        ...player,
        maxHp: player.maxHp || 0,
        ac: player.ac || 0,
        tokenUrl: player.tokenUrl || "data:image/jpeg;base64,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"
    });
    await savePlayersList(players);
};

// Remove a player by name
export const removePlayer = async (name: string): Promise<void> => {
    let players = await loadPlayersList();
    players = players.filter(p => p.name !== name);
    await savePlayersList(players);
};

// Update a player by name
export const updatePlayer = async (name: string, updated: { name?: string, race?: string, class?: string, maxHp?: number, ac?: number, tokenUrl?: string }): Promise<void> => {
    let players = await loadPlayersList();
    players = players.map(p => p.name === name ? { ...p, ...updated, maxHp: updated.maxHp ?? p.maxHp ?? 0, ac: updated.ac ?? p.ac ?? 0, tokenUrl: updated.tokenUrl ?? p.tokenUrl ?? "data:image/jpeg;base64,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" } : p);
    await savePlayersList(players);
}; 

// Spellbook functions
export const loadSpellbooksFromFile = async (): Promise<any[]> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            const jsonData = localStorage.getItem(WEB_STORAGE_KEYS.SPELLBOOKS);
            if (!jsonData) return [];
            return JSON.parse(jsonData);
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();
            const fileInfo = await FileSystem.getInfoAsync(SPELLBOOKS_FILE);
            if (!fileInfo.exists) return [];
            const jsonData = await FileSystem.readAsStringAsync(SPELLBOOKS_FILE);
            return JSON.parse(jsonData);
        }
    } catch (error) {
        console.error('Error loading spellbooks:', error);
        return [];
    }
};

export const saveSpellbooksToFile = async (spellbooks: any[]): Promise<void> => {
    try {
        if (isWeb) {
            // Web implementation using localStorage
            localStorage.setItem(WEB_STORAGE_KEYS.SPELLBOOKS, JSON.stringify(spellbooks));
        } else {
            // Mobile implementation using expo-file-system
            await ensureDataDir();
            await FileSystem.writeAsStringAsync(SPELLBOOKS_FILE, JSON.stringify(spellbooks));
        }
    } catch (error) {
        console.error('Error saving spellbooks:', error);
        throw error;
    }
};

export const addSpellToSpellbook = async (spellbookId: string, spellName: string, spellSource: string): Promise<void> => {
    const spellbooks = await loadSpellbooksFromFile();
    const spellbook = spellbooks.find(sb => sb.id === spellbookId);
    if (spellbook) {
        const spellId = `${spellName}-${spellSource}`;
        if (!spellbook.spells.includes(spellId)) {
            spellbook.spells.push(spellId);
            spellbook.updatedAt = new Date().toISOString();
            await saveSpellbooksToFile(spellbooks);
        }
    }
};

export const removeSpellFromSpellbook = async (spellbookId: string, spellName: string, spellSource: string): Promise<void> => {
    const spellbooks = await loadSpellbooksFromFile();
    const spellbook = spellbooks.find(sb => sb.id === spellbookId);
    if (spellbook) {
        const spellId = `${spellName}-${spellSource}`;
        spellbook.spells = spellbook.spells.filter((spell: string) => spell !== spellId);
        spellbook.updatedAt = new Date().toISOString();
        await saveSpellbooksToFile(spellbooks);
    }
};

export const createSpellbook = async (name: string, description?: string): Promise<string> => {
    const spellbooks = await loadSpellbooksFromFile();
    const id = `spellbook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newSpellbook = {
        id,
        name,
        description,
        spells: [],
        createdAt: now,
        updatedAt: now,
    };
    
    spellbooks.push(newSpellbook);
    await saveSpellbooksToFile(spellbooks);
    return id;
};

export const deleteSpellbook = async (id: string): Promise<void> => {
    const spellbooks = await loadSpellbooksFromFile();
    const updated = spellbooks.filter(sb => sb.id !== id);
    await saveSpellbooksToFile(updated);
}; 