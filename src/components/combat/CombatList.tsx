import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createCombatStyles } from '../../styles/combat';
import { CombatListProps } from './types';
import { formatDate } from './utils';

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
  const styles = createCombatStyles(theme);

  return (
    <View style={styles.listContainer}>
        <Text style={[styles.listSectionTitle, { color: theme.text }]}>Create New Combat</Text>
        <View style={[styles.listContainerBox, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            {/* Create New Combat */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.listCombatNameInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }]}
                        placeholder="Combat name..."
                        placeholderTextColor={theme.noticeText}
                        value={newCombatName}
                        onChangeText={onNewCombatNameChange} />
                    <TouchableOpacity
                        onPress={onCreateCombat}
                        style={[styles.listCreateBtn, { backgroundColor: theme.primary }]}
                        disabled={!newCombatName.trim()}
                    >
                        <Text style={styles.listCreateBtnText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <Text style={[styles.listSectionTitle, { color: theme.text }]}>Saved Combats</Text>
        <View style={[styles.listContainerBox, { backgroundColor: theme.card, borderColor: theme.primary, flex: 1, padding: 0 }]}>
                {/* Existing Combats */}
                <View>
                    {!combats || combats.length === 0 ? (
                        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.listEmptyText, { color: theme.noticeText }]}>No combats created yet</Text>
                        </View>
                    ) : (
                        <ScrollView style={{ height: '100%' }}>
                            <View style={{ flex: 1, padding: 12 }}>
                                {combats.map(combat => (
                                    <View key={combat.id} style={styles.listCombatListItem}>
                                        <TouchableOpacity
                                            onPress={() => onSelectCombat(combat.id)}
                                            style={[
                                                styles.listCombatOption,
                                                { backgroundColor: theme.inputBackground },
                                                currentCombatId === combat.id && { borderColor: theme.primary, borderWidth: 2 },
                                                combat.isActive && { borderColor: '#4CAF50', borderWidth: 2 }
                                            ]}
                                        >
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                    <Text style={[styles.listCombatName, { color: theme.text }]}>{combat.name}</Text>
                                                    {combat.isActive ? (
                                                        <View style={styles.listActiveBadge}>
                                                            <Text style={styles.listActiveBadgeText}>ACTIVE</Text>
                                                        </View>
                                                    ) : null}
                                                </View>
                                                <Text style={[styles.listCombatCount, { color: theme.noticeText }]}>
                                                    ({combat.combatants?.length || 0} creatures)
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            onPress={() => onSetCombatActive(combat.id, !combat.isActive)}
                                            style={[
                                                styles.listActiveCombatBtn,
                                                { backgroundColor: combat.isActive ? '#4CAF50' : theme.primary }
                                            ]}
                                        >
                                            <Ionicons 
                                                name={combat.isActive ? 'pause' : 'play'} 
                                                size={14} 
                                                color='white' 
                                            />
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