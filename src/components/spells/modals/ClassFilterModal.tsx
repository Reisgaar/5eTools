// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { BaseModal, Button } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
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

/**
 * ClassFilterModal component.
 */
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
    const commonStyles = getCommonStyles(theme);

    // Filter out invalid options
    const validClassOptions = classOptions.filter(className => className !== '[object Object]');

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Filter by Class"
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, commonStyles.gap_sm]}>
                    <View style={{ flex: 1 }}><Button title="Clear" variant="secondary" onPress={onClear} fullWidth /></View>
                    <View style={{ flex: 1 }}><Button title="Apply" variant="primary" onPress={onApply} fullWidth /></View>
                </View>
            }
        >
            <View style={styles.optionsGrid}>
                {validClassOptions.map(className => {
                    const isSelected = selectedClasses.includes(className);
                    return (
                        <View key={className} style={styles.optionContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionRow,
                                    { borderColor: theme.border },
                                    isSelected && { backgroundColor: theme.primary + '20' }
                                ]}
                                onPress={() => onToggleClass(className)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    isSelected ? { backgroundColor: theme.primary, borderColor: theme.primary } : { borderColor: theme.border }
                                ]}>
                                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                                </View>
                                <Text style={[styles.optionText, commonStyles.text_primary]}>
                                    {capitalize(className)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </BaseModal>
    );
}
