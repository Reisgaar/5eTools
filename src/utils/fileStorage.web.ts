import { resolveMonster } from '../data/resolveMonster';
import { set, get, del, clear, keys } from 'idb-keyval';

const WEB_STORAGE_KEYS = {
    BEASTS_INDEX: 'dnd_beasts_index',
    SPELLS_INDEX: 'dnd_spells_index',
    COMBATS_INDEX: 'dnd_combats_index',
    SPELLBOOKS: 'dnd_spellbooks',
    PLAYERS: 'dnd_players',
    MONSTERS_PREFIX: 'dnd_monster_',
    SPELLS_PREFIX: 'dnd_spell_',
    COMBATS_PREFIX: 'dnd_combat_'
};

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

const generateCombatFilename = (id: string, name: string): string => {
    const safeName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return `${id}-${safeName}.json`;
};

export const ensureDataDir = async (): Promise<void> => {
    // No-op en web
};

export const storeBeastsToFile = async (beasts: any[]): Promise<void> => {
    const monstersWithoutCopy = beasts.filter(beast => !beast._copy);
    let monstersWithCopy = beasts.filter(beast => beast._copy);
    const allResolvedMonsters: any[] = [...monstersWithoutCopy];
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
                stillUnresolved.push(beast);
            }
        }
        unresolved = stillUnresolved;
    }
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
    await set(WEB_STORAGE_KEYS.BEASTS_INDEX, indexData);
    for (const beast of allResolvedMonsters) {
        const key = `${WEB_STORAGE_KEYS.MONSTERS_PREFIX}${generateSafeFilename(beast.name, beast.source)}`;
        await set(key, beast);
    }
};

export const storeSpellsToFile = async (spells: any[]): Promise<void> => {
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
    await set(WEB_STORAGE_KEYS.SPELLS_INDEX, indexData);
    for (const spell of spells) {
        const key = `${WEB_STORAGE_KEYS.SPELLS_PREFIX}${generateSafeFilename(spell.name, spell.source)}`;
        await set(key, spell);
    }
};

export const storeCombatToFile = async (combat: any): Promise<void> => {
    const filename = generateCombatFilename(combat.id, combat.name);
    const key = `${WEB_STORAGE_KEYS.COMBATS_PREFIX}${combat.id}`;
    await set(key, combat);
    let indexData: { combats: any[] } = { combats: [] };
    const indexJson = await get(WEB_STORAGE_KEYS.COMBATS_INDEX);
    if (indexJson) {
        indexData = indexJson;
    }
    indexData.combats = indexData.combats.filter((c: any) => c.id !== combat.id);
    indexData.combats.push({
        id: combat.id,
        name: combat.name,
        createdAt: combat.createdAt,
        file: filename
    });
    await set(WEB_STORAGE_KEYS.COMBATS_INDEX, indexData);
};

export const loadBeastsIndexFromFile = async (): Promise<any[] | null> => {
    const indexData = await get(WEB_STORAGE_KEYS.BEASTS_INDEX);
    if (!indexData) return null;
    return indexData.monsters;
};

export const loadSpellsIndexFromFile = async (): Promise<any[] | null> => {
    const indexData = await get(WEB_STORAGE_KEYS.SPELLS_INDEX);
    if (!indexData) return null;
    return indexData.spells;
};

export const loadCombatsIndexFromFile = async (): Promise<any[] | null> => {
    // Load all combats directly from their individual keys
    const allKeys = await keys();
    const combatKeys = allKeys.filter(key => 
        typeof key === 'string' && key.startsWith(WEB_STORAGE_KEYS.COMBATS_PREFIX)
    );
    
    const combats: any[] = [];
    for (const key of combatKeys) {
        if (typeof key === 'string') {
            const combat = await get(key);
            if (combat) {
                console.log('Loaded combat from IndexedDB:', combat.name, combat.id);
                console.log('Full combat data:', combat);
                console.log('Combatants count:', combat.combatants?.length || 0);
                combats.push(combat);
            }
        }
    }
    
    // Sort by creation date (newest first)
    combats.sort((a, b) => b.createdAt - a.createdAt);
    console.log('Total combats loaded from IndexedDB:', combats.length);
    
    return combats;
};

export const loadMonsterFromFile = async (filename: string): Promise<any | null> => {
    const monsterId = filename.replace('.json', '');
    const key = `${WEB_STORAGE_KEYS.MONSTERS_PREFIX}${monsterId}`;
    const data = await get(key);
    if (!data) return null;
    return data;
};

export const loadSpellFromFile = async (filename: string): Promise<any | null> => {
    const spellId = filename.replace('.json', '');
    const key = `${WEB_STORAGE_KEYS.SPELLS_PREFIX}${spellId}`;
    const data = await get(key);
    if (!data) return null;
    return data;
};

export const loadCombatFromFile = async (filename: string): Promise<any | null> => {
    const combatId = filename.split('-')[0];
    const key = `${WEB_STORAGE_KEYS.COMBATS_PREFIX}${combatId}`;
    const data = await get(key);
    if (!data) return null;
    return data;
};

export const loadMonstersFromFiles = async (filenames: string[]): Promise<any[]> => {
    const monsters: any[] = [];
    for (const filename of filenames) {
        const monster = await loadMonsterFromFile(filename);
        if (monster) monsters.push(monster);
    }
    return monsters;
};

