// REACT
import React, { createContext, ReactNode, useContext, useState } from 'react';

// CONTEXT
import { useData } from 'src/context/DataContext';

// INTERFACES
interface DiceModalState {
  visible: boolean;
  expression: string;
  result: number;
  breakdown: number[];
  modifier?: number;
  type?: 'damage' | 'hit' | 'save';
  label?: string;
}

interface AdvancedDiceModalState {
  visible: boolean;
  d20Config?: {
    bonus: number;
    label: string;
    type: 'hit' | 'save' | 'ability';
  };
  damageConfig?: {
    expression: string;
    label: string;
  };
}

interface ModalContextType {
  beastModalVisible: boolean;
  selectedBeast: any | null;
  openBeastModal: (beast: any, fromModal?: boolean) => void;
  closeBeastModal: () => void;
  beastStackDepth: number;

  spellModalVisible: boolean;
  selectedSpell: any | null;
  openSpellModal: (spell: any, fromModal?: boolean) => void;
  closeSpellModal: () => void;
  spellStackDepth: number;

  diceModalState: DiceModalState;
  openDiceModal: (state: Omit<DiceModalState, 'visible'>) => void;
  closeDiceModal: () => void;

  advancedDiceModalState: AdvancedDiceModalState;
  openAdvancedDiceModal: (config: Omit<AdvancedDiceModalState, 'visible'>) => void;
  closeAdvancedDiceModal: () => void;

  campaignSelectorModalVisible: boolean;
  openCampaignSelectorModal: () => void;
  closeCampaignSelectorModal: () => void;

  beastStack: any[];
  spellStack: any[];
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * ModalProvider component.
 */
export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [beastModalVisible, setBeastModalVisible] = useState(false);
    const [selectedBeast, setSelectedBeast] = useState<any | null>(null);
    const [beastStack, setBeastStack] = useState<any[]>([]);
    const [spellModalVisible, setSpellModalVisible] = useState(false);
    const [selectedSpell, setSelectedSpell] = useState<any | null>(null);
    const [spellStack, setSpellStack] = useState<any[]>([]);
    const [diceModalState, setDiceModalState] = useState<DiceModalState>({
        visible: false,
        expression: '',
        result: 0,
        breakdown: [],
        modifier: undefined,
        type: 'damage',
        label: '',
    });

    const [advancedDiceModalState, setAdvancedDiceModalState] = useState<AdvancedDiceModalState>({
        visible: false,
    });

    const [campaignSelectorModalVisible, setCampaignSelectorModalVisible] = useState(false);

    const { getFullBeast, getFullSpell } = useData();

    // If called with fromModal, push the current modal to the stack before opening the new one
    const openBeastModal = async (beast: any, fromModal: boolean = false) => {
        if (fromModal && selectedBeast) {
            setBeastStack(stack => [...stack, selectedBeast]);
            setBeastModalVisible(false);
        }
        setSelectedBeast(null);
        setBeastModalVisible(true);
        if (beast && beast.name && beast.source) {
            const fullBeast = await getFullBeast(beast.name, beast.source);
            setSelectedBeast(fullBeast);
        } else if (beast && beast.name) {
            const fullBeast = await getFullBeast(beast.name, beast.source || beast._source || '');
            setSelectedBeast(fullBeast);
        } else {
            setSelectedBeast(beast);
        }
    };
    const closeBeastModal = () => {
        setBeastModalVisible(false);
        setSelectedBeast(null);
        setBeastStack(stack => {
            if (stack.length > 0) {
                const prev = stack[stack.length - 1];
                setTimeout(() => openBeastModal(prev, false), 0);
                return stack.slice(0, -1);
            }
            return stack;
        });
    };

    const openSpellModal = async (spell: any, fromModal: boolean = false) => {
        if (fromModal && selectedSpell) {
            setSpellStack(stack => [...stack, selectedSpell]);
            setSpellModalVisible(false);
        }
        setSelectedSpell(null);
        setSpellModalVisible(true);
        if (spell && spell.name && spell.source) {
            const fullSpell = await getFullSpell(spell.name, spell.source);
            setSelectedSpell(fullSpell);
        } else if (spell && spell.name) {
            const fullSpell = await getFullSpell(spell.name, spell.source || spell._source || '');
            setSelectedSpell(fullSpell);
        } else {
            setSelectedSpell(spell);
        }
    };
    const closeSpellModal = () => {
        setSpellModalVisible(false);
        setSelectedSpell(null);
        setSpellStack(stack => {
            if (stack.length > 0) {
                const prev = stack[stack.length - 1];
                setTimeout(() => openSpellModal(prev, false), 0);
                return stack.slice(0, -1);
            }
            return stack;
        });
    };

    const openDiceModal = (state: Omit<DiceModalState, 'visible'>) => {
        setDiceModalState({ ...state, visible: true });
    };
    const closeDiceModal = () => {
        setDiceModalState(prev => ({ ...prev, visible: false }));
    };

    const openAdvancedDiceModal = (config: Omit<AdvancedDiceModalState, 'visible'>) => {
        setAdvancedDiceModalState({ ...config, visible: true });
    };
    const closeAdvancedDiceModal = () => {
        setAdvancedDiceModalState(prev => ({ ...prev, visible: false }));
    };

    const openCampaignSelectorModal = () => {
        setCampaignSelectorModalVisible(true);
    };
    const closeCampaignSelectorModal = () => {
        setCampaignSelectorModalVisible(false);
    };

    return (
        <ModalContext.Provider
            value={{
                beastModalVisible,
                selectedBeast,
                openBeastModal,
                closeBeastModal,
                beastStackDepth: beastStack.length,
                spellModalVisible,
                selectedSpell,
                openSpellModal,
                closeSpellModal,
                spellStackDepth: spellStack.length,
                diceModalState,
                openDiceModal,
                closeDiceModal,
                advancedDiceModalState,
                openAdvancedDiceModal,
                closeAdvancedDiceModal,
                campaignSelectorModalVisible,
                openCampaignSelectorModal,
                closeCampaignSelectorModal,
                beastStack,
                spellStack,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within a ModalProvider');
    return ctx;
}
