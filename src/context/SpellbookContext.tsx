import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadSpellbooksFromFile, saveSpellbooksToFile, addSpellToSpellbook, removeSpellFromSpellbook, createSpellbook, deleteSpellbook } from '../utils/fileStorage';

interface Spellbook {
  id: string;
  name: string;
  description?: string;
  spells: string[]; // Array of spell IDs (name-source combinations)
  createdAt: string;
  updatedAt: string;
}

interface SpellbookContextType {
  spellbooks: Spellbook[];
  currentSpellbookId: string | null;
  createSpellbook: (name: string, description?: string) => string;
  deleteSpellbook: (id: string) => void;
  selectSpellbook: (id: string) => void;
  addSpellToSpellbook: (spellbookId: string, spellName: string, spellSource: string) => void;
  removeSpellFromSpellbook: (spellbookId: string, spellName: string, spellSource: string) => void;
  isSpellInSpellbook: (spellbookId: string, spellName: string, spellSource: string) => boolean;
  getCurrentSpellbook: () => Spellbook | null;
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
      setSpellbooks(loadedSpellbooks);
      
      // Select the first spellbook if none is selected
      if (loadedSpellbooks.length > 0 && !currentSpellbookId) {
        setCurrentSpellbookId(loadedSpellbooks[0].id);
      }
    } catch (error) {
      console.error('Error loading spellbooks:', error);
    }
  };

  const createSpellbook = (name: string, description?: string): string => {
    const id = `spellbook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newSpellbook: Spellbook = {
      id,
      name,
      description,
      spells: [],
      createdAt: now,
      updatedAt: now,
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

  const addSpellToSpellbook = (spellbookId: string, spellName: string, spellSource: string) => {
    const spellId = `${spellName}-${spellSource}`;
    
    setSpellbooks(prev => {
      const updated = prev.map(spellbook => {
        if (spellbook.id === spellbookId) {
          if (!spellbook.spells.includes(spellId)) {
            return {
              ...spellbook,
              spells: [...spellbook.spells, spellId],
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
    const spellId = `${spellName}-${spellSource}`;
    
    setSpellbooks(prev => {
      const updated = prev.map(spellbook => {
        if (spellbook.id === spellbookId) {
          return {
            ...spellbook,
            spells: spellbook.spells.filter(spell => spell !== spellId),
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
    
    const spellId = `${spellName}-${spellSource}`;
    return spellbook.spells.includes(spellId);
  };

  const getCurrentSpellbook = (): Spellbook | null => {
    return spellbooks.find(sb => sb.id === currentSpellbookId) || null;
  };

  return (
    <SpellbookContext.Provider
      value={{
        spellbooks,
        currentSpellbookId,
        createSpellbook,
        deleteSpellbook,
        selectSpellbook,
        addSpellToSpellbook,
        removeSpellFromSpellbook,
        isSpellInSpellbook,
        getCurrentSpellbook,
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
