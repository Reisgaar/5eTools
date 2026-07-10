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
    // Pre-compute selected state for better performance
    const selectedSet = useMemo(() => new Set(selectedCRs), [selectedCRs]);

    // Pre-compute filtered options
    const filteredOptions = useMemo(() =>
        crOptions.filter(cr => cr !== '[object Object]'),
    [crOptions]
    );
    const commonStyles = getCommonStyles(theme);

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title='Filter by CR'
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, { gap: '4%' }]}>
                    <View style={{ flex: 1 }}>
                        <Button title='Clear' variant='secondary' onPress={onSelectAll} fullWidth />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title='Apply' variant='primary' onPress={onApply} fullWidth />
                    </View>
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
                                    { borderColor: isSelected ? theme.primary : theme.border },
                                    isSelected && { backgroundColor: theme.primary }
                                ]}
                                >
                                    {isSelected && <Ionicons name='checkmark' size={14} color='#fff' />}
                                </View>
                                <Text style={[styles.optionText, commonStyles.text_primary]}>
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
    scrollView: {
        maxHeight: 300,
        marginBottom: styleConstants.marginLG,
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
        paddingVertical: styleConstants.paddingSM,
        paddingHorizontal: styleConstants.paddingXS,
        marginBottom: styleConstants.marginXS,
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
    optionText: {
        fontSize: styleConstants.fontSizeMD,
    },
});
