// REACT
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { BaseModal, Button } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface OtherFilterModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    options: { label: string; value: string }[];
    selectedOptions: string[];
    onToggleOption: (value: string) => void;
    onSelectAll: () => void;
    onApply: () => void;
    isApplying: boolean;
}

/**
 * OtherFilterModal component.
 */
export default function OtherFilterModal({
    visible,
    onClose,
    theme,
    options,
    selectedOptions,
    onToggleOption,
    onSelectAll,
    onApply,
    isApplying
}: OtherFilterModalProps) {
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);
    const allSelected = selectedOptions.length === options.length;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Filter by Type"
            maxHeight="80%"
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, commonStyles.gap_sm]}>
                    <View style={{ flex: 1 }}><Button title={allSelected ? 'Clear All' : 'Select All'} variant="secondary" onPress={onSelectAll} fullWidth /></View>
                    <View style={{ flex: 1 }}><Button title="Apply" variant="primary" onPress={onApply} loading={isApplying} fullWidth /></View>
                </View>
            }
        >
            <View style={styles.optionsGrid}>
                {options.map((option) => {
                    const isSelected = selectedOptions.includes(option.value);
                    return (
                        <View key={option.value} style={styles.optionContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionRow,
                                    { borderColor: theme.border },
                                    isSelected && { backgroundColor: theme.primary + '20' }
                                ]}
                                onPress={() => onToggleOption(option.value)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    isSelected ? { backgroundColor: theme.primary, borderColor: theme.primary } : { borderColor: theme.border }
                                ]}>
                                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                                </View>
                                <Text style={[styles.optionText, commonStyles.text_primary]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </BaseModal>
    );
}
