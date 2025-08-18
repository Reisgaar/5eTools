// REACT
import React from 'react';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// COMPONENTS
import BeastDetailModal from 'src/components/beasts/BeastDetailModal';
import DiceRollModal from 'src/components/modals/DiceRollModal';
import AdvancedDiceRollModal from 'src/components/modals/AdvancedDiceRollModal';
import { SpellDetailModal } from 'src/components/spells/SpellDetailModal';

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
        closeAdvancedDiceModal
    } = useModal();
    const { currentTheme } = useAppSettingsStore();
  
    return (
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