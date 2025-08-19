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
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
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
                {validClassOptions.map(className => (
                    <View key={className} style={styles.optionContainer}>
                        <TouchableOpacity
                            style={[
                                styles.optionRow,
                                { borderColor: theme.border },
                                selectedClasses.includes(className) && { backgroundColor: theme.primary + '20' }
                            ]}
                            onPress={() => onToggleClass(className)}
                        >
                            <View style={[
                                styles.checkbox,
                                { borderColor: theme.primary },
                                selectedClasses.includes(className) && { backgroundColor: theme.primary }
                            ]}
                            />
                            <Text style={[styles.optionText, { color: theme.text }]}>
                            {capitalize(className)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </BaseModal>
    );
}
