import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BaseModal from './BaseModal';
import { commonStyles } from 'src/styles/commonStyles';

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
    <BaseModal visible={visible} onClose={onClose} theme={theme} title="Filter by Type">
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
    </BaseModal>
  );
}

const styles = {
  clearBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end' as const,
    marginBottom: 6,
    minHeight: 24,
    minWidth: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  applyBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  typeOptionRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
};