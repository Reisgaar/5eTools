import React, { createContext, useContext, useEffect, useState } from 'react';
import { bestiaryGetRequests, spellsGetRequests } from '../constants/requests';
import {
    clearBeastsAndSpellsOnly,
    loadBeastsIndexFromFile,
    loadMonsterFromFile,
    loadSpellFromFile,
    loadSpellsIndexFromFile,
    storeBeastsToFile,
    storeSpellsToFile
} from '../utils/fileStorage';

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
  classes: any;
  ritual: boolean;
  concentration: boolean;
  file: string;
}

interface DataContextType {
  beasts: Beast[];
  simpleBeasts: { name: string; CR: string | number; source: string; ac: any }[];
  spells: Spell[];
  simpleSpells: { name: string; level: number; school: string; source: string }[];
  isLoading: boolean;
  isInitialized: boolean;
  loadData: () => Promise<void>;
  reloadData: () => Promise<void>;
  clearData: () => Promise<void>;
  getFullBeast: (name: string, source: string) => Promise<Beast | null>;
  getFullSpell: (name: string, source: string) => Promise<Spell | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

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
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Derived simpleBeasts from index
  const simpleBeasts = React.useMemo(() => {
    const seen = new Set();
    return beastsIndex.map(({ name, cr, source, ac }) => {
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
        source: source || 'Unknown',
        ac: ac,
      };
    }).filter(({ name, CR, source }) => {
      const key = `${name}||${CR}||${source}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [beastsIndex]);

  // Derived simpleSpells from index
  const simpleSpells = React.useMemo(() => {
    const seen = new Set();
    return spellsIndex.map(({ name, level, school, source }) => {
      return {
        name,
        level,
        school,
        source: source || 'Unknown',
      };
    }).filter(({ name, level, school, source }) => {
      const key = `${name}||${level}||${school}||${source}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [spellsIndex]);

  // Utility to extract all unique '{@...}' tags from an object
  function extractCurlyTags(obj: any, tagSet: Set<string>) {
      if (typeof obj === 'string') {
          const regex = /\{@(.*?)\}/g;
          let match;
          while ((match = regex.exec(obj)) !== null) {
              tagSet.add(`{@${match[1]}}`);
          }
      } else if (Array.isArray(obj)) {
          obj.forEach(item => extractCurlyTags(item, tagSet));
      } else if (typeof obj === 'object' && obj !== null) {
          // Recursively scan all properties
          Object.entries(obj).forEach(([key, val]) => {
              if (key === 'entries' || key === 'headerEntries' || key === 'footerEntries') {
                  // Skip these properties as they contain the most tags and are processed separately
                  return;
              }
              extractCurlyTags(val, tagSet);
          });
      }
  }

  // Fetch all data from the API
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching beasts data...');
      
      // Fetch beasts data from all URLs
      const beastsPromises = bestiaryGetRequests.map(async (url: string) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`Failed to fetch ${url}: ${response.status}`);
            return [];
          }
          const data = await response.json();
          return data.monster || [];
        } catch (error) {
          console.warn(`Error fetching ${url}:`, error);
          return [];
        }
      });

      console.log('Fetching spells data...');
      
      // Fetch spells data from all URLs
      const spellsPromises = spellsGetRequests.map(async (url: string) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`Failed to fetch ${url}: ${response.status}`);
            return [];
          }
          const data = await response.json();
          return data.spell || [];
        } catch (error) {
          console.warn(`Error fetching ${url}:`, error);
          return [];
        }
      });

      // Wait for all requests to complete
      const [beastsResults, spellsResults] = await Promise.all([
        Promise.all(beastsPromises),
        Promise.all(spellsPromises)
      ]);

      // Flatten and combine results
      const beastsData = beastsResults.flat().sort((a, b) => {
        if (!a.name) return 1;
        if (!b.name) return -1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
      
      const spellsData = spellsResults.flat().sort((a, b) => {
        if (!a.name) return 1;
        if (!b.name) return -1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });

      console.log(`Fetched ${beastsData.length} beasts and ${spellsData.length} spells`);

      // Store data to files
      console.log('Storing beasts to individual files...');
      await storeBeastsToFile(beastsData);
      
      console.log('Storing spells to individual files...');
      await storeSpellsToFile(spellsData);

      // Load indexes for immediate use
      const [beastsIndexData, spellsIndexData] = await Promise.all([
        loadBeastsIndexFromFile(),
        loadSpellsIndexFromFile()
      ]);
      
      if (beastsIndexData) {
        setBeastsIndex(beastsIndexData);
      }
      
      if (spellsIndexData) {
        setSpellsIndex(spellsIndexData);
      }

      setIsInitialized(true);
      console.log('Data loading completed successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load data from files
  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('Loading data from files...');
      
      // Load indexes
      const [beastsIndexData, spellsIndexData] = await Promise.all([
        loadBeastsIndexFromFile(),
        loadSpellsIndexFromFile()
      ]);
      
      if (beastsIndexData) {
        setBeastsIndex(beastsIndexData);
        console.log(`Loaded index with ${beastsIndexData.length} monsters`);
      }

      if (spellsIndexData) {
        setSpellsIndex(spellsIndexData);
        console.log(`Loaded index with ${spellsIndexData.length} spells`);
      }

      setIsInitialized(true);
      console.log('Data loading from files completed');
    } catch (error) {
      console.error('Error loading data from files:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reload data (fetch from API)
  const reloadData = async () => {
    await fetchAllData();
  };

  // Clear all data
  const clearData = async () => {
    try {
      await clearBeastsAndSpellsOnly();
      setBeasts([]);
      setBeastsIndex([]);
      setSpells([]);
      setSpellsIndex([]);
      setIsInitialized(false);
      console.log('Beasts and spells data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  // Get full beast data by name and source
  const getFullBeast = async (name: string, source: string): Promise<Beast | null> => {
    try {
      // Find the beast in the index
      const beastIndex = beastsIndex.find(b => 
        b.name.trim().toLowerCase() === name.trim().toLowerCase() && b.source.trim().toLowerCase() === source.trim().toLowerCase()
      );
      
      if (!beastIndex) {
        return null;
      }

      // Load the full beast data from file
      const fullBeast = await loadMonsterFromFile(beastIndex.file);
      return fullBeast;
    } catch (error) {
      console.error('Error loading full beast:', error);
      return null;
    }
  };

  // Get full spell data by name and source
  const getFullSpell = async (name: string, source: string): Promise<Spell | null> => {
    try {
      // Find the spell in the index
      const spellIndex = spellsIndex.find(s => 
        s.name.trim().toLowerCase() === name.trim().toLowerCase() && s.source.trim().toLowerCase() === source.trim().toLowerCase()
      );
      
      if (!spellIndex) {
        return null;
      }

      // Load the full spell data from file
      const fullSpell = await loadSpellFromFile(spellIndex.file);
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
        console.error('Failed to load data from files, fetching from API...');
        try {
          await fetchAllData();
        } catch (fetchError) {
          console.error('Failed to fetch data from API:', fetchError);
        }
      }
    };

    initializeData();
  }, []);

  return (
    <DataContext.Provider value={{
      beasts,
      simpleBeasts,
      spells,
      simpleSpells,
      isLoading,
      isInitialized,
      loadData,
      reloadData,
      clearData,
      getFullBeast,
      getFullSpell
    }}>
      {children}
    </DataContext.Provider>
  );
}; 