// REACT
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// STORAGE
import AsyncStorage from '@react-native-async-storage/async-storage';

// BUNDLED DATA (offline)
import {
    BESTIARY_BUNDLE, SPELL_BUNDLE, SPELL_SOURCE_LOOKUP, CONDITIONS_DISEASES, ACTIONS, FEATS,
    BACKGROUNDS, ITEMS, ITEMS_BASE, VARIANT_RULES, RACES, CLASS_FILES,
    DEITIES, CULTS_BOONS, REWARDS, TRAPS_HAZARDS, BASTIONS, LANGUAGES, OBJECTS,
    OPTIONAL_FEATURES, CHAR_OPTIONS, SENSES, SKILLS, PSIONICS, VEHICLES,
    DATA_VERSION,
} from 'src/data/bundledData';

// UTILS
import { normalizeString } from 'src/utils/stringUtils';
import { getTokenUrl } from 'src/utils/tokenCache';
import {
    clearBeastsAndSpellsOnly,
    loadBeastsIndexFromFile,
    loadMonsterFromFile,
    loadSpellFromFile,
    loadSpellsIndexFromFile,
    loadSpellClassRelationsIndexFromFile,
    loadAvailableClassesIndexFromFile,
    storeBeastsToFile,
    storeSpellsToFile,
    storeSpellClassRelationsToFile,
    storeAvailableClassesToFile,
    regenerateAllIndexes
} from 'src/utils/fileStorage';

// Key under which the last-seeded bundled data version is persisted.
const DATA_VERSION_KEY = 'BUNDLED_DATA_VERSION';

// INTERFACES
interface Beast {
  name: string;
  type: string;
  CR: string | number;
  source: string;
  [key: string]: any;
}

