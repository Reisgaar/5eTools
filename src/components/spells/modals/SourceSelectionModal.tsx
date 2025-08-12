import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SourceOption {
  name: string;
  source: string;
}

interface SourceSelectionModalProps {
  visible: boolean;
  title: string;
  message: string;
  options: SourceOption[];
  onSelect: (option: SourceOption) => void;
  onClose: () => void;
  theme: any;
}

export default function SourceSelectionModal({ 
  visible, 
  title, 
  message, 
  options, 
  onSelect, 
  onClose, 
  theme 
}: SourceSelectionModalProps) {
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
            <Ionicons name="list" size={24} color={theme.primary} />
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          </View>
          
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          
          <View style={styles.content}>
            <Text style={[styles.message, { color: theme.text }]}>
              {message}
            </Text>
            
            <ScrollView style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={`${option.name}-${option.source}-${index}`}
                  style={[styles.option, { borderColor: theme.border }]}
                  onPress={() => onSelect(option)}
                >
                  <Text style={[styles.optionName, { color: theme.text }]}>
                    {option.name}
                  </Text>
                  <Text style={[styles.optionSource, { color: theme.noticeText }]}>
                    {option.source}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
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
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
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
    flex: 1,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    maxHeight: 300,
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionSource: {
    fontSize: 14,
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
  separator: {
    height: 1,
    marginVertical: 16,
  },
});
