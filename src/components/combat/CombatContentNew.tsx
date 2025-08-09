import React from 'react';
import { FlatList, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useCombat } from '../../context/CombatContext';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { loadPlayersList } from '../../utils/fileStorage';
import { getCachedTokenUrl } from '../../utils/tokenCache';
import { normalizeString } from '../../utils/stringUtils';
import CombatHeader from './CombatHeader';
import CombatControls from './CombatControls';
import CombatGroup from './CombatGroup';
import CombatIndividual from './CombatIndividual';
import { PlayerModal, SettingsModal, ValueEditModal, HPEditModal, MaxHPEditModal, ConfirmModal } from '../modals';
import { Ionicons } from '@expo/vector-icons';
import { createCombatStyles } from '../../styles/combat';
import { CombatContentProps } from './types';
import { getGroupedCombatants } from './utils';
import { loadCombatImages } from './utils';
import { TokenViewModal } from '../modals';

export default function CombatContentNew({
  combatants,
  combatName,
  onUpdateHp,
  onUpdateMaxHp,
  onUpdateAc,
  onUpdateInitiative,
  onUpdateInitiativeForGroup,
  onUpdateColor,
  onUpdateConditions,
  onUpdateNote,
  onRemoveCombatant,
  onRandomizeInitiative,
  onStopCombat,
  onBackToList,
  theme,
  isGroupEnabled,
  toggleGroupForName,
  groupByName,
  round,
  turnIndex,
  started,
  onStartCombat,
  onNextTurn
}: CombatContentProps) {
  const { getTurnOrder, addPlayerCombatant, resetCombatGroups } = useCombat();
  const { openBeastModal, openSpellModal } = useModal();
  
  // State for modals
  const [playerModalVisible, setPlayerModalVisible] = React.useState(false);
  const [valueEditModalVisible, setValueEditModalVisible] = React.useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = React.useState(false);
  const [hpEditModalVisible, setHpEditModalVisible] = React.useState(false);
  const [maxHpEditModalVisible, setMaxHpEditModalVisible] = React.useState(false);
  
  // State for token view modal
  const [tokenModalVisible, setTokenModalVisible] = React.useState(false);
  const [tokenModalData, setTokenModalData] = React.useState<{
    tokenUrl: string;
    fallbackUrl: string;
    creatureName: string;
  } | null>(null);
  
  // State for confirm modal
  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [confirmModalData, setConfirmModalData] = React.useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  // State for editing
  const [editingValue, setEditingValue] = React.useState<{
    type: 'initiative' | 'hp' | 'ac';
    value: number;
    id: string;
    name: string;
    isGroup: boolean;
    combatantNumber?: number;
  } | null>(null);
  
  const [editingHp, setEditingHp] = React.useState<{
    id: string;
    name: string;
    currentHp: number;
    maxHp: number;
    combatantNumber?: number;
  } | null>(null);
  
  const [editingStatus, setEditingStatus] = React.useState<{
    id: string;
    name: string;
    currentColor?: string;
    currentConditions?: string[];
    currentNote?: string;
  } | null>(null);
  
  // State for players
  const [allPlayers, setAllPlayers] = React.useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);
  
  // State for cached token URLs
  const [cachedTokenUrls, setCachedTokenUrls] = React.useState<{ [key: string]: string }>({});
  
  // Refs
  const flatListRef = React.useRef<FlatList>(null);

  // Load cached token URLs
  const loadCachedTokenUrls = async () => {
    const newCachedUrls: { [key: string]: string } = {};
    
    for (const combatant of combatants) {
      if (combatant.tokenUrl && combatant.source && combatant.name) {
        try {
          const cachedUrl = await getCachedTokenUrl(combatant.source, combatant.name);
          if (cachedUrl) {
            newCachedUrls[`${combatant.source}-${combatant.name}`] = cachedUrl;
          }
        } catch (error) {
          console.error('Error loading cached token URL:', error);
        }
      }
    }
    
    setCachedTokenUrls(newCachedUrls);
  };

  // Load players list
  const loadPlayers = async () => {
    try {
      const players = await loadPlayersList();
      setAllPlayers(players);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  // Get grouped combatants
  const groupedCombatants = getGroupedCombatants(combatants);

  // Load data on mount
  React.useEffect(() => {
    loadCachedTokenUrls();
    loadPlayers();
  }, [combatants]);

  // Open player modal
  const openPlayerModal = async () => {
    await loadPlayers();
    setPlayerModalVisible(true);
  };

  // Handle adding players to combat
  const handleAddPlayersToCombat = () => {
    selectedPlayers.forEach(playerName => {
      const player = allPlayers.find(p => p.name === playerName);
      if (player) {
        addPlayerCombatant(player);
      }
    });
    setSelectedPlayers([]);
    setPlayerModalVisible(false);
  };

  // Handle value editing
  const handleValueEdit = (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean, combatantNumber?: number) => {
    if (type === 'hp') {
      // Find the combatant to get maxHp
      const combatant = combatants.find(c => c.id === id);
      if (combatant) {
        handleHpEdit(id, name, value, combatant.maxHp, combatantNumber);
        return;
      }
    }
    setEditingValue({ type, value, id, name, isGroup, combatantNumber });
    setValueEditModalVisible(true);
  };

  const handleValueAccept = (newValue: number) => {
    if (editingValue) {
      if (editingValue.type === 'initiative') {
        if (editingValue.isGroup) {
          onUpdateInitiativeForGroup(editingValue.name, newValue);
        } else {
          onUpdateInitiative(editingValue.id, newValue);
        }
      } else if (editingValue.type === 'hp') {
        onUpdateHp(editingValue.id, newValue);
      } else if (editingValue.type === 'ac') {
        onUpdateAc(editingValue.id, newValue);
      }
    }
    setValueEditModalVisible(false);
    setEditingValue(null);
  };

  const handleValueCancel = () => {
    setValueEditModalVisible(false);
    setEditingValue(null);
  };

  // Handle HP editing
  const handleHpEdit = (id: string, name: string, currentHp: number, maxHp: number, combatantNumber?: number) => {
    setEditingHp({ id, name, currentHp, maxHp, combatantNumber });
    setHpEditModalVisible(true);
  };

  const handleHpAccept = (newCurrentHp: number) => {
    if (editingHp) {
      onUpdateHp(editingHp.id, newCurrentHp);
    }
    setHpEditModalVisible(false);
    setEditingHp(null);
  };

  const handleHpCancel = () => {
    setHpEditModalVisible(false);
    setEditingHp(null);
  };

  const handleMaxHpEdit = () => {
    setMaxHpEditModalVisible(true);
  };

  const handleMaxHpAccept = (newMaxHp: number) => {
    if (editingHp) {
      onUpdateMaxHp(editingHp.id, newMaxHp);
      // Update the editingHp state to reflect the new maxHp
      setEditingHp(prev => prev ? { ...prev, maxHp: newMaxHp } : null);
    }
    setMaxHpEditModalVisible(false);
  };

  const handleMaxHpCancel = () => {
    setMaxHpEditModalVisible(false);
  };

  // Handle color editing - moved to settings modal
  const handleColorEdit = (id: string, name: string, currentColor?: string) => {
    // Color editing is now handled in the settings modal
    console.log('Color editing moved to settings modal');
  };

  const handleColorSelect = (color: string | null) => {
    if (editingStatus) {
      onUpdateColor(editingStatus.id, color);
    }
  };

  const handleColorCancel = () => {
    // Color cancel is now handled in the settings modal
  };

  // Handle status editing
  const handleStatusEdit = (id: string, name: string, currentColor?: string, currentCondition?: string) => {
    const combatant = combatants.find(c => c.id === id);
    setEditingStatus({
      id,
      name,
      currentColor,
      currentConditions: combatant?.conditions || [],
      currentNote: combatant?.note || ''
    });
    setSettingsModalVisible(true);
  };

  const handleStatusSelect = (conditions: string[]) => {
    if (editingStatus) {
      onUpdateConditions(editingStatus.id, conditions);
    }
  };

  const handleStatusCancel = () => {
    setSettingsModalVisible(false);
    setEditingStatus(null);
  };

  // Handle note update
  const handleNoteUpdate = (note: string) => {
    if (editingStatus) {
      onUpdateNote(editingStatus.id, note);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id: string, name: string) => {
    onRemoveCombatant(id);
    setSettingsModalVisible(false);
    setEditingStatus(null);
  };

  // Handle creature press
  const handleCreaturePress = async (name: string, source: string) => {
    openBeastModal({ name, source });
  };

  // Handle token press - show full image modal
  const handleTokenPress = async (tokenUrl: string | undefined, creatureName: string) => {
    console.log('Token pressed for:', creatureName);
    
    // Find the combatant to get source
    const combatant = combatants.find(c => c.name === creatureName);
    if (!combatant || !combatant.source) {
      console.log('No source found for creature:', creatureName);
      return;
    }
    
    try {
      // Get both display and modal images
      const images = await loadCombatImages(combatant.source, creatureName);
      
      setTokenModalData({
        tokenUrl: images.modalUrl, // Use full image for modal
        fallbackUrl: images.displayUrl, // Use token as fallback
        creatureName
      });
      setTokenModalVisible(true);
    } catch (error) {
      console.error('Error loading images for token press:', error);
      // Fallback to token URL if available
      if (tokenUrl) {
        setTokenModalData({
          tokenUrl,
          fallbackUrl: tokenUrl,
          creatureName
        });
        setTokenModalVisible(true);
      }
    }
  };

  // Handle spell press
  const handleSpellPress = async (name: string, source: string) => {
    openSpellModal({ name, source });
  };

  // Function to show confirm modal
  const showConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalData({ title, message, onConfirm });
    setConfirmModalVisible(true);
  };

  // Handle randomize initiative with confirm modal
  const handleRandomizeInitiativeWithConfirm = () => {
    showConfirmModal(
      'Randomize Initiative',
      'Do you want to roll initiative for all creatures? (1d20 + initiative bonus)',
      () => {
        console.log('=== RANDOMIZE INITIATIVE CONFIRMED ===');
        
        if (combatants.length === 0) {
          console.log('No combatants to update');
          return;
        }
        
        // Simple approach: update each combatant individually
        combatants.forEach((combatant, index) => {
          console.log(`Processing combatant ${index + 1}: ${combatant.name}`);
          
          // Roll 1d20
          const initiativeRoll = Math.floor(Math.random() * 20) + 1;
          
          // Get initiative bonus (default to 0 if not set)
          const initiativeBonus = combatant.initiativeBonus || 0;
          
          // Calculate total initiative
          const totalInitiative = initiativeRoll + initiativeBonus;
          
          console.log(`${combatant.name}: roll=${initiativeRoll}, bonus=${initiativeBonus}, total=${totalInitiative}`);
          
          // Update the combatant's initiative
          onUpdateInitiative(combatant.id, totalInitiative);
        });
        
        console.log('=== RANDOMIZE INITIATIVE COMPLETED ===');
      }
    );
  };

  const turnOrder = getTurnOrder(combatants, groupByName);
  const styles = createCombatStyles(theme);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <CombatHeader
        combatName={combatName}
        onBackToList={onBackToList}
        onStartCombat={onStartCombat}
        onRandomizeInitiative={handleRandomizeInitiativeWithConfirm}
        onOpenPlayerModal={openPlayerModal}
        onStopCombat={onStopCombat}
        onResetCombat={resetCombatGroups}
        started={started}
        theme={theme}
      />

      {/* Combat List */}
      <FlatList
        ref={flatListRef}
        data={groupedCombatants}
        keyExtractor={(item) => item.nameOrigin}
        renderItem={({ item: group, index }) => {
          const isActive = started && turnOrder[index] && turnOrder[index].ids.some(id => 
            combatants.find(c => c.id === id) && 
            turnOrder.findIndex(turn => turn.ids.includes(id)) === turnIndex
          );
          const groupEnabled = isGroupEnabled(group.nameOrigin);
          
          // If group is enabled, render as a group
          if (groupEnabled) {
            return (
              <CombatGroup
                group={group}
                isActive={isActive}
                isGroupEnabled={groupEnabled}
                onToggleGroup={() => toggleGroupForName(group.nameOrigin)}
                onValueEdit={handleValueEdit}
                onStatusEdit={handleStatusEdit}
                onCreaturePress={handleCreaturePress}
                onTokenPress={handleTokenPress}
                cachedTokenUrls={cachedTokenUrls}
                theme={theme}
              />
            );
          } else {
            // If group is disabled, render each combatant individually
            return (
              <View>
                {group.groupMembers.map((member: any, memberIndex: number) => (
                  <CombatIndividual
                    key={member.id}
                    combatant={member}
                    isActive={isActive}
                    canGroup={group.showGroupButton}
                    onToggleGroup={() => toggleGroupForName(group.nameOrigin)}
                    onValueEdit={handleValueEdit}
                    onStatusEdit={handleStatusEdit}
                    onCreaturePress={handleCreaturePress}
                    onTokenPress={handleTokenPress}
                    cachedTokenUrls={cachedTokenUrls}
                    theme={theme}
                  />
                ))}
              </View>
            );
          }
        }}
        style={styles.combatList}
      />

      <CombatControls
        started={started}
        round={round}
        onStopCombat={onStopCombat}
        onNextTurn={onNextTurn}
        theme={theme}
      />

      {/* Modals */}
      <PlayerModal
        visible={playerModalVisible}
        onClose={() => setPlayerModalVisible(false)}
        onAddPlayers={handleAddPlayersToCombat}
        allPlayers={allPlayers}
        selectedPlayers={selectedPlayers}
        onPlayerToggle={(playerName) => {
          setSelectedPlayers(sel => sel.includes(playerName)
            ? sel.filter(n => n !== playerName)
            : [...sel, playerName]);
        }}
        theme={theme}
      />

      <ValueEditModal
        visible={valueEditModalVisible}
        onClose={handleValueCancel}
        onAccept={handleValueAccept}
        title={editingValue?.type === 'initiative' ? 'Edit Initiative' : 
               editingValue?.type === 'hp' ? 'Edit HP' : 'Edit AC'}
        creatureName={editingValue?.name}
        combatantNumber={editingValue?.combatantNumber}
        initialValue={editingValue?.value || 0}
        theme={theme}
      />

      <SettingsModal
        visible={settingsModalVisible}
        currentConditions={editingStatus?.currentConditions || []}
        currentColor={editingStatus?.currentColor}
        onSelect={handleStatusSelect}
        onColorSelect={handleColorSelect}
        onClose={handleStatusCancel}
        onDelete={editingStatus ? () => onRemoveCombatant(editingStatus.id) : undefined}
        onNoteUpdate={editingStatus ? handleNoteUpdate : undefined}
        currentNote={editingStatus?.currentNote || ''}
        creatureName={editingStatus?.name || 'Creature'}
        theme={theme}
      />

      <HPEditModal
        visible={hpEditModalVisible}
        onClose={handleHpCancel}
        onAccept={handleHpAccept}
        onMaxHpEdit={handleMaxHpEdit}
        creatureName={editingHp?.name || 'Creature'}
        combatantNumber={editingHp?.combatantNumber || 1}
        initialCurrentHp={editingHp?.currentHp || 0}
        maxHp={editingHp?.maxHp || 1}
        theme={theme}
      />

      <MaxHPEditModal
        visible={maxHpEditModalVisible}
        onClose={handleMaxHpCancel}
        onAccept={handleMaxHpAccept}
        creatureName={editingHp?.name || 'Creature'}
        combatantNumber={editingHp?.combatantNumber || 1}
        currentHp={editingHp?.currentHp || 0}
        initialMaxHp={editingHp?.maxHp || 1}
        theme={theme}
      />
      
      {/* Token View Modal */}
      <TokenViewModal
        visible={tokenModalVisible}
        onClose={() => setTokenModalVisible(false)}
        tokenUrl={tokenModalData?.tokenUrl || ''}
        fallbackUrl={tokenModalData?.fallbackUrl || ''}
        creatureName={tokenModalData?.creatureName || ''}
        theme={theme}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={() => confirmModalData?.onConfirm()}
        title={confirmModalData?.title || ''}
        message={confirmModalData?.message || ''}
        theme={theme}
      />
    </View>
  );
}
