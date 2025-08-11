// Storage Types
export interface StorageKeys {
    BEASTS_INDEX: string;
    SPELLS_INDEX: string;
    COMBATS_INDEX: string;
    SPELLBOOKS: string;
    PLAYERS: string;
    CAMPAIGNS: string;
    SELECTED_CAMPAIGN: string;
    MONSTERS_PREFIX: string;
    SPELLS_PREFIX: string;
    COMBATS_PREFIX: string;
    SPELL_CLASS_RELATIONS_INDEX: string;
    AVAILABLE_CLASSES_INDEX: string;
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

export interface SpellClassRelationIndex {
    spellName: string;
    source: string;
    className: string;
    book: string;
}

export interface AvailableClassesIndex {
    classes: string[];
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
    // Processed properties for consistency with SpellIndex
    ritual?: boolean;
    concentration?: boolean;
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
    campaignId?: string;
}

export interface SpellbookSpell {
    name: string;
    source: string;
    level: number;
    school: string;
    ritual: boolean;
    concentration: boolean;
    availableClasses: string[];
}

export interface Spellbook {
    id: string;
    name: string;
    description?: string;
    spellsIndex: SpellbookSpell[]; // Index of spell details for filtering and display
    createdAt: string;
    updatedAt: string;
    campaignId?: string; // Campaign this spellbook belongs to
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
    CAMPAIGNS: 'dnd_campaigns',
    SELECTED_CAMPAIGN: 'dnd_selected_campaign',
    MONSTERS_PREFIX: 'dnd_monster_',
    SPELLS_PREFIX: 'dnd_spell_',
    COMBATS_PREFIX: 'dnd_combat_',
    SPELL_CLASS_RELATIONS_INDEX: 'dnd_spell_class_relations_index',
    AVAILABLE_CLASSES_INDEX: 'dnd_available_classes_index'
};