export const loadSpellsFromFiles = async (filenames: string[]): Promise<any[]> => {
    const spells: any[] = [];
    for (const filename of filenames) {
        const spell = await loadSpellFromFile(filename);
        if (spell) spells.push(spell);
    }
    return spells;
};

export const deleteCombatFile = async (id: string): Promise<void> => {
    let indexData: { combats: any[] } = { combats: [] };
    const indexJson = await get(WEB_STORAGE_KEYS.COMBATS_INDEX);
    if (indexJson) {
        indexData = indexJson;
    }
    const combatEntry = indexData.combats.find((c: any) => c.id === id);
    if (combatEntry) {
        const key = `${WEB_STORAGE_KEYS.COMBATS_PREFIX}${id}`;
        await del(key);
    }
    indexData.combats = indexData.combats.filter((c: any) => c.id !== id);
    await set(WEB_STORAGE_KEYS.COMBATS_INDEX, indexData);
};

export const clearAllFiles = async (): Promise<void> => {
    const allKeys = await keys();
    const toRemove = allKeys.filter(key =>
        typeof key === 'string' && (
            key.startsWith(WEB_STORAGE_KEYS.MONSTERS_PREFIX) ||
            key.startsWith(WEB_STORAGE_KEYS.SPELLS_PREFIX) ||
            key.startsWith(WEB_STORAGE_KEYS.COMBATS_PREFIX) ||
            key === WEB_STORAGE_KEYS.BEASTS_INDEX ||
            key === WEB_STORAGE_KEYS.SPELLS_INDEX ||
            key === WEB_STORAGE_KEYS.COMBATS_INDEX ||
            key === WEB_STORAGE_KEYS.PLAYERS
        )
    );
    await Promise.all(toRemove.map(key => del(key)));
};

export const clearBeastsAndSpellsOnly = async (): Promise<void> => {
    const allKeys = await keys();
    const toRemove = allKeys.filter(key =>
        typeof key === 'string' && (
            key.startsWith(WEB_STORAGE_KEYS.MONSTERS_PREFIX) ||
            key.startsWith(WEB_STORAGE_KEYS.SPELLS_PREFIX) ||
            key === WEB_STORAGE_KEYS.BEASTS_INDEX ||
            key === WEB_STORAGE_KEYS.SPELLS_INDEX
        )
    );
    await Promise.all(toRemove.map(key => del(key)));
};

export const getStorageInfo = async (): Promise<{ 
    beastsIndexSize: number; 
    beastsCount: number; 
    spellsIndexSize: number; 
    spellsCount: number; 
}> => {
    const beastsIndex = await get(WEB_STORAGE_KEYS.BEASTS_INDEX);
    const spellsIndex = await get(WEB_STORAGE_KEYS.SPELLS_INDEX);
    let beastsCount = 0;
    let beastsIndexSize = 0;
    if (beastsIndex) {
        beastsCount = beastsIndex.monsters?.length || 0;
        beastsIndexSize = JSON.stringify(beastsIndex).length;
    }
    let spellsCount = 0;
    let spellsIndexSize = 0;
    if (spellsIndex) {
        spellsCount = spellsIndex.spells?.length || 0;
        spellsIndexSize = JSON.stringify(spellsIndex).length;
    }
    return {
        beastsIndexSize,
        beastsCount,
        spellsIndexSize,
        spellsCount
    };
};

export const savePlayersList = async (players: any[]): Promise<void> => {
    await set(WEB_STORAGE_KEYS.PLAYERS, players);
};

export const loadPlayersList = async (): Promise<any[]> => {
    const data = await get(WEB_STORAGE_KEYS.PLAYERS);
    if (!data) return [];
    return data;
};

export const addPlayer = async (player: { name: string, race: string, class: string, maxHp: number, ac: number, passivePerception?: number, initiativeBonus?: number, tokenUrl?: string }): Promise<void> => {
    const players = await loadPlayersList();
    players.push({
        ...player,
        maxHp: player.maxHp || 0,
        ac: player.ac || 0,
        tokenUrl: player.tokenUrl || "data:image/jpeg;base64,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"
    });
    await savePlayersList(players);
};

export const removePlayer = async (name: string): Promise<void> => {
    let players = await loadPlayersList();
    players = players.filter(p => p.name !== name);
    await savePlayersList(players);
};

export const updatePlayer = async (name: string, updated: { name?: string, race?: string, class?: string, maxHp?: number, ac?: number, passivePerception?: number, initiativeBonus?: number, tokenUrl?: string }): Promise<void> => {
    let players = await loadPlayersList();
    players = players.map(p => p.name === name ? { ...p, ...updated, maxHp: updated.maxHp ?? p.maxHp ?? 0, ac: updated.ac ?? p.ac ?? 0, tokenUrl: updated.tokenUrl ?? p.tokenUrl ?? "data:image/jpeg;base64,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"
    } : p);
    await savePlayersList(players);
};

// Spellbook functions
export const loadSpellbooksFromFile = async (): Promise<any[]> => {
    const data = await get(WEB_STORAGE_KEYS.SPELLBOOKS);
    if (!data) return [];
    return data;
};

export const saveSpellbooksToFile = async (spellbooks: any[]): Promise<void> => {
    await set(WEB_STORAGE_KEYS.SPELLBOOKS, spellbooks);
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
