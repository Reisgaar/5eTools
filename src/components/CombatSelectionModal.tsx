import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Combat {
  id: string;
  name: string;
  createdAt: number;
  combatants: any[];
}

interface CombatSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  beastToAdd: any | null;
  combats: Combat[];
  currentCombatId: string | null;
  newCombatName: string;
  quantity: string;
  onNewCombatNameChange: (name: string) => void;
  onQuantityChange: (quantity: string) => void;
  onSelectCombat: (combatId: string) => void;
  onCreateNewCombat: () => void;
  theme: any;
}

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
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}> 
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Add {beastToAdd?.name} to Combat
          </Text>
          
          {/* Quantity Selector */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginRight: 8, marginBottom: 0 }]}>Quantity</Text>
              <TouchableOpacity 
                onPress={() => {
                  const currentQty = parseInt(quantity, 10) || 1;
                  if (currentQty > 1) {
                    onQuantityChange(String(currentQty - 1));
                  }
                }}
                style={[styles.quantityBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              
              <TextInput
                style={[styles.quantityInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }]}
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
                style={[styles.quantityBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Existing Combats */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Select a combat</Text>
            {combats.length === 0 ? (
              <Text style={{ color: theme.noticeText, textAlign: 'center', marginVertical: 8 }}>
                Create a combat first.
              </Text>
            ) : (
              <ScrollView style={{ maxHeight: 200 }}>
                {combats.map(combat => (
                  <TouchableOpacity
                    key={combat.id}
                    onPress={() => onSelectCombat(combat.id)}
                    style={[
                      styles.combatOption,
                      { backgroundColor: theme.inputBackground, borderColor: theme.primary, borderWidth: 1 },
                      currentCombatId === combat.id && { borderColor: theme.primary, borderWidth: 2 }
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.combatName, { color: theme.text }]}>{combat.name}</Text>
                        <Text style={[styles.combatCount, { color: theme.noticeText }]}>
                        ({combat.combatants.length} creatures)
                        </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity 
            onPress={onClose}
            style={[styles.cancelBtn, { borderColor: theme.primary }]}
          > 
            <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'stretch',
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityInput: {
    width: 60,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: 'bold',
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
  combatOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  combatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  combatDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  combatCount: {
    fontSize: 12,
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
}); 