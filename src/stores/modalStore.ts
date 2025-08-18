import { create } from 'zustand';

interface DiceModalState {
  visible: boolean;
  expression: string;
  result: number;
  breakdown: number[];
  modifier?: number;
  type?: 'damage' | 'hit' | 'save';
  label?: string;
}

interface ModalStore {
  // Beast modal state
  beastModalVisible: boolean;
  selectedBeast: any | null;
  beastStack: any[];

  // Spell modal state
  spellModalVisible: boolean;
  selectedSpell: any | null;
  spellStack: any[];

  // Dice modal state
  diceModalState: DiceModalState;

  // Data fetching functions (to be injected)
  getFullBeast?: (name: string, source: string) => Promise<any | null>;
  getFullSpell?: (name: string, source: string) => Promise<any | null>;

  // Beast modal actions
  openBeastModal: (beast: any, fromModal?: boolean) => Promise<void>;
  closeBeastModal: () => void;

  // Spell modal actions
  openSpellModal: (spell: any, fromModal?: boolean) => Promise<void>;
  closeSpellModal: () => void;

  // Dice modal actions
  openDiceModal: (state: Omit<DiceModalState, 'visible'>) => void;
  closeDiceModal: () => void;

  // Set data fetching functions
  setDataFunctions: (getFullBeast: (name: string, source: string) => Promise<any | null>, getFullSpell: (name: string, source: string) => Promise<any | null>) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  // Initial state
  beastModalVisible: false,
  selectedBeast: null,
  beastStack: [],
  spellModalVisible: false,
  selectedSpell: null,
  spellStack: [],
  diceModalState: {
    visible: false,
    expression: '',
    result: 0,
    breakdown: [],
    modifier: undefined,
    type: 'damage',
    label: '',
  },

  // Set data fetching functions
  setDataFunctions: (getFullBeast, getFullSpell) => {
    set({ getFullBeast, getFullSpell });
  },

  // Beast modal actions
  openBeastModal: async (beast: any, fromModal: boolean = false) => {
    const { selectedBeast, beastStack, getFullBeast } = get();
    
    if (fromModal && selectedBeast) {
      set(state => ({
        beastStack: [...state.beastStack, selectedBeast],
        beastModalVisible: false,
      }));
    }
    
    set({ selectedBeast: null, beastModalVisible: true });
    
    if (beast && beast.name && beast.source && getFullBeast) {
      const fullBeast = await getFullBeast(beast.name, beast.source);
      set({ selectedBeast: fullBeast });
    } else if (beast && beast.name && getFullBeast) {
      const fullBeast = await getFullBeast(beast.name, beast.source || beast._source || '');
      set({ selectedBeast: fullBeast });
    } else {
      set({ selectedBeast: beast });
    }
  },

  closeBeastModal: () => {
    const { beastStack } = get();
    
    set({ beastModalVisible: false, selectedBeast: null });
    
    if (beastStack.length > 0) {
      const prev = beastStack[beastStack.length - 1];
      set(state => ({
        beastStack: state.beastStack.slice(0, -1),
      }));
      
      // Reopen the previous modal
      setTimeout(() => {
        get().openBeastModal(prev, false);
      }, 0);
    }
  },

  // Spell modal actions
  openSpellModal: async (spell: any, fromModal: boolean = false) => {
    const { selectedSpell, spellStack, getFullSpell } = get();
    
    if (fromModal && selectedSpell) {
      set(state => ({
        spellStack: [...state.spellStack, selectedSpell],
        spellModalVisible: false,
      }));
    }
    
    set({ selectedSpell: null, spellModalVisible: true });
    
    if (spell && spell.name && spell.source && getFullSpell) {
      const fullSpell = await getFullSpell(spell.name, spell.source);
      set({ selectedSpell: fullSpell });
    } else if (spell && spell.name && getFullSpell) {
      const fullSpell = await getFullSpell(spell.name, spell.source || spell._source || '');
      set({ selectedSpell: fullSpell });
    } else {
      set({ selectedSpell: spell });
    }
  },

  closeSpellModal: () => {
    const { spellStack } = get();
    
    set({ spellModalVisible: false, selectedSpell: null });
    
    if (spellStack.length > 0) {
      const prev = spellStack[spellStack.length - 1];
      set(state => ({
        spellStack: state.spellStack.slice(0, -1),
      }));
      
      // Reopen the previous modal
      setTimeout(() => {
        get().openSpellModal(prev, false);
      }, 0);
    }
  },

  // Dice modal actions
  openDiceModal: (state: Omit<DiceModalState, 'visible'>) => {
    set({ diceModalState: { ...state, visible: true } });
  },

  closeDiceModal: () => {
    set(state => ({ 
      diceModalState: { ...state.diceModalState, visible: false } 
    }));
  },
}));
