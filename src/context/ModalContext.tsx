// REACT
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

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

// A single content modal in the navigation stack. The top of the stack is what's shown; the
// stack lets the user travel spell → creature → condition → … and step back through them.
export type ContentKind = 'beast' | 'spell' | 'item' | 'race' | 'class' | 'entry';
export interface ContentFrame {
  kind: ContentKind;
  data: any;
  category?: string;   // for 'entry' frames (condition/action/feat/deity/…)
  loading?: boolean;   // beast/spell data is fetched async
}

interface ModalContextType {
  // Unified content-modal navigation stack
  contentStack: ContentFrame[];
  currentContent: ContentFrame | null;
  canGoBack: boolean;
  openBeastModal: (beast: any, fromModal?: boolean) => void;
  openSpellModal: (spell: any, fromModal?: boolean) => void;
  openEntryModal: (category: string, name: string, source?: string) => void;
  modalBack: () => void;
  closeContentModals: () => void;

  diceModalState: DiceModalState;
  openDiceModal: (state: Omit<DiceModalState, 'visible'>) => void;
  closeDiceModal: () => void;

  advancedDiceModalState: AdvancedDiceModalState;
  openAdvancedDiceModal: (config: Omit<AdvancedDiceModalState, 'visible'>) => void;
  closeAdvancedDiceModal: () => void;

  campaignSelectorModalVisible: boolean;
  openCampaignSelectorModal: () => void;
  closeCampaignSelectorModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * ModalProvider component.
 */
export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [contentStack, setContentStack] = useState<ContentFrame[]>([]);
    const [diceModalState, setDiceModalState] = useState<DiceModalState>({
        visible: false,
        expression: '',
        result: 0,
        breakdown: [],
        modifier: undefined,
        type: 'damage',
        label: '',
    });
    const [advancedDiceModalState, setAdvancedDiceModalState] = useState<AdvancedDiceModalState>({ visible: false });
    const [campaignSelectorModalVisible, setCampaignSelectorModalVisible] = useState(false);

    const { getFullBeast, getFullSpell, getContentEntry } = useData();

    const modalBack = useCallback(() => setContentStack(s => s.slice(0, -1)), []);
    const closeContentModals = useCallback(() => setContentStack([]), []);

    // Push a beast/spell frame immediately (with a loading placeholder) so the modal appears
    // instantly, then fill in the full record once it's loaded from disk.
    const openAsyncFrame = useCallback(async (kind: 'beast' | 'spell', fallback: any, load: () => Promise<any>) => {
        setContentStack(s => [...s, { kind, data: fallback ?? null, loading: true }]);
        let full: any = fallback;
        try { full = (await load()) || fallback; } catch { full = fallback; }
        setContentStack(s => {
            if (s.length === 0) return s;
            const copy = [...s];
            const top = copy[copy.length - 1];
            if (top.kind === kind && top.loading) copy[copy.length - 1] = { kind, data: full };
            return copy;
        });
    }, []);

    const openBeastModal = useCallback((beast: any) => {
        if (beast && beast.name) {
            openAsyncFrame('beast', beast, () => getFullBeast(beast.name, beast.source || beast._source || ''));
        } else {
            setContentStack(s => [...s, { kind: 'beast', data: beast }]);
        }
    }, [getFullBeast, openAsyncFrame]);

    const openSpellModal = useCallback((spell: any) => {
        if (spell && spell.name) {
            openAsyncFrame('spell', spell, () => getFullSpell(spell.name, spell.source || spell._source || ''));
        } else {
            setContentStack(s => [...s, { kind: 'spell', data: spell }]);
        }
    }, [getFullSpell, openAsyncFrame]);

    const openEntryModal = useCallback((category: string, name: string, source?: string) => {
        const entry = getContentEntry(category, name, source) || { name, source, entries: ['No details available.'] };
        const kind: ContentKind = category === 'item' ? 'item' : category === 'race' ? 'race' : category === 'class' ? 'class' : 'entry';
        setContentStack(s => [...s, { kind, data: entry, category }]);
    }, [getContentEntry]);

    const openDiceModal = useCallback((state: Omit<DiceModalState, 'visible'>) => {
        setDiceModalState({ ...state, visible: true });
    }, []);
    const closeDiceModal = useCallback(() => {
        setDiceModalState(prev => ({ ...prev, visible: false }));
    }, []);

    const openAdvancedDiceModal = useCallback((config: Omit<AdvancedDiceModalState, 'visible'>) => {
        setAdvancedDiceModalState({ ...config, visible: true });
    }, []);
    const closeAdvancedDiceModal = useCallback(() => {
        setAdvancedDiceModalState(prev => ({ ...prev, visible: false }));
    }, []);

    const openCampaignSelectorModal = useCallback(() => {
        setCampaignSelectorModalVisible(true);
    }, []);
    const closeCampaignSelectorModal = useCallback(() => {
        setCampaignSelectorModalVisible(false);
    }, []);

    const value = useMemo<ModalContextType>(() => ({
        contentStack,
        currentContent: contentStack.length ? contentStack[contentStack.length - 1] : null,
        canGoBack: contentStack.length > 1,
        openBeastModal,
        openSpellModal,
        openEntryModal,
        modalBack,
        closeContentModals,
        diceModalState,
        openDiceModal,
        closeDiceModal,
        advancedDiceModalState,
        openAdvancedDiceModal,
        closeAdvancedDiceModal,
        campaignSelectorModalVisible,
        openCampaignSelectorModal,
        closeCampaignSelectorModal,
    }), [
        contentStack, openBeastModal, openSpellModal, openEntryModal, modalBack, closeContentModals,
        diceModalState, openDiceModal, closeDiceModal,
        advancedDiceModalState, openAdvancedDiceModal, closeAdvancedDiceModal,
        campaignSelectorModalVisible, openCampaignSelectorModal, closeCampaignSelectorModal,
    ]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within a ModalProvider');
    return ctx;
}
