import React from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useModal } from '../../context/ModalContext';
import BeastDetailModal from '../beasts/BeastDetailModal';
import DiceRollModal from './DiceRollModal';
import { SpellDetailModal } from '../spells/SpellDetailModal';

export default function GlobalModals() {
  const { beastModalVisible, selectedBeast, closeBeastModal, spellModalVisible, selectedSpell, closeSpellModal, diceModalState, closeDiceModal } = useModal();
  const { currentTheme } = useAppSettings();
  
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
    </>
  );
} 