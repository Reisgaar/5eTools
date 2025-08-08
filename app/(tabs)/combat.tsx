import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CombatContent, CombatList } from 'src/components/combat';
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useCombat } from 'src/context/CombatContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

export default function CombatScreen() {
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
    nextTurn,
    updateCombatantConditions,
    updateCombatantNote,
    setCombatActive,
    getSortedCombats
  } = useCombat();
  const { currentTheme } = useAppSettings();
  const { getFullBeast } = useData();
  const { openBeastModal, openSpellModal } = useModal();
  const [newCombatName, setNewCombatName] = useState('');
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
    Alert.alert(
      'Randomize Initiative',
      'Do you want to overwrite all initiative values with a random roll?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {
           // Per-creature grouping
           const uniqueNames = [...new Set(combatants.map(c => c.name))];
           uniqueNames.forEach(name => {
             if (isGroupEnabled(name)) {
               updateInitiativeForGroup(name, Math.floor(Math.random() * 21));
             } else {
               // Update each combatant with this name individually
               combatants.filter(c => c.name === name).forEach(c => {
                 updateInitiative(c.id, Math.floor(Math.random() * 21));
               });
             }
           });
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Combatants',
      'Are you sure you want to remove all combatants?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCombat }
      ]
    );
  };

  const handleCreateCombat = () => {
    if (newCombatName.trim()) {
      createCombat(newCombatName.trim());
      setNewCombatName('');
    }
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

  // Handler for finishing combat (when started)
  const handleFinishCombat = () => {
    Alert.alert(
      'Finish Combat',
      'Are you sure you want to finish this combat? This will stop combatants and reset the round counter.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Finish', style: 'destructive', onPress: clearCombat }
      ]
    );
  };

  const handleSetCombatActive = (combatId: string, active: boolean) => {
    setCombatActive(combatId, active);
  };

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
            {/* Header */}
            {currentCombatId ? (<></>) : (
                <View style={{ marginBottom: 16, borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderBottomColor: currentTheme.primary }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: currentTheme.text }}>Combat Manager</Text>
                </View>
            )}

            <View style={{ flex: 1, backgroundColor: currentTheme.background, padding: 0, paddingBottom: 0 }}>
              {/* Show Combat List or Combat Content */}
              {currentCombatId ? (
                  // Show combat content when a combat is selected
                  <CombatContent
                  combatants={combatants}
                  combatName={currentCombat?.name || 'Combat'}
                  onUpdateHp={updateHp}
                  onUpdateAc={updateAc}
                  onUpdateColor={updateColor}
                  onUpdateInitiative={updateInitiative}
                  onUpdateInitiativeForGroup={updateInitiativeForGroup}
                  onUpdateConditions={onUpdateConditions}
                  onUpdateNote={updateCombatantNote}
                  onRemoveCombatant={removeCombatant}
                  onRandomizeInitiative={handleRandomInitiative}
                  onClearCombat={currentCombat?.started ? handleFinishCombat : handleClearAll}
                  onBackToList={handleBackToList}
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
                  combats={getSortedCombats()}
                  currentCombatId={currentCombatId}
                  newCombatName={newCombatName}
                  onNewCombatNameChange={setNewCombatName}
                  onSelectCombat={handleSelectCombat}
                  onCreateCombat={handleCreateCombat}
                  onSetCombatActive={handleSetCombatActive}
                  theme={currentTheme}
                  />
              )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  // Styles moved to individual components
}); 