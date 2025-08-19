// REACT
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface SchoolFilterModalProps {
    visible: boolean;
    onClose: () => void;
    schoolOptions: string[];
    selectedSchools: string[];
    onToggleSchool: (school: string) => void;
    onClear: () => void;
    onApply: () => void;
    theme: any;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * SchoolFilterModal component.
 */
export default function SchoolFilterModal({
    visible,
    onClose,
    schoolOptions,
    selectedSchools,
    onToggleSchool,
    onClear,
    onApply,
    theme
}: SchoolFilterModalProps) {
    const styles = createBaseModalStyles(theme);

    // Filter out invalid options
    const validSchoolOptions = schoolOptions.filter(school => school !== '[object Object]');

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Filter by School"
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
                {validSchoolOptions.map(school => (
                    <View key={school} style={styles.optionContainer}>
                        <TouchableOpacity
                            style={[
                                styles.optionRow,
                                { borderColor: theme.border },
                                selectedSchools.includes(school) && { backgroundColor: theme.primary + '20' }
                            ]}
                            onPress={() => onToggleSchool(school)}
                        >
                            <View style={[
                                styles.checkbox,
                                { borderColor: theme.primary },
                                selectedSchools.includes(school) && { backgroundColor: theme.primary }
                            ]}
                            />
                            <Text style={[styles.optionText, { color: theme.text }]}>
                                {capitalize(school)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </BaseModal>
    );
}
