import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { extractACValue } from '../components/beasts/BeastDetailModal';
import { calculatePassivePerception } from '../utils/beastUtils';
import { DEFAULT_CREATURE_TOKEN, DEFAULT_PLAYER_TOKEN } from '../constants/tokens';
import { deleteCombatFile, loadCombatFromFile, loadCombatsIndexFromFile, storeCombatToFile } from '../utils/fileStorage';
import { getTokenUrl, getCachedTokenUrl } from '../utils/tokenCache';
import { normalizeString } from '../utils/stringUtils';

export interface Combatant {
  id: string; // unique (name+index or uuid)
  name: string;
  source: string;
  tokenUrl?: string;
  maxHp: number;
  currentHp: number;
  initiative: number;
  ac: number; // Armor Class
  passivePerception?: number; // Passive Perception
  color?: string; // Custom color for the beast container
  conditions?: string[]; // Status conditions for the combatant
  note?: string; // Short note about the combatant
}

export interface Combat {
  id: string;
  name: string;
  createdAt: number;
  combatants: Combatant[];
  groupByName: { [name: string]: boolean };
  round?: number;
  turnIndex?: number;
  started?: boolean;
  isActive?: boolean; // Marks if this combat is currently active/in progress
}

interface CombatContextType {
  combats: Combat[];
  currentCombatId: string | null;
  currentCombat: Combat | null;
  combatants: Combatant[];
  groupByName: { [name: string]: boolean };
  createCombat: (name: string) => string;
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
  isGroupEnabled: (name: string) => boolean;
  toggleGroupForName: (name: string) => void;
  setGroupForName: (name: string, value: boolean) => void;
  clearCombat: () => void;
  startCombat: () => void;
  nextTurn: () => void;
  getTurnOrder: (combatants: Combatant[], groupByName: { [name: string]: boolean }) => { ids: string[], name: string, initiative: number }[];
  addPlayerCombatant: (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, tokenUrl?: string }) => void;
  syncPlayerCombatants: (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, tokenUrl?: string }) => void;
  updateCombatantConditions: (id: string, conditions: string[]) => void;
  updateCombatantNote: (id: string, note: string) => void;
  setCombatActive: (id: string, active: boolean) => void;
  getSortedCombats: () => Combat[];
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
    console.warn(`Could not determine maxHp for monster:`, monster);
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
  const [loading, setLoading] = useState(true);

  // Load combats from file storage on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log('Loading combats from storage...');
      const loadedCombats = await loadCombatsIndexFromFile();
      console.log('Loaded combats:', loadedCombats);
      
      if (loadedCombats && loadedCombats.length > 0) {
        console.log('Total loaded combats:', loadedCombats.length);
        
        // Update token URLs for existing combats
        const updatedCombats = await Promise.all(loadedCombats.map(async (combat) => {
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
                  console.error(`Error updating token URL for ${combatant.name}:`, error);
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
      setLoading(false);
    })();
  }, []);



  // Get current combat
  const currentCombat = combats.find(c => c.id === currentCombatId) || null;
  const combatants = currentCombat?.combatants || [];
  const groupByName = currentCombat?.groupByName || {};

  const createCombat = (name: string): string => {
    const id = `combat-${Date.now()}-${Math.random()}`;
    const newCombat: Combat = {
      id,
      name,
      createdAt: Date.now(),
      combatants: [],
      groupByName: {}, // All names will be grouped by default as they are added
    };
    setCombats(prev => [...prev, newCombat]);
    setCurrentCombatId(id);
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
      ac: extractACValue(monster.ac), // Extract AC from monster.ac
      passivePerception: calculatePassivePerception(monster), // Calculate passive perception
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
      console.warn(`Could not determine maxHp for monster:`, monster);
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
      ac: extractACValue(monster.ac), // Extract AC from monster.ac
      passivePerception: calculatePassivePerception(monster), // Calculate passive perception
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
    const clampedMaxHp = Math.max(1, Math.min(999, newMaxHp));
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
                      currentHp: Math.min(comb.currentHp, clampedMaxHp)
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
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
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
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: (updatedCombat.combatants || []).map(comb => comb.id === id ? { ...comb, initiative: newInit } : comb) });
  };

  const updateInitiativeForGroup = (name: string, newInit: number) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
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
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: (updatedCombat.combatants || []).map(comb => comb.name === name ? { ...comb, initiative: newInit } : comb) });
  };

  const updateCombatantConditions = (id: string, conditions: string[]) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? {
            ...c,
            combatants: (c.combatants || []).map(comb =>
              comb.id === id
                ? { ...comb, conditions }
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
          comb.id === id ? { ...comb, conditions } : comb
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



  // Grouping logic
  const isGroupEnabled = (name: string) => {
    if (!currentCombat) return true;
    // Default to true (grouped) if not set
    return (currentCombat.groupByName || {})[name] !== false;
  };

  const toggleGroupForName = (name: string) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? {
            ...c,
            groupByName: {
              ...(c.groupByName || {}),
              [name]: !((c.groupByName || {})[name] !== false)
            }
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) {
      const newGroupByName = { ...(updatedCombat.groupByName || {}), [name]: !((updatedCombat.groupByName || {})[name] !== false) };
      storeCombatToFile({ ...updatedCombat, groupByName: newGroupByName });
    }
  };

  const setGroupForName = (name: string, value: boolean) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? {
            ...c,
            groupByName: {
              ...(c.groupByName || {}),
              [name]: value
            }
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, groupByName: { ...(updatedCombat.groupByName || {}), [name]: value } });
  };

  const clearCombat = () => {
    if (!currentCombatId) return;
    
    setCombats(prev => prev.map(c => {
      if (c.id !== currentCombatId) return c;
      
      // Regenerate groupByName based on current combatants using normalized name-source format
      const groups: { [nameOrigin: string]: Combatant[] } = {};
      c.combatants.forEach(combatant => {
        const nameOrigin = `${normalizeString(combatant.name)}-${normalizeString(combatant.source)}`;
        if (!groups[nameOrigin]) {
          groups[nameOrigin] = [];
        }
        groups[nameOrigin].push(combatant);
      });
      
      const newGroupByName: { [nameOrigin: string]: boolean } = {};
      Object.entries(groups).forEach(([nameOrigin, members]) => {
        // If there's more than one combatant of the same name-origin, group them by default
        newGroupByName[nameOrigin] = members.length > 1;
      });
      
      return { ...c, groupByName: newGroupByName };
    }));
    
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) {
      const groups: { [nameOrigin: string]: Combatant[] } = {};
      updatedCombat.combatants.forEach(combatant => {
        const nameOrigin = `${normalizeString(combatant.name)}-${normalizeString(combatant.source)}`;
        if (!groups[nameOrigin]) {
          groups[nameOrigin] = [];
        }
        groups[nameOrigin].push(combatant);
      });
      
      const newGroupByName: { [nameOrigin: string]: boolean } = {};
      Object.entries(groups).forEach(([nameOrigin, members]) => {
        newGroupByName[nameOrigin] = members.length > 1;
      });
      
      storeCombatToFile({ ...updatedCombat, groupByName: newGroupByName });
    }
  };

  const startCombat = () => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => {
      if (c.id !== currentCombatId) return c;
      // Sort combatants by initiative descending
      const sorted = [...(c.combatants || [])].sort((a, b) => b.initiative - a.initiative);
      const turnOrder = getTurnOrder(sorted, c.groupByName || {});
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
  function getTurnOrder(combatants: Combatant[], groupByName: { [name: string]: boolean }) {
    // Group combatants by name
    const groups = new Map<string, Combatant[]>();
    combatants.forEach(c => {
      if (!groups.has(c.name)) {
        groups.set(c.name, []);
      }
      groups.get(c.name)!.push(c);
    });
    // Build turn order: grouped = one entry per group, ungrouped = each individual
    let turnOrder: { ids: string[], name: string, initiative: number }[] = [];
    Array.from(groups.entries()).forEach(([name, members]) => {
      if (groupByName[name]) {
        // Grouped: one turn for all
        turnOrder.push({ ids: members.map(m => m.id), name, initiative: Math.max(...members.map(m => m.initiative)) });
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

  const addPlayerCombatant = (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, tokenUrl?: string }) => {
    if (!currentCombatId) return;
    const id = `player-${player.name}-${Date.now()}-${Math.random()}`;
    const newCombatant = {
      id,
      name: player.name,
      source: 'player',
      maxHp: player.maxHp || 0,
      currentHp: player.maxHp || 0,
      initiative: 0,
      ac: player.ac || 0,
      passivePerception: player.passivePerception || 10,
      color: undefined,
      tokenUrl: player.tokenUrl || DEFAULT_PLAYER_TOKEN
    };
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? { ...c, combatants: [...(c.combatants || []), newCombatant] }
        : c
    ));
};

  // Sync all player combatants in all combats when a player is edited
  const syncPlayerCombatants = (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, passivePerception?: number, tokenUrl?: string }) => {
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

  // Get combats sorted by: active first, then by creation date (newest first)
  const getSortedCombats = (): Combat[] => {
    // Ensure all combats have required properties
    const normalizedCombats = combats.map(combat => ({
      ...combat,
      combatants: combat.combatants || [],
      groupByName: combat.groupByName || {},
      isActive: combat.isActive || false
    }));
    
    return normalizedCombats.sort((a, b) => {
      // Active combats first
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      // Then by creation date (newest first)
      return b.createdAt - a.createdAt;
    });
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
      isGroupEnabled,
      toggleGroupForName,
      setGroupForName,
      clearCombat,
      startCombat,
      nextTurn,
      getTurnOrder: (combatants: Combatant[], groupByName: { [name: string]: boolean }) => getTurnOrder(combatants, groupByName),
      addPlayerCombatant,
      syncPlayerCombatants,
      updateCombatantConditions,
      updateCombatantNote,
      setCombatActive,
      getSortedCombats,
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