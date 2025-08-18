// REACT
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

// COMPONENTS
import { CombatContent, CombatList } from 'src/components/combat';
import { CombatFormModal } from 'src/components/combat/modals';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

export default function CombatScreen() {
    const { selectedCampaign } = useCampaignStore();
    const { 
        combats,
        currentCombatId,
        currentCombat,
        combatants, 
        createCombat,
        selectCombat,
        clearCurrentCombat,
        deleteCombat,
        updateHp, 
        updateMaxHp,
        updateAc,
        updateColor,
        updateInitiative, 
        updateInitiativeForGroup,
        removeCombatant, 
        clearCombat,
        isGroupEnabled,
        toggleGroupForName,
        groupByName,
        startCombat,
        stopCombat,
        nextTurn,
        updateCombatantConditions,
        updateCombatantNote,
        setCombatActive,
        getSortedCombats
    } = useCombat();

    const { currentTheme } = useAppSettingsStore();
    const { getFullBeast } = useData();
    const { openBeastModal, openSpellModal } = useModal();
    const [createCombatModalVisible, setCreateCombatModalVisible] = useState(false);
    
    // Sync local state with context combatants if needed
    React.useEffect(() => {
        // setCombatantsState(combatants); // This line is removed as per the edit hint
    }, [combatants]);

    const onUpdateConditions = (id: string, conditions: string[]) => {
        updateCombatantConditions(id, conditions);
    };

    // Find full beast by name and source (async)
    const handleGetFullBeast = async (name: string, source: string) => {
        try {
            return await getFullBeast(name, source);
        } catch (error) {
            console.error('Error getting full beast:', error);
            return null;
        }
    };

    // Menu handlers
    const handleRandomInitiative = () => {
        console.log('=== RANDOMIZE INITIATIVE CALLED ===');
        console.log('Combatants count:', combatants.length);
        // This function is now handled by the modal in CombatContentNew
    };

    const handleCreateCombat = () => {
        setCreateCombatModalVisible(true);
    };

    const handleCreateCombatWithName = (name: string, campaignId?: string, description?: string) => {
        createCombat(name, campaignId, description);
    };

  const handleDeleteCombat = (combatId: string) => {
    Alert.alert(
      'Delete Combat',
      'Are you sure you want to delete this combat?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCombat(combatId) }
      ]
    );
  };

    const handleSelectCombat = (combatId: string) => {
        selectCombat(combatId);
    };

    const handleViewBeastDetails = (beast: any) => {
        openBeastModal(beast);
    };

    const handleBackToList = () => {
        clearCurrentCombat(); // Clear current combat selection
    };

    const handleSetCombatActive = (combatId: string, active: boolean) => {
        setCombatActive(combatId, active);
    };

    // Get combats filtered by selected campaign
    const filteredCombats = getSortedCombats(selectedCampaign?.id || null);
    
    // Debug logging
    console.log('CombatScreen - selectedCampaign:', selectedCampaign);
    console.log('CombatScreen - filteredCombats count:', filteredCombats.length);

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={{ flex: 1, backgroundColor: currentTheme.background, padding: 0, paddingBottom: 0 }}>
              {/* Show Combat List or Combat Content */}
              {currentCombatId ? (
                  // Show combat content when a combat is selected
                  <CombatContent
                    combatants={combatants}
                    combatName={currentCombat?.name || 'Combat'}
                    onUpdateHp={updateHp}
                    onUpdateMaxHp={updateMaxHp}
                    onUpdateAc={updateAc}
                    onUpdateColor={updateColor}
                    onUpdateInitiative={updateInitiative}
                    onUpdateInitiativeForGroup={updateInitiativeForGroup}
                    onUpdateConditions={onUpdateConditions}
                    onUpdateNote={updateCombatantNote}
                    onRemoveCombatant={removeCombatant}
                    onRandomizeInitiative={handleRandomInitiative}
                    onStopCombat={stopCombat}
                    onBackToList={handleBackToList}
                    onEditCombat={() => {}} // This will be handled by the modal in CombatContentNew
                    theme={currentTheme}
                    isGroupEnabled={isGroupEnabled}
                    toggleGroupForName={toggleGroupForName}
                    groupByName={groupByName}
                    round={currentCombat?.round || 1}
                    turnIndex={currentCombat?.turnIndex || 0}
                    started={!!currentCombat?.started}
                    onStartCombat={startCombat}
                    onNextTurn={nextTurn}
                  />
              ) : (
                  // Show combat list when no combat is selected
                  <CombatList
                    combats={filteredCombats}
                    currentCombatId={currentCombatId}
                    onSelectCombat={handleSelectCombat}
                    onCreateCombat={handleCreateCombat}
                    theme={currentTheme}
                  />
              )}
            </View>

            {/* Create Combat Modal */}
            <CombatFormModal
              visible={createCombatModalVisible}
              onClose={() => setCreateCombatModalVisible(false)}
              mode="create"
              onCreateCombat={handleCreateCombatWithName}
              theme={currentTheme}
            />
        </View>
    );
}
