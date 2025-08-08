import { StorageFactory } from './storage/StorageFactory';
import { Beast, Spell, Player, Spellbook, Combat } from './types';

// Re-export the storage provider for direct access
export const storage = StorageFactory.getStorageProvider();

// Legacy API compatibility functions
// These maintain the same interface as the old fileStorage functions

export const ensureDataDir = async (): Promise<void> => {
    await storage.ensureDataDirectory();
};

export const storeBeastsToFile = async (beasts: Beast[]): Promise<void> => {
    await storage.storeBeastsIndex(beasts);
};

export const storeSpellsToFile = async (spells: Spell[]): Promise<void> => {
    await storage.storeSpellsIndex(spells);
};

export const storeSpellClassRelationsToFile = async (relations: any[]): Promise<void> => {
    await storage.storeSpellClassRelationsIndex(relations);
};

export const storeAvailableClassesToFile = async (classes: string[]): Promise<void> => {
    await storage.storeAvailableClassesIndex(classes);
};

export const storeCombatToFile = async (combat: Combat): Promise<void> => {
    await storage.storeCombatIndex(combat);
};

export const loadBeastsIndexFromFile = async (): Promise<any[] | null> => {
    return await storage.loadBeastsIndex();
};

export const loadSpellsIndexFromFile = async (): Promise<any[] | null> => {
    return await storage.loadSpellsIndex();
};

export const loadSpellClassRelationsIndexFromFile = async (): Promise<any[] | null> => {
    return await storage.loadSpellClassRelationsIndex();
};

export const loadAvailableClassesIndexFromFile = async (): Promise<string[] | null> => {
    return await storage.loadAvailableClassesIndex();
};

export const loadCombatsIndexFromFile = async (): Promise<any[] | null> => {
    return await storage.loadCombatsIndex();
};

export const loadMonsterFromFile = async (filename: string): Promise<any | null> => {
    return await storage.loadBeast(filename);
};

export const loadSpellFromFile = async (filename: string): Promise<any | null> => {
    return await storage.loadSpell(filename);
};

export const loadCombatFromFile = async (filename: string): Promise<any | null> => {
    return await storage.loadCombat(filename);
};

export const loadMonstersFromFiles = async (filenames: string[]): Promise<any[]> => {
    return await storage.loadBeasts(filenames);
};

export const loadSpellsFromFiles = async (filenames: string[]): Promise<any[]> => {
    return await storage.loadSpells(filenames);
};

export const deleteCombatFile = async (id: string): Promise<void> => {
    await storage.deleteCombat(id);
};

export const clearAllFiles = async (): Promise<void> => {
    await storage.clearAllData();
};

export const clearBeastsAndSpellsOnly = async (): Promise<void> => {
    await storage.clearBeastsAndSpellsOnly();
};

export const getStorageInfo = async (): Promise<{
    beastsIndexSize: number;
    beastsCount: number;
    spellsIndexSize: number;
    spellsCount: number;
}> => {
    return await storage.getStorageInfo();
};

export const savePlayersList = async (players: Player[]): Promise<void> => {
    await storage.savePlayers(players);
};

export const loadPlayersList = async (): Promise<Player[]> => {
    return await storage.loadPlayers();
};

export const addPlayer = async (player: Player): Promise<void> => {
    await storage.addPlayer(player);
};

export const removePlayer = async (name: string): Promise<void> => {
    await storage.removePlayer(name);
};

export const updatePlayer = async (name: string, updated: Partial<Player>): Promise<void> => {
    await storage.updatePlayer(name, updated);
};

export const loadSpellbooksFromFile = async (): Promise<Spellbook[]> => {
    return await storage.loadSpellbooks();
};

export const saveSpellbooksToFile = async (spellbooks: Spellbook[]): Promise<void> => {
    await storage.saveSpellbooks(spellbooks);
};

export const addSpellToSpellbook = async (spellbookId: string, spellName: string, spellSource: string): Promise<void> => {
    await storage.addSpellToSpellbook(spellbookId, spellName, spellSource);
};

export const removeSpellFromSpellbook = async (spellbookId: string, spellName: string, spellSource: string): Promise<void> => {
    await storage.removeSpellFromSpellbook(spellbookId, spellName, spellSource);
};

export const createSpellbook = async (name: string, description?: string): Promise<string> => {
    return await storage.createSpellbook(name, description);
};

export const deleteSpellbook = async (id: string): Promise<void> => {
    await storage.deleteSpellbook(id);
}; 