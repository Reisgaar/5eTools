// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

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

    // Filter out invalid options
    const validClassOptions = classOptions.filter(className => className !== '[object Object]');

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Filter by Class"
            scrollable={true}
            showFooter={true}
            footerContent={
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        onPress={onClear}
                        style={[styles.modalButton, styles.modalButtonSecondary]}
                    >
                        <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApply}
                        style={[styles.modalButton, styles.modalButtonPrimary]}
                    >
                        <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View style={styles.modalSection}>
                <Text style={[styles.modalText, { marginBottom: 16 }]}>
                    Select the classes you want to include in the filter:
                </Text>

                {validClassOptions.map(className => (
                    <TouchableOpacity
                        key={className}
                        style={[
                            styles.modalListItem,
                            { marginBottom: 8, borderRadius: 8, paddingVertical: 12 },
                            selectedClasses.includes(className) && styles.modalListItemSelected
                        ]}
                        onPress={() => onToggleClass(className)}
                    >
                        <View style={[
                            styles.checkbox,
                            {
                                borderColor: theme.primary,
                                backgroundColor: selectedClasses.includes(className) ? theme.primary : 'transparent'
                            }
                        ]}>
                            {selectedClasses.includes(className) && (
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                            )}
                        </View>
                        <Text style={[styles.modalListItemText, { fontSize: 16 }]}>{capitalize(className)}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </BaseModal>
    );
}
