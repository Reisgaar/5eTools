// REACT
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// INTERFACES
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

/**
 * Modal for filtering creatures by CR.
 */
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

    // Pre-compute selected state for better performance
    const selectedSet = useMemo(() => new Set(selectedCRs), [selectedCRs]);

    // Pre-compute filtered options
    const filteredOptions = useMemo(() =>
        crOptions.filter(cr => cr !== '[object Object]'),
    [crOptions]
    );

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title='Filter by CR'
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={onSelectAll}
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
                                ]}
                                />
                                <Text style={[styles.optionText, { color: theme.text }]}>
                                    {sourceIdToNameMap && sourceIdToNameMap[cr] ? sourceIdToNameMap[cr] : (cr === 'Unknown' ? 'Unknown' : cr)}
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
        width: '33%',
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
