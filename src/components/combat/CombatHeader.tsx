import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createCombatStyles } from '../../styles/combat';
import { CombatHeaderProps } from './types';

export default function CombatHeader({
  combatName,
  onBackToList,
  onRandomizeInitiative,
  onOpenPlayerModal,
  onEditCombat,
  theme
}: CombatHeaderProps) {
  const styles = createCombatStyles(theme);

  return (
    <View style={[styles.header, { backgroundColor: theme.card }]}>
      <TouchableOpacity onPress={onBackToList} style={styles.headerBackButton}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      
      <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
        {combatName}
      </Text>
      
      <View style={styles.headerActionButtons}>
        {/* Edit Combat Button */}
        <TouchableOpacity 
          onPress={onEditCombat} 
          style={[styles.headerIconButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="settings-outline" size={20} color="white" />
        </TouchableOpacity>
        
        {/* Randomize Initiative Button */}
        <TouchableOpacity 
          onPress={onRandomizeInitiative} 
          style={[styles.headerIconButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="dice-outline" size={20} color="white" />
        </TouchableOpacity>
        
        {/* Add Player Button */}
        <TouchableOpacity 
          onPress={onOpenPlayerModal} 
          style={[styles.headerIconButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="person-add-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
