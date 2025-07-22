import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { commonStyles } from 'src/style/styles';

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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}> 
          <Text style={[styles.modalTitle, { color: theme.text }]}>Filter by Type</Text>
          <TouchableOpacity onPress={onClear} style={[styles.clearBtn, { borderColor: theme.primary }]}> 
            <Text style={{ color: theme.primary, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Clear</Text>
          </TouchableOpacity>
          <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
            <View style={[commonStyles.row, { flexWrap: 'wrap', justifyContent: 'space-between' }]}> 
              {typeOptions.filter(type => type !== '[object Object]').map(type => (
                <View key={type} style={{ width: '50%' }}>
                  <TouchableOpacity
                    style={[styles.typeOptionRow, selectedTypes.includes(type) && { backgroundColor: theme.primary + '22' }]}
                    onPress={() => onToggleType(type)}
                  >
                    <View style={[styles.checkbox, { borderColor: theme.primary, backgroundColor: selectedTypes.includes(type) ? theme.primary : 'transparent' }]} />
                    <Text style={{ color: theme.text, marginLeft: 8 }}>{capitalize(type)}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onApply} style={[styles.applyBtn, { backgroundColor: theme.primary }]}> 
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Apply</Text>
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
  clearBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    marginBottom: 6,
    minHeight: 24,
    minWidth: 48,
    position: 'absolute',
    right: 15,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  typeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 4,
  },
}); 