import { IStorageProvider } from './IStorageProvider';
import { Beast, Spell, Player, Spellbook, Combat, BeastIndex, SpellIndex, CombatIndex, SpellClassRelationIndex, AvailableClassesIndex, STORAGE_KEYS } from '../types';
import { resolveMonster } from '../../data/resolveMonster';
import { 
    generateSafeFilename, 
    generateCombatFilename, 
    createSpellIndexEntry, 
    createBeastIndexEntry, 
    createCombatIndexEntry,
    logSpellProcessing 
} from '../storageUtils';

/**
 * Abstract base class for storage providers
 * Implements common logic and delegates platform-specific operations to subclasses
 */
export abstract class BaseStorageProvider implements IStorageProvider {
    
    // Abstract methods that must be implemented by subclasses
    protected abstract storeIndex(key: string, data: any): Promise<void>;
    protected abstract loadIndex(key: string): Promise<any>;
    protected abstract deleteIndex(key: string): Promise<void>;
    protected abstract storeIndividual(key: string, data: any): Promise<void>;
    protected abstract loadIndividual(key: string): Promise<any>;
    protected abstract deleteIndividual(key: string): Promise<void>;
    protected abstract getAllKeys(): Promise<string[]>;
    protected abstract clearAll(): Promise<void>;
    
    // Platform-specific operations
    public abstract ensureDataDirectory(): Promise<void>;
    
    // Index operations with common logic
    public async storeBeastsIndex(beasts: Beast[]): Promise<void> {
        console.log('storeBeastsIndex called with', beasts.length, 'beasts');
        
        // Clear existing index first
        await this.deleteIndex(STORAGE_KEYS.BEASTS_INDEX);
        console.log('Cleared existing beasts index');
        
        // Process beasts (resolve _copy references)
        const allResolvedMonsters = await this.processBeasts(beasts);
        
        // Create index data
        const indexData = {
            monsters: allResolvedMonsters.map(beast => createBeastIndexEntry(beast))
        };
        
        // Store index
        await this.storeIndex(STORAGE_KEYS.BEASTS_INDEX, indexData);
        console.log(`Stored beasts index with ${allResolvedMonsters.length} beasts`);
        
        // Store individual beasts
        await this.storeBeasts(allResolvedMonsters);
    }
    
    public async storeSpellsIndex(spells: Spell[]): Promise<void> {
        console.log('storeSpellsIndex called with', spells.length, 'spells');
        console.log('Sample spell availableClasses:', spells[0]?.availableClasses);
        
        // Clear existing index first
        await this.deleteIndex(STORAGE_KEYS.SPELLS_INDEX);
        console.log('Cleared existing spells index');
        
        // Create index data
        const indexData = {
            spells: spells.map(spell => {
                const spellIndexEntry = createSpellIndexEntry(spell);
                logSpellProcessing(spell, {
                    concentration: spellIndexEntry.concentration,
                    ritual: spellIndexEntry.ritual,
                    availableClasses: spellIndexEntry.availableClasses
                }, this.getPlatformName());
                return spellIndexEntry;
            })
        };
        
        console.log('Index data sample:', JSON.stringify(indexData.spells.slice(0, 2), null, 2));
        await this.storeIndex(STORAGE_KEYS.SPELLS_INDEX, indexData);
        console.log(`Stored spells index with ${spells.length} spells`);
        
        // Store individual spells
        await this.storeSpells(spells);
    }
    
    public async storeCombatIndex(combat: Combat): Promise<void> {
        const filename = generateCombatFilename(combat.id, combat.name);
        
        // Store individual combat
        await this.storeIndividual(`${STORAGE_KEYS.COMBATS_PREFIX}${combat.id}`, combat);
        
        // Update combat index
        let indexData: { combats: CombatIndex[] } = { combats: [] };
        const existingIndex = await this.loadIndex(STORAGE_KEYS.COMBATS_INDEX);
        if (existingIndex) {
            indexData = existingIndex;
        }
        
        // Remove existing combat with same ID
        indexData.combats = indexData.combats.filter((c: CombatIndex) => c.id !== combat.id);
        
        // Add new combat
        indexData.combats.push(createCombatIndexEntry(combat));
        
        await this.storeIndex(STORAGE_KEYS.COMBATS_INDEX, indexData);
    }
    
