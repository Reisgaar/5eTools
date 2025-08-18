// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
                    Select the schools you want to include in the filter:
                </Text>

                {validSchoolOptions.map(school => (
                    <TouchableOpacity
                        key={school}
                        style={[
                            styles.modalListItem,
                            { marginBottom: 8, borderRadius: 8, paddingVertical: 12 },
                            selectedSchools.includes(school) && styles.modalListItemSelected
                        ]}
                        onPress={() => onToggleSchool(school)}
                    >
                        <View style={[
                            styles.checkbox,
                            {
                                borderColor: theme.primary,
                                backgroundColor: selectedSchools.includes(school) ? theme.primary : 'transparent'
                            }
                        ]}>
                            {selectedSchools.includes(school) && (
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                            )}
                        </View>
                        <Text style={[styles.modalListItemText, { fontSize: 16 }]}>{capitalize(school)}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </BaseModal>
    );
}
