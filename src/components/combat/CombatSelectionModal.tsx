import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';
import { CombatSelectionModalProps } from './types';
import { formatDate } from './utils';
import { createCombatStyles } from '../../styles/combat';

export default function CombatSelectionModal({
  visible,
  onClose,
  beastToAdd,
  combats,
  currentCombatId,
  newCombatName,
  quantity,
  onNewCombatNameChange,
  onQuantityChange,
  onSelectCombat,
  onCreateNewCombat,
  theme
}: CombatSelectionModalProps) {
  const styles = createCombatStyles(theme);

  // Create title with beast name
  const modalTitle = `Add ${beastToAdd?.name} to Combat`;

  return (
    <BaseModal
      visible={visible}
      onClose={onClose} 
      theme={theme} 
      title={modalTitle}
    >
          
          {/* Quantity Selector */}
          <View style={styles.selectionContainer}>
            <View style={styles.selectionRow}>
            <Text style={[styles.selectionTitle, { color: theme.text }]}>Quantity</Text>
              <TouchableOpacity 
                onPress={() => {
                  const currentQty = parseInt(quantity, 10) || 1;
                  if (currentQty > 1) {
                    onQuantityChange(String(currentQty - 1));
                  }
                }}
                style={[styles.selectionQuantityBtn, styles.selectionQuantityBtnLeft, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.selectionQuantityBtnText}>-</Text>
              </TouchableOpacity>
              
              <TextInput
                style={[styles.selectionQuantityInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }]}
                value={quantity}
                onChangeText={onQuantityChange}
                keyboardType="numeric"
                textAlign="center"
              />
              
              <TouchableOpacity 
                onPress={() => {
                  const currentQty = parseInt(quantity, 10) || 1;
                  onQuantityChange(String(currentQty + 1));
                }}
                style={[styles.selectionQuantityBtn, styles.selectionQuantityBtnRight, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.selectionQuantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Existing Combats */}
          <View style={styles.selectionSection}>
            <Text style={[styles.selectionSectionTitle, { color: theme.text }]}>Select a combat</Text>
            {!combats || combats.length === 0 ? (
              <Text style={[styles.selectionEmptyText, { color: theme.noticeText }]}>
                Create a combat first.
              </Text>
            ) : (
              <ScrollView style={styles.selectionScrollView}>
                {combats.map(combat => (
                  <TouchableOpacity
                    key={combat.id}
                    onPress={() => onSelectCombat(combat.id)}
                    style={[
                      styles.selectionCombatOption,
                      { backgroundColor: theme.inputBackground, borderColor: currentCombatId === combat.id ? theme.primary : theme.border }
                    ]}
                  >
                    <Text style={[styles.selectionCombatName, { color: theme.text }]}>
                      {combat.name}
                    </Text>
                    <Text style={[styles.selectionCombatInfo, { color: theme.noticeText }]}>
                      {formatDate(combat.createdAt)} • {combat.combatants?.length || 0} creatures
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Create New Combat */}
          <View style={styles.selectionCreateSection}>
            <Text style={[styles.selectionSectionTitle, { color: theme.text }]}>Or create new combat</Text>
            <View style={styles.selectionCreateRow}>
              <TextInput
                style={[
                  styles.selectionCreateInput,
                  { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }
                ]}
                placeholder="New combat name..."
                placeholderTextColor={theme.noticeText}
                value={newCombatName}
                onChangeText={onNewCombatNameChange}
              />
              <TouchableOpacity
                onPress={onCreateNewCombat}
                style={[
                  styles.selectionCreateBtn,
                  { backgroundColor: theme.primary }
                ]}
                disabled={!newCombatName.trim()}
              >
                <Text style={styles.selectionCreateBtnText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
    </BaseModal>
  );
}