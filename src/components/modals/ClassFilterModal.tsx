import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';
import { createBaseModalStyles } from '../../styles/baseModalStyles';

interface ClassFilterModalProps {
  visible: boolean;
  onClose: () => void;
  classOptions: string[];
  selectedClasses: string[];
  onToggleClass: (className: string) => void;
  onClear: () => void;
  onApply: () => void;
  theme: any;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function ClassFilterModal({
  visible,
  onClose,
  classOptions,
  selectedClasses,
  onToggleClass,
  onClear,
  onApply,
  theme
}: ClassFilterModalProps) {
  const styles = createBaseModalStyles(theme);
  
  return (
    <BaseModal 
      visible={visible} 
      onClose={onClose} 
      theme={theme} 
      title="Filter by Class"
      scrollable={true}
    >
      <TouchableOpacity onPress={onClear} style={[styles.modalButton, styles.modalButtonSecondary, { alignSelf: 'flex-end', marginBottom: 16 }]}> 
        <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Clear</Text>
      </TouchableOpacity>
      
      <View style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}> 
        {classOptions.filter(className => className !== '[object Object]').map(className => (
          <View key={className} style={{ width: '100%' }}>
            <TouchableOpacity
              style={[
                styles.modalListItem, 
                { marginBottom: 4, borderRadius: 6 },
                selectedClasses.includes(className) && styles.modalListItemSelected
              ]}
              onPress={() => onToggleClass(className)}
            >
              <View style={[
                styles.checkbox, 
                { borderColor: theme.primary, backgroundColor: selectedClasses.includes(className) ? theme.primary : 'transparent' }
              ]} />
              <Text style={styles.modalListItemText}>{capitalize(className)}</Text>
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
