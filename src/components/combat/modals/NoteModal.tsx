import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../../ui';
import { createBaseModalStyles } from '../../../styles/baseModalStyles';

interface NoteModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: (note: string) => void;
  currentNote?: string;
  creatureName?: string;
  combatantNumber?: number;
  theme: any;
}

const NoteModal: React.FC<NoteModalProps> = ({
  visible,
  onClose,
  onAccept,
  currentNote = '',
  creatureName = 'Creature',
  combatantNumber,
  theme
}) => {
  const [noteText, setNoteText] = useState(currentNote);
  const styles = createBaseModalStyles(theme);
  
  React.useEffect(() => {
    setNoteText(currentNote);
  }, [currentNote, visible]);

  const handleAccept = () => {
    onAccept(noteText);
    onClose();
  };

  const handleCancel = () => {
    setNoteText(currentNote);
    onClose();
  };

  const modalTitle = "Creature Notes";
  const modalSubtitle = combatantNumber ? `#${combatantNumber} ${creatureName}` : creatureName;

  return (
    <BaseModal 
      visible={visible} 
      onClose={handleCancel} 
      theme={theme} 
      title={modalTitle}
      subtitle={modalSubtitle}
    >
      {/* Notes Section */}
      <View style={styles.modalSection}>
        <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Notes</Text>
        <Text style={[styles.modalNoticeText, { color: theme.noticeText }]}>
          Add notes about this creature for quick reference during combat.
        </Text>
        <TextInput
          style={[styles.noteInput, { 
            backgroundColor: theme.inputBackground, 
            color: theme.text, 
            borderColor: theme.border 
          }]}
          placeholder="Add notes about this creature..."
          placeholderTextColor={theme.noticeText}
          value={noteText}
          onChangeText={setNoteText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalButtonSecondary]}
          onPress={handleCancel}
        >
          <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalButtonPrimary]}
          onPress={handleAccept}
        >
          <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Save</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};



export default NoteModal;
