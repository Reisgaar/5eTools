import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BaseModal } from '../ui';
import { createBaseModalStyles } from '../../styles/baseModalStyles';

interface OtherFilterModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    options: Array<{ label: string; value: string }>;
    selectedOptions: string[];
    onToggleOption: (value: string) => void;
    onSelectAll: () => void;
    onApply: () => void;
    isApplying: boolean;
}

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
    const unifiedStyles = createBaseModalStyles(theme);
    const allSelected = selectedOptions.length === options.length;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Filter by Type"
            width={350}
            maxHeight="80%"
            scrollable={true}
        >
            <View style={unifiedStyles.modalSection}>
                <View style={unifiedStyles.modalSectionTitle}>
                    <Text style={unifiedStyles.modalSectionTitleText}>Spell Types</Text>
                    <TouchableOpacity
                        onPress={onSelectAll}
                        style={unifiedStyles.modalButtonSecondary}
                    >
                        <Text style={unifiedStyles.modalButtonTextSecondary}>
                            {allSelected ? 'Clear All' : 'Select All'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: 300 }}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                unifiedStyles.modalListItem,
                                selectedOptions.includes(option.value) && unifiedStyles.modalListItemSelected
                            ]}
                            onPress={() => onToggleOption(option.value)}
                        >
                            <Text style={[
                                unifiedStyles.modalListItemText,
                                selectedOptions.includes(option.value) && { color: theme.primary }
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={unifiedStyles.modalSection}>
                <TouchableOpacity
                    onPress={onApply}
                    style={[unifiedStyles.modalButton, unifiedStyles.modalButtonPrimary]}
                    disabled={isApplying}
                >
                    <Text style={[unifiedStyles.modalButtonText, unifiedStyles.modalButtonTextPrimary]}>
                        {isApplying ? 'Applying...' : 'Apply Filters'}
                    </Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
}

