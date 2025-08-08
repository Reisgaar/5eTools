import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { createCombatStyles } from '../../styles/combat';

interface CombatHeaderProps {
  combatName: string;
  onBackToList: () => void;
  onStartCombat: () => void;
  onRandomizeInitiative: () => void;
  onOpenPlayerModal: () => void;
  onClearCombat: () => void;
  started: boolean;
  theme: any;
}

export default function CombatHeader({
  combatName,
  onBackToList,
  onStartCombat,
  onRandomizeInitiative,
  onOpenPlayerModal,
  onClearCombat,
  started,
  theme
}: CombatHeaderProps) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <>
      {/* Header with Back Button and Menu */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: theme.primary }}>
        <TouchableOpacity onPress={onBackToList} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name='arrow-back' size={24} color={theme.text} />
          <Text style={{ color: theme.text, fontWeight: 'bold', marginLeft: 8 }}>{combatName}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 8 }}>
          <Ionicons name='menu' size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Combat Menu Modal */}
      <Modal visible={menuVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.card, borderRadius: 12, padding: 24, width: 280, maxWidth: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: theme.text, marginBottom: 16, textAlign: 'center' }}>Combat Menu</Text>
            
            {!started && (
              <TouchableOpacity onPress={() => { onStartCombat(); setMenuVisible(false); }} style={{ backgroundColor: theme.primary, borderRadius: 8, padding: 12, marginBottom: 8, alignItems: 'center' }}>
                <Text style={{ color: theme.buttonText || 'white', fontWeight: 'bold' }}>Start Combat</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity onPress={() => { onRandomizeInitiative(); setMenuVisible(false); }} style={{ backgroundColor: '#4CAF50', borderRadius: 8, padding: 12, marginBottom: 8, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Randomize Initiative</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { onOpenPlayerModal(); setMenuVisible(false); }} style={{ backgroundColor: '#2196F3', borderRadius: 8, padding: 12, marginBottom: 8, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Players</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { onClearCombat(); setMenuVisible(false); }} style={{ backgroundColor: '#f44336', borderRadius: 8, padding: 12, marginBottom: 8, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear Combat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={{ backgroundColor: '#eee', borderRadius: 8, padding: 12, alignItems: 'center' }}>
              <Text style={{ color: theme.text, fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
