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
import { PlayerModal, SettingsModal, ValueEditModal, ColorPickerModal, HPEditModal, MaxHPEditModal } from '../modals';
import { Ionicons } from '@expo/vector-icons';
import { createCombatStyles } from '../../styles/combat';

interface Combatant {
  id: string;
  name: string;
  source: string;
  tokenUrl?: string;
  maxHp: number;
  currentHp: number;
  initiative: number;
  ac: number;
  passivePerception?: number;
  color?: string;
  conditions?: string[];
  note?: string;
}

interface CombatContentProps {
  combatants: Combatant[];
  combatName: string;
  onUpdateHp: (id: string, newHp: number) => void;
  onUpdateMaxHp: (id: string, newMaxHp: number) => void;
  onUpdateAc: (id: string, newAc: number) => void;
  onUpdateInitiative: (id: string, newInit: number) => void;
  onUpdateInitiativeForGroup: (name: string, newInit: number) => void;
  onUpdateColor: (id: string, color: string | null) => void;
  onUpdateConditions: (id: string, conditions: string[]) => void;
  onUpdateNote: (id: string, note: string) => void;
  onRemoveCombatant: (id: string) => void;
  onRandomizeInitiative: () => void;
  onClearCombat: () => void;
  onBackToList: () => void;
  theme: any;
  isGroupEnabled: (nameOrigin: string) => boolean;
  toggleGroupForName: (nameOrigin: string) => void;
  groupByName: { [nameOrigin: string]: boolean };
  round: number;
  turnIndex: number;
  started: boolean;
  onStartCombat: () => void;
  onNextTurn: () => void;
}

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
  onClearCombat,
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
  const [colorPickerModalVisible, setColorPickerModalVisible] = React.useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = React.useState(false);
  const [hpEditModalVisible, setHpEditModalVisible] = React.useState(false);
  const [maxHpEditModalVisible, setMaxHpEditModalVisible] = React.useState(false);
  
  // State for editing
  const [editingValue, setEditingValue] = React.useState<{
    type: 'initiative' | 'hp' | 'ac';
    value: number;
    id: string;
    name: string;
    isGroup: boolean;
    combatantNumber?: number; // Added for ValueEditModal
  } | null>(null);
  
  const [editingColor, setEditingColor] = React.useState<{
    id: string;
    name: string;
    currentColor?: string;
  } | null>(null);
  
  const [editingStatus, setEditingStatus] = React.useState<{
    id: string;
    name: string;
    currentConditions?: string[];
    currentNote?: string;
  } | null>(null);
  
  const [editingHp, setEditingHp] = React.useState<{
    id: string;
    name: string;
    currentHp: number;
    maxHp: number;
    combatantNumber?: number;
  } | null>(null);
  const [editingNote, setEditingNote] = React.useState<{
    name: string;
    displayName: string;
    currentNote?: string;
  } | null>(null);
  const [deletingCombatant, setDeletingCombatant] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  
  // State for players
  const [allPlayers, setAllPlayers] = React.useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);
  const [noteModalText, setNoteModalText] = React.useState('');
  
  // State for token caching
  const [cachedTokenUrls, setCachedTokenUrls] = React.useState<{ [key: string]: string }>({});
  
  const flatListRef = React.useRef<FlatList>(null);

  // Load cached token URLs
  const loadCachedTokenUrls = async () => {
    const urls: { [key: string]: string } = {};
    for (const combatant of combatants) {
      if (combatant.tokenUrl) {
        const cachedUrl = await getCachedTokenUrl(combatant.source, combatant.name);
        if (cachedUrl) {
          urls[combatant.id] = cachedUrl;
        }
      }
    }
    setCachedTokenUrls(urls);
  };

  React.useEffect(() => {
    loadCachedTokenUrls();
  }, [combatants]);

  // Load players list
  React.useEffect(() => {
    const loadPlayers = async () => {
      const players = await loadPlayersList();
      setAllPlayers(players);
    };
    loadPlayers();
  }, []);

  // Get grouped combatants
  const getGroupedCombatants = () => {
    const groups: { [nameOrigin: string]: Combatant[] } = {};
    
    combatants.forEach(combatant => {
      const nameOrigin = `${normalizeString(combatant.name)}-${normalizeString(combatant.source)}`;
      if (!groups[nameOrigin]) {
        groups[nameOrigin] = [];
      }
      groups[nameOrigin].push(combatant);
    });
    
    return Object.entries(groups).map(([nameOrigin, members]) => ({
      name: members[0].name,
      source: members[0].source,
      nameOrigin,
      initiative: members[0].initiative,
      passivePerception: members[0].passivePerception,
      groupMembers: members,
      showGroupButton: members.length > 1
    }));
  };

  // Event handlers
  const openPlayerModal = async () => {
    setPlayerModalVisible(true);
  };

  const handleAddPlayersToCombat = () => {
    selectedPlayers.forEach(playerName => {
      const player = allPlayers.find(p => p.name === playerName);
      if (player) {
        addPlayerCombatant(player);
      }
    });
    setPlayerModalVisible(false);
    setSelectedPlayers([]);
  };

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
      if (editingValue.isGroup) {
        onUpdateInitiativeForGroup(editingValue.name, newValue);
      } else {
        switch (editingValue.type) {
          case 'initiative':
            onUpdateInitiative(editingValue.id, newValue);
            break;
          case 'hp':
            onUpdateHp(editingValue.id, newValue);
            break;
          case 'ac':
            onUpdateAc(editingValue.id, newValue);
            break;
        }
      }
    }
    setValueEditModalVisible(false);
    setEditingValue(null);
  };

  const handleValueCancel = () => {
    setValueEditModalVisible(false);
    setEditingValue(null);
  };

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
    if (editingHp && onUpdateMaxHp) {
      onUpdateMaxHp(editingHp.id, newMaxHp);
      // Update the editingHp state to reflect the new maxHp
      setEditingHp(prev => prev ? { ...prev, maxHp: newMaxHp } : null);
    }
    setMaxHpEditModalVisible(false);
  };

  const handleMaxHpCancel = () => {
    setMaxHpEditModalVisible(false);
  };

  const handleColorEdit = (id: string, name: string, currentColor?: string) => {
    setEditingColor({ id, name, currentColor });
    setColorPickerModalVisible(true);
  };

  const handleColorSelect = (color: string | null) => {
    if (editingColor) {
      onUpdateColor(editingColor.id, color);
    }
    setColorPickerModalVisible(false);
    setEditingColor(null);
  };

  const handleColorCancel = () => {
    setColorPickerModalVisible(false);
    setEditingColor(null);
  };

  const handleStatusEdit = (id: string, name: string, currentColor?: string, currentCondition?: string) => {
    const combatant = combatants.find(c => c.id === id);
    setEditingStatus({ 
      id, 
      name, 
      currentConditions: currentCondition ? currentCondition.split(', ') : [],
      currentNote: combatant?.note || ''
    });
    setSettingsModalVisible(true);
  };

  const handleStatusSelect = (conditions: string[]) => {
    if (editingStatus) {
      onUpdateConditions(editingStatus.id, conditions);
    }
    setSettingsModalVisible(false);
    setEditingStatus(null);
  };

  const handleStatusCancel = () => {
    setSettingsModalVisible(false);
    setEditingStatus(null);
  };

  const handleNoteUpdate = (note: string) => {
    if (editingStatus) {
      onUpdateNote(editingStatus.id, note);
      setSettingsModalVisible(false);
      setEditingStatus(null);
    }
  };


  const handleDeleteConfirm = (id: string, name: string) => {
    setDeletingCombatant({ id, name });
    // Show confirmation dialog
    if (confirm(`Are you sure you want to remove ${name} from combat?`)) {
      onRemoveCombatant(id);
    }
    setDeletingCombatant(null);
  };

  const handleCreaturePress = async (name: string, source: string) => {
    openBeastModal(name, source);
  };

  const handleTokenPress = (tokenUrl: string | undefined, creatureName: string) => {
    // Handle token press - could open a larger view
    console.log('Token pressed for:', creatureName);
  };

  const handleSpellPress = async (name: string, source: string) => {
    openSpellModal(name, source);
  };

  const groupedCombatants = getGroupedCombatants();
  const turnOrder = getTurnOrder(combatants, groupByName);
  const styles = createCombatStyles(theme);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <CombatHeader
        combatName={combatName}
        onBackToList={onBackToList}
        onStartCombat={onStartCombat}
        onRandomizeInitiative={onRandomizeInitiative}
        onOpenPlayerModal={openPlayerModal}
        onClearCombat={onClearCombat}
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
                onColorEdit={handleColorEdit}
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
                {group.groupMembers.map((member: Combatant, memberIndex: number) => (
                  <CombatIndividual
                    key={member.id}
                    combatant={member}
                    isActive={isActive}
                    canGroup={group.showGroupButton}
                    onToggleGroup={() => toggleGroupForName(group.nameOrigin)}
                    onValueEdit={handleValueEdit}
                    onColorEdit={handleColorEdit}
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
        contentContainerStyle={{ padding: 16 }}
      />

      <CombatControls
        started={started}
        round={round}
        onClearCombat={onClearCombat}
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

      <ColorPickerModal
        visible={colorPickerModalVisible}
        onClose={handleColorCancel}
        onSelectColor={handleColorSelect}
        currentColor={editingColor?.currentColor}
        theme={theme}
      />

      <SettingsModal
        visible={settingsModalVisible}
        currentConditions={editingStatus?.currentConditions || []}
        onSelect={handleStatusSelect}
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


    </View>
  );
}
