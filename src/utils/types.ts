// Storage Types
export interface StorageKeys {
    BEASTS_INDEX: string;
    SPELLS_INDEX: string;
    COMBATS_INDEX: string;
    SPELLBOOKS: string;
    PLAYERS: string;
    MONSTERS_PREFIX: string;
    SPELLS_PREFIX: string;
    COMBATS_PREFIX: string;
}

// Index Types
export interface BeastIndex {
    id: string;
    name: string;
    cr: any;
    type: string;
    source: string;
    ac: any;
    size: string;
    alignment: string;
    file: string;
}

export interface SpellIndex {
    id: string;
    name: string;
    level: number;
    school: string;
    source: string;
    availableClasses: string[];
    ritual: boolean;
    concentration: boolean;
    file: string;
}

export interface CombatIndex {
    id: string;
    name: string;
    createdAt: number;
    file: string;
}

// Data Types
export interface Beast {
    name: string;
    type: string;
    CR: string | number;
    source: string;
    [key: string]: any;
}

export interface Spell {
    name: string;
    level: number;
    school: string;
    source: string;
    duration?: any[];
    meta?: {
        ritual?: boolean;
        [key: string]: any;
    };
    availableClasses?: string[];
    [key: string]: any;
}

export interface Player {
    name: string;
    race: string;
    class: string;
    maxHp: number;
    ac: number;
    passivePerception?: number;
    initiativeBonus?: number;
    tokenUrl?: string;
}

export interface Spellbook {
    id: string;
    name: string;
    description?: string;
    spells: Array<{
        name: string;
        source: string;
    }>;
    createdAt: number;
}

export interface Combat {
    id: string;
    name: string;
    combatants: any[];
    createdAt: number;
    [key: string]: any;
}

// Storage Info Types
export interface StorageInfo {
    beastsIndexSize: number;
    beastsCount: number;
    spellsIndexSize: number;
    spellsCount: number;
}

// StorageUsage interface moved to storageManager.ts to avoid conflicts

// Utility Types
export interface SafeStorageResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Spell Processing Types
export interface SpellProcessingData {
    concentration: boolean;
    ritual: boolean;
    availableClasses: string[];
}

// Constants
export const STORAGE_KEYS: StorageKeys = {
    BEASTS_INDEX: 'dnd_beasts_index',
    SPELLS_INDEX: 'dnd_spells_index',
    COMBATS_INDEX: 'dnd_combats_index',
    SPELLBOOKS: 'dnd_spellbooks',
    PLAYERS: 'dnd_players',
    MONSTERS_PREFIX: 'dnd_monster_',
    SPELLS_PREFIX: 'dnd_spell_',
    COMBATS_PREFIX: 'dnd_combat_'
};
