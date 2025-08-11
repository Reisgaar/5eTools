import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';
import { createBaseModalStyles } from '../../styles/baseModalStyles';

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
  const styles = createBaseModalStyles(theme);
  
  return (
    <BaseModal 
      visible={visible} 
      onClose={onClose} 
      theme={theme} 
      title="Filter by School"
      scrollable={true}
    >
      <TouchableOpacity onPress={onClear} style={[styles.modalButton, styles.modalButtonSecondary, { alignSelf: 'flex-end', marginBottom: 16 }]}> 
        <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Clear</Text>
      </TouchableOpacity>
      
      <View style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}> 
        {schoolOptions.filter(school => school !== '[object Object]').map(school => (
          <View key={school} style={{ width: '100%' }}>
            <TouchableOpacity
              style={[
                styles.modalListItem, 
                { marginBottom: 4, borderRadius: 6 },
                selectedSchools.includes(school) && styles.modalListItemSelected
              ]}
              onPress={() => onToggleSchool(school)}
            >
              <View style={[
                styles.checkbox, 
                { borderColor: theme.primary, backgroundColor: selectedSchools.includes(school) ? theme.primary : 'transparent' }
              ]} />
              <Text style={styles.modalListItemText}>{capitalize(school)}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      <TouchableOpacity onPress={onApply} style={[styles.modalButton, styles.modalButtonPrimary, { marginTop: 20 }]}> 
        <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Apply</Text>
      </TouchableOpacity>
    </BaseModal>
  );
}

const styles = {
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
  },
};
