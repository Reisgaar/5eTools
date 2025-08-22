// REACT
import React, { createContext, useContext, useEffect, useState } from 'react';

// CONSTANTS - No longer needed with local data

// UTILS
import { equalsNormalized } from 'src/utils/stringUtils';
import { getTokenUrl } from 'src/utils/tokenCache';
import {
    clearBeastsAndSpellsOnly,
    loadMonsterFromFile,
    loadSpellFromFile,
    loadSpellClassRelationsIndexFromFile,
    loadAvailableClassesIndexFromFile,
    storeSpellClassRelationsToFile,
    storeAvailableClassesToFile
} from 'src/utils/fileStorage';

// LOCAL DATA LOADING
import { 
    loadAllBestiaryData, 
    loadAllSpellData, 
    createBestiaryIndex, 
    createSpellIndex,
    findMonster,
    findSpell
} from 'src/data/localDataLoader';

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
  loadData: () => Promise<void>;
  getFullBeast: (name: string, source: string) => Promise<Beast | null>;
  getFullSpell: (name: string, source: string) => Promise<Spell | null>;
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

    // Process spell source lookup data to extract available classes and spell-class relations
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
                                    relations.push({
                                        spellName,
                                        source,
                                        className,
                                        book
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });

        // Update spells with their available classes
        const updatedSpells = spellsData.map(spell => {
            const spellClasses = new Set<string>();

            // Find all relations for this spell (case insensitive)
            relations.forEach(relation => {
                if (relation.spellName.toLowerCase() === spell.name.toLowerCase() &&
            relation.source.toLowerCase() === spell.source.toLowerCase()) {
                    spellClasses.add(relation.className);
                }
            });

            return {
                ...spell,
                availableClasses: Array.from(spellClasses).sort()
            };
        });

        return {
            availableClasses: Array.from(allClasses).sort(),
            spellClassRelations: relations,
            updatedSpells
        };
    }



    // Load data from local files
    const loadData = async () => {
        setIsLoading(true);
        try {
            console.log('Loading data from local files...');

            // Load all bestiary and spell data
            const [bestiaryData, spellData] = await Promise.all([
                loadAllBestiaryData(),
                loadAllSpellData()
            ]);

            // Create indexes from the loaded data
            const beastsIndexData = createBestiaryIndex(bestiaryData);
            const spellsIndexData = createSpellIndex(spellData);

            // Set the indexes
            setBeastsIndex(beastsIndexData);
            setSpellsIndex(spellsIndexData);

            console.log(`Loaded ${beastsIndexData.length} monsters from local data`);
            console.log(`Loaded ${spellsIndexData.length} spells from local data`);

            // Process spell class information
            const allClasses = new Set<string>();
            const relations: SpellClassRelation[] = [];

            Object.values(spellData).flat().forEach((spell: any) => {
                if (spell.classes && typeof spell.classes === 'object') {
                    Object.entries(spell.classes).forEach(([book, classData]: [string, any]) => {
                        if (typeof classData === 'object' && classData !== null) {
                            Object.entries(classData).forEach(([className, canCast]: [string, any]) => {
                                if (canCast === true) {
                                    allClasses.add(className);
                                    relations.push({
                                        spellName: spell.name,
                                        source: spell.source || 'PHB',
                                        className,
                                        book
                                    });
                                }
                            });
                        }
                    });
                }
            });

            setAvailableClasses(Array.from(allClasses).sort());
            setSpellClassRelations(relations);

            console.log(`Extracted ${allClasses.size} available classes and ${relations.length} spell-class relations`);

            setIsInitialized(true);
            console.log('Local data loading completed successfully');
        } catch (error) {
            console.error('Error loading data from local files:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Reload data (load from local files)
    const reloadData = async () => {
        await loadData();
    };

    // Clear all data
    const clearData = async () => {
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
    };

    // Get full beast data by name and source
    const getFullBeast = async (name: string, source: string): Promise<Beast | null> => {
        try {
            // Try to find the beast using local data loader first
            const beast = await findMonster(name, source);
            if (beast) {
                // If the beast has a token URL, try to cache it
                if (beast.tokenUrl) {
                    try {
                        const cachedTokenUrl = await getTokenUrl(source, name, beast.tokenUrl);
                        // Ensure we have a valid string URL
                        if (cachedTokenUrl && typeof cachedTokenUrl === 'string') {
                            beast.tokenUrl = cachedTokenUrl;
                        } else {
                            console.warn('Invalid token URL received for', name, ':', cachedTokenUrl);
                            // Keep original URL if caching returns invalid result
                        }
                    } catch (error) {
                        console.error(`Error caching token for ${name}:`, error);
                        // Keep original URL if caching fails
                    }
                }
                return beast;
            }

            // Fallback to index-based loading
            const beastIndex = beastsIndex.find(b =>
                equalsNormalized(b.name, name) && equalsNormalized(b.source, source)
            );

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
    };

    // Get full spell data by name and source
    const getFullSpell = async (name: string, source: string): Promise<Spell | null> => {
        try {
            // Try to find the spell using local data loader first
            const spell = await findSpell(name, source);
            if (spell) {
                return spell;
            }

            // Fallback to index-based loading
            const spellIndex = spellsIndex.find(s =>
                equalsNormalized(s.name, name) && equalsNormalized(s.source, source)
            );

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
    };

    // Initialize data on mount
    useEffect(() => {
        const initializeData = async () => {
            try {
                await loadData();
            } catch (error) {
                console.error('Failed to load data from local files:', error);
                // No fallback needed since we're using local data only
            }
        };

        initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DataContext.Provider value={{
            beasts,
            simpleBeasts,
            spells,
            simpleSpells,
            spellSourceLookup,
            availableClasses,
            spellClassRelations,
            isLoading,
            isInitialized,
            loadData,
            getFullBeast,
            getFullSpell
        }}>
            {children}
        </DataContext.Provider>
    );
};
