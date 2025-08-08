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
  onResetCombat: () => void;
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
  onResetCombat,
  started,
  theme
}: CombatHeaderProps) {
  const styles = createCombatStyles(theme);
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <>
      {/* Header with Back Button and Menu */}
      <View style={[styles.header, { borderBottomColor: theme.primary }]}>
        <TouchableOpacity onPress={onBackToList} style={styles.headerBackButton}>
          <Ionicons name='arrow-back' size={24} color={theme.text} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>{combatName}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerMenuButton}>
          <Ionicons name='menu' size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Combat Menu Modal */}
      <Modal visible={menuVisible} animationType="slide" transparent>
        <View style={styles.headerModal}>
          <View style={[styles.headerModalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.headerModalTitle, { color: theme.text }]}>Combat Menu</Text>
            
            {!started ? (
              <TouchableOpacity 
                onPress={() => { onStartCombat(); setMenuVisible(false); }} 
                style={[styles.headerModalButton, styles.headerModalButtonPrimary, { backgroundColor: theme.primary }]}
              >
                <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextPrimary]}>Start Combat</Text>
              </TouchableOpacity>
            ) : null}
            
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
            
            <TouchableOpacity 
              onPress={() => { onClearCombat(); setMenuVisible(false); }} 
              style={[styles.headerModalButton, styles.headerModalButtonDanger]}
            >
              <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextLight]}>Clear Combat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setMenuVisible(false)} 
              style={[styles.headerModalButton, styles.headerModalButtonSecondary]}
            >
              <Text style={[styles.headerModalButtonText, styles.headerModalButtonTextDark]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
