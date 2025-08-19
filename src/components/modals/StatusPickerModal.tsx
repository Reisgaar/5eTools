// REACT
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// CONSTANTS
import { conditions as DEFAULT_CONDITIONS } from 'src/constants/conditions';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface StatusPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (conditions: string[]) => void;
    onDelete?: () => void;
    onNoteUpdate?: (note: string) => void;
    currentConditions?: string[];
    currentNote?: string;
    creatureName?: string;
    combatantNumber?: number;
    theme: any;
}

type TabType = 'status' | 'notes' | 'delete';

/**
 * StatusPickerModal component.
 */
export default function StatusPickerModal({
    visible,
    onClose,
    onSelect,
    onDelete,
    onNoteUpdate,
    currentConditions = [],
    currentNote = '',
    creatureName = 'Creature',
    combatantNumber,
    theme
}: StatusPickerModalProps): JSX.Element {
    const [selectedConditions, setSelectedConditions] = useState<string[]>(currentConditions);
    const [noteText, setNoteText] = useState(currentNote);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('status');
    const baseModalStyles = createBaseModalStyles(theme);

    React.useEffect(() => {
        setSelectedConditions(currentConditions);
        setNoteText(currentNote);
        setShowDeleteConfirmation(false);
        setActiveTab('status');
    }, [currentConditions, currentNote, visible]);

    const handleToggleCondition = (cond: string) => {
        setSelectedConditions(prev =>
            prev.includes(cond)
                ? prev.filter(c => c !== cond)
                : [...prev, cond]
        );
    };

    const handleAccept = () => {
        onSelect(selectedConditions);
        onClose();
    };

    const handleNoteAccept = () => {
        if (onNoteUpdate)
            onNoteUpdate(noteText);

        onClose();
    };

    const handleDelete = () => {
        if (onDelete)
            onDelete();

        setShowDeleteConfirmation(false);
        onClose();
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const modalSubtitle = creatureName
        ? `${combatantNumber ? `#${combatantNumber} ` : ''}${creatureName}`
        : undefined;

    const renderStatusTab = () => (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {/* Status Conditions Section */}
            <View style={styles.section}>
                <Text style={baseModalStyles.modalSectionTitle}>Status Conditions</Text>
                <View style={baseModalStyles.conditionsGrid}>
                    {DEFAULT_CONDITIONS.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={baseModalStyles.conditionBtn}
                            onPress={() => handleToggleCondition(item)}
                        >
                            <Ionicons
                                name={selectedConditions.includes(item) ? 'checkbox' : 'square-outline'}
                                size={18}
                                color={theme.text}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[baseModalStyles.modalText, { fontSize: 12 }]}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Save Button */}
                <TouchableOpacity onPress={handleAccept} style={[baseModalStyles.modalButton, baseModalStyles.modalButtonPrimary]}>
                    <Text style={[baseModalStyles.modalButtonText, baseModalStyles.modalButtonTextPrimary]}>Save Conditions</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderNotesTab = () => (
        <View style={styles.tabContent}>
            {/* Notes Section */}
            <View style={styles.section}>
                <Text style={baseModalStyles.modalSectionTitle}>Notes</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { minHeight: 80, textAlignVertical: 'top' }]}
                    placeholder="Add notes about this creature..."
                    placeholderTextColor={theme.noticeText}
                    value={noteText}
                    onChangeText={setNoteText}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                {/* Save Button */}
                <TouchableOpacity onPress={handleNoteAccept} style={[baseModalStyles.modalButton, baseModalStyles.modalButtonPrimary]}>
                    <Text style={[baseModalStyles.modalButtonText, baseModalStyles.modalButtonTextPrimary]}>Save Note</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderDeleteTab = () => (
        <View style={styles.tabContent}>
            {/* Combat Management Section */}
            <View style={[styles.section, styles.dangerSection]}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: '#f44336' }]}>Combat Management</Text>
                <Text style={baseModalStyles.modalNoticeText}>
                    Remove this creature from the combat tracker permanently.
                </Text>

                {!showDeleteConfirmation ? (
                    <TouchableOpacity onPress={handleDeleteClick} style={[baseModalStyles.modalButton, { backgroundColor: '#f44336' }]}>
                        <Text style={[baseModalStyles.modalButtonText, { color: 'white' }]}>Remove from Combat</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={baseModalStyles.confirmationContainer}>
                        <Text style={[baseModalStyles.modalText, { textAlign: 'center', marginBottom: 12, fontWeight: '500' }]}>
                            Are you sure you want to remove "{creatureName}" from combat?
                        </Text>
                        <View style={baseModalStyles.confirmationButtons}>
                            <TouchableOpacity onPress={handleCancelDelete} style={[baseModalStyles.modalButton, baseModalStyles.modalButtonSecondary]}>
                                <Text style={[baseModalStyles.modalButtonText, baseModalStyles.modalButtonTextSecondary]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={[baseModalStyles.modalButton, { backgroundColor: '#f44336' }]}>
                                <Text style={[baseModalStyles.modalButtonText, { color: 'white' }]}>Confirm Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Creature Settings"
            subtitle={modalSubtitle}
        >
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'status' && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => setActiveTab('status')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'status' ? 'white' : theme.text }
                    ]}>
                        Status
                    </Text>
                </TouchableOpacity>

                {onNoteUpdate && (
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'notes' && { backgroundColor: theme.primary }
                        ]}
                        onPress={() => setActiveTab('notes')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'notes' ? 'white' : theme.text }
                        ]}>
                            Notes
                        </Text>
                    </TouchableOpacity>
                )}

                {onDelete && (
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'delete' && { backgroundColor: '#f44336' }
                        ]}
                        onPress={() => setActiveTab('delete')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'delete' ? 'white' : theme.text }
                        ]}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Tab Content */}
            {activeTab === 'status' && renderStatusTab()}
            {activeTab === 'notes' && renderNotesTab()}
            {activeTab === 'delete' && renderDeleteTab()}
        </BaseModal>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    tabContent: {
        flex: 1,
        maxHeight: 400,
    },
    section: {
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    dangerSection: {
        borderBottomWidth: 0,
        marginBottom: 0,
    },
    conditionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 4,
        flex: 1,
        minWidth: 0,
    },
    confirmationContainer: {
        marginTop: 8,
    },
    confirmationButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
});
