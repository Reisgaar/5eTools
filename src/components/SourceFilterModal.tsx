import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { commonStyles } from 'src/style/styles';

interface SourceFilterModalProps {
  visible: boolean;
  onClose: () => void;
  sourceOptions: string[];
  selectedSources: string[];
  onToggleSource: (source: string) => void;
  onClear: () => void;
  onApply: () => void;
  theme: any;
  sourceIdToNameMap: Record<string, string>;
}

export default function SourceFilterModal({
  visible,
  onClose,
  sourceOptions,
  selectedSources,
  onToggleSource,
  onClear,
  onApply,
  theme,
  sourceIdToNameMap
}: SourceFilterModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}> 
          <Text style={[styles.modalTitle, { color: theme.text }]}>Filter by Source</Text>
          <TouchableOpacity onPress={onClear} style={[styles.clearBtn, { borderColor: theme.primary }]}> 
            <Text style={{ color: theme.primary, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Clear</Text>
          </TouchableOpacity>
          <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
            <View style={[commonStyles.row, { flexWrap: 'wrap', justifyContent: 'space-between' }]}> 
              {sourceOptions
                .filter(source => source !== '[object Object]')
                .map(source => ({
                  id: source,
                  name: sourceIdToNameMap[source.toUpperCase()] ? sourceIdToNameMap[source.toUpperCase()] : source.toUpperCase()
                }))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(({ id, name }) => (
                <View key={id} style={{ width: '100%' }}>
                  <TouchableOpacity
                    style={[styles.sourceOptionRow, selectedSources.includes(id) && { backgroundColor: theme.primary + '22' }]}
                    onPress={() => onToggleSource(id)}
                  >
                    <View style={[styles.checkbox, { borderColor: theme.primary, backgroundColor: selectedSources.includes(id) ? theme.primary : 'transparent' }]} />
                    <Text style={{ color: theme.text, marginLeft: 8 }}>
                      {name}
                    </Text>
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
  sourceOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 0,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 4,
  },
}); 