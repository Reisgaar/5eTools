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
    const commonStyles = getCommonStyles(theme);

    // Filter out invalid options
    const validSchoolOptions = schoolOptions.filter(school => school !== '[object Object]');

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Filter by School"
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, commonStyles.gap_sm]}>
                    <View style={{ flex: 1 }}><Button title="Clear" variant="secondary" onPress={onClear} fullWidth /></View>
                    <View style={{ flex: 1 }}><Button title="Apply" variant="primary" onPress={onApply} fullWidth /></View>
                </View>
            }
        >
            <View style={styles.optionsGrid}>
                {validSchoolOptions.map(school => {
                    const isSelected = selectedSchools.includes(school);
                    return (
                        <View key={school} style={styles.optionContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionRow,
                                    { borderColor: theme.border },
                                    isSelected && { backgroundColor: theme.primary + '20' }
                                ]}
                                onPress={() => onToggleSchool(school)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    isSelected ? { backgroundColor: theme.primary, borderColor: theme.primary } : { borderColor: theme.border }
                                ]}>
                                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                                </View>
                                <Text style={[styles.optionText, commonStyles.text_primary]}>
                                    {capitalize(school)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </BaseModal>
    );
}
