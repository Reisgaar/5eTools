import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreatureNotFoundModalProps {
  visible: boolean;
  creatureName: string;
  onClose: () => void;
  theme: any;
}

export default function CreatureNotFoundModal({ 
  visible, 
  creatureName, 
  onClose, 
  theme 
}: CreatureNotFoundModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modal, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.header}>
            <Ionicons name="alert-circle" size={24} color="#f44336" />
            <Text style={[styles.title, { color: theme.text }]}>Creature Not Found</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.message, { color: theme.text }]}>
              The creature "{creatureName}" could not be found in the available sources.
            </Text>
            <Text style={[styles.subMessage, { color: theme.noticeText }]}>
              This creature may not be available in the current data set or may have a different name.
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
