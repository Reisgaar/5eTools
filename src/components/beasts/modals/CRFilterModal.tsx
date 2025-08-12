import React, { useMemo } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useModal } from '../../../context/ModalContext';
import { getModalZIndex } from '../../../styles/modals';

interface CRFilterModalProps {
  visible: boolean;
  onClose: () => void;
  crOptions: string[];
  selectedCRs: string[];
  onToggleCR: (cr: string | number) => void;
  onSelectAll: () => void;
  onApply: () => void;
  theme: any;
  sourceIdToNameMap?: Record<string, string>;
}

export default function CRFilterModal({
  visible,
  onClose,
  crOptions,
  selectedCRs,
  onToggleCR,
  onSelectAll,
  onApply,
  theme,
  sourceIdToNameMap
}: CRFilterModalProps) {
  const { beastStackDepth, spellStackDepth } = useModal();
  const maxStackDepth = Math.max(beastStackDepth, spellStackDepth);
  const dynamicZIndex = getModalZIndex(maxStackDepth + 1); // Filter modals should be above other modals
  
  // Pre-compute selected state for better performance
  const selectedSet = useMemo(() => new Set(selectedCRs), [selectedCRs]);
  
  // Pre-compute filtered options
  const filteredOptions = useMemo(() => 
    crOptions.filter(cr => cr !== '[object Object]'), 
    [crOptions]
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={[styles.modalOverlay, { zIndex: dynamicZIndex }]} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.modalContent, { backgroundColor: theme.card, zIndex: dynamicZIndex }]} activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Filter by CR
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          <View style={styles.modalBody}>
            <TouchableOpacity 
              onPress={onSelectAll} 
              style={[styles.clearButton, { borderColor: theme.primary }]}
            > 
              <Text style={[styles.clearButtonText, { color: theme.primary }]}>Clear</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.scrollView}>
              <View style={styles.optionsGrid}> 
                {filteredOptions.map(cr => {
                  const isSelected = selectedSet.has(cr);
                  return (
                    <View key={String(cr)} style={styles.optionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.optionRow, 
                          { borderColor: theme.border },
                          isSelected && { backgroundColor: theme.primary + '20' }
                        ]}
                        onPress={() => onToggleCR(cr)}
                      >
                        <View style={[
                          styles.checkbox, 
                          { borderColor: theme.primary },
                          isSelected && { backgroundColor: theme.primary }
                        ]} />
                        <Text style={[styles.optionText, { color: theme.text }]}>
                          {sourceIdToNameMap && sourceIdToNameMap[cr] ? sourceIdToNameMap[cr] : (cr === 'Unknown' ? 'Unknown' : cr)}
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
    width: '33%',
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
