// REACT
import { create } from 'zustand';

// UTILS
import { loadSpellbooksFromFile, saveSpellbooksToFile } from 'src/utils/fileStorage';
import { Spellbook, SpellbookSpell } from 'src/utils/types';

// INTERFACES
interface SpellbookState {
    spellbooks: Spellbook[];
    currentSpellbookId: string | null;
    
    // Spellbook management
    createSpellbook: (name: string, description?: string, campaignId?: string) => string;
    deleteSpellbook: (id: string) => void;
    selectSpellbook: (id: string) => void;
    clearSpellbookSelection: () => void;
    
    // Spell management
    addSpellToSpellbook: (spellbookId: string, spellName: string, spellSource: string, spellDetails?: any) => void;
    removeSpellFromSpellbook: (spellbookId: string, spellName: string, spellSource: string) => void;
    isSpellInSpellbook: (spellbookId: string, spellName: string, spellSource: string) => boolean;
    
    // Getters
    getCurrentSpellbook: () => Spellbook | null;
    getSpellbooksByCampaign: (campaignId?: string | null) => Spellbook[];
    getSpellbookSpells: (spellbookId: string) => SpellbookSpell[];
    
    // Data loading
    loadSpellbooks: () => Promise<void>;
}

/**
 * SpellbookStore is a Zustand store that manages spellbook data and state.
 */
export const useSpellbookStore = create<SpellbookState>((set, get) => ({
    spellbooks: [],
    currentSpellbookId: null,

    // Spellbook management functions
    createSpellbook: (name: string, description?: string, campaignId?: string): string => {
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

        set(state => {
            const updatedSpellbooks = [...state.spellbooks, newSpellbook];
            // Save to storage
            saveSpellbooksToFile(updatedSpellbooks);
            return { spellbooks: updatedSpellbooks };
        });
        
        return id;
    },

    deleteSpellbook: (id: string) => {
        set(state => {
            const updated = state.spellbooks.filter(spellbook => spellbook.id !== id);
            saveSpellbooksToFile(updated);
            
            // If we deleted the current spellbook, clear selection
            if (state.currentSpellbookId === id) {
                set({ currentSpellbookId: null });
            }
            
            return { spellbooks: updated };
        });
    },

    selectSpellbook: (id: string) => {
        set({ currentSpellbookId: id });
    },

    clearSpellbookSelection: () => {
        set({ currentSpellbookId: null });
    },

    addSpellToSpellbook: (spellbookId: string, spellName: string, spellSource: string, spellDetails?: any) => {
        set(state => {
            const updated = state.spellbooks.map(spellbook => {
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
            return { spellbooks: updated };
        });
    },

    removeSpellFromSpellbook: (spellbookId: string, spellName: string, spellSource: string) => {
        set(state => {
            const updated = state.spellbooks.map(spellbook => {
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
            return { spellbooks: updated };
        });
    },

    isSpellInSpellbook: (spellbookId: string, spellName: string, spellSource: string): boolean => {
        const spellbook = get().spellbooks.find(sb => sb.id === spellbookId);
        if (!spellbook) return false;
        
        const spellsIndex = spellbook.spellsIndex || [];
        return spellsIndex.some(spell => 
            spell.name === spellName && spell.source === spellSource
        );
    },

    getCurrentSpellbook: (): Spellbook | null => {
        const { spellbooks, currentSpellbookId } = get();
        return spellbooks.find(sb => sb.id === currentSpellbookId) || null;
    },

    getSpellbooksByCampaign: (campaignId?: string | null): Spellbook[] => {
        const spellbooks = get().spellbooks;
        if (!campaignId) {
            // If no campaign is selected (null/undefined), show all spellbooks
            return spellbooks;
        } else {
            // Show spellbooks for the specific campaign
            return spellbooks.filter(spellbook => spellbook.campaignId === campaignId);
        }
    },

    getSpellbookSpells: (spellbookId: string): SpellbookSpell[] => {
        const spellbook = get().spellbooks.find(sb => sb.id === spellbookId);
        if (!spellbook) return [];
        return spellbook.spellsIndex || [];
    },

    loadSpellbooks: async () => {
        try {
            const loadedSpellbooks = await loadSpellbooksFromFile();
            
            // Ensure all spellbooks have a valid spellsIndex array
            const validatedSpellbooks = loadedSpellbooks.map(spellbook => ({
                ...spellbook,
                spellsIndex: spellbook.spellsIndex || []
            }));
            
            set({ spellbooks: validatedSpellbooks });
        } catch (error) {
            console.error('Error loading spellbooks:', error);
        }
    },
}));
