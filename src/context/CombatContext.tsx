// REACT
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// UTILS
import { calculatePassivePerception, calculateInitiativeBonus, extractSpeed, extractSenses, extractACValue } from 'src/utils/beastUtils';
import { deleteCombatFile, loadCombatFromFile, loadCombatsIndexFromFile, storeCombatToFile } from 'src/utils/fileStorage';
import { getTokenUrl, getCachedTokenUrl } from 'src/utils/tokenCache';
import { normalizeString } from 'src/utils/stringUtils';

// CONSTANTS
import { DEFAULT_CREATURE_TOKEN, DEFAULT_PLAYER_TOKEN } from 'src/constants/tokens';

// INTERFACES
export interface Combatant {
  id: string; // unique (name+index or uuid)
  name: string;
  source: string;
  tokenUrl?: string;
  maxHp: number;
  currentHp: number;
  initiative: number;
  initiativeBonus: number; // Initiative bonus (dexterity modifier)
  ac: number; // Armor Class
  passivePerception?: number; // Passive Perception
  speed?: string; // Speed information
  senses?: string; // Senses information
  color?: string; // Custom color for the beast container
  conditions?: string[]; // Status conditions for the combatant
  note?: string; // Short note about the combatant
  // Player-specific fields
  race?: string; // Player race
  class?: string; // Player class
}

export interface Combat {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  combatants: Combatant[];
  groupByName: { [nameOrigin: string]: boolean };
  round?: number;
  turnIndex?: number;
  started?: boolean;
  isActive?: boolean; // Marks if this combat is currently active/in progress
  campaignId?: string; // Campaign this combat belongs to
}

interface CombatContextType {
  combats: Combat[];
  currentCombatId: string | null;
  currentCombat: Combat | null;
  combatants: Combatant[];
  groupByName: { [nameOrigin: string]: boolean };
  createCombat: (name: string, campaignId?: string, description?: string) => string;
  selectCombat: (id: string) => void;
  clearCurrentCombat: () => void;
  deleteCombat: (id: string) => void;
  archiveCombat: (id: string) => void;
  resetCombat: (id: string) => void;
  addCombatant: (monster: any) => Promise<void>;
  addCombatantToCombat: (monster: any, combatId: string) => Promise<void>;
  removeCombatant: (id: string) => void;
  updateHp: (id: string, newHp: number) => void;
  updateMaxHp: (id: string, newMaxHp: number) => void;
  updateAc: (id: string, newAc: number) => void;
  updateColor: (id: string, color: string | null) => void;
  updateInitiative: (id: string, newInit: number) => void;
  updateInitiativeForGroup: (name: string, newInit: number) => void;
  updateInitiativeBonus: (id: string, newBonus: number) => void;
  isGroupEnabled: (nameOrigin: string) => boolean;
  toggleGroupForName: (nameOrigin: string) => void;
  setGroupForName: (nameOrigin: string, value: boolean) => void;
  clearCombat: () => void;
  resetCombatGroups: () => void;
  startCombat: () => void;
  stopCombat: () => void;
  nextTurn: () => void;
  getTurnOrder: (combatants: Combatant[], groupByName: { [nameOrigin: string]: boolean }) => { ids: string[], name: string, initiative: number }[];
  addPlayerCombatant: (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, initiativeBonus?: number, tokenUrl?: string }) => void;
  syncPlayerCombatants: (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, initiativeBonus?: number, tokenUrl?: string }) => void;
  updateCombatantConditions: (id: string, conditions: string[]) => void;
  updateCombatantNote: (id: string, note: string) => void;
  setCombatActive: (id: string, active: boolean) => void;
  updateCombat: (id: string, updates: { name?: string; description?: string; campaignId?: string }) => void;
  getSortedCombats: (campaignId?: string | null) => Combat[];
  reloadCombats: () => Promise<void>;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

