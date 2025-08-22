// PROVIDERS
import { IStorageProvider } from 'src/utils/storage/IStorageProvider';

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
    SpellClassRelationIndex,
    STORAGE_KEYS
} from 'src/models/interfaces/utils';

// DATA
import { resolveMonster } from 'src/data/resolveMonster';

// UTILS
import {
    generateSafeFilename,
    createSpellIndexEntry,
    createBeastIndexEntry,
    createCombatIndexEntry,
    logSpellProcessing,
    processSpellData
} from 'src/utils/storageUtils';

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

        // Ensure data directory exists before writing
        await this.ensureDataDirectory();

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

        // Ensure data directory exists before writing
        await this.ensureDataDirectory();

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
                });
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
        // Ensure data directory exists before writing
        await this.ensureDataDirectory();

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

        // Ensure data directory exists before writing
        await this.ensureDataDirectory();

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

        // Ensure data directory exists before writing
        await this.ensureDataDirectory();

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
        // Remove .json extension to get the combat ID
        // Filename format: combat-1754675833566-0.9178056674399327.json
        const combatId = filename.replace('.json', '');
        const key = `${STORAGE_KEYS.COMBATS_PREFIX}${combatId}`;

        try {
            return await this.loadIndividual(key);
        } catch (error) {
            console.error(`❌ Error loading combat with key ${key} from filename ${filename}:`, error);
            return null;
        }
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

    public async addSpellToSpellbook(spellbookId: string, spellName: string, spellSource: string, spellDetails?: any): Promise<void> {
        const spellbooks = await this.loadSpellbooks();
        const spellbook = spellbooks.find(sb => sb.id === spellbookId);
        if (spellbook) {
            // Ensure spellsIndex exists
            if (!spellbook.spellsIndex) {
                spellbook.spellsIndex = [];
            }

            const spellExists = spellbook.spellsIndex.some(s => s.name === spellName && s.source === spellSource);
            if (!spellExists) {
                const newSpellIndex = {
                    name: spellName,
                    source: spellSource,
                    level: spellDetails?.level || 0,
                    school: spellDetails?.school || '',
                    ritual: spellDetails?.ritual || false,
                    concentration: spellDetails?.concentration || false,
                    availableClasses: spellDetails?.availableClasses || []
                };
                spellbook.spellsIndex.push(newSpellIndex);
                await this.saveSpellbooks(spellbooks);
            }
        }
    }

    public async removeSpellFromSpellbook(spellbookId: string, spellName: string, spellSource: string): Promise<void> {
        const spellbooks = await this.loadSpellbooks();
        const spellbook = spellbooks.find(sb => sb.id === spellbookId);
        if (spellbook) {
            // Ensure spellsIndex exists
            if (!spellbook.spellsIndex) {
                spellbook.spellsIndex = [];
            }

            spellbook.spellsIndex = spellbook.spellsIndex.filter(s => !(s.name === spellName && s.source === spellSource));
            await this.saveSpellbooks(spellbooks);
        }
    }

    public async createSpellbook(name: string, description?: string): Promise<string> {
        const spellbooks = await this.loadSpellbooks();
        const newSpellbook: Spellbook = {
            id: `spellbook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
            spellsIndex: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
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
                } catch {
                    stillUnresolved.push(beast);
                }
            }
            unresolved = stillUnresolved;
        }

        if (unresolved.length > 0) {
            console.warn('Some monsters with _copy could not be resolved:', unresolved.map(b => b.name));
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

    // Campaign methods
    public async saveCampaigns(campaigns: any[]): Promise<void> {
        await this.storeIndex(STORAGE_KEYS.CAMPAIGNS, { campaigns });
    }

    public async loadCampaigns(): Promise<any[]> {
        const data = await this.loadIndex(STORAGE_KEYS.CAMPAIGNS);
        return data?.campaigns || [];
    }

    public async createCampaign(name: string, description?: string): Promise<string> {
        const id = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const newCampaign = {
            id,
            name,
            description,
            createdAt: now,
            updatedAt: now,
        };

        const existingCampaigns = await this.loadCampaigns();
        const updatedCampaigns = [...existingCampaigns, newCampaign];
        await this.saveCampaigns(updatedCampaigns);

        return id;
    }

    public async deleteCampaign(id: string): Promise<void> {
        const existingCampaigns = await this.loadCampaigns();
        const updatedCampaigns = existingCampaigns.filter(campaign => campaign.id !== id);
        await this.saveCampaigns(updatedCampaigns);
    }

    public async updateCampaign(id: string, name: string, description?: string): Promise<void> {
        const existingCampaigns = await this.loadCampaigns();
        const updatedCampaigns = existingCampaigns.map(campaign => {
            if (campaign.id === id) {
                return {
                    ...campaign,
                    name,
                    description,
                    updatedAt: new Date().toISOString(),
                };
            }
            return campaign;
        });
        await this.saveCampaigns(updatedCampaigns);
    }

    /**
     * Regenerate all indexes from existing data files
     * This recreates all indexes (beasts, spells, combats, relations, classes) without loading JSON files
     */
    public async regenerateAllIndexes(): Promise<void> {
        console.log('🔄 Starting regeneration of all indexes...');

        try {
            // Ensure data directory exists before regenerating indexes
            await this.ensureDataDirectory();

            const allKeys = await this.getAllKeys();
            console.log(`📋 Found ${allKeys.length} total keys`);

            if (allKeys.length === 0) {
                console.log('ℹ️ No data files found to regenerate indexes from');
                return;
            }

            // Regenerate each index type
            await this.regenerateBeastsIndex(allKeys);
            await this.regenerateSpellsIndex(allKeys);
            await this.regenerateCombatsIndex(allKeys);
            await this.regenerateSpellClassRelationsIndex(allKeys);
            await this.regenerateAvailableClassesIndex(allKeys);

            // Regenerate filter indexes for better performance
            await this.regenerateFilterIndexes(allKeys);

            console.log('✅ Successfully regenerated all indexes');
        } catch (error) {
            console.error('❌ Error during indexes regeneration:', error);
            throw error;
        }
    }

    /**
     * Regenerate filter indexes (CR, Type, Source) for better performance
     */
    private async regenerateFilterIndexes(allKeys: string[]): Promise<void> {
        console.log('🔄 Regenerating filter indexes...');

        const beastKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.MONSTERS_PREFIX));
        console.log(`📋 Found ${beastKeys.length} beast files for filter indexing`);

        if (beastKeys.length === 0) {
            console.log('ℹ️ No beast files found for filter indexing');
            return;
        }

        // Create optimized filter indexes
        const crIndex = new Set<string>();
        const typeIndex = new Set<string>();
        const sourceIndex = new Set<string>();

        for (const key of beastKeys) {
            try {
                const beast = await this.loadIndividual(key);
                if (beast && beast.name) {
                    // Index CR
                    if (beast.CR || beast.cr) {
                        const crValue = typeof beast.CR === 'object' ?
                            (beast.CR.cr || beast.CR.value || JSON.stringify(beast.CR)) :
                            String(beast.CR || beast.cr);
                        crIndex.add(crValue);
                    } else {
                        crIndex.add('Unknown');
                    }

                    // Index Type
                    if (beast.type) {
                        typeIndex.add(beast.type);
                    } else {
                        typeIndex.add('Unknown');
                    }

                    // Index Source
                    if (beast.source) {
                        sourceIndex.add(beast.source);
                    } else {
                        sourceIndex.add('Unknown');
                    }
                }
            } catch (error) {
                console.error(`❌ Error processing beast for filter indexing from ${key}:`, error);
            }
        }

        // Store filter indexes
        const filterIndexes = {
            cr: Array.from(crIndex).sort((a, b) => {
                // Sort CRs: numbers first, then 'Unknown' last
                if (a === 'Unknown') return 1;
                if (b === 'Unknown') return -1;

                // Handle fractions
                const parseCR = (val: string) => {
                    if (val.includes('/')) {
                        const [num, denom] = val.split('/').map(Number);
                        return denom ? num / denom : 0;
                    }
                    const n = parseFloat(val);
                    return isNaN(n) ? 0 : n;
                };
                return parseCR(a) - parseCR(b);
            }),
            type: Array.from(typeIndex).sort(),
            source: Array.from(sourceIndex).sort()
        };

        // Store the filter indexes
        await this.storeIndex('filter_indexes', filterIndexes);
        console.log(`✅ Regenerated filter indexes: ${filterIndexes.cr.length} CRs, ${filterIndexes.type.length} Types, ${filterIndexes.source.length} Sources`);
    }

    /**
     * Load filter indexes for optimized filtering
     */
    public async loadFilterIndexes(): Promise<{ cr: string[], type: string[], source: string[] } | null> {
        try {
            return await this.loadIndex('filter_indexes');
        } catch {
            console.log('ℹ️ No filter indexes found, will be generated on next reindex');
            return null;
        }
    }

    /**
     * Regenerate beasts index from existing beast files
     */
    private async regenerateBeastsIndex(allKeys: string[]): Promise<void> {
        console.log('🔄 Regenerating beasts index...');

        const beastKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.MONSTERS_PREFIX));
        console.log(`📋 Found ${beastKeys.length} beast files`);

        if (beastKeys.length === 0) {
            console.log('ℹ️ No beast files found');
            return;
        }

        const beastsIndex: BeastIndex[] = [];

        for (const key of beastKeys) {
            try {
                const beast = await this.loadIndividual(key);
                if (beast && beast.name) {
                    const filename = key.replace(STORAGE_KEYS.MONSTERS_PREFIX, '') + '.json';
                    beastsIndex.push({
                        id: beast.id || beast.name,
                        name: beast.name,
                        cr: beast.CR || beast.cr || 'unknown',
                        type: beast.type || 'unknown',
                        source: beast.source || 'unknown',
                        ac: beast.AC || beast.ac || 'unknown',
                        size: beast.size || 'unknown',
                        alignment: beast.alignment || 'unknown',
                        file: filename
                    });
                }
            } catch (error) {
                console.error(`❌ Error loading beast from ${key}:`, error);
            }
        }

        // Clear and recreate index
        await this.deleteIndex(STORAGE_KEYS.BEASTS_INDEX);
        await this.storeIndex(STORAGE_KEYS.BEASTS_INDEX, { monsters: beastsIndex });
        console.log(`✅ Regenerated beasts index with ${beastsIndex.length} entries`);
    }

    /**
     * Regenerate spells index from existing spell files
     */
    private async regenerateSpellsIndex(allKeys: string[]): Promise<void> {
        console.log('🔄 Regenerating spells index...');

        const spellKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.SPELLS_PREFIX));
        console.log(`📋 Found ${spellKeys.length} spell files`);

        if (spellKeys.length === 0) {
            console.log('ℹ️ No spell files found');
            return;
        }

        const spellsIndex: SpellIndex[] = [];

        for (const key of spellKeys) {
            try {
                const spell = await this.loadIndividual(key);
                if (spell && spell.name) {
                    const filename = key.replace(STORAGE_KEYS.SPELLS_PREFIX, '') + '.json';

                    // Use processSpellData to properly extract ritual and concentration
                    const { concentration, ritual, availableClasses } = processSpellData(spell);

                    spellsIndex.push({
                        id: spell.id || spell.name,
                        name: spell.name,
                        level: spell.level || 0,
                        school: spell.school || 'unknown',
                        source: spell.source || 'unknown',
                        availableClasses: availableClasses,
                        ritual: ritual,
                        concentration: concentration,
                        file: filename
                    });
                }
            } catch (error) {
                console.error(`❌ Error loading spell from ${key}:`, error);
            }
        }

        // Clear and recreate index
        await this.deleteIndex(STORAGE_KEYS.SPELLS_INDEX);
        await this.storeIndex(STORAGE_KEYS.SPELLS_INDEX, { spells: spellsIndex });
        console.log(`✅ Regenerated spells index with ${spellsIndex.length} entries`);
    }

    /**
     * Regenerate combats index from existing combat files
     */
    private async regenerateCombatsIndex(allKeys: string[]): Promise<void> {
        console.log('🔄 Regenerating combats index...');

        const combatKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.COMBATS_PREFIX));
        console.log(`📋 Found ${combatKeys.length} combat files`);

        if (combatKeys.length === 0) {
            console.log('ℹ️ No combat files found');
            return;
        }

        const combatsIndex: CombatIndex[] = [];

        for (const key of combatKeys) {
            try {
                const combat = await this.loadIndividual(key);
                if (combat && combat.name) {
                    const filename = key.replace(STORAGE_KEYS.COMBATS_PREFIX, '') + '.json';
                    combatsIndex.push({
                        name: combat.name,
                        file: filename,
                        id: combat.id,
                        createdAt: combat.createdAt || Date.now()
                    });
                }
            } catch (error) {
                console.error(`❌ Error loading combat from ${key}:`, error);
            }
        }

        // Clear and recreate index
        await this.deleteIndex(STORAGE_KEYS.COMBATS_INDEX);
        await this.storeIndex(STORAGE_KEYS.COMBATS_INDEX, { combats: combatsIndex });
        console.log(`✅ Regenerated combats index with ${combatsIndex.length} entries`);
    }

    /**
     * Regenerate spell class relations index from existing spell files
     */
    private async regenerateSpellClassRelationsIndex(allKeys: string[]): Promise<void> {
        console.log('🔄 Regenerating spell class relations index...');

        const spellKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.SPELLS_PREFIX));

        if (spellKeys.length === 0) {
            console.log('ℹ️ No spell files found for relations');
            return;
        }

        const relations: SpellClassRelationIndex[] = [];

        for (const key of spellKeys) {
            try {
                const spell = await this.loadIndividual(key);
                if (spell && spell.availableClasses) {
                    for (const className of spell.availableClasses) {
                        relations.push({
                            spellName: spell.name,
                            source: spell.source || 'unknown',
                            className: className,
                            book: spell.source || 'unknown'
                        });
                    }
                }
            } catch (error) {
                console.error(`❌ Error loading spell from ${key}:`, error);
            }
        }

        // Clear and recreate index
        await this.deleteIndex(STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX);
        await this.storeIndex(STORAGE_KEYS.SPELL_CLASS_RELATIONS_INDEX, { relations });
        console.log(`✅ Regenerated spell class relations index with ${relations.length} relations`);
    }

    /**
     * Regenerate available classes index from existing spell files
     */
    private async regenerateAvailableClassesIndex(allKeys: string[]): Promise<void> {
        console.log('🔄 Regenerating available classes index...');

        const spellKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.SPELLS_PREFIX));

        if (spellKeys.length === 0) {
            console.log('ℹ️ No spell files found for classes');
            return;
        }

        const classesSet = new Set<string>();

        for (const key of spellKeys) {
            try {
                const spell = await this.loadIndividual(key);
                if (spell && spell.availableClasses) {
                    for (const className of spell.availableClasses) {
                        classesSet.add(className);
                    }
                }
            } catch (error) {
                console.error(`❌ Error loading spell from ${key}:`, error);
            }
        }

        const classes = Array.from(classesSet).sort();

        // Clear and recreate index
        await this.deleteIndex(STORAGE_KEYS.AVAILABLE_CLASSES_INDEX);
        await this.storeIndex(STORAGE_KEYS.AVAILABLE_CLASSES_INDEX, { classes });
        console.log(`✅ Regenerated available classes index with ${classes.length} classes`);
    }

    /**
     * Regenerate all combat files and indexes to fix filename issues
     * This will update all existing combats to use the new filename format
     */
    public async regenerateCombatFiles(): Promise<void> {
        console.log('🔄 Starting combat files regeneration...');

        try {
            // Load existing combats index
            const existingIndex = await this.loadIndex(STORAGE_KEYS.COMBATS_INDEX);
            if (!existingIndex || !existingIndex.combats || existingIndex.combats.length === 0) {
                console.log('ℹ️ No existing combats found to regenerate');
                return;
            }

            console.log(`📋 Found ${existingIndex.combats.length} combats to regenerate`);

            // Load all existing combats
            const combats: Combat[] = [];
            for (const combatIndex of existingIndex.combats) {
                try {
                    const combat = await this.loadCombat(combatIndex.file);
                    if (combat) {
                        combats.push(combat);
                        console.log(`✅ Loaded combat: ${combat.name} (${combat.id})`);
                    } else {
                        console.warn(`⚠️ Failed to load combat from ${combatIndex.file}`);
                    }
                } catch (error) {
                    console.error(`❌ Error loading combat ${combatIndex.file}:`, error);
                }
            }

            if (combats.length === 0) {
                console.log('ℹ️ No valid combats found to regenerate');
                return;
            }

            // Clear existing combat index
            await this.deleteIndex(STORAGE_KEYS.COMBATS_INDEX);
            console.log('🗑️ Cleared existing combat index');

            // Store each combat with the new filename format
            for (const combat of combats) {
                await this.storeCombatIndex(combat);
                console.log(`💾 Regenerated combat: ${combat.name} (${combat.id})`);
            }

            console.log(`✅ Successfully regenerated ${combats.length} combat files`);
        } catch (error) {
            console.error('❌ Error during combat files regeneration:', error);
            throw error;
        }
    }
}