    public async storeSpellClassRelationsIndex(relations: SpellClassRelationIndex[]): Promise<void> {
        console.log('storeSpellClassRelationsIndex called with', relations.length, 'relations');
        
        // Clear existing index first
        await this.deleteIndex(STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX);
        console.log('Cleared existing spell-class relations index');
        
        // Create index data
        const indexData = {
            relations: relations
        };
        
        // Store index
        await this.storeIndex(STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX, indexData);
        console.log(`Stored spell-class relations index with ${relations.length} relations`);
    }
    
    public async storeAvailableClassesIndex(classes: string[]): Promise<void> {
        console.log('storeAvailableClassesIndex called with', classes.length, 'classes');
        
        // Clear existing index first
        await this.deleteIndex(STORAGE_KEYS.AVAILABLE_CLASSES_INDEX);
        console.log('Cleared existing available classes index');
        
        // Create index data
        const indexData = {
            classes: classes
        };
        
        // Store index
        await this.storeIndex(STORAGE_KEYS.AVAILABLE_CLASSES_INDEX, indexData);
        console.log(`Stored available classes index with ${classes.length} classes`);
    }
    
    // Load operations
    public async loadBeastsIndex(): Promise<BeastIndex[] | null> {
        const indexData = await this.loadIndex(STORAGE_KEYS.BEASTS_INDEX);
        return indexData?.monsters || null;
    }
    
    public async loadSpellsIndex(): Promise<SpellIndex[] | null> {
        const indexData = await this.loadIndex(STORAGE_KEYS.SPELLS_INDEX);
        return indexData?.spells || null;
    }
    
    public async loadCombatsIndex(): Promise<CombatIndex[] | null> {
        const indexData = await this.loadIndex(STORAGE_KEYS.COMBATS_INDEX);
        return indexData?.combats || null;
    }
    
    public async loadSpellClassRelationsIndex(): Promise<SpellClassRelationIndex[] | null> {
        const indexData = await this.loadIndex(STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX);
        return indexData?.relations || null;
    }
    
    public async loadAvailableClassesIndex(): Promise<string[] | null> {
        const indexData = await this.loadIndex(STORAGE_KEYS.AVAILABLE_CLASSES_INDEX);
        return indexData?.classes || null;
    }
    
    // Individual file operations
    public async storeBeast(beast: Beast): Promise<void> {
        const key = `${STORAGE_KEYS.MONSTERS_PREFIX}${generateSafeFilename(beast.name, beast.source)}`;
        await this.storeIndividual(key, beast);
    }
    
    public async storeSpell(spell: Spell): Promise<void> {
        const key = `${STORAGE_KEYS.SPELLS_PREFIX}${generateSafeFilename(spell.name, spell.source)}`;
        await this.storeIndividual(key, spell);
    }
    
    public async storeCombat(combat: Combat): Promise<void> {
        const key = `${STORAGE_KEYS.COMBATS_PREFIX}${combat.id}`;
        await this.storeIndividual(key, combat);
    }
    
    public async loadBeast(filename: string): Promise<Beast | null> {
        const beastId = filename.replace('.json', '');
        const key = `${STORAGE_KEYS.MONSTERS_PREFIX}${beastId}`;
        return await this.loadIndividual(key);
    }
    
    public async loadSpell(filename: string): Promise<Spell | null> {
        const spellId = filename.replace('.json', '');
        const key = `${STORAGE_KEYS.SPELLS_PREFIX}${spellId}`;
        return await this.loadIndividual(key);
    }
    
    public async loadCombat(filename: string): Promise<Combat | null> {
        // Remove .json extension and extract the combat ID
        // Filename format: combat-1754675833566-0.9178056674399327-t3st.json
        // We need to extract: combat-1754675833566-0.9178056674399327
        const withoutExtension = filename.replace('.json', '');
        const parts = withoutExtension.split('-');
        
        // The combat ID is everything except the last part (the safe name)
        // So we join all parts except the last one
        const combatId = parts.slice(0, -1).join('-');
        const key = `${STORAGE_KEYS.COMBATS_PREFIX}${combatId}`;
        return await this.loadIndividual(key);
    }
    
