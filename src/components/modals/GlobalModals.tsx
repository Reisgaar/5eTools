// REACT
import React from 'react';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// STORES
import { useAppSettingsStore } from 'src/stores';

// COMPONENTS
import BeastDetailModal from 'src/components/beasts/BeastDetailModal';
import SpellDetailModal from 'src/components/spells/SpellDetailModal';
import AdvancedDiceRollModal from 'src/components/modals/AdvancedDiceRollModal';
import DiceRollModal from 'src/components/modals/DiceRollModal';
import CampaignSelectorModal from 'src/components/modals/CampaignSelectorModal';
import EntryDetailModal from 'src/components/modals/EntryDetailModal';
import ItemDetailModal from 'src/components/modals/ItemDetailModal';
import RaceDetailModal from 'src/components/modals/RaceDetailModal';
import ClassDetailModal from 'src/components/modals/ClassDetailModal';

/**
 * Hosts the single global modal. Content modals (creature/spell/item/…) live on one navigation
 * stack: the top frame is shown, with a back button when there's a previous frame and a close
 * button that dismisses the whole stack. Dice/campaign modals take over while active (only one
 * modal is ever on screen at a time).
 */
export default function GlobalModals() {
    const {
        currentContent,
        canGoBack,
        modalBack,
        closeContentModals,
        diceModalState,
        closeDiceModal,
        advancedDiceModalState,
        closeAdvancedDiceModal,
        campaignSelectorModalVisible,
    } = useModal();
    const { currentTheme } = useAppSettingsStore();

    if (campaignSelectorModalVisible) {
        return <CampaignSelectorModal visible={campaignSelectorModalVisible} />;
    }

    if (diceModalState.visible || advancedDiceModalState.visible) {
        return (
            <>
                <DiceRollModal
                    visible={diceModalState.visible}
                    expression={diceModalState.expression}
                    result={diceModalState.result}
                    breakdown={diceModalState.breakdown}
                    modifier={diceModalState.modifier}
                    type={diceModalState.type}
                    label={diceModalState.label}
                    theme={currentTheme}
                    onClose={closeDiceModal}
                />
                <AdvancedDiceRollModal
                    visible={advancedDiceModalState.visible}
                    onClose={closeAdvancedDiceModal}
                    theme={currentTheme}
                    d20Config={advancedDiceModalState.d20Config}
                    damageConfig={advancedDiceModalState.damageConfig}
                />
            </>
        );
    }

    const frame = currentContent;
    if (!frame) return null;

    const onBack = canGoBack ? modalBack : undefined;
    const common = { visible: true, onClose: closeContentModals, onBack, theme: currentTheme };

    switch (frame.kind) {
        case 'beast':
            return <BeastDetailModal {...common} beast={frame.data} />;
        case 'spell':
            return <SpellDetailModal {...common} spell={frame.data} schoolFullName={frame.data?.school || ''} />;
        case 'item':
            return <ItemDetailModal {...common} item={frame.data} />;
        case 'race':
            return <RaceDetailModal {...common} race={frame.data} />;
        case 'class':
            return <ClassDetailModal {...common} classSummary={frame.data} />;
        default:
            return <EntryDetailModal {...common} entry={frame.data} category={frame.category ?? null} />;
    }
}
