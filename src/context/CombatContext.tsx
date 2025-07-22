import React, { createContext, useContext, useEffect, useState } from 'react';
import { extractACValue } from '../components/BeastDetailModal';
import { deleteCombatFile, loadCombatFromFile, loadCombatsIndexFromFile, storeCombatToFile } from '../utils/fileStorage';

export interface Combatant {
  id: string; // unique (name+index or uuid)
  name: string;
  source: string;
  tokenUrl?: string;
  maxHp: number;
  currentHp: number;
  initiative: number;
  ac: number; // Armor Class
  color?: string; // Custom color for the beast container
  conditions?: string[]; // Status conditions for the combatant
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
  addCombatant: (monster: any) => void;
  addCombatantToCombat: (monster: any, combatId: string) => void;
  removeCombatant: (id: string) => void;
  updateHp: (id: string, newHp: number) => void;
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
  addPlayerCombatant: (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, tokenUrl?: string }) => void;
  syncPlayerCombatants: (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, tokenUrl?: string }) => void;
  updateCombatantConditions: (id: string, conditions: string[]) => void;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

// Provides combat state and actions for managing combats and combatants.
export const CombatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [combats, setCombats] = useState<Combat[]>([]);
  const [currentCombatId, setCurrentCombatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load combats from file storage on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const index = await loadCombatsIndexFromFile();
      if (index && index.length > 0) {
        const loadedCombats: Combat[] = [];
        for (const entry of index) {
          const combat = await loadCombatFromFile(entry.file);
          if (combat) loadedCombats.push(combat);
        }
        setCombats(loadedCombats);
        setCurrentCombatId(loadedCombats[0]?.id || null);
      }
      setLoading(false);
    })();
  }, []);

  // Save all combats to file storage whenever they change
  useEffect(() => {
    if (loading) return;
    combats.forEach(combat => {
      storeCombatToFile(combat);
    });
  }, [combats, loading]);

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

  const addCombatant = (monster: any) => {
    if (!currentCombatId) return;
    
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
    // Get token url
    let tokenUrl = undefined;
    if (monster.source && monster.name) {
      // Most monsters from 5e.tools have tokens, so we'll try to load them
      // The token URL follows the pattern: https://5e.tools/img/bestiary/tokens/{source}/{name}.webp
      tokenUrl = `https://5e.tools/img/bestiary/tokens/${monster.source}/${encodeURIComponent(monster.name)}.webp`;
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
    };

    setCombats(prev => prev.map(c => 
      c.id === currentCombatId 
        ? { ...c, combatants: [...c.combatants, newCombatant] }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: [...updatedCombat.combatants, newCombatant] });
  };

  const addCombatantToCombat = (monster: any, combatId: string) => {
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
    // Get token url
    let tokenUrl = undefined;
    if (monster.source && monster.name) {
      // Most monsters from 5e.tools have tokens, so we'll try to load them
      // The token URL follows the pattern: https://5e.tools/img/bestiary/tokens/{source}/{name}.webp
      tokenUrl = `https://5e.tools/img/bestiary/tokens/${monster.source}/${encodeURIComponent(monster.name)}.webp`;
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
    };

    setCombats(prev => prev.map(c => 
      c.id === combatId 
        ? { ...c, combatants: [...c.combatants, newCombatant] }
        : c
    ));
    // Save
    storeCombatToFile({ ...combat, combatants: [...combat.combatants, newCombatant] });
  };

  const removeCombatant = (id: string) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
      c.id === currentCombatId 
        ? { ...c, combatants: c.combatants.filter(comb => comb.id !== id) }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: updatedCombat.combatants.filter(comb => comb.id !== id) });
  };

  const updateHp = (id: string, newHp: number) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
      c.id === currentCombatId 
        ? { 
            ...c, 
            combatants: c.combatants.map(comb => 
              comb.id === id 
                ? { ...comb, currentHp: Math.max(0, Math.min(newHp, comb.maxHp)) }
                : comb
            )
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: updatedCombat.combatants.map(comb => comb.id === id ? { ...comb, currentHp: Math.max(0, Math.min(newHp, comb.maxHp)) } : comb) });
  };

  const updateAc = (id: string, newAc: number) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
      c.id === currentCombatId 
        ? { 
            ...c, 
            combatants: c.combatants.map(comb => 
              comb.id === id 
                ? { ...comb, ac: Math.max(0, newAc) }
                : comb
            )
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: updatedCombat.combatants.map(comb => comb.id === id ? { ...comb, ac: Math.max(0, newAc) } : comb) });
  };

  const updateColor = (id: string, color: string | null) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
      c.id === currentCombatId 
        ? { 
            ...c, 
            combatants: c.combatants.map(comb => 
              comb.id === id 
                ? { ...comb, color: color || undefined }
                : comb
            )
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: updatedCombat.combatants.map(comb => comb.id === id ? { ...comb, color: color || undefined } : comb) });
  };

  const updateInitiative = (id: string, newInit: number) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
      c.id === currentCombatId 
        ? { 
            ...c, 
            combatants: c.combatants.map(comb => 
              comb.id === id 
                ? { ...comb, initiative: newInit }
                : comb
            )
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: updatedCombat.combatants.map(comb => comb.id === id ? { ...comb, initiative: newInit } : comb) });
  };

  const updateInitiativeForGroup = (name: string, newInit: number) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => 
      c.id === currentCombatId 
        ? { 
            ...c, 
            combatants: c.combatants.map(comb => 
              comb.name === name 
                ? { ...comb, initiative: newInit }
                : comb
            )
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, combatants: updatedCombat.combatants.map(comb => comb.name === name ? { ...comb, initiative: newInit } : comb) });
  };

  const updateCombatantConditions = (id: string, conditions: string[]) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? {
            ...c,
            combatants: c.combatants.map(comb =>
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
        combatants: updatedCombat.combatants.map(comb =>
          comb.id === id ? { ...comb, conditions } : comb
        )
      });
    }
  };

  // Grouping logic
  const isGroupEnabled = (name: string) => {
    if (!currentCombat) return true;
    // Default to true (grouped) if not set
    return currentCombat.groupByName[name] !== false;
  };

  const toggleGroupForName = (name: string) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? {
            ...c,
            groupByName: {
              ...c.groupByName,
              [name]: !isGroupEnabled(name)
            }
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, groupByName: { ...updatedCombat.groupByName, [name]: !isGroupEnabled(name) } });
  };

  const setGroupForName = (name: string, value: boolean) => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? {
            ...c,
            groupByName: {
              ...c.groupByName,
              [name]: value
            }
          }
        : c
    ));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) storeCombatToFile({ ...updatedCombat, groupByName: { ...updatedCombat.groupByName, [name]: value } });
  };

  const clearCombat = () => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => {
      if (c.id !== currentCombatId) return c;
      if (c.started) {
        // If combat is started, just reset round/turn and stop
        return { ...c, started: false, round: 1, turnIndex: 0 };
      } else {
        // If not started, remove all combatants
        return { ...c, combatants: [] };
      }
    }));
    // Save
    const updatedCombat = combats.find(c => c.id === currentCombatId);
    if (updatedCombat) {
      if (updatedCombat.started) {
        storeCombatToFile({ ...updatedCombat, started: false, round: 1, turnIndex: 0 });
      } else {
        storeCombatToFile({ ...updatedCombat, combatants: [] });
      }
    }
  };

  const startCombat = () => {
    if (!currentCombatId) return;
    setCombats(prev => prev.map(c => {
      if (c.id !== currentCombatId) return c;
      // Sort combatants by initiative descending
      const sorted = [...c.combatants].sort((a, b) => b.initiative - a.initiative);
      const turnOrder = getTurnOrder(sorted, c.groupByName);
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
      const turnOrder = getTurnOrder(c.combatants, c.groupByName);
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
      const turnOrder = getTurnOrder(updatedCombat.combatants, updatedCombat.groupByName);
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

  const addPlayerCombatant = (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, tokenUrl?: string }) => {
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
      color: undefined,
      tokenUrl: player.tokenUrl || "data:image/jpeg;base64,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"
    };
    setCombats(prev => prev.map(c =>
      c.id === currentCombatId
        ? { ...c, combatants: [...c.combatants, newCombatant] }
        : c
    ));
};

  // Sync all player combatants in all combats when a player is edited
  const syncPlayerCombatants = (player: { name: string, race: string, class: string, maxHp?: number, ac?: number, tokenUrl?: string }) => {
    setCombats(prev => prev.map(combat => ({
      ...combat,
      combatants: combat.combatants.map(comb =>
        comb.source === 'player' && comb.name === player.name
          ? {
              ...comb,
              race: player.race,
              class: player.class,
              maxHp: player.maxHp || 0,
              ac: player.ac || 0,
              tokenUrl: player.tokenUrl || comb.tokenUrl,
            }
          : comb
      )
    })));
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
      addCombatant, 
      addCombatantToCombat, 
      removeCombatant, 
      updateHp, 
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
      updateCombatantConditions, // <-- expose here
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