// REACT
import React, { useMemo } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

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
    const commonStyles = getCommonStyles(theme);
    // Pre-compute selected state for better performance
    const selectedSet = useMemo(() => new Set(selectedTypes), [selectedTypes]);

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title='Filter by Type'
            footerContent={
                <View style={[commonStyles.row_center_center, commonStyles.w_100, { gap: '4%' }]}>
                    <TouchableOpacity
                        onPress={onClear}
                        style={[styles.footerButton, { backgroundColor: theme.secondary }]}
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
                {typeOptions.map(rawType => {
                    // Defensive: never call string ops on a non-string (some data sources
                    // provide object types); the filter hook already normalizes, this is a guard.
                    const type = typeof rawType === 'string' ? rawType : String(rawType);
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
                                <Text style={[styles.optionText, commonStyles.text_primary]}>
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
        borderRadius: styleConstants.borderRadiusMD,
        paddingVertical: styleConstants.paddingMD,
        alignItems: 'center',
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeLG,
    },
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
        width: '50%',
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
    },
    optionText: {
        fontSize: styleConstants.fontSizeMD,
    },
});