// Helper function to extract max HP from monster data
const extractMaxHp = (monster: any): number => {
    let maxHp = 0;

    if (monster.hp) {
        if (typeof monster.hp === 'object') {
            // If it has average, use that as max HP
            if (typeof monster.hp.average === 'number') {
                maxHp = monster.hp.average;
            }
            // If it has formula, calculate the maximum possible roll
            else if (typeof monster.hp.formula === 'string') {
                const rollMatch = monster.hp.formula.match(/(\d+)d(\d+)([+-]\d+)?/);
                if (rollMatch) {
                    const dice = parseInt(rollMatch[1]);
                    const sides = parseInt(rollMatch[2]);
                    const modifier = rollMatch[3] ? parseInt(rollMatch[3]) : 0;
                    // Maximum roll: all dice roll their maximum value
                    maxHp = (dice * sides) + modifier;
                }
            }
            // If it has roll (string format), calculate the maximum possible roll
            else if (typeof monster.hp.roll === 'string') {
                const rollMatch = monster.hp.roll.match(/(\d+)d(\d+)([+-]\d+)?/);
                if (rollMatch) {
                    const dice = parseInt(rollMatch[1]);
                    const sides = parseInt(rollMatch[2]);
                    const modifier = rollMatch[3] ? parseInt(rollMatch[3]) : 0;
                    // Maximum roll: all dice roll their maximum value
                    maxHp = (dice * sides) + modifier;
                }
            }
            // Try to find any number in the object as fallback
            else {
                const values = Object.values(monster.hp).filter(v => typeof v === 'number');
                if (values.length > 0) maxHp = values[0];
            }
        } else if (typeof monster.hp === 'number') {
            maxHp = monster.hp;
        } else if (typeof monster.hp === 'string') {
            // Handle string format like "5d8+10"
            const rollMatch = monster.hp.match(/(\d+)d(\d+)([+-]\d+)?/);
            if (rollMatch) {
                const dice = parseInt(rollMatch[1]);
                const sides = parseInt(rollMatch[2]);
                const modifier = rollMatch[3] ? parseInt(rollMatch[3]) : 0;
                // Maximum roll: all dice roll their maximum value
                maxHp = (dice * sides) + modifier;
            } else if (!isNaN(Number(monster.hp))) {
                maxHp = Number(monster.hp);
            }
        }
    }

    // If still no HP found, try alternative sources
    if (!maxHp || maxHp <= 0) {
    // Check if there's a formula or other HP-related field
        if (monster.hpFormula && typeof monster.hpFormula === 'string') {
            const rollMatch = monster.hpFormula.match(/(\d+)d(\d+)([+-]\d+)?/);
            if (rollMatch) {
                const dice = parseInt(rollMatch[1]);
                const sides = parseInt(rollMatch[2]);
                const modifier = rollMatch[3] ? parseInt(rollMatch[3]) : 0;
                // Maximum roll: all dice roll their maximum value
                maxHp = (dice * sides) + modifier;
            }
        }
    }

    if (!maxHp || maxHp <= 0) {
        console.warn('Could not determine maxHp for monster:', monster);
        maxHp = 1;
    }

    return maxHp;
};

// Helper function to safely save a combat to file
const saveCombatToFile = (combat: Combat) => {
    setTimeout(() => {
        storeCombatToFile(combat);
    }, 0);
};

