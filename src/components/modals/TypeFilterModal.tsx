import React, { useMemo } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TypeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  typeOptions: string[];
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  onClear: () => void;
  onApply: () => void;
  theme: any;
}

export default function TypeFilterModal({
  visible,
  onClose,
  typeOptions,
  selectedTypes,
  onToggleType,
  onClear,
  onApply,
  theme
}: TypeFilterModalProps) {
  // Pre-compute selected state for better performance
  const selectedSet = useMemo(() => new Set(selectedTypes), [selectedTypes]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.modalContent, { backgroundColor: theme.card }]} activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Filter by Type
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          <View style={styles.modalBody}>
            <TouchableOpacity 
              onPress={onClear} 
              style={[styles.clearButton, { borderColor: theme.primary }]}
            > 
              <Text style={[styles.clearButtonText, { color: theme.primary }]}>Clear</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.scrollView}>
              <View style={styles.optionsGrid}> 
                {typeOptions.map(type => {
                  const isSelected = selectedSet.has(type);
                  return (
                    <View key={type} style={styles.optionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.optionRow, 
                          { borderColor: theme.border },
                          isSelected && { backgroundColor: theme.primary + '20' }
                        ]}
                        onPress={() => onToggleType(type)}
                      >
                        <View style={[
                          styles.checkbox, 
                          { borderColor: theme.primary },
                          isSelected && { backgroundColor: theme.primary }
                        ]} />
                        <Text style={[styles.optionText, { color: theme.text }]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              onPress={onApply} 
              style={[styles.applyButton, { backgroundColor: theme.primary }]}
            > 
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 0,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  separator: {
    height: 1,
    marginBottom: 0,
  },
  modalBody: {
    padding: 20,
  },
  clearButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    marginBottom: 16,
    minHeight: 24,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  scrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionContainer: {
    width: '50%',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
  },
  applyButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});