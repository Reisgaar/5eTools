// REACT
import React, { useMemo } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { getCommonStyles } from 'src/styles/commonStyles';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { BaseModal, Button } from 'src/components/ui';

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
    const commonStyles = getCommonStyles(theme);

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title='Filter by Source'
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, { gap: '4%' }]}>
                    <View style={{ flex: 1 }}>
                        <Button title='Clear' variant='secondary' onPress={onClear} fullWidth />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title='Apply' variant='primary' onPress={onApply} fullWidth />
                    </View>
                </View>
            }
        >
            <View style={[commonStyles.pl_sm, { marginRight: 40 }]}>
                {sourceOptions.map(source => {
                    const isSelected = selectedSet.has(source);
                    const displayName = sourceIdToNameMap && sourceIdToNameMap[source.toUpperCase()]
                        ? sourceIdToNameMap[source.toUpperCase()] : source;
                    return (
                        <View key={source} style={commonStyles.mb_sm}>
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
                                    { borderColor: isSelected ? theme.primary : theme.border },
                                    isSelected && { backgroundColor: theme.primary }
                                ]}
                                >
                                    {isSelected && <Ionicons name='checkmark' size={14} color='#fff' />}
                                </View>

                                <View style={styles.optionTextContainer}>
                                    <Text style={[styles.optionText, commonStyles.text_primary]}>
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
        marginVertical: styleConstants.marginXS,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: styleConstants.borderSM,
        borderRadius: styleConstants.borderRadiusSM,
        marginRight: styleConstants.marginSM,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: styleConstants.fontSizeMD,
    },
    optionAcronym: {
        fontSize: styleConstants.fontSizeSM,
        marginLeft: styleConstants.marginXS,
    },
});
