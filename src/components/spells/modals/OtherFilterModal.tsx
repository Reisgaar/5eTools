// REACT
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

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
            showFooter={true}
            footerContent={
                <View style={unifiedStyles.actionRow}>
                    <TouchableOpacity
                        onPress={onSelectAll}
                        style={[unifiedStyles.modalButton, unifiedStyles.modalButtonSecondary]}
                    >
                        <Text style={[unifiedStyles.modalButtonText, unifiedStyles.modalButtonTextSecondary]}>
                            {allSelected ? 'Clear All' : 'Select All'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApply}
                        style={[unifiedStyles.modalButton, unifiedStyles.modalButtonPrimary]}
                        disabled={isApplying}
                    >
                        <Text style={[unifiedStyles.modalButtonText, unifiedStyles.modalButtonTextPrimary]}>
                            {isApplying ? 'Applying...' : 'Apply'}
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View style={unifiedStyles.modalSection}>
                <Text style={[unifiedStyles.modalText, { marginBottom: 16 }]}>
                    Select the spell types you want to include in the filter:
                </Text>

                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            unifiedStyles.modalListItem,
                            { marginBottom: 8, borderRadius: 8, paddingVertical: 12 },
                            selectedOptions.includes(option.value) && unifiedStyles.modalListItemSelected
                        ]}
                        onPress={() => onToggleOption(option.value)}
                    >
                        <View style={[
                            unifiedStyles.checkbox,
                            {
                                borderColor: theme.primary,
                                backgroundColor: selectedOptions.includes(option.value) ? theme.primary : 'transparent'
                            }
                        ]}>
                            {selectedOptions.includes(option.value) && (
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                            )}
                        </View>
                        <Text style={[unifiedStyles.modalListItemText, { fontSize: 16 }]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </BaseModal>
    );
}