interface BeastIndex {
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

interface Spell {
  name: string;
  level: number;
  school: string;
  source: string;
  [key: string]: any;
}

interface SpellIndex {
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

interface SpellSourceLookup {
  [source: string]: {
    [spellName: string]: {
      class: {
        [book: string]: {
          [className: string]: boolean;
        };
      };
    };
  };
}

interface SpellClassRelation {
  spellName: string;
  source: string;
  className: string;
  book: string;
}

interface DataContextType {
  beasts: Beast[];
  simpleBeasts: { name: string; CR: string | number; type: string; source: string; ac: any; passivePerception: number }[];
  spells: Spell[];
  simpleSpells: { name: string; level: number; school: string; source: string; availableClasses: string[]; ritual: boolean; concentration: boolean }[];
  spellSourceLookup: SpellSourceLookup;
  availableClasses: string[];
  spellClassRelations: SpellClassRelation[];
  isLoading: boolean;
  isInitialized: boolean;
  loadError: string | null;
  loadData: () => Promise<boolean>; // resolves true if data was loaded from files
  reloadData: () => Promise<void>;
  clearData: () => Promise<void>;
  getFullBeast: (name: string, source: string) => Promise<Beast | null>;
  getFullSpell: (name: string, source: string) => Promise<Spell | null>;
  // Bundled reference content, held in memory (small, static datasets)
  conditions: any[];
  diseases: any[];
  statuses: any[];
  actions: any[];
  feats: any[];
  backgrounds: any[];
  items: any[];
  races: any[];
  classes: any[];
  variantRules: any[];
  // Generic lookup by category ('condition' | 'disease' | 'status' | 'action' | 'feat' | 'background' | 'item' | 'race' | 'class' | …)
  getContentEntry: (category: string, name: string, source?: string) => any | null;
  // Full list for a content category (for the browser screens).
  getContentList: (category: string) => any[];
  // Full parsed class file (class/subclass/classFeature/subclassFeature) for the class detail view.
  getClassFile: (name: string) => any | null;
  // All distinct source codes present across the data (for the ignore-books setting).
  allSources: string[];
}

// Process spell source lookup data to extract available classes and spell-class relations.
// Pure/module-scoped so it has a stable identity and can be unit-tested in isolation.
function processSpellSourceLookup(spellSourceLookupData: SpellSourceLookup, spellsData: Spell[]) {
    const allClasses = new Set<string>();
    const relations: SpellClassRelation[] = [];

    // Process each source
    Object.entries(spellSourceLookupData).forEach(([source, spells]) => {
        // Process each spell in the source
        Object.entries(spells).forEach(([spellName, spellData]) => {
            if (spellData.class) {
                // Process each book for this spell
                Object.entries(spellData.class).forEach(([book, classData]) => {
                    if (typeof classData === 'object') {
                        // Process each class in this book
                        Object.entries(classData).forEach(([className, canCast]) => {
                            if (canCast === true) {
                                allClasses.add(className);
                                relations.push({ spellName, source, className, book });
                            }
                        });
                    }
                });
            }
        });
    });

    // Index relations by normalized "name|source" once, so the join below is O(spells + relations)
    // instead of O(spells × relations) with per-iteration toLowerCase() calls.
    const classesBySpell = new Map<string, Set<string>>();
    relations.forEach(relation => {
        const key = `${relation.spellName.toLowerCase()}|${relation.source.toLowerCase()}`;
        let set = classesBySpell.get(key);
        if (!set) {
            set = new Set<string>();
            classesBySpell.set(key, set);
        }
        set.add(relation.className);
    });

    // Update spells with their available classes via O(1) map lookups
    const updatedSpells = spellsData.map(spell => {
        const key = `${spell.name.toLowerCase()}|${spell.source.toLowerCase()}`;
        const spellClasses = classesBySpell.get(key);
        return {
            ...spell,
            availableClasses: spellClasses ? Array.from(spellClasses).sort() : []
        };
    });

    return {
        availableClasses: Array.from(allClasses).sort(),
        spellClassRelations: relations,
        updatedSpells
    };
}

// Bundled reference content (conditions, actions, feats, …) are small, static datasets. Load
// them once at module scope and index each category by normalized "name|source" (plus a
// name-only fallback for tags like {@condition Blinded} that omit a source).
function safeThunk(thunk: () => any): any {
    try { return thunk() || {}; } catch (e) { console.warn('Failed to load bundled content:', e); return {}; }
}

const CD = safeThunk(CONDITIONS_DISEASES);

// Races + subraces. Subraces get a combined display name (e.g. "Elf (High)") since their own
// name is just the variant ("High").
const RD = safeThunk(RACES);
const RACE_LIST: any[] = [
    ...(RD.race || []),
    ...((RD.subrace || []).map((sr: any) => ({
        ...sr,
        name: sr.raceName ? `${sr.raceName}${sr.name ? ` (${sr.name})` : ''}` : (sr.name || 'Subrace'),
        __isSubrace: true,
    }))),
];

// Classes: eagerly parse the per-class files; keep summaries for browsing/lookup and the full
// files (with classFeature/subclassFeature entries) for the detail view.
const CLASS_FILE_DATA: any[] = CLASS_FILES
    .map(thunk => { try { return thunk(); } catch { return null; } })
    .filter(Boolean);
const CLASS_SUMMARIES: any[] = CLASS_FILE_DATA
    .map(f => (f.class && f.class[0]) || null)
    .filter(Boolean);
const CLASS_FILE_BY_NAME = new Map<string, any>();
for (const f of CLASS_FILE_DATA) {
    const cls = f.class && f.class[0];
    if (cls) CLASS_FILE_BY_NAME.set(normalizeString(cls.name), f);
}
function getClassFileByName(name: string): any | null {
    return CLASS_FILE_BY_NAME.get(normalizeString(name)) || null;
}

const CONTENT_DATA: Record<string, any[]> = {
    condition: CD.condition || [],
    disease: CD.disease || [],
    status: CD.status || [],
    action: safeThunk(ACTIONS).action || [],
    feat: safeThunk(FEATS).feat || [],
    background: safeThunk(BACKGROUNDS).background || [],
    variantrule: safeThunk(VARIANT_RULES).variantrule || [],
    // Specific/named items plus base equipment (magic-variant generation is intentionally omitted).
    item: [...(safeThunk(ITEMS).item || []), ...(safeThunk(ITEMS_BASE).baseitem || [])],
    race: RACE_LIST,
    class: CLASS_SUMMARIES,
    // "World" & extra reference content. Category keys match the {@tag} names where a tag exists.
    deity: safeThunk(DEITIES).deity || [],
    cult: safeThunk(CULTS_BOONS).cult || [],
    boon: safeThunk(CULTS_BOONS).boon || [],
    reward: safeThunk(REWARDS).reward || [],
    trap: safeThunk(TRAPS_HAZARDS).trap || [],
    hazard: safeThunk(TRAPS_HAZARDS).hazard || [],
    facility: safeThunk(BASTIONS).facility || [],
    language: safeThunk(LANGUAGES).language || [],
    object: safeThunk(OBJECTS).object || [],
    optfeature: safeThunk(OPTIONAL_FEATURES).optionalfeature || [],
    charoption: safeThunk(CHAR_OPTIONS).charoption || [],
    sense: safeThunk(SENSES).sense || [],
    skill: safeThunk(SKILLS).skill || [],
    psionic: safeThunk(PSIONICS).psionic || [],
    vehicle: safeThunk(VEHICLES).vehicle || [],
};

// Per-category lookup indexes.
const CONTENT_INDEX: Record<string, { byKey: Map<string, any>; byName: Map<string, any> }> = {};
for (const [category, arr] of Object.entries(CONTENT_DATA)) {
    const byKey = new Map<string, any>();
    const byName = new Map<string, any>();
    for (const entry of arr) {
        const name = normalizeString(entry.name);
        byKey.set(`${name}|${normalizeString(entry.source)}`, entry);
        // First-seen wins for the name-only fallback; prefer the 2024 (XPHB) reprint when present.
        const existing = byName.get(name);
        if (!existing || normalizeString(entry.source) === 'xphb') byName.set(name, entry);
    }
    CONTENT_INDEX[category] = { byKey, byName };
}

// Categories that share a namespace, so a mistyped tag (e.g. {@condition} for a status) still resolves.
const CONDITION_FAMILY = ['condition', 'status', 'disease'];

function lookupContent(category: string, name: string, source?: string): any | null {
    const n = normalizeString(name);
    const tryIdx = (ix?: { byKey: Map<string, any>; byName: Map<string, any> }) => {
        if (!ix) return null;
        if (source) {
            const exact = ix.byKey.get(`${n}|${normalizeString(source)}`);
            if (exact) return exact;
        }
        return ix.byName.get(n) || null;
    };
    const primary = tryIdx(CONTENT_INDEX[category]);
    if (primary) return primary;
    if (CONDITION_FAMILY.includes(category)) {
        for (const c of CONDITION_FAMILY) {
            if (c === category) continue;
            const res = tryIdx(CONTENT_INDEX[c]);
            if (res) return res;
        }
    }
    return null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * useData hook.
 */
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Provides data context for beasts and spells, including loading and storage logic.
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [beasts, setBeasts] = useState<Beast[]>([]);
    const [beastsIndex, setBeastsIndex] = useState<BeastIndex[]>([]);
    const [spells, setSpells] = useState<Spell[]>([]);
    const [spellsIndex, setSpellsIndex] = useState<SpellIndex[]>([]);
    const [spellSourceLookup, setSpellSourceLookup] = useState<SpellSourceLookup>({});
    const [availableClasses, setAvailableClasses] = useState<string[]>([]);
    const [spellClassRelations, setSpellClassRelations] = useState<SpellClassRelation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Derived simpleBeasts from index
    const simpleBeasts = React.useMemo(() => {
        const seen = new Set();
        return beastsIndex.map(({ name, cr, type, source, ac }) => {
            let crValue: string | number = 'Unknown';
            if (cr !== undefined && cr !== null && cr !== '') {
                if (typeof cr === 'object') {
                    if (typeof cr.cr === 'string' || typeof cr.cr === 'number') {
                        crValue = cr.cr;
                    } else if (typeof cr.value === 'string' || typeof cr.value === 'number') {
                        crValue = cr.value;
                    } else {
                        crValue = JSON.stringify(cr);
                    }
                } else {
                    crValue = String(cr);
                }
            }
            return {
                name,
                CR: crValue,
                type: type || 'Unknown',
                source: source || 'Unknown',
                ac: ac,
                passivePerception: 10, // Default value, will be calculated when full beast is loaded
            };
        }).filter(({ name, CR, source }) => {
            const key = `${name}||${CR}||${source}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [beastsIndex]);

    // Derived simpleSpells from index with available classes
    const simpleSpells = React.useMemo(() => {
        const seen = new Set();
        return spellsIndex.map(({ name, level, school, source, availableClasses, ritual, concentration }) => {
            return {
                name,
                level,
                school,
                source: source || 'Unknown',
                availableClasses: availableClasses || [],
                ritual: ritual || false,
                concentration: concentration || false
            };
        }).filter(({ name, level, school, source }) => {
            const key = `${name}||${level}||${school}||${source}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [spellsIndex]);

    // Fetch all data from the API
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('Loading bundled beasts data...');

            // Load beasts from the offline-bundled per-source JSON. Each thunk require()s one
            // source file; we yield to the event loop between sources so parsing the bundled
            // data (~20MB) doesn't block the UI thread in one long synchronous burst.
            const beastsResults: any[][] = [];
            for (const source of Object.keys(BESTIARY_BUNDLE)) {
                try {
                    const data = BESTIARY_BUNDLE[source]();
                    beastsResults.push(data.monster || []);
                } catch (error) {
                    console.warn(`Error loading bundled bestiary source ${source}:`, error);
                }
                await Promise.resolve();
            }

            console.log('Loading bundled spells data...');

            const spellsResults: any[][] = [];
            for (const source of Object.keys(SPELL_BUNDLE)) {
                try {
                    const data = SPELL_BUNDLE[source]();
                    spellsResults.push(data.spell || []);
                } catch (error) {
                    console.warn(`Error loading bundled spell source ${source}:`, error);
                }
                await Promise.resolve();
            }

            console.log('Loading bundled spell source lookup data...');
            let spellSourceLookupData: SpellSourceLookup = {};
            try {
                spellSourceLookupData = SPELL_SOURCE_LOOKUP() || {};
            } catch (error) {
                console.warn('Error loading bundled spell source lookup:', error);
            }

            // Flatten and combine results
            const beastsData = beastsResults.flat().sort((a: any, b: any) => {
                if (!a.name) return 1;
                if (!b.name) return -1;
                return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            });

            const spellsData = spellsResults.flat().sort((a: any, b: any) => {
                if (!a.name) return 1;
                if (!b.name) return -1;
                return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
            });

            console.log(`Loaded ${beastsData.length} beasts and ${spellsData.length} spells from bundle`);
            console.log('Spell source lookup data loaded');

            // Process the spell source lookup to extract classes and relations
            const { availableClasses: classes, spellClassRelations: relations, updatedSpells } = processSpellSourceLookup(spellSourceLookupData, spellsData);
            console.log(`Extracted ${classes.length} available classes and ${relations.length} spell-class relations`);
            console.log(`Updated ${updatedSpells.length} spells with class information`);

            // Store data to files
            console.log('Storing beasts to individual files...');
            await storeBeastsToFile(beastsData);
            console.log('✅ Beasts stored successfully');

            console.log('Storing spells to individual files with class information...');
            await storeSpellsToFile(updatedSpells);
            console.log('✅ Spells stored successfully');

            // Store spell-class relations and available classes indexes
            console.log('Storing spell-class relations index...');
            await storeSpellClassRelationsToFile(relations);
            console.log('✅ Spell-class relations stored successfully');

            console.log('Storing available classes index...');
            await storeAvailableClassesToFile(classes);
            console.log('✅ Available classes stored successfully');

            // Set spell source lookup data and derived data
            setSpellSourceLookup(spellSourceLookupData);
            setAvailableClasses(classes);
            setSpellClassRelations(relations);

            // Load indexes for immediate use
            const [beastsIndexData, spellsIndexData, spellClassRelationsData, availableClassesData] = await Promise.all([
                loadBeastsIndexFromFile(),
                loadSpellsIndexFromFile(),
                loadSpellClassRelationsIndexFromFile(),
                loadAvailableClassesIndexFromFile()
            ]);

            if (beastsIndexData) {
                setBeastsIndex(beastsIndexData);
            }

            if (spellsIndexData) {
                setSpellsIndex(spellsIndexData);
            }

            if (spellClassRelationsData) {
                setSpellClassRelations(spellClassRelationsData);
            }

            if (availableClassesData) {
                setAvailableClasses(availableClassesData);
            }

            setIsInitialized(true);

            // Build the filter indexes once, right after seeding (no manual "regenerate" step).
            try {
                await regenerateAllIndexes();
            } catch (indexError) {
                console.warn('Filter index generation failed (filters will compute on the fly):', indexError);
            }

            // Stamp the bundled data version so we only re-seed on a data update.
            await AsyncStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
            console.log('Data seeding from bundle completed successfully');
        } catch (error) {
            console.error('Error seeding data from bundle:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load data from files
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            console.log('Loading data from files...');

            // Load indexes
            const [beastsIndexData, spellsIndexData, spellClassRelationsData, availableClassesData] = await Promise.all([
                loadBeastsIndexFromFile(),
                loadSpellsIndexFromFile(),
                loadSpellClassRelationsIndexFromFile(),
                loadAvailableClassesIndexFromFile()
            ]);

            if (beastsIndexData) {
                setBeastsIndex(beastsIndexData);
                console.log(`Loaded index with ${beastsIndexData.length} monsters`);
            }

            if (spellsIndexData) {
                setSpellsIndex(spellsIndexData);
                console.log(`Loaded index with ${spellsIndexData.length} spells`);
            }

            if (spellClassRelationsData) {
                setSpellClassRelations(spellClassRelationsData);
                console.log(`Loaded index with ${spellClassRelationsData.length} spell-class relations`);
            }

            if (availableClassesData) {
                setAvailableClasses(availableClassesData);
                console.log(`Loaded index with ${availableClassesData.length} available classes`);
            }

            // loadData does NOT throw when files are simply absent (fresh install), so report
            // back whether anything was actually loaded; the caller seeds from the bundle if not.
            const hasData = !!(beastsIndexData?.length || spellsIndexData?.length);
            if (hasData) {
                setIsInitialized(true);
            }
            console.log(`Data loading from files completed (hasData=${hasData})`);
            return hasData;
        } catch (error) {
            console.error('Error loading data from files:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Reload data (fetch from API). Doubles as the retry action for the error state.
    const reloadData = useCallback(async () => {
        setLoadError(null);
        try {
            await fetchAllData();
        } catch {
            setLoadError('Could not load game data. Please restart the app and try again.');
        }
    }, [fetchAllData]);

    // Clear all data
    const clearData = useCallback(async () => {
        try {
            await clearBeastsAndSpellsOnly();
            setBeasts([]);
            setBeastsIndex([]);
            setSpells([]);
            setSpellsIndex([]);
            setSpellClassRelations([]);
            setAvailableClasses([]);
            setIsInitialized(false);
            console.log('Beasts and spells data cleared successfully');
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }, []);

    // O(1) lookup maps keyed by normalized "name|source", rebuilt only when an index changes.
    // Replaces per-call O(n) linear scans of the index on every detail open.
    const beastIndexByKey = useMemo(() => {
        const map = new Map<string, BeastIndex>();
        for (const b of beastsIndex) {
            map.set(`${normalizeString(b.name)}|${normalizeString(b.source)}`, b);
        }
        return map;
    }, [beastsIndex]);

    const spellIndexByKey = useMemo(() => {
        const map = new Map<string, SpellIndex>();
        for (const s of spellsIndex) {
            map.set(`${normalizeString(s.name)}|${normalizeString(s.source)}`, s);
        }
        return map;
    }, [spellsIndex]);

    // Name-only fallback maps (first source wins). Used when a {@creature}/{@spell} tag omits a
    // source (common in book/adventure content) so the source-qualified lookup would miss.
    const beastIndexByName = useMemo(() => {
        const map = new Map<string, BeastIndex>();
        for (const b of beastsIndex) {
            const key = normalizeString(b.name);
            if (!map.has(key)) map.set(key, b);
        }
        return map;
    }, [beastsIndex]);

    const spellIndexByName = useMemo(() => {
        const map = new Map<string, SpellIndex>();
        for (const s of spellsIndex) {
            const key = normalizeString(s.name);
            if (!map.has(key)) map.set(key, s);
        }
        return map;
    }, [spellsIndex]);

    // Get full beast data by name and source
    const getFullBeast = useCallback(async (name: string, source: string): Promise<Beast | null> => {
        try {
            // Find the beast in the index (O(1)); fall back to name-only when the source is
            // missing or unknown (e.g. sourceless {@creature} links in book content).
            const beastIndex = beastIndexByKey.get(`${normalizeString(name)}|${normalizeString(source)}`)
                || beastIndexByName.get(normalizeString(name));

            if (!beastIndex) {
                return null;
            }

            // Load the full beast data from file
            const fullBeast = await loadMonsterFromFile(beastIndex.file);

            // If the beast has a token URL, try to cache it
            if (fullBeast && fullBeast.tokenUrl) {
                try {
                    const cachedTokenUrl = await getTokenUrl(source, name, fullBeast.tokenUrl);
                    // Ensure we have a valid string URL
                    if (cachedTokenUrl && typeof cachedTokenUrl === 'string') {
                        fullBeast.tokenUrl = cachedTokenUrl;
                    } else {
                        console.warn('Invalid token URL received for', name, ':', cachedTokenUrl);
                        // Keep original URL if caching returns invalid result
                    }
                } catch (error) {
                    console.error(`Error caching token for ${name}:`, error);
                    // Keep original URL if caching fails
                }
            }

            return fullBeast;
        } catch (error) {
            console.error('Error loading full beast:', error);
            return null;
        }
    }, [beastIndexByKey, beastIndexByName]);

    // Get full spell data by name and source
    const getFullSpell = useCallback(async (name: string, source: string): Promise<Spell | null> => {
        try {
            // Find the spell in the index (O(1)); fall back to name-only when the source is
            // missing or unknown (e.g. sourceless {@spell} links in book content).
            const spellIndex = spellIndexByKey.get(`${normalizeString(name)}|${normalizeString(source)}`)
                || spellIndexByName.get(normalizeString(name));

            if (!spellIndex) {
                return null;
            }

            // Load the full spell data from file
            const fullSpell = await loadSpellFromFile(spellIndex.file);

            // Add processed properties for consistency
            if (fullSpell) {
                fullSpell.ritual = spellIndex.ritual;
                fullSpell.concentration = spellIndex.concentration;
            }

            return fullSpell;
        } catch (error) {
            console.error('Error loading full spell:', error);
            return null;
        }
    }, [spellIndexByKey, spellIndexByName]);

    // Generic reference-content lookup (conditions, actions, feats, …) from the bundled datasets
    const getContentEntry = useCallback((category: string, name: string, source?: string) => lookupContent(category, name, source), []);
    const getContentList = useCallback((category: string) => CONTENT_DATA[category] || [], []);
    const getClassFile = useCallback((name: string) => getClassFileByName(name), []);

    // Initialize data on mount. Falls back from local files → network fetch, and surfaces
    // a recoverable error (instead of a permanent spinner) when both fail — e.g. a first
    // launch with no connection and no bundled data.
    const initializeData = useCallback(async () => {
        setLoadError(null);
        try {
            const storedVersion = await AsyncStorage.getItem(DATA_VERSION_KEY);

            // Seed (or re-seed) from the offline bundle on first launch or after a data update
            // (bundled DATA_VERSION changed). This also (re)builds all indexes automatically.
            if (storedVersion !== DATA_VERSION) {
                console.log(`Seeding from bundle (stored=${storedVersion}, bundle=${DATA_VERSION})...`);
                await fetchAllData();
                return;
            }

            // Version matches → load from the cached per-entity files. If they're somehow
            // missing/empty, fall back to re-seeding from the bundle.
            const hadData = await loadData();
            if (!hadData) {
                console.log('No stored data found — seeding from bundled data...');
                await fetchAllData();
            }
        } catch {
            console.error('Failed to load data from files, seeding from bundled data...');
            try {
                await fetchAllData();
            } catch (fetchError) {
                console.error('Failed to load bundled data:', fetchError);
                setLoadError(
                    'Could not load game data. Please restart the app and try again.'
                );
            }
        }
    }, [loadData, fetchAllData]);

    useEffect(() => {
        initializeData();
    }, [initializeData]);

    // Memoize the context value so consumers don't re-render on unrelated parent renders.
    // Distinct source codes across beasts, spells and all bundled content (for ignore-books).
    const allSources = useMemo(() => {
        const s = new Set<string>();
        for (const b of simpleBeasts) if (b.source) s.add(b.source);
        for (const sp of simpleSpells) if (sp.source) s.add(sp.source);
        for (const arr of Object.values(CONTENT_DATA)) for (const e of arr) if (e?.source) s.add(e.source);
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [simpleBeasts, simpleSpells]);

    const value = useMemo<DataContextType>(() => ({
        beasts,
        simpleBeasts,
        spells,
        simpleSpells,
        spellSourceLookup,
        availableClasses,
        spellClassRelations,
        isLoading,
        isInitialized,
        loadError,
        loadData,
        reloadData,
        clearData,
        getFullBeast,
        getFullSpell,
        conditions: CONTENT_DATA['condition'],
        diseases: CONTENT_DATA['disease'],
        statuses: CONTENT_DATA['status'],
        actions: CONTENT_DATA['action'],
        feats: CONTENT_DATA['feat'],
        backgrounds: CONTENT_DATA['background'],
        items: CONTENT_DATA['item'],
        races: CONTENT_DATA['race'],
        classes: CONTENT_DATA['class'],
        variantRules: CONTENT_DATA['variantrule'],
        getContentEntry,
        getContentList,
        getClassFile,
        allSources
    }), [
        beasts,
        simpleBeasts,
        spells,
        simpleSpells,
        spellSourceLookup,
        availableClasses,
        spellClassRelations,
        isLoading,
        isInitialized,
        loadError,
        loadData,
        reloadData,
        clearData,
        getFullBeast,
        getFullSpell,
        getContentEntry,
        getContentList,
        getClassFile,
        allSources
    ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
