import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createCombatStyles } from '../../styles/combat';
import BaseModal from '../ui/BaseModal';

interface CombatHeaderProps {
  combatName: string;
  onBackToList: () => void;
  onStartCombat: () => void;
  onStopCombat: () => void;
  onRandomizeInitiative: () => void;
  onOpenPlayerModal: () => void;
  onResetCombat: () => void;
  started: boolean;
  theme: any;
}

export default function CombatHeader({
  combatName,
  onBackToList,
  onStartCombat,
  onStopCombat,
  onRandomizeInitiative,
  onOpenPlayerModal,
  onResetCombat,
  started,
  theme
}: CombatHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const styles = createCombatStyles(theme);

  return (
    <>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={onBackToList} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {combatName}
        </Text>
        
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerMenuButton}>
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <BaseModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)}
        theme={theme}
        title="Combat Menu"
      >
        <View style={styles.headerModalContent}>
          {!started ? (
            <TouchableOpacity 
              onPress={() => { onStartCombat(); setMenuVisible(false); }} 
              style={[styles.headerModalButton, styles.headerModalButtonPrimary, { backgroundColor: theme.primary }]}
            >
              <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextPrimary]}>Start Combat</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => { onStopCombat(); setMenuVisible(false); }} 
              style={[styles.headerModalButton, styles.headerModalButtonDanger]}
            >
              <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextLight]}>Stop Combat</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={() => { onRandomizeInitiative(); setMenuVisible(false); }} 
            style={[styles.headerModalButton, styles.headerModalButtonSuccess]}
          >
            <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextLight]}>Randomize Initiative</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => { onOpenPlayerModal(); setMenuVisible(false); }} 
            style={[styles.headerModalButton, styles.headerModalButtonInfo]}
          >
            <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextLight]}>Add Players</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => { onResetCombat(); setMenuVisible(false); }} 
            style={[styles.headerModalButton, styles.headerModalButtonInfo]}
          >
            <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextLight]}>Reset Combat</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
    </>
  );
}
