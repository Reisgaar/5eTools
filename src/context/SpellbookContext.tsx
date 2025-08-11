import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadSpellbooksFromFile, saveSpellbooksToFile, addSpellToSpellbook, removeSpellFromSpellbook, createSpellbook, deleteSpellbook } from '../utils/fileStorage';
import { Spellbook, SpellbookSpell } from '../utils/types';

interface SpellbookContextType {
  spellbooks: Spellbook[];
  currentSpellbookId: string | null;
  createSpellbook: (name: string, description?: string, campaignId?: string) => string;
  deleteSpellbook: (id: string) => void;
  selectSpellbook: (id: string) => void;
  clearSpellbookSelection: () => void;
  addSpellToSpellbook: (spellbookId: string, spellName: string, spellSource: string, spellDetails?: any) => void;
  removeSpellFromSpellbook: (spellbookId: string, spellName: string, spellSource: string) => void;
  isSpellInSpellbook: (spellbookId: string, spellName: string, spellSource: string) => boolean;
  getCurrentSpellbook: () => Spellbook | null;
  getSpellbooksByCampaign: (campaignId?: string | null) => Spellbook[];
  getSpellbookSpells: (spellbookId: string) => SpellbookSpell[];
  loadSpellbooks: () => Promise<void>;
}

const SpellbookContext = createContext<SpellbookContextType | null>(null);

export const SpellbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spellbooks, setSpellbooks] = useState<Spellbook[]>([]);
  const [currentSpellbookId, setCurrentSpellbookId] = useState<string | null>(null);

  // Load spellbooks on mount
  useEffect(() => {
    loadSpellbooks();
  }, []);

  const loadSpellbooks = async () => {
    try {
      const loadedSpellbooks = await loadSpellbooksFromFile();
      
      // Ensure all spellbooks have a valid spellsIndex array
      const validatedSpellbooks = loadedSpellbooks.map(spellbook => ({
        ...spellbook,
        spellsIndex: spellbook.spellsIndex || []
      }));
      
      setSpellbooks(validatedSpellbooks);
      
      // Select the first spellbook if none is selected
      if (validatedSpellbooks.length > 0 && !currentSpellbookId) {
        setCurrentSpellbookId(validatedSpellbooks[0].id);
      }
    } catch (error) {
      console.error('Error loading spellbooks:', error);
    }
  };

  const createSpellbook = (name: string, description?: string, campaignId?: string): string => {
    const id = `spellbook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newSpellbook: Spellbook = {
      id,
      name,
      description,
      spellsIndex: [],
      createdAt: now,
      updatedAt: now,
      campaignId, // Add campaign ID if provided
    };

    setSpellbooks(prev => [...prev, newSpellbook]);
    setCurrentSpellbookId(id);
    
    // Save to storage
    saveSpellbooksToFile([...spellbooks, newSpellbook]);
    
    return id;
  };

  const deleteSpellbook = (id: string) => {
    setSpellbooks(prev => {
      const updated = prev.filter(spellbook => spellbook.id !== id);
      saveSpellbooksToFile(updated);
      
      // If we deleted the current spellbook, select another one
      if (currentSpellbookId === id) {
        setCurrentSpellbookId(updated.length > 0 ? updated[0].id : null);
      }
      
      return updated;
    });
  };

  const selectSpellbook = (id: string) => {
    setCurrentSpellbookId(id);
  };

  const clearSpellbookSelection = () => {
    setCurrentSpellbookId(null);
  };

  const addSpellToSpellbook = (spellbookId: string, spellName: string, spellSource: string, spellDetails?: any) => {
    setSpellbooks(prev => {
      const updated = prev.map(spellbook => {
        if (spellbook.id === spellbookId) {
          // Ensure spellsIndex exists
          const spellsIndex = spellbook.spellsIndex || [];
          
          // Check if spell already exists in spellsIndex
          const spellExists = spellsIndex.some(spell => 
            spell.name === spellName && spell.source === spellSource
          );
          
          if (!spellExists) {
            const newSpellIndex: SpellbookSpell = {
              name: spellName,
              source: spellSource,
              level: spellDetails?.level || 0,
              school: spellDetails?.school || '',
              ritual: spellDetails?.ritual || false,
              concentration: spellDetails?.concentration || false,
              availableClasses: spellDetails?.availableClasses || []
            };
            
            return {
              ...spellbook,
              spellsIndex: [...spellsIndex, newSpellIndex],
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return spellbook;
      });
      
      saveSpellbooksToFile(updated);
      return updated;
    });
  };

  const removeSpellFromSpellbook = (spellbookId: string, spellName: string, spellSource: string) => {
    setSpellbooks(prev => {
      const updated = prev.map(spellbook => {
        if (spellbook.id === spellbookId) {
          const spellsIndex = spellbook.spellsIndex || [];
          return {
            ...spellbook,
            spellsIndex: spellsIndex.filter(spell => 
              !(spell.name === spellName && spell.source === spellSource)
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return spellbook;
      });
      
      saveSpellbooksToFile(updated);
      return updated;
    });
  };

  const isSpellInSpellbook = (spellbookId: string, spellName: string, spellSource: string): boolean => {
    const spellbook = spellbooks.find(sb => sb.id === spellbookId);
    if (!spellbook) return false;
    
    const spellsIndex = spellbook.spellsIndex || [];
    return spellsIndex.some(spell => 
      spell.name === spellName && spell.source === spellSource
    );
  };

  const getCurrentSpellbook = (): Spellbook | null => {
    return spellbooks.find(sb => sb.id === currentSpellbookId) || null;
  };

  const getSpellbooksByCampaign = (campaignId?: string | null): Spellbook[] => {
    if (!campaignId) {
      // If no campaign is selected (null/undefined), show all spellbooks
      return spellbooks;
    } else {
      // Show spellbooks for the specific campaign
      return spellbooks.filter(spellbook => spellbook.campaignId === campaignId);
    }
  };

  const getSpellbookSpells = (spellbookId: string): SpellbookSpell[] => {
    const spellbook = spellbooks.find(sb => sb.id === spellbookId);
    if (!spellbook) return [];
    return spellbook.spellsIndex || [];
  };

  return (
    <SpellbookContext.Provider
      value={{
        spellbooks,
        currentSpellbookId,
        createSpellbook,
        deleteSpellbook,
        selectSpellbook,
        clearSpellbookSelection,
        addSpellToSpellbook,
        removeSpellFromSpellbook,
        isSpellInSpellbook,
        getCurrentSpellbook,
        getSpellbooksByCampaign,
        getSpellbookSpells,
        loadSpellbooks,
      }}
    >
      {children}
    </SpellbookContext.Provider>
  );
};

export function useSpellbook() {
  const ctx = useContext(SpellbookContext);
  if (!ctx) throw new Error('useSpellbook must be used within a SpellbookProvider');
  return ctx;
}