    // Batch operations
    public async loadBeasts(filenames: string[]): Promise<Beast[]> {
        const beasts: Beast[] = [];
        for (const filename of filenames) {
            const beast = await this.loadBeast(filename);
            if (beast) {
                beasts.push(beast);
            }
        }
        return beasts;
    }
    
    public async loadSpells(filenames: string[]): Promise<Spell[]> {
        const spells: Spell[] = [];
        for (const filename of filenames) {
            const spell = await this.loadSpell(filename);
            if (spell) {
                spells.push(spell);
            }
        }
        return spells;
    }
    
    // Player operations
    public async savePlayers(players: Player[]): Promise<void> {
        await this.storeIndex(STORAGE_KEYS.PLAYERS, players);
    }
    
    public async loadPlayers(): Promise<Player[]> {
        const data = await this.loadIndex(STORAGE_KEYS.PLAYERS);
        return data || [];
    }
    
    public async addPlayer(player: Player): Promise<void> {
        const players = await this.loadPlayers();
        players.push(player);
        await this.savePlayers(players);
    }
    
    public async removePlayer(name: string): Promise<void> {
        const players = await this.loadPlayers();
        const filteredPlayers = players.filter(p => p.name !== name);
        await this.savePlayers(filteredPlayers);
    }
    
    public async updatePlayer(name: string, updated: Partial<Player>): Promise<void> {
        const players = await this.loadPlayers();
        const index = players.findIndex(p => p.name === name);
        if (index !== -1) {
            players[index] = { ...players[index], ...updated };
            await this.savePlayers(players);
        }
    }
    
    // Spellbook operations
    public async saveSpellbooks(spellbooks: Spellbook[]): Promise<void> {
        await this.storeIndex(STORAGE_KEYS.SPELLBOOKS, spellbooks);
    }
    
    public async loadSpellbooks(): Promise<Spellbook[]> {
        const data = await this.loadIndex(STORAGE_KEYS.SPELLBOOKS);
        return data || [];
    }
    
    public async addSpellToSpellbook(spellbookId: string, spellName: string, spellSource: string): Promise<void> {
        const spellbooks = await this.loadSpellbooks();
        const spellbook = spellbooks.find(sb => sb.id === spellbookId);
        if (spellbook) {
            const spellExists = spellbook.spells.some(s => s.name === spellName && s.source === spellSource);
            if (!spellExists) {
                spellbook.spells.push({ name: spellName, source: spellSource });
                await this.saveSpellbooks(spellbooks);
            }
        }
    }
    
    public async removeSpellFromSpellbook(spellbookId: string, spellName: string, spellSource: string): Promise<void> {
        const spellbooks = await this.loadSpellbooks();
        const spellbook = spellbooks.find(sb => sb.id === spellbookId);
        if (spellbook) {
            spellbook.spells = spellbook.spells.filter(s => !(s.name === spellName && s.source === spellSource));
            await this.saveSpellbooks(spellbooks);
        }
    }
    
