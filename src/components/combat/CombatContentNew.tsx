import React from 'react';
import { FlatList, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useCombat } from '../../context/CombatContext';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { loadPlayersList } from '../../utils/fileStorage';
import { getCachedTokenUrl } from '../../utils/tokenCache';
import CombatHeader from './CombatHeader';
import CombatControls from './CombatControls';
import CombatGroup from './CombatGroup';
import { PlayerModal, StatusPickerModal, ValueEditModal, ColorPickerModal } from '../modals';
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
  onRemoveCombatant: (id: string) => void;
  onRandomizeInitiative: () => void;
  onClearCombat: () => void;
  onBackToList: () => void;
  theme: any;
  isGroupEnabled: (name: string) => boolean;
  toggleGroupForName: (name: string) => void;
  groupByName: { [name: string]: boolean };
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
  const { getTurnOrder, addPlayerCombatant } = useCombat();
  const { openBeastModal, openSpellModal } = useModal();
  
  // State for modals
  const [playerModalVisible, setPlayerModalVisible] = React.useState(false);
  const [valueEditModalVisible, setValueEditModalVisible] = React.useState(false);
  const [colorPickerModalVisible, setColorPickerModalVisible] = React.useState(false);
  const [statusPickerModalVisible, setStatusPickerModalVisible] = React.useState(false);
  
  // State for editing
  const [editingValue, setEditingValue] = React.useState<{
    type: 'initiative' | 'hp' | 'ac';
    value: number;
    id: string;
    name: string;
    isGroup: boolean;
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
        const cachedUrl = await getCachedTokenUrl(combatant.tokenUrl);
        urls[combatant.id] = cachedUrl;
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
    const groups: { [name: string]: Combatant[] } = {};
    
    combatants.forEach(combatant => {
      if (!groups[combatant.name]) {
        groups[combatant.name] = [];
      }
      groups[combatant.name].push(combatant);
    });
    
    return Object.entries(groups).map(([name, members]) => ({
      name,
      initiative: members[0].initiative,
      passivePerception: members[0].passivePerception,
      groupMembers: members
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

  const handleValueEdit = (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean) => {
    setEditingValue({ type, value, id, name, isGroup });
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
    setEditingStatus({ 
      id, 
      name, 
      currentConditions: currentCondition ? currentCondition.split(', ') : [] 
    });
    setStatusPickerModalVisible(true);
  };

  const handleStatusSelect = (conditions: string[]) => {
    if (editingStatus) {
      onUpdateConditions(editingStatus.id, conditions);
    }
    setStatusPickerModalVisible(false);
    setEditingStatus(null);
  };

  const handleStatusCancel = () => {
    setStatusPickerModalVisible(false);
    setEditingStatus(null);
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
        started={started}
        theme={theme}
      />



      {/* Combat List */}
      <FlatList
        ref={flatListRef}
        data={groupedCombatants}
        keyExtractor={(item) => item.name}
        renderItem={({ item: group, index }) => {
          const isActive = started && turnOrder[index] && turnOrder[index].ids.some(id => 
            combatants.find(c => c.id === id) && 
            turnOrder.findIndex(turn => turn.ids.includes(id)) === turnIndex
          );
          const groupEnabled = isGroupEnabled(group.name);
          
          return (
            <CombatGroup
              group={group}
              isActive={isActive}
              isGroupEnabled={groupEnabled}
              onToggleGroup={() => toggleGroupForName(group.name)}
              onValueEdit={handleValueEdit}
              onColorEdit={handleColorEdit}
              onStatusEdit={handleStatusEdit}
              onCreaturePress={handleCreaturePress}
              onTokenPress={handleTokenPress}
              cachedTokenUrls={cachedTokenUrls}
              theme={theme}
            />
          );
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
        type={editingValue?.type || 'hp'}
        value={editingValue?.value || 0}
        onAccept={handleValueAccept}
        onCancel={handleValueCancel}
        theme={theme}
      />

      <ColorPickerModal
        visible={colorPickerModalVisible}
        currentColor={editingColor?.currentColor}
        onSelect={handleColorSelect}
        onCancel={handleColorCancel}
        theme={theme}
      />

      <StatusPickerModal
        visible={statusPickerModalVisible}
        currentConditions={editingStatus?.currentConditions || []}
        onSelect={handleStatusSelect}
        onCancel={handleStatusCancel}
        theme={theme}
      />


    </View>
  );
}
