// REACT
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// INTERFACES
interface SourceFilterModalProps {
    visible: boolean;
    onClose: () => void;
    sourceOptions: string[];
    selectedSources: string[];
    onToggleSource: (source: string) => void;
    onClear: () => void;
    onApply: () => void;
    theme: any;
    sourceIdToNameMap?: Record<string, string>;
}

/**
 * Modal for filtering creatures by source.
 */
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
    // Pre-compute selected state for better performance
    const selectedSet = useMemo(() => new Set(selectedSources), [selectedSources]);

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title='Filter by Source'
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
            <View style={{ paddingLeft: 10, marginRight: 40 }}>
                {sourceOptions.map(source => {
                    const isSelected = selectedSet.has(source);
                    const displayName = sourceIdToNameMap && sourceIdToNameMap[source.toUpperCase()]
                        ? sourceIdToNameMap[source.toUpperCase()] : source;
                    return (
                        <View key={source} style={{ marginBottom: 8 }}>
                            <TouchableOpacity
                                style={[
                                    styles.optionRow,
                                    { borderColor: theme.border },
                                    isSelected && { backgroundColor: theme.primary + '20' }
                                ]}
                                onPress={() => onToggleSource(source)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    { borderColor: theme.primary },
                                    isSelected && { backgroundColor: theme.primary }
                                ]}
                                />

                                <View style={styles.optionTextContainer}>
                                    <Text style={[styles.optionText, { color: theme.text }]}>
                                        {displayName}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    optionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 14,
    },
    optionAcronym: {
        fontSize: 12,
        marginLeft: 4,
    },
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
});
