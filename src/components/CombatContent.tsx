import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, findNodeHandle } from 'react-native';
import { useCombat } from '../context/CombatContext';
import { useData } from '../context/DataContext';
import { useModal } from '../context/ModalContext';
import { loadPlayersList } from '../utils/fileStorage';
import ColorPickerModal from './ColorPickerModal';
import StatusPickerModal from './StatusPickerModal';
import ValueEditModal from './ValueEditModal';

interface Combatant {
    id: string;
    name: string;
    source: string;
    tokenUrl?: string;
    maxHp: number;
    currentHp: number;
    initiative: number;
    ac: number; // Armor Class
    color?: string; // Custom color for the beast container
    conditions?: string[]; // Status conditions for the combatant
}

interface CombatContentProps {
    combatants: Combatant[];
    combatName: string;
    onUpdateHp: (id: string, newHp: number) => void;
    onUpdateAc: (id: string, newAc: number) => void;
    onUpdateInitiative: (id: string, newInit: number) => void;
    onUpdateInitiativeForGroup: (name: string, newInit: number) => void;
    onUpdateColor: (id: string, color: string | null) => void;
    onUpdateConditions: (id: string, conditions: string[]) => void; // <-- add this
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

// Displays and manages the combat interface, including combatants, initiative, and group actions.
export default function CombatContent({
  combatants,
  combatName,
  onUpdateHp,
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
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [valueEditModalVisible, setValueEditModalVisible] = React.useState(false);
  const [colorPickerModalVisible, setColorPickerModalVisible] = React.useState(false);
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
  const flatListRef = React.useRef<FlatList>(null);
  const cardRefs = React.useRef<{ [key: string]: View | null }>({});
  // Add refs for each card
  const cardPositions = React.useRef<{ [groupId: string]: number }>({});
  const [playerModalVisible, setPlayerModalVisible] = React.useState(false);
  const [allPlayers, setAllPlayers] = React.useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);
  const { simpleBeasts, simpleSpells, getFullBeast, getFullSpell } = useData();
  const [statusPickerModalVisible, setStatusPickerModalVisible] = React.useState(false);
  const [editingStatus, setEditingStatus] = React.useState<{ id: string; name: string; currentColor?: string; currentCondition?: string } | null>(null);
  const [statusModalConditions, setStatusModalConditions] = React.useState<string[]>([]);

  // Load players when modal opens
  const openPlayerModal = async () => {
    const players = await loadPlayersList();
    setAllPlayers(players);
    setSelectedPlayers([]);
    setPlayerModalVisible(true);
  };

  // Add selected players to combat
  const handleAddPlayersToCombat = () => {
    selectedPlayers.forEach(name => {
      const player = allPlayers.find(p => p.name === name);
      if (player) {
        addPlayerCombatant(player);
      }
    });
    setPlayerModalVisible(false);
  };

  // Group combatants by name if grouping is enabled for that name
  const getGroupedCombatants = () => {
    const groups = new Map<string, any[]>();
    combatants.forEach(c => {
      if (!groups.has(c.name)) {
        groups.set(c.name, []);
      }
      groups.get(c.name)!.push(c);
    });
    return Array.from(groups.entries()).map(([name, members]) => {
      const grouped = isGroupEnabled(name);
      if (grouped) {
        return {
          ...members[0],
          groupId: name,
          groupMembers: members,
          grouped: true
        };
      } else {
        // Each member is its own group
        return members.map(m => ({ ...m, groupId: m.id, groupMembers: [m], grouped: false }));
      }
    }).flat();
  };

  // Sort combatants by initiative (high to low)
  const sortedCombatants = getGroupedCombatants().sort((a, b) => b.initiative - a.initiative);

  // Compute turn order for highlighting
  const turnOrder = getTurnOrder(combatants, groupByName);

  // Find the groupId(s) for the current turn
  const currentTurnIds = turnOrder[turnIndex]?.ids || [];

  // Scroll to current turn when it changes
  React.useEffect(() => {
    if (!flatListRef.current || !started) return;
    const idx = sortedCombatants.findIndex(c => currentTurnIds.includes(c.grouped ? c.groupId : c.id));
    if (idx === -1) return;
    const group = sortedCombatants[idx];
    const groupId = group.grouped ? group.groupId : group.id;
    const ref = cardRefs.current[groupId];
    if (ref) {
      setTimeout(() => {
        const handle = findNodeHandle(ref);
        const flatListHandle = findNodeHandle(flatListRef.current);
        if (typeof handle === 'number' && typeof flatListHandle === 'number') {
          ref.measureLayout(
            flatListHandle,
            (x, y) => {
              flatListRef.current?.scrollToOffset({ offset: Math.max(0, y - 40), animated: true });
            },
            () => {}
          );
        }
      }, 100);
    }
  }, [turnIndex, started, sortedCombatants, currentTurnIds]);

  const handleValueEdit = (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean) => {
    setEditingValue({ type, value, id, name, isGroup });
    setValueEditModalVisible(true);
  };

  const handleValueAccept = (newValue: number) => {
    if (!editingValue) return;

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

    setEditingValue(null);
    setValueEditModalVisible(false);
  };

  const handleValueCancel = () => {
    setEditingValue(null);
    setValueEditModalVisible(false);
  };

  const handleColorEdit = (id: string, name: string, currentColor?: string) => {
    setEditingColor({ id, name, currentColor });
    setColorPickerModalVisible(true);
  };

  const handleColorSelect = (color: string | null) => {
    if (editingColor) {
      onUpdateColor(editingColor.id, color);
    }
    setEditingColor(null);
    setColorPickerModalVisible(false);
  };

  const handleColorCancel = () => {
    setEditingColor(null);
    setColorPickerModalVisible(false);
  };

  const handleStatusEdit = (id: string, name: string, currentColor?: string, currentCondition?: string) => {
    // Find the current conditions for this combatant
    const member = combatants.find(c => c.id === id);
    setStatusModalConditions(Array.isArray(member?.conditions) ? member.conditions : []);
    setEditingStatus({ id, name, currentColor, currentCondition });
    setStatusPickerModalVisible(true);
  };

  const handleStatusSelect = (conditions: string[]) => {
    if (editingStatus) {
      onUpdateConditions(editingStatus.id, conditions);
    }
    setEditingStatus(null);
    setStatusPickerModalVisible(false);
  };

  const handleStatusCancel = () => {
    setEditingStatus(null);
    setStatusPickerModalVisible(false);
  };

  // Handler for opening a beast modal from a tag
  const handleCreaturePress = async (name: string, source: string) => {
    const beast = simpleBeasts.find(b => b.name.trim().toLowerCase() === name.trim().toLowerCase() && b.source.trim().toLowerCase() === source.trim().toLowerCase());
    if (beast) {
      openBeastModal(beast);
    }
  };

  // Handler for opening a spell modal from a tag
  const handleSpellPress = async (name: string, source: string) => {
    const spell = simpleSpells.find(s => s.name.trim().toLowerCase() === name.trim().toLowerCase() && s.source.trim().toLowerCase() === source.trim().toLowerCase());
    if (spell) {
      openSpellModal(spell);
    }
  };

  return (
    <>
      {/* Header with Back Button and Menu */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: theme.primary }}>
        <TouchableOpacity 
          onPress={onBackToList}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name='arrow-back' size={24} color={theme.primary} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, marginLeft: 8 }}>{combatName}</Text>
        </TouchableOpacity>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={{ padding: 8 }}>
            <Ionicons name='ellipsis-vertical' size={24} color={theme.primary} />
          </TouchableOpacity>
          {/* Menu Dropdown */}
          {menuVisible && (
            <View style={[styles.menu, { backgroundColor: theme.card, borderColor: theme.primary }]}>              
              {!started && (
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    onStartCombat();
                    setMenuVisible(false);
                  }}
                >
                  <Ionicons name='play' size={20} color={theme.primary} />
                  <Text style={[styles.menuText, { color: theme.text }]}>Start Combat</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  onRandomizeInitiative();
                  setMenuVisible(false);
                }}
              >
                <Ionicons name='dice' size={20} color={theme.primary} />
                <Text style={[styles.menuText, { color: theme.text }]}>Randomize Initiative</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  openPlayerModal();
                  setMenuVisible(false);
                }}
              >
                <Ionicons name='person-add' size={20} color={theme.primary} />
                <Text style={[styles.menuText, { color: theme.text }]}>Add Players</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  onClearCombat();
                  setMenuVisible(false);
                }}
              >
                <Ionicons name='trash' size={20} color='#c00' />
                <Text style={[styles.menuText, { color: '#c00' }]}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={{ flex: 1, padding: 0 }}>

        {/* Value Edit Modal */}
        <ValueEditModal
          visible={valueEditModalVisible}
          onClose={handleValueCancel}
          onAccept={handleValueAccept}
          title={editingValue ? `${editingValue.type === 'initiative' ? 'Initiative' : editingValue.type === 'hp' ? 'HP' : 'AC'} - ${editingValue.name}` : ''}
          initialValue={editingValue?.value || 0}
          theme={theme}
        />

        {/* Color Picker Modal */}
        <ColorPickerModal
          visible={colorPickerModalVisible}
          onClose={handleColorCancel}
          onSelectColor={handleColorSelect}
          currentColor={editingColor?.currentColor}
          theme={theme}
        />

        {/* Status Picker Modal */}
        <StatusPickerModal
          visible={statusPickerModalVisible}
          onClose={handleStatusCancel}
          onSelect={handleStatusSelect}
          theme={theme}
          currentConditions={statusModalConditions}
        />

        {/* Combat Content */}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={sortedCombatants}
            keyExtractor={item => item.groupId}
            contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 0 }}
            ListEmptyComponent={<Text style={{ color: theme.noticeText, fontSize: 16 }}>No monsters in combat. Add from Bestiary.</Text>}
            renderItem={({ item: group, index: idx }) => (
              <View
                ref={el => { cardRefs.current[group.grouped ? group.groupId : group.id] = el; }}
                style={[
                  styles.card,
                  { backgroundColor: theme.card, borderColor: theme.primary, marginBottom: 12 },
                  started && (
                    (group.grouped && group.groupMembers.some((m: any) => currentTurnIds.includes(m.id))) ||
                    (!group.grouped && currentTurnIds.includes(group.id))
                  ) ? { borderColor: '#4ade80', borderWidth: 3 } : null
                ]}
              >
                {/* Per-group grouping toggle as icon, absolutely positioned top right */}
                {combatants.filter(c => c.name === group.name).length > 1 && (
                  <TouchableOpacity
                    onPress={() => toggleGroupForName(group.name)}
                    style={{ position: 'absolute', top: 2, right: 2, zIndex: 10, padding: 1, backgroundColor: theme.primary, borderRadius: 100 }}
                  >
                    <Ionicons
                      name={group.grouped ? 'expand' : 'contract'}
                      size={20}
                      color={'white'}
                    />
                  </TouchableOpacity>
                )}
                <View style={{ marginBottom: 5, marginTop: -5, width: 80, justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => handleCreaturePress(group.name, group.source)}
                  >
                    {group.tokenUrl ? (
                      <Image 
                        source={{ uri: group.tokenUrl }}
                        height={60} 
                        width={60}
                        onError={() => console.log(`Failed to load token for ${group.name}`)}
                      />) : (
                          <View style={{ backgroundColor: theme.primary, height: 60, width: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>No token</Text>
                          </View>
                    )}
                  </TouchableOpacity> 
                  {/* Initiative Display - Tap to Edit */}
                  <View style={{ position: 'absolute', bottom: -10, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity 
                      onPress={() => handleValueEdit('initiative', group.initiative, group.id, group.name, group.grouped)}
                      style={[styles.valueDisplay, { backgroundColor: theme.primary }]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="walk" size={16} color={'white'} style={{ marginRight: 4 }} />
                        <Text style={[styles.valueText, { color: 'white' }]}> {group.initiative} </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => handleCreaturePress(group.name, group.source)}
                    >
                      <Text style={[styles.name, { color: theme.text }]}> {group.name}</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Show individual HP controls for each member in the group */}
                  {group.groupMembers.map((member: any, index: number) => (
                    <View key={member.id} style={{ marginBottom: 6 }}>
                      <View
                        style={[
                          styles.row, 
                          { 
                            borderWidth: 1, 
                            borderColor: theme.primary, 
                            borderRadius: 8, 
                            paddingVertical: 4, 
                            paddingHorizontal: 4,
                            backgroundColor: member.color || 'transparent',
                            marginBottom: 0,
                            marginLeft: 20
                          }
                        ]}
                      > 
                        {group.grouped && group.groupMembers.length > 1 && (
                          <Text style={{ position: 'absolute', right: '100%', marginRight: 12, color: theme.text, fontSize: 12 }}>#{index + 1}</Text>
                        )}
                        <View style={[styles.row, { flex: 1, justifyContent: 'space-between', marginBottom: 0 }]}> 
                            <TouchableOpacity 
                              onPress={() => handleValueEdit('ac', member.ac, member.id, member.name, false)}
                              style={[styles.valueDisplay, { backgroundColor: theme.primary }]}
                            >
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="shield-outline" size={16} color={'white'} style={{ marginRight: 4 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                  {member.ac}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={() => handleValueEdit('hp', member.currentHp, member.id, member.name, false)}
                              style={[styles.valueDisplay, { backgroundColor: theme.primary }]}
                            >
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="heart" size={16} color="#ff4444" style={{ marginRight: 4 }} />
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                  {member.currentHp}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={() => handleStatusEdit(member.id, member.name, member.color, member.condition)}
                              style={[styles.colorButton, { backgroundColor: theme.primary }]}
                            >
                              <Ionicons name="alert-circle" size={16} color={'white'} />
                            </TouchableOpacity>
                          <TouchableOpacity onPress={() => onRemoveCombatant(member.id)} style={[styles.removeBtn, { backgroundColor: '#cc0000' }]}>
                            <Ionicons name='trash' size={16} color='white' />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{marginLeft: 20}}>
                        {Array.isArray(member.conditions) && member.conditions.length > 0 && (
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 6 }}>
                            {member.conditions.map((cond: string, idx: number) => (
                              <Text
                                key={cond + idx}
                                style={{
                                  backgroundColor: theme.primary,
                                  color: 'white',
                                  borderBottomLeftRadius: 6,
                                  borderBottomRightRadius: 6,
                                  borderTopWidth: 0,
                                  borderBottomWidth: 1,
                                  borderLeftWidth: 1,
                                  borderRightWidth: 1,
                                  borderColor: theme.primary,
                                  paddingHorizontal: 2,
                                  marginHorizontal: 2,
                                  fontSize: 8,
                                  maxWidth: 80,
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {cond}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          />
          {/* Bottom Turn/Round Controls */}
          {started && (
            <View style={{ backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 4, paddingHorizontal: 16 }}>
              <TouchableOpacity onPress={onClearCombat} style={{ backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginRight: 16, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name='stop' size={18} color={'#c00'} style={{ marginRight: 4 }} />
                <Text style={{ color: '#c00', fontWeight: 'bold', fontSize: 12 }}>Finish</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.text, marginRight: 16 }}>Round {round}</Text>
              <TouchableOpacity onPress={onNextTurn} style={{ backgroundColor: theme.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 4, marginLeft: 8 }}>
                <Text style={{ color: theme.buttonText || 'white', fontWeight: 'bold', fontSize: 12 }}>Next Turn</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {/* Add Players Modal */}
      <Modal visible={playerModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.card, borderRadius: 12, padding: 24, width: 320, maxWidth: '90%', maxHeight: Dimensions.get('window').height * 0.7 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: theme.text, marginBottom: 12 }}>Add Players to Combat</Text>
              <FlatList
                data={allPlayers}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.name}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                    onPress={() => {
                      setSelectedPlayers(sel => sel.includes(item.name)
                        ? sel.filter(n => n !== item.name)
                        : [...sel, item.name]);
                    }}
                  >
                    <Ionicons
                      name={selectedPlayers.includes(item.name) ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={theme.primary}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{ color: theme.text, fontWeight: 'bold' }}>{item.name}</Text>
                    <Text style={{ color: theme.text, marginLeft: 8, fontSize: 12 }}>{item.race} - {item.class}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={{ color: theme.noticeText, textAlign: 'center' }}>No players found.</Text>}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setPlayerModalVisible(false)} style={[styles.menuItem, { backgroundColor: '#eee', borderRadius: 8, flex: 1, marginRight: 8 }]}> 
                  <Text style={{ color: theme.text, textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddPlayersToCombat} style={[styles.menuItem, { backgroundColor: theme.primary, borderRadius: 8, flex: 1, marginLeft: 8 }]}> 
                  <Text style={{ color: theme.buttonText || 'white', textAlign: 'center', fontWeight: 'bold' }}>Add</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 14,
    borderWidth: 2,
    padding: 8,
    marginRight: 16,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hpBtn: {
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
  },
  hpBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hpInput: {
    borderWidth: 1,
    borderRadius: 6,
    width: 40,
    textAlign: 'center',
    marginHorizontal: 2,
    fontSize: 16,
    paddingVertical: 2,
  },
  initInput: {
    borderWidth: 1,
    borderRadius: 6,
    width: 30,
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 2,
  },
  removeBtn: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
  },
  menu: {
    position: 'absolute',
    top: 40,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    minWidth: 180,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
  },
  valueDisplay: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
}); 