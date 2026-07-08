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
 * GlobalModals component.
 */
export default function GlobalModals() {
    const {
        beastModalVisible,
        selectedBeast,
        closeBeastModal,
        spellModalVisible,
        selectedSpell,
        closeSpellModal,
        diceModalState,
        closeDiceModal,
        advancedDiceModalState,
        closeAdvancedDiceModal,
        campaignSelectorModalVisible,
        entryModalVisible,
        selectedEntry,
        selectedEntryCategory,
        closeEntryModal
    } = useModal();
    const { currentTheme } = useAppSettingsStore();

    return (
        <>
            {campaignSelectorModalVisible ? (
                <CampaignSelectorModal visible={campaignSelectorModalVisible} />
            ) : diceModalState.visible || advancedDiceModalState.visible ? (
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
            ):(
                <>
                    <BeastDetailModal
                        visible={beastModalVisible}
                        beast={selectedBeast}
                        onClose={closeBeastModal}
                        theme={currentTheme}
                    />
                    <SpellDetailModal
                        visible={spellModalVisible}
                        spell={selectedSpell}
                        onClose={closeSpellModal}
                        schoolFullName={selectedSpell ? selectedSpell.school : ''}
                        theme={currentTheme}
                    />
                </>
            )}

            {/* Reference-content modal (conditions, actions, feats, …) — overlays on top of any
                other modal, since these tags are tapped from inside beast/spell detail modals. */}
            {selectedEntryCategory === 'item' ? (
                <ItemDetailModal
                    visible={entryModalVisible}
                    item={selectedEntry}
                    onClose={closeEntryModal}
                    theme={currentTheme}
                />
            ) : selectedEntryCategory === 'race' ? (
                <RaceDetailModal
                    visible={entryModalVisible}
                    race={selectedEntry}
                    onClose={closeEntryModal}
                    theme={currentTheme}
                />
            ) : selectedEntryCategory === 'class' ? (
                <ClassDetailModal
                    visible={entryModalVisible}
                    classSummary={selectedEntry}
                    onClose={closeEntryModal}
                    theme={currentTheme}
                />
            ) : (
                <EntryDetailModal
                    visible={entryModalVisible}
                    entry={selectedEntry}
                    category={selectedEntryCategory}
                    onClose={closeEntryModal}
                    theme={currentTheme}
                />
            )}
        </>
    );
}
