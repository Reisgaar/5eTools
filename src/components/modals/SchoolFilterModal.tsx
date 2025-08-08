import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';
import { commonStyles } from '../../styles/commonStyles';

interface SchoolFilterModalProps {
  visible: boolean;
  onClose: () => void;
  schoolOptions: string[];
  selectedSchools: string[];
  onToggleSchool: (school: string) => void;
  onClear: () => void;
  onApply: () => void;
  theme: any;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function SchoolFilterModal({
  visible,
  onClose,
  schoolOptions,
  selectedSchools,
  onToggleSchool,
  onClear,
  onApply,
  theme
}: SchoolFilterModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose} theme={theme} title="Filter by School">
      <TouchableOpacity onPress={onClear} style={[styles.clearBtn, { borderColor: theme.primary }]}> 
        <Text style={{ color: theme.primary, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Clear</Text>
      </TouchableOpacity>
      <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
        <View style={[commonStyles.row, { flexWrap: 'wrap', justifyContent: 'space-between' }]}> 
          {schoolOptions.filter(school => school !== '[object Object]').map(school => (
            <View key={school} style={{ width: '100%' }}>
              <TouchableOpacity
                style={[styles.schoolOptionRow, selectedSchools.includes(school) && { backgroundColor: theme.primary + '22' }]}
                onPress={() => onToggleSchool(school)}
              >
                <View style={[styles.checkbox, { borderColor: theme.primary, backgroundColor: selectedSchools.includes(school) ? theme.primary : 'transparent' }]} />
                <Text style={{ color: theme.text, marginLeft: 8 }}>{capitalize(school)}</Text>
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
  schoolOptionRow: {
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