    public async createSpellbook(name: string, description?: string): Promise<string> {
        const spellbooks = await this.loadSpellbooks();
        const newSpellbook: Spellbook = {
            id: `spellbook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
            spells: [],
            createdAt: Date.now()
        };
        spellbooks.push(newSpellbook);
        await this.saveSpellbooks(spellbooks);
        return newSpellbook.id;
    }
    
    public async deleteSpellbook(id: string): Promise<void> {
        const spellbooks = await this.loadSpellbooks();
        const filteredSpellbooks = spellbooks.filter(sb => sb.id !== id);
        await this.saveSpellbooks(filteredSpellbooks);
    }
    
    // Combat operations
    public async deleteCombat(id: string): Promise<void> {
        // Remove from individual storage
        await this.deleteIndividual(`${STORAGE_KEYS.COMBATS_PREFIX}${id}`);
        
        // Remove from index
        const indexData = await this.loadIndex(STORAGE_KEYS.COMBATS_INDEX);
        if (indexData) {
            indexData.combats = indexData.combats.filter((c: CombatIndex) => c.id !== id);
            await this.storeIndex(STORAGE_KEYS.COMBATS_INDEX, indexData);
        }
    }
    
    // Utility operations
    public async clearAllData(): Promise<void> {
        await this.clearAll();
    }
    
    public async clearBeastsAndSpellsOnly(): Promise<void> {
        // Get all keys
        const allKeys = await this.getAllKeys();
        
        // Filter keys to remove
        const keysToRemove = allKeys.filter(key => 
            key.startsWith(STORAGE_KEYS.MONSTERS_PREFIX) ||
            key.startsWith(STORAGE_KEYS.SPELLS_PREFIX) ||
            key === STORAGE_KEYS.BEASTS_INDEX ||
            key === STORAGE_KEYS.SPELLS_INDEX ||
            key === STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX ||
            key === STORAGE_KEYS.AVAILABLE_CLASSES_INDEX
        );
        
        // Remove each key
        for (const key of keysToRemove) {
            await this.deleteIndividual(key);
        }
        
        // Clear indexes
        await this.deleteIndex(STORAGE_KEYS.BEASTS_INDEX);
        await this.deleteIndex(STORAGE_KEYS.SPELLS_INDEX);
        await this.deleteIndex(STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX);
        await this.deleteIndex(STORAGE_KEYS.AVAILABLE_CLASSES_INDEX);
    }
    
    public async getStorageInfo(): Promise<{
        beastsIndexSize: number;
        beastsCount: number;
        spellsIndexSize: number;
        spellsCount: number;
        spellClassRelationsCount: number;
        availableClassesCount: number;
    }> {
        const beastsIndex = await this.loadIndex(STORAGE_KEYS.BEASTS_INDEX);
        const spellsIndex = await this.loadIndex(STORAGE_KEYS.SPELLS_INDEX);
        const spellClassRelationsIndex = await this.loadIndex(STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX);
        const availableClassesIndex = await this.loadIndex(STORAGE_KEYS.AVAILABLE_CLASSES_INDEX);
        
        return {
            beastsIndexSize: beastsIndex ? JSON.stringify(beastsIndex).length : 0,
            beastsCount: beastsIndex?.monsters?.length || 0,
            spellsIndexSize: spellsIndex ? JSON.stringify(spellsIndex).length : 0,
            spellsCount: spellsIndex?.spells?.length || 0,
            spellClassRelationsCount: spellClassRelationsIndex?.relations?.length || 0,
            availableClassesCount: availableClassesIndex?.classes?.length || 0
        };
    }
    
    // Helper methods
    protected async processBeasts(beasts: Beast[]): Promise<Beast[]> {
        const monstersWithoutCopy = beasts.filter(beast => !beast['_copy']);
        let monstersWithCopy = beasts.filter(beast => beast['_copy']);
        const allResolvedMonsters: Beast[] = [...monstersWithoutCopy];
        
        let unresolved = [...monstersWithCopy];
        let lastUnresolvedCount = -1;
        
        while (unresolved.length > 0 && unresolved.length !== lastUnresolvedCount) {
            lastUnresolvedCount = unresolved.length;
            const stillUnresolved: Beast[] = [];
            
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
        
        if (unresolved.length > 0) {
            console.warn(`Some monsters with _copy could not be resolved:`, unresolved.map(b => b.name));
        }
        
        return allResolvedMonsters;
    }
    
    protected async storeBeasts(beasts: Beast[]): Promise<void> {
        for (const beast of beasts) {
            await this.storeBeast(beast);
        }
        console.log(`Stored ${beasts.length} individual beast files`);
    }
    
    protected async storeSpells(spells: Spell[]): Promise<void> {
        for (const spell of spells) {
            await this.storeSpell(spell);
        }
        console.log(`Stored ${spells.length} individual spell files`);
    }
    
    protected getPlatformName(): 'web' | 'mobile' {
        return this.constructor.name.includes('Web') ? 'web' : 'mobile';
    }
}