// Provides combat state and actions for managing combats and combatants.
export const CombatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [combats, setCombats] = useState<Combat[]>([]);
    const [currentCombatId, setCurrentCombatId] = useState<string | null>(null);

    // Load combats from file storage on mount
    useEffect(() => {
        (async () => {
            console.log('Loading combats from storage...');
            const combatIndexes = await loadCombatsIndexFromFile();
            console.log('Loaded combat indexes:', combatIndexes);

            if (combatIndexes && combatIndexes.length > 0) {
                console.log('Total loaded combat indexes:', combatIndexes.length);
                console.log('📁 Combat index files to load:', combatIndexes.map(ci => ({ name: ci.name, file: ci.file, id: ci.id })));

                // Load full combat data for each combat
                console.log(`🔄 Starting to load ${combatIndexes.length} combats...`);
                const loadedCombats = await Promise.all(combatIndexes.map(async (combatIndex, index) => {
                    console.log(`🔄 [${index + 1}/${combatIndexes.length}] Processing: ${combatIndex.name} (${combatIndex.file})`);
                    try {
                        console.log(`Attempting to load combat from file: ${combatIndex.file}`);
                        const fullCombat = await loadCombatFromFile(combatIndex.file);
                        if (fullCombat) {
                            console.log(`✅ Successfully loaded combat: ${fullCombat.name} (ID: ${fullCombat.id}) with ${fullCombat.combatants?.length || 0} combatants`);
                            return fullCombat;
                        } else {
                            console.warn(`❌ Failed to load full combat for ${combatIndex.name} from file: ${combatIndex.file} - loadCombatFromFile returned null/undefined`);
                            return null;
                        }
                    } catch (error) {
                        console.error(`❌ Error loading combat ${combatIndex.name} from file ${combatIndex.file}:`, error);
                        console.error('❌ Error details:', {
                            name: combatIndex.name,
                            file: combatIndex.file,
                            id: combatIndex.id,
                            error: error instanceof Error ? error.message : String(error),
                            stack: error instanceof Error ? error.stack : undefined
                        });
                        return null;
                    }
                }));

                // Filter out null values and update token URLs
                const validCombats = loadedCombats.filter(combat => combat !== null);
                console.log(`📊 Loaded ${loadedCombats.length} combats, ${validCombats.length} are valid (not null)`);
                console.log('📋 Valid combats:', validCombats.map(c => ({ id: c.id, name: c.name, campaignId: c.campaignId })));
                const updatedCombats = await Promise.all(validCombats.map(async (combat) => {
                    if (combat.combatants && combat.combatants.length > 0) {
                        const updatedCombatants = await Promise.all(combat.combatants.map(async (combatant: Combatant) => {
                            if (combatant.tokenUrl && combatant.tokenUrl.startsWith('http')) {
                                try {
                                    const cachedUrl = await getCachedTokenUrl(combatant.source, combatant.name);
                                    if (cachedUrl) {
                                        console.log(`Updated token URL for ${combatant.name}: ${cachedUrl}`);
                                        return { ...combatant, tokenUrl: cachedUrl };
                                    }
                                } catch (error) {
                                    console.error(`Error updating token URL for ${combatant.name}:`, error instanceof Error ? error.message : String(error));
                                }
                            }
                            return combatant;
                        }));
                        return { ...combat, combatants: updatedCombatants };
                    }
                    return combat;
                }));

                // Log combat details for debugging
                updatedCombats.forEach(combat => {
                    console.log(`Combat ${combat.name}:`, combat);
                    console.log(`Combatants count: ${combat.combatants?.length || 0}`);
                });

                setCombats(updatedCombats);
                // Don't automatically select any combat - show the list instead
                setCurrentCombatId(null);
            } else {
                console.log('No combats found');
            }
        })();
    }, []);

    // Get current combat
    const currentCombat = combats.find(c => c.id === currentCombatId) || null;
    const combatants = currentCombat?.combatants || [];
    const groupByName = currentCombat?.groupByName || {};

    const createCombat = (name: string, campaignId?: string, description?: string): string => {
    // Use a more robust ID generation to avoid duplicates
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const id = `combat-${timestamp}-${random}`;
        const newCombat: Combat = {
            id,
            name,
            description,
            createdAt: Date.now(),
            combatants: [],
            groupByName: {}, // All names will be grouped by default as they are added
            campaignId, // Add campaign ID if provided
        };
        setCombats(prev => [...prev, newCombat]);
        // Save immediately
        storeCombatToFile(newCombat);
        return id;
    };

    const selectCombat = (id: string) => {
        console.log('Selecting combat:', id);
        setCurrentCombatId(id);
    };

    const clearCurrentCombat = () => {
        setCurrentCombatId(null);
    };

    const deleteCombat = (id: string) => {
        setCombats(prev => prev.filter(c => c.id !== id));
        deleteCombatFile(id);
        if (currentCombatId === id) {
            setCurrentCombatId(combats.length > 1 ? combats[0]?.id || null : null);
        }
    };

    const archiveCombat = (id: string) => {
        setCombats(prev => prev.map(c =>
            c.id === id
                ? { ...c, archived: true, archivedAt: Date.now() }
                : c
        ));
    };

    const resetCombat = (id: string) => {
        setCombats(prev => prev.map(c =>
            c.id === id
                ? {
                    ...c,
                    round: undefined,
                    turnIndex: undefined,
                    started: false,
                    combatants: (c.combatants || []).map(comb => ({
                        ...comb,
                        currentHp: comb.maxHp, // Reset HP to max
                        initiative: 0, // Reset initiative
                        conditions: [] // Clear conditions
                        // Note: initiativeBonus is preserved
                    }))
                }
                : c
        ));
    };

    const addCombatant = async (monster: any) => {
        if (!currentCombatId) return;

        // Use name+source+index as id to allow duplicates
        const id = `${monster.name}-${monster.source || ''}-${Date.now()}-${Math.random()}`;
        // Get max HP using helper function
        const maxHp = extractMaxHp(monster);
        // Get token url with caching
        let tokenUrl = DEFAULT_CREATURE_TOKEN;
        if (monster.source && monster.name) {
            // Most monsters from 5e.tools have tokens, so we'll try to load them
            // The token URL follows the pattern: https://5e.tools/img/bestiary/tokens/{source}/{name}.webp
            const originalTokenUrl = `https://5e.tools/img/bestiary/tokens/${monster.source}/${encodeURIComponent(monster.name)}.webp`;

            try {
                const cachedTokenUrl = await getTokenUrl(monster.source, monster.name, originalTokenUrl);
                // Ensure we have a valid string URL
                if (cachedTokenUrl && typeof cachedTokenUrl === 'string') {
                    tokenUrl = cachedTokenUrl;
                } else {
                    console.warn('Invalid token URL received for', monster.name, ':', cachedTokenUrl);
                    tokenUrl = originalTokenUrl; // Fallback to original URL
                }
            } catch (error) {
                console.error(`Error caching token for ${monster.name}:`, error);
                // Fallback to original URL
                tokenUrl = originalTokenUrl;
            }
        }

        const newCombatant: Combatant = {
            id,
            name: monster.name,
            source: monster.source || '',
            tokenUrl,
            maxHp: maxHp,
            currentHp: maxHp,
            initiative: 0,
            initiativeBonus: calculateInitiativeBonus(monster), // Calculate initiative bonus
            ac: extractACValue(monster.ac), // Extract AC from monster.ac
            passivePerception: calculatePassivePerception(monster), // Calculate passive perception
            speed: extractSpeed(monster), // Extract speed information
            senses: extractSenses(monster), // Extract senses information
        };

        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === currentCombatId
                    ? { ...c, combatants: [...(c.combatants || []), newCombatant] }
                    : c
            );
            // Save the updated combat immediately
            const updatedCombat = updatedCombats.find(c => c.id === currentCombatId);
            if (updatedCombat) {
                // Use setTimeout to ensure the state update completes first
                setTimeout(() => {
                    storeCombatToFile(updatedCombat);
                }, 0);
            }
            return updatedCombats;
        });
    };

    const addCombatantToCombat = async (monster: any, combatId: string) => {
        const combat = combats.find(c => c.id === combatId);
        if (!combat) return;

        // Use name+source+index as id to allow duplicates
        const id = `${monster.name}-${monster.source || ''}-${Date.now()}-${Math.random()}`;
        // Get max HP
        let maxHp = 0;
        if (monster.hp) {
            if (typeof monster.hp === 'object') {
                if (typeof monster.hp.average === 'number') maxHp = monster.hp.average;
                else if (typeof monster.hp.max === 'number') maxHp = monster.hp.max;
                else {
                    // Try to find the first number in the object
                    const values = Object.values(monster.hp).filter(v => typeof v === 'number');
                    if (values.length > 0) maxHp = values[0];
                }
            } else if (typeof monster.hp === 'number') maxHp = monster.hp;
            else if (!isNaN(Number(monster.hp))) maxHp = Number(monster.hp);
        }
        if (!maxHp || maxHp <= 0) {
            console.warn('Could not determine maxHp for monster:', monster);
            maxHp = 1;
        }
        // Get token url with caching
        let tokenUrl = DEFAULT_CREATURE_TOKEN;
        if (monster.source && monster.name) {
            // Most monsters from 5e.tools have tokens, so we'll try to load them
            // The token URL follows the pattern: https://5e.tools/img/bestiary/tokens/{source}/{name}.webp
            const originalTokenUrl = `https://5e.tools/img/bestiary/tokens/${monster.source}/${encodeURIComponent(monster.name)}.webp`;

            try {
                tokenUrl = await getTokenUrl(monster.source, monster.name, originalTokenUrl);
            } catch (error) {
                console.error(`Error caching token for ${monster.name}:`, error);
                // Fallback to original URL
                tokenUrl = originalTokenUrl;
            }
        }

        const newCombatant: Combatant = {
            id,
            name: monster.name,
            source: monster.source || '',
            tokenUrl,
            maxHp: maxHp,
            currentHp: maxHp,
            initiative: 0,
            initiativeBonus: calculateInitiativeBonus(monster), // Calculate initiative bonus
            ac: extractACValue(monster.ac), // Extract AC from monster.ac
            passivePerception: calculatePassivePerception(monster), // Calculate passive perception
            speed: extractSpeed(monster), // Extract speed information
            senses: extractSenses(monster), // Extract senses information
        };

        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === combatId
                    ? { ...c, combatants: [...(c.combatants || []), newCombatant] }
                    : c
            );
            // Save the updated combat immediately
            const updatedCombat = updatedCombats.find(c => c.id === combatId);
            if (updatedCombat) {
                // Use setTimeout to ensure the state update completes first
                setTimeout(() => {
                    storeCombatToFile(updatedCombat);
                }, 0);
            }
            return updatedCombats;
        });
    };

    const removeCombatant = (id: string) => {
        if (!currentCombatId) return;
        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === currentCombatId
                    ? { ...c, combatants: (c.combatants || []).filter(comb => comb.id !== id) }
                    : c
            );
            // Save the updated combat
            const updatedCombat = updatedCombats.find(c => c.id === currentCombatId);
            if (updatedCombat) {
                saveCombatToFile(updatedCombat);
            }
            return updatedCombats;
        });
    };

    const updateHp = (id: string, newHp: number) => {
        if (!currentCombatId) return;
        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === currentCombatId
                    ? {
                        ...c,
                        combatants: (c.combatants || []).map(comb =>
                            comb.id === id
                                ? { ...comb, currentHp: Math.min(newHp, comb.maxHp) }
                                : comb
                        )
                    }
                    : c
            );
            // Save the updated combat
            const updatedCombat = updatedCombats.find(c => c.id === currentCombatId);
            if (updatedCombat) {
                saveCombatToFile(updatedCombat);
            }
            return updatedCombats;
        });
    };

    const updateMaxHp = (id: string, newMaxHp: number) => {
        if (!currentCombatId) return;
        const clampedMaxHp = Math.max(1, newMaxHp);
        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === currentCombatId
                    ? {
                        ...c,
                        combatants: (c.combatants || []).map(comb =>
                            comb.id === id
                                ? {
                                    ...comb,
                                    maxHp: clampedMaxHp,
                                    currentHp: (() => {
                                        // Apply the same logic as in the UI:
                                        // - If MaxHP goes down below CurrentHP → CurrentHP = MaxHP
                                        // - If MaxHP goes up and CurrentHP = MaxHP → CurrentHP goes up with MaxHP
                                        // - If MaxHP goes up and CurrentHP < MaxHP → CurrentHP stays the same
                                        if (clampedMaxHp < comb.currentHp) {
                                            return clampedMaxHp;
                                        } else if (comb.currentHp === comb.maxHp && clampedMaxHp > comb.maxHp) {
                                            return clampedMaxHp;
                                        } else {
                                            return comb.currentHp;
                                        }
                                    })()
                                }
                                : comb
                        )
                    }
                    : c
            );
            // Save the updated combat
            const updatedCombat = updatedCombats.find(c => c.id === currentCombatId);
            if (updatedCombat) {
                saveCombatToFile(updatedCombat);
            }
            return updatedCombats;
        });
    };

    const updateAc = (id: string, newAc: number) => {
        if (!currentCombatId) return;
        setCombats(prev => prev.map(c =>
            c.id === currentCombatId
                ? {
                    ...c,
                    combatants: (c.combatants || []).map(comb =>
                        comb.id === id
                            ? { ...comb, ac: Math.max(0, newAc) }
                            : comb
                    )
                }
                : c
        ));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: (updatedCombat.combatants || []).map(comb => comb.id === id ? { ...comb, ac: Math.max(0, newAc) } : comb) });
    };

    const updateColor = (id: string, color: string | null) => {
        if (!currentCombatId) return;
        setCombats(prev => prev.map(c =>
            c.id === currentCombatId
                ? {
                    ...c,
                    combatants: (c.combatants || []).map(comb =>
                        comb.id === id
                            ? { ...comb, color: color || undefined }
                            : comb
                    )
                }
                : c
        ));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: (updatedCombat.combatants || []).map(comb => comb.id === id ? { ...comb, color: color || undefined } : comb) });
    };

    const updateInitiative = (id: string, newInit: number) => {
        console.log(`updateInitiative called: id=${id}, newInit=${newInit}, currentCombatId=${currentCombatId}`);
        if (!currentCombatId) return;
        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === currentCombatId
                    ? {
                        ...c,
                        combatants: (c.combatants || []).map(comb =>
                            comb.id === id
                                ? { ...comb, initiative: newInit }
                                : comb
                        )
                    }
                    : c
            );
            console.log(`State updated for ${id} with initiative ${newInit}`);
            // Save the updated combat immediately
            const updatedCombat = updatedCombats.find(c => c.id === currentCombatId);
            if (updatedCombat) {
                console.log(`Saving combat with updated initiative for ${id}: ${newInit}`);
                // Use setTimeout to ensure the state update completes first
                setTimeout(() => {
                    storeCombatToFile(updatedCombat);
                    console.log(`Combat saved for ${id} with initiative ${newInit}`);
                }, 0);
            }
            return updatedCombats;
        });
    };

    const updateInitiativeForGroup = (name: string, newInit: number) => {
        console.log(`updateInitiativeForGroup called: name=${name}, newInit=${newInit}, currentCombatId=${currentCombatId}`);
        if (!currentCombatId) return;
        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === currentCombatId
                    ? {
                        ...c,
                        combatants: (c.combatants || []).map(comb =>
                            comb.name === name
                                ? { ...comb, initiative: newInit }
                                : comb
                        )
                    }
                    : c
            );
            // Save the updated combat immediately
            const updatedCombat = updatedCombats.find(c => c.id === currentCombatId);
            if (updatedCombat) {
                // Use setTimeout to ensure the state update completes first
                setTimeout(() => {
                    storeCombatToFile(updatedCombat);
                }, 0);
            }
            return updatedCombats;
        });
    };

    const updateInitiativeBonus = (id: string, newBonus: number) => {
        if (!currentCombatId) return;
        setCombats(prev => {
            const updatedCombats = prev.map(c =>
                c.id === currentCombatId
                    ? {
                        ...c,
                        combatants: (c.combatants || []).map(comb =>
                            comb.id === id
                                ? { ...comb, initiativeBonus: newBonus }
                                : comb
                        )
                    }
                    : c
            );
            // Save the updated combat immediately
            const updatedCombat = updatedCombats.find(c => c.id === currentCombatId);
            if (updatedCombat) {
                // Use setTimeout to ensure the state update completes first
                setTimeout(() => {
                    storeCombatToFile(updatedCombat);
                }, 0);
            }
            return updatedCombats;
        });
    };

    const updateCombatantConditions = (id: string, conditions: string[]) => {
        if (!currentCombatId) return;

        // Clean conditions: remove empty strings and trim whitespace
        const cleanedConditions = conditions
            .filter(condition => condition && condition.trim() !== '')
            .map(condition => condition.trim());

        setCombats(prev => prev.map(c =>
            c.id === currentCombatId
                ? {
                    ...c,
                    combatants: (c.combatants || []).map(comb =>
                        comb.id === id
                            ? { ...comb, conditions: cleanedConditions }
                            : comb
                    )
                }
                : c
        ));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) {
            storeCombatToFile({
                ...updatedCombat,
                combatants: (updatedCombat.combatants || []).map(comb =>
                    comb.id === id ? { ...comb, conditions: cleanedConditions } : comb
                )
            });
        }
    };

    const updateCombatantNote = (id: string, note: string) => {
        if (!currentCombatId) return;

        // Update individual combatant note
        setCombats(prev => prev.map(c =>
            c.id === currentCombatId
                ? {
                    ...c,
                    combatants: (c.combatants || []).map(comb =>
                        comb.id === id
                            ? { ...comb, note }
                            : comb
                    )
                }
                : c
        ));

        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) {
            storeCombatToFile({
                ...updatedCombat,
                combatants: (updatedCombat.combatants || []).map(comb =>
                    comb.id === id ? { ...comb, note } : comb
                )
            });
        }
    };

    const updateCombat = (id: string, updates: { name?: string; description?: string; campaignId?: string }) => {
        setCombats(prev => prev.map(c =>
            c.id === id
                ? { ...c, ...updates }
                : c
        ));

        // Save
        const updatedCombat = combats.find(c => c.id === id);
        if (updatedCombat) {
            storeCombatToFile({ ...updatedCombat, ...updates });
        }
    };

    // Grouping logic
    const isGroupEnabled = (nameOrigin: string) => {
        if (!currentCombat) return false;
        // Default to false (ungrouped) if not set
        return (currentCombat.groupByName || {})[nameOrigin] === true;
    };

    const toggleGroupForName = (nameOrigin: string) => {
        if (!currentCombatId) return;
        setCombats(prev => prev.map(c =>
            c.id === currentCombatId
                ? {
                    ...c,
                    groupByName: {
                        ...(c.groupByName || {}),
                        [nameOrigin]: !((c.groupByName || {})[nameOrigin] === true)
                    }
                }
                : c
        ));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) {
            const newGroupByName = { ...(updatedCombat.groupByName || {}), [nameOrigin]: !((updatedCombat.groupByName || {})[nameOrigin] === true) };
            storeCombatToFile({ ...updatedCombat, groupByName: newGroupByName });
        }
    };

    const setGroupForName = (nameOrigin: string, value: boolean) => {
        if (!currentCombatId) return;
        setCombats(prev => prev.map(c =>
            c.id === currentCombatId
                ? {
                    ...c,
                    groupByName: {
                        ...(c.groupByName || {}),
                        [nameOrigin]: value
                    }
                }
                : c
        ));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) storeCombatToFile({ ...updatedCombat, groupByName: { ...(updatedCombat.groupByName || {}), [nameOrigin]: value } });
    };

    const clearCombat = () => {
        if (!currentCombatId) return;

        setCombats(prev => prev.map(c => {
            if (c.id !== currentCombatId) return c;

            // Clear all combatants and reset groups
            return {
                ...c,
                combatants: [],
                groupByName: {},
                started: false,
                round: undefined,
                turnIndex: undefined
            };
        }));

        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) {
            storeCombatToFile({
                ...updatedCombat,
                combatants: [],
                groupByName: {},
                started: false,
                round: undefined,
                turnIndex: undefined
            });
        }
    };

    const resetCombatGroups = () => {
        if (!currentCombatId) return;

        setCombats(prev => prev.map(c => {
            if (c.id !== currentCombatId) return c;

            // Clear all existing groups
            const newGroupByName: { [nameOrigin: string]: boolean } = {};

            // Reanalyze current combatants and create new groups following the rules
            const groups: { [nameOrigin: string]: Combatant[] } = {};
            c.combatants.forEach(combatant => {
                const nameOrigin = `${normalizeString(combatant.name)}-${normalizeString(combatant.source)}`;
                if (!groups[nameOrigin]) {
                    groups[nameOrigin] = [];
                }
                groups[nameOrigin].push(combatant);
            });

            // Apply grouping rules:
            // 1. If only one combatant with this name-origin, don't group (no need)
            // 2. If multiple combatants with same name-origin, group by default (true)
            Object.entries(groups).forEach(([nameOrigin, members]) => {
                if (members.length > 1) {
                    newGroupByName[nameOrigin] = true; // Group by default
                }
                // If only one member, don't add to groupByName (will default to false)
            });

            return { ...c, groupByName: newGroupByName };
        }));

        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) {
            const newGroupByName: { [nameOrigin: string]: boolean } = {};
            const groups: { [nameOrigin: string]: Combatant[] } = {};

            updatedCombat.combatants.forEach(combatant => {
                const nameOrigin = `${normalizeString(combatant.name)}-${normalizeString(combatant.source)}`;
                if (!groups[nameOrigin]) {
                    groups[nameOrigin] = [];
                }
                groups[nameOrigin].push(combatant);
            });

            Object.entries(groups).forEach(([nameOrigin, members]) => {
                if (members.length > 1) {
                    newGroupByName[nameOrigin] = true;
                }
            });

            storeCombatToFile({ ...updatedCombat, groupByName: newGroupByName });
        }
    };

    // Helper function to sort combatants considering groups
    const sortCombatantsWithGroups = (combatants: Combatant[], groupByName: { [nameOrigin: string]: boolean }) => {
    // Group combatants by name-origin
        const groups = new Map<string, Combatant[]>();
        combatants.forEach(c => {
            const nameOrigin = `${normalizeString(c.name)}-${normalizeString(c.source)}`;
            if (!groups.has(nameOrigin)) {
                groups.set(nameOrigin, []);
            }
      groups.get(nameOrigin)!.push(c);
        });

        // Create a list of combatants in the correct order
        const sortedCombatants: Combatant[] = [];

        // Get turn order to determine the correct sequence
        const turnOrder = getTurnOrder(combatants, groupByName);

        // For each turn in the order, add the corresponding combatants
        turnOrder.forEach(turn => {
            turn.ids.forEach(id => {
                const combatant = combatants.find(c => c.id === id);
                if (combatant) {
                    sortedCombatants.push(combatant);
                }
            });
        });

        return sortedCombatants;
    };

    const startCombat = () => {
        if (!currentCombatId) return;
        setCombats(prev => prev.map(c => {
            if (c.id !== currentCombatId) return c;
            // Sort combatants considering groups
            const sorted = sortCombatantsWithGroups(c.combatants || [], c.groupByName || {});
            return {
                ...c,
                combatants: sorted,
                round: 1,
                turnIndex: 0,
                started: true,
            };
        }));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) storeCombatToFile({ ...updatedCombat, round: 1, turnIndex: 0, started: true });
    };

    const stopCombat = () => {
        if (!currentCombatId) return;
        setCombats(prev => prev.map(c => {
            if (c.id !== currentCombatId) return c;
            return {
                ...c,
                started: false,
                round: undefined,
                turnIndex: undefined,
            };
        }));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) storeCombatToFile({ ...updatedCombat, started: false, round: undefined, turnIndex: undefined });
    };

    const nextTurn = () => {
        if (!currentCombatId) return;
        setCombats(prev => prev.map(c => {
            if (c.id !== currentCombatId) return c;
            if (!c.started) return c;
            const turnOrder = getTurnOrder(c.combatants || [], c.groupByName || {});
            const numTurns = turnOrder.length;
            if (numTurns === 0) return c;
            let nextTurnIndex = (c.turnIndex ?? 0) + 1;
            let nextRound = c.round ?? 1;
            if (nextTurnIndex >= numTurns) {
                nextTurnIndex = 0;
                nextRound += 1;
            }
            return {
                ...c,
                turnIndex: nextTurnIndex,
                round: nextRound,
            };
        }));
        // Save
        const updatedCombat = combats.find(c => c.id === currentCombatId);
        if (updatedCombat) {
            const turnOrder = getTurnOrder(updatedCombat.combatants || [], updatedCombat.groupByName || {});
            const numTurns = turnOrder.length;
            let nextTurnIndex = (updatedCombat.turnIndex ?? 0) + 1;
            let nextRound = updatedCombat.round ?? 1;
            if (nextTurnIndex >= numTurns) {
                nextTurnIndex = 0;
                nextRound += 1;
            }
            storeCombatToFile({ ...updatedCombat, turnIndex: nextTurnIndex, round: nextRound });
        }
    };

    // Helper to get turn order based on grouping
    function getTurnOrder(combatants: Combatant[], groupByName: { [nameOrigin: string]: boolean }) {
    // Group combatants by name-origin
        const groups = new Map<string, Combatant[]>();
        combatants.forEach(c => {
            const nameOrigin = `${normalizeString(c.name)}-${normalizeString(c.source)}`;
            if (!groups.has(nameOrigin)) {
                groups.set(nameOrigin, []);
            }
      groups.get(nameOrigin)!.push(c);
        });
        // Build turn order: grouped = one entry per group, ungrouped = each individual
        let turnOrder: { ids: string[], name: string, initiative: number }[] = [];
        Array.from(groups.entries()).forEach(([nameOrigin, members]) => {
            if (groupByName[nameOrigin]) {
                // Grouped: one turn for all
                turnOrder.push({ ids: members.map(m => m.id), name: members[0].name, initiative: Math.max(...members.map(m => m.initiative)) });
            } else {
                // Ungrouped: each is its own turn
                members.forEach(m => {
                    turnOrder.push({ ids: [m.id], name: m.name, initiative: m.initiative });
                });
            }
        });
        // Sort by initiative descending
        turnOrder.sort((a, b) => b.initiative - a.initiative);
        return turnOrder;
    }

    const addPlayerCombatant = (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, initiativeBonus?: number, tokenUrl?: string }) => {
        if (!currentCombatId) return;
        const id = `player-${player.name}-${Date.now()}-${Math.random()}`;
        const newCombatant = {
            id,
            name: player.name,
            source: 'player',
            maxHp: player.maxHp || 0,
            currentHp: player.maxHp || 0,
            initiative: 0,
            initiativeBonus: player.initiativeBonus || 0, // Use player's initiative bonus or default to 0
            ac: player.ac || 0,
            passivePerception: player.passivePerception || 10,
            color: undefined,
            tokenUrl: player.tokenUrl || DEFAULT_PLAYER_TOKEN,
            race: player.race,
            class: player.class
        };
        setCombats(prev => prev.map(c =>
            c.id === currentCombatId
                ? { ...c, combatants: [...(c.combatants || []), newCombatant] }
                : c
        ));
    };

    // Sync all player combatants in all combats when a player is edited
    const syncPlayerCombatants = (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, initiativeBonus?: number, tokenUrl?: string }) => {
        setCombats(prev => prev.map(combat => ({
            ...combat,
            combatants: (combat.combatants || []).map(comb =>
                comb.source === 'player' && comb.name === player.name
                    ? {
                        ...comb,
                        race: player.race,
                        class: player.class,
                        maxHp: player.maxHp || 0,
                        ac: player.ac || 0,
                        passivePerception: player.passivePerception || 10,
                        initiativeBonus: player.initiativeBonus || 0,
                        tokenUrl: player.tokenUrl || comb.tokenUrl,
                    }
                    : comb
            )
        })));
    };

    // Set a combat as active/inactive (only one can be active at a time)
    const setCombatActive = (id: string, active: boolean) => {
        setCombats(prev => prev.map(combat => ({
            ...combat,
            isActive: active ? (combat.id === id) : false // If setting active, only this one is active. If setting inactive, none are active.
        })));
    };

    // Get combats sorted by: started first, then by name (alphabetically)
    const getSortedCombats = useCallback((campaignId?: string | null): Combat[] => {
    // Filter combats by campaign if campaignId is provided
        let filteredCombats = combats;
        if (campaignId) {
            // Filter by specific campaign
            filteredCombats = combats.filter(combat => combat.campaignId === campaignId);
        } else {
            // Show all combats when no campaign is selected (null or undefined)
            filteredCombats = combats;
        }

        // Ensure all combats have required properties
        const normalizedCombats = filteredCombats.map(combat => ({
            ...combat,
            combatants: combat.combatants || [],
            groupByName: combat.groupByName || {},
            started: combat.started || false
        }));

        return normalizedCombats.sort((a, b) => {
            // Started combats first
            if (a.started && !b.started) return -1;
            if (!a.started && b.started) return 1;
            // Then by name (alphabetically)
            return a.name.localeCompare(b.name);
        });
    }, [combats]);

    // Reload combats from storage
    const reloadCombats = async (): Promise<void> => {
        try {
            console.log('Reloading combats from storage...');
            const combatIndexes = await loadCombatsIndexFromFile();
            console.log('Reloaded combat indexes:', combatIndexes);

            if (combatIndexes && combatIndexes.length > 0) {
                console.log('Total reloaded combat indexes:', combatIndexes.length);

                // Load full combat data for each combat
                const loadedCombats = await Promise.all(combatIndexes.map(async (combatIndex, index) => {
                    try {
                        const fullCombat = await loadCombatFromFile(combatIndex.file);
                        if (fullCombat) {
                            console.log(`✅ Successfully reloaded combat: ${fullCombat.name} (ID: ${fullCombat.id})`);
                            return fullCombat;
                        } else {
                            console.warn(`❌ Failed to reload full combat for ${combatIndex.name}`);
                            return null;
                        }
                    } catch (error) {
                        console.error(`❌ Error reloading combat ${combatIndex.name}:`, error);
                        return null;
                    }
                }));

                // Filter out null values and update token URLs
                const validCombats = loadedCombats.filter(combat => combat !== null);
                const updatedCombats = await Promise.all(validCombats.map(async (combat) => {
                    if (combat.combatants && combat.combatants.length > 0) {
                        const updatedCombatants = await Promise.all(combat.combatants.map(async (combatant: Combatant) => {
                            if (combatant.tokenUrl && combatant.tokenUrl.startsWith('http')) {
                                try {
                                    const cachedUrl = await getCachedTokenUrl(combatant.source, combatant.name);
                                    if (cachedUrl) {
                                        return { ...combatant, tokenUrl: cachedUrl };
                                    }
                                } catch (error) {
                                    console.error(`Error updating token URL for ${combatant.name}:`, error);
                                }
                            }
                            return combatant;
                        }));
                        return { ...combat, combatants: updatedCombatants };
                    }
                    return combat;
                }));

                setCombats(updatedCombats);
                // Clear current combat when reloading
                setCurrentCombatId(null);
            } else {
                console.log('No combats found during reload');
                setCombats([]);
                setCurrentCombatId(null);
            }
        } catch (error) {
            console.error('Error reloading combats:', error);
        }
    };

    return (
        <CombatContext.Provider value={{
            combats,
            currentCombatId,
            currentCombat,
            combatants,
            groupByName,
            createCombat,
            selectCombat,
            clearCurrentCombat,
            deleteCombat,
            archiveCombat,
            resetCombat,
            addCombatant,
            addCombatantToCombat,
            removeCombatant,
            updateHp,
            updateMaxHp,
            updateAc,
            updateColor,
            updateInitiative,
            updateInitiativeForGroup,
            updateInitiativeBonus,
            isGroupEnabled,
            toggleGroupForName,
            setGroupForName,
            clearCombat,
            resetCombatGroups,
            startCombat,
            stopCombat,
            nextTurn,
            getTurnOrder: (combatants: Combatant[], groupByName: { [name: string]: boolean }) => getTurnOrder(combatants, groupByName),
            addPlayerCombatant,
            syncPlayerCombatants,
            updateCombatantConditions,
            updateCombatantNote,
            setCombatActive,
            updateCombat,
            getSortedCombats,
            reloadCombats,
        }}>
            {children}
        </CombatContext.Provider>
    );
};

export function useCombat() {
    const ctx = useContext(CombatContext);
    if (!ctx) throw new Error('useCombat must be used within a CombatProvider');
    return ctx;
}
