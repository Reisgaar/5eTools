// REACT
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

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
                <View style={[commonStyles.w_100, commonStyles.row_center_center, { gap: '4%' }]}>
                    <TouchableOpacity
                        onPress={onSelectAll}
                        style={[styles.footerButton, { backgroundColor: theme.secondary }]}
                    >
                        <Text style={styles.footerButtonText}>{allSelected ? 'Clear All' : 'Select All'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApply}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>{isApplying ? 'Applying...' : 'Apply'}</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View style={styles.optionsGrid}>
                {options.map((option) => (
                    <View key={option.value} style={styles.optionContainer}>
                        <TouchableOpacity
                            style={[
                                styles.optionRow,
                                { borderColor: theme.border },
                                selectedOptions.includes(option.value) && { backgroundColor: theme.primary + '20' }
                            ]}
                            onPress={() => onToggleOption(option.value)}
                        >
                            <View style={[
                                styles.checkbox,
                                { borderColor: theme.primary },
                                selectedOptions.includes(option.value) && { backgroundColor: theme.primary }
                            ]}
                            />
                            <Text style={[styles.optionText, commonStyles.text_primary]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </BaseModal>
    );
}
