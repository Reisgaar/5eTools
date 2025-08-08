import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';
import { commonStyles } from '../../styles/commonStyles';

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
  return (
    <BaseModal visible={visible} onClose={onClose} theme={theme} title="Filter by CR">
      <TouchableOpacity onPress={onSelectAll} style={[styles.clearBtn, { borderColor: theme.primary }]}> 
        <Text style={{ color: theme.primary, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Clear</Text>
      </TouchableOpacity>
      <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
        <View style={[commonStyles.row, { flexWrap: 'wrap', justifyContent: 'space-between' }]}> 
          {crOptions.filter(cr => cr !== '[object Object]').map(cr => (
            <View key={String(cr)} style={{ width: '33%' }}>
              <TouchableOpacity
                style={[styles.crOptionRow, selectedCRs.includes(cr) && { backgroundColor: theme.primary + '22' }]}
                onPress={() => onToggleCR(cr)}
              >
                <View style={[styles.checkbox, { borderColor: theme.primary, backgroundColor: selectedCRs.includes(cr) ? theme.primary : 'transparent' }]} />
                <Text style={{ color: theme.text, marginLeft: 8 }}>
                  {sourceIdToNameMap && sourceIdToNameMap[cr] ? sourceIdToNameMap[cr] : (cr === 'Unknown' ? 'Unknown' : cr)}
                </Text>
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
  crOptionRow: {
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
