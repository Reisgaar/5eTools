import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Combat {
  id: string;
  name: string;
  createdAt: number;
  combatants: any[];
  isActive?: boolean;
}

interface CombatListProps {
  combats: Combat[];
  currentCombatId: string | null;
  newCombatName: string;
  onNewCombatNameChange: (name: string) => void;
  onSelectCombat: (combatId: string) => void;
  onCreateCombat: () => void;
  onSetCombatActive: (combatId: string, active: boolean) => void;
  theme: any;
}

export default function CombatList({
  combats,
  currentCombatId,
  newCombatName,
  onNewCombatNameChange,
  onSelectCombat,
  onCreateCombat,
  onSetCombatActive,
  theme
}: CombatListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
        <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 6, marginBottom: 2 }]}>Create New Combat</Text>
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            {/* Create New Combat */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.combatNameInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }]}
                        placeholder="Combat name..."
                        placeholderTextColor={theme.noticeText}
                        value={newCombatName}
                        onChangeText={onNewCombatNameChange} />
                    <TouchableOpacity
                        onPress={onCreateCombat}
                        style={[styles.createBtn, { backgroundColor: theme.primary }]}
                        disabled={!newCombatName.trim()}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 6, marginBottom: 2 }]}>Saved Combats</Text>
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.primary, flex: 1, padding: 0 }]}>
                {/* Existing Combats */}
                <View>
                    {!combats || combats.length === 0 ? (
                        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: theme.noticeText, textAlign: 'center', marginVertical: 8, fontStyle: 'italic', fontSize: 16 }}>No combats created yet</Text>
                        </View>
                    ) : (
                        <ScrollView style={{ height: '100%' }}>
                            <View style={{ flex: 1, padding: 12 }}>
                                {combats.map(combat => (
                                    <View key={combat.id} style={styles.combatListItem}>
                                        <TouchableOpacity
                                            onPress={() => onSelectCombat(combat.id)}
                                            style={[
                                                styles.combatOption,
                                                { backgroundColor: theme.inputBackground },
                                                currentCombatId === combat.id && { borderColor: theme.primary, borderWidth: 2 },
                                                combat.isActive && { borderColor: '#4CAF50', borderWidth: 2 }
                                            ]}
                                        >
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                    <Text style={[styles.combatName, { color: theme.text, marginBottom: 0 }]}>{combat.name}</Text>
                                                    {combat.isActive && (
                                                        <View style={{ backgroundColor: '#4CAF50', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 }}>
                                                            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>ACTIVE</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={[styles.combatCount, { color: theme.noticeText, marginLeft: 8 }]}>
                                                    ({combat.combatants?.length || 0} creatures)
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => onSetCombatActive(combat.id, !combat.isActive)}
                                            style={[styles.activeCombatBtn, { backgroundColor: combat.isActive ? '#4CAF50' : theme.primary }]}
                                        >
                                            <Ionicons name={combat.isActive ? 'pause' : 'play'} size={14} color='white' />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  combatNameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
  createBtn: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  combatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  combatOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  combatName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  combatDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  combatCount: {
    fontSize: 12,
  },
  deleteCombatBtn: {
    padding: 8,
    marginLeft: 8,
  },
  activeCombatBtn: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 