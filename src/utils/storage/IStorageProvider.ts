// MODELS
import {
    Beast,
    Spell,
    Player,
    Spellbook,
    Combat,
    BeastIndex,
    SpellIndex,
    CombatIndex,
    SpellClassRelationIndex
} from 'src/models/interfaces/utils';

/**
 * Interface defining the contract for storage providers
 */
export interface IStorageProvider {
    // Index operations
    storeBeastsIndex(beasts: Beast[]): Promise<void>;
    storeSpellsIndex(spells: Spell[]): Promise<void>;
    storeCombatIndex(combat: Combat): Promise<void>;
    storeSpellClassRelationsIndex(relations: SpellClassRelationIndex[]): Promise<void>;
    storeAvailableClassesIndex(classes: string[]): Promise<void>;

    loadBeastsIndex(): Promise<BeastIndex[] | null>;
    loadSpellsIndex(): Promise<SpellIndex[] | null>;
    loadCombatsIndex(): Promise<CombatIndex[] | null>;
    loadSpellClassRelationsIndex(): Promise<SpellClassRelationIndex[] | null>;
    loadAvailableClassesIndex(): Promise<string[] | null>;

    // Individual file operations
    storeBeast(beast: Beast): Promise<void>;
    storeSpell(spell: Spell): Promise<void>;
    storeCombat(combat: Combat): Promise<void>;

    loadBeast(filename: string): Promise<Beast | null>;
    loadSpell(filename: string): Promise<Spell | null>;
    loadCombat(filename: string): Promise<Combat | null>;

    // Batch operations
    loadBeasts(filenames: string[]): Promise<Beast[]>;
    loadSpells(filenames: string[]): Promise<Spell[]>;

    // Player operations
    savePlayers(players: Player[]): Promise<void>;
    loadPlayers(): Promise<Player[]>;
    addPlayer(player: Player): Promise<void>;
    removePlayer(name: string): Promise<void>;
    updatePlayer(name: string, updated: Partial<Player>): Promise<void>;

    // Spellbook operations
    saveSpellbooks(spellbooks: Spellbook[]): Promise<void>;
    loadSpellbooks(): Promise<Spellbook[]>;
    addSpellToSpellbook(spellbookId: string, spellName: string, spellSource: string): Promise<void>;
    removeSpellFromSpellbook(spellbookId: string, spellName: string, spellSource: string): Promise<void>;
    createSpellbook(name: string, description?: string): Promise<string>;
    deleteSpellbook(id: string): Promise<void>;

    // Combat operations
    deleteCombat(id: string): Promise<void>;

    // Utility operations
    clearAllData(): Promise<void>;
    clearBeastsAndSpellsOnly(): Promise<void>;
    getStorageInfo(): Promise<{
        beastsIndexSize: number;
        beastsCount: number;
        spellsIndexSize: number;
        spellsCount: number;
        spellClassRelationsCount: number;
        availableClassesCount: number;
    }>;

    // Platform-specific operations
    ensureDataDirectory(): Promise<void>;

    // Regeneration operations
    regenerateAllIndexes(): Promise<void>;
    regenerateCombatFiles(): Promise<void>;
}
