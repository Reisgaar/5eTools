// REACT
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// INTERFACES
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

/**
 * TypeFilterModal component.
 */
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
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title='Filter by Type'
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={onClear}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApply}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            }
        >
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
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    footerButton: {
        width: '48%',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
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
        marginBottom: 4,
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
});
