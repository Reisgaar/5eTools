// REACT
import React, { useState } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// CONSTANTS
import { conditions as DEFAULT_CONDITIONS } from 'src/constants/conditions';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (conditions: string[]) => void;
    onColorSelect?: (color: string | null) => void;
    onDelete?: () => void;
    onNoteUpdate?: (note: string) => void;
    currentConditions?: string[];
    currentColor?: string;
    currentNote?: string;
    creatureName?: string;
    combatantNumber?: number;
    theme: any;
}

type TabType = 'status' | 'color' | 'notes' | 'delete';

// CONSTANTS
const COLORS = [
    'rgba(255, 107, 107, 0.3)', // Light Red
    'rgba(255, 167, 38, 0.3)', // Light Orange
    'rgba(255, 235, 59, 0.3)', // Light Yellow
    'rgba(102, 187, 106, 0.3)', // Light Green
    'rgba(66, 165, 245, 0.3)', // Light Blue
    'rgba(171, 71, 188, 0.3)', // Light Purple
    'rgba(236, 64, 122, 0.3)', // Light Pink
    'rgba(141, 110, 99, 0.3)', // Light Brown
    'rgba(120, 144, 156, 0.3)', // Light Gray
    'rgba(255, 152, 0, 0.3)', // Light Dark Orange
];

/**
 * SettingsModal component.
 */
export default function SettingsModal({
    visible,
    onClose,
    onSelect,
    onColorSelect,
    onDelete,
    onNoteUpdate,
    currentConditions = [],
    currentColor,
    currentNote = '',
    creatureName = 'Creature',
    combatantNumber,
    theme
}: SettingsModalProps): React.JSX.Element {
    const modalStyles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);

    const [selectedConditions, setSelectedConditions] = useState<string[]>(currentConditions);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(currentColor);
    const [noteText, setNoteText] = useState(currentNote);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('status');

    React.useEffect(() => {
        setSelectedConditions(currentConditions);
        setSelectedColor(currentColor);
        setNoteText(currentNote);
        setShowDeleteConfirmation(false);
        setActiveTab('status');
    }, [currentConditions, currentColor, currentNote, visible]);

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

    const handleColorAccept = () => {
        if (onColorSelect)
            onColorSelect(selectedColor || null);

        onClose();
    };

    const handleColorClear = () => {
        if (onColorSelect)
            onColorSelect(null);

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

    const renderStatusTab = () => (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.subtitle, commonStyles.text_primary]}>{creatureName}</Text>

            {/* Status Conditions Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, commonStyles.text_primary]}>Status Conditions</Text>
                <View style={styles.conditionsGrid}>
                    {DEFAULT_CONDITIONS.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.conditionBtn}
                            onPress={() => handleToggleCondition(item)}
                        >
                            <Ionicons
                                name={selectedConditions.includes(item) ? 'checkbox' : 'square-outline'}
                                size={18}
                                color={theme.text}
                                style={commonStyles.mr_xs}
                            />
                            <Text style={[commonStyles.text_primary, commonStyles.text_sm]}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Save Button */}
                <TouchableOpacity onPress={handleAccept} style={[modalStyles.modalButton, modalStyles.modalButtonPrimary]}>
                    <Text style={[modalStyles.modalButtonText, modalStyles.modalButtonTextPrimary]}>Save Conditions</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderColorTab = () => (
        <View style={styles.tabContent}>
            <Text style={[styles.subtitle, commonStyles.text_primary]}>{creatureName}</Text>

            {/* Color Selection Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, commonStyles.text_primary]}>Creature Color</Text>
                <Text style={[styles.sectionDescription, commonStyles.text_grey]}>
                    Select a color to highlight this creature in the combat tracker.
                </Text>

                {/* Color Grid */}
                <View style={styles.colorGrid}>
                    {COLORS.map((color) => (
                        <TouchableOpacity
                            key={color}
                            style={[
                                styles.colorOption,
                                { backgroundColor: color },
                                selectedColor === color && styles.selectedColor
                            ]}
                            onPress={() => setSelectedColor(color)}
                        >
                            {selectedColor === color && (
                                <Ionicons name="checkmark" size={20} color="#000" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Current Selection */}
                {selectedColor && (
                    <View style={styles.currentSelection}>
                        <Text style={[styles.currentText, commonStyles.text_primary]}>Selected:</Text>
                        <View style={[styles.currentColor, { backgroundColor: selectedColor }]} />
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[modalStyles.modalButton, modalStyles.modalButtonSecondary]}
                        onPress={handleColorClear}
                    >
                        <Text style={[modalStyles.modalButtonText, modalStyles.modalButtonTextSecondary]}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[modalStyles.modalButton, modalStyles.modalButtonPrimary]}
                        onPress={handleColorAccept}
                    >
                        <Text style={[modalStyles.modalButtonText, modalStyles.modalButtonTextPrimary]}>Save Color</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderNotesTab = () => (
        <View style={styles.tabContent}>
            <Text style={[styles.subtitle, commonStyles.text_primary]}>{creatureName}</Text>

            {/* Notes Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, commonStyles.text_primary]}>Notes</Text>
                <TextInput
                    style={[modalStyles.modalInput]}
                    placeholder="Add notes about this creature..."
                    placeholderTextColor={theme.noticeText}
                    value={noteText}
                    onChangeText={setNoteText}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                {/* Save Button */}
                <TouchableOpacity onPress={handleNoteAccept} style={[modalStyles.modalButton, modalStyles.modalButtonPrimary]}>
                    <Text style={[modalStyles.modalButtonText, modalStyles.modalButtonTextPrimary]}>Save Note</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderDeleteTab = () => (
        <View style={styles.tabContent}>
            <Text style={[styles.subtitle, commonStyles.text_primary]}>{creatureName}</Text>

            {/* Combat Management Section */}
            <View style={[styles.section, styles.dangerSection]}>
                <Text style={[styles.sectionTitle, { color: '#f44336' }]}>Combat Management</Text>
                <Text style={[styles.dangerText, commonStyles.text_grey]}>
                    Remove this creature from the combat tracker permanently.
                </Text>

                {!showDeleteConfirmation ? (
                    <TouchableOpacity onPress={handleDeleteClick} style={[modalStyles.modalButton, { backgroundColor: '#f44336' }]}>
                        <Text style={[modalStyles.modalButtonText, { color: 'white' }]}>Remove from Combat</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.confirmationContainer}>
                        <Text style={[styles.confirmationText, commonStyles.text_primary]}>
                            Are you sure you want to remove "{creatureName}" from combat?
                        </Text>
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity onPress={handleCancelDelete} style={[modalStyles.modalButton, modalStyles.modalButtonSecondary]}>
                                <Text style={[modalStyles.modalButtonText, modalStyles.modalButtonTextSecondary]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={[modalStyles.modalButton, { backgroundColor: '#f44336' }]}>
                                <Text style={[modalStyles.modalButtonText, { color: 'white' }]}>Confirm Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Creature Settings">
            {/* Tab Navigation */}
            <View style={[styles.tabContainer, { borderColor: theme.border }]}>
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

                {onColorSelect && (
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'color' && { backgroundColor: theme.primary }
                        ]}
                        onPress={() => setActiveTab('color')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'color' ? 'white' : theme.text }
                        ]}>
                            Color
                        </Text>
                    </TouchableOpacity>
                )}

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
            {activeTab === 'color' && renderColorTab()}
            {activeTab === 'notes' && renderNotesTab()}
            {activeTab === 'delete' && renderDeleteTab()}
        </BaseModal>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        marginBottom: styleConstants.marginLG,
        borderRadius: styleConstants.borderRadiusMD,
        overflow: 'hidden',
        borderWidth: styleConstants.borderXS,
    },
    tabButton: {
        flex: 1,
        paddingVertical: styleConstants.paddingMD,
        alignItems: 'center',
    },
    tabText: {
        fontSize: styleConstants.fontSizeMD,
        fontWeight: 'bold',
    },
    tabContent: {
        flex: 1,
        maxHeight: 400,
    },
    subtitle: {
        fontSize: styleConstants.fontSizeMD,
        marginBottom: styleConstants.marginLG,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 24,
        paddingBottom: styleConstants.paddingLG,
        borderBottomWidth: styleConstants.borderXS,
    },
    dangerSection: {
        borderBottomWidth: 0,
        marginBottom: 0,
    },
    sectionTitle: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginMD,
    },
    dangerText: {
        fontSize: styleConstants.fontSizeSM,
        marginBottom: styleConstants.marginMD,
        fontStyle: 'italic',
    },
    conditionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: styleConstants.marginXS,
        flex: 1,
        minWidth: 0,
    },
    confirmationContainer: {
        marginTop: styleConstants.marginSM,
    },
    confirmationText: {
        fontSize: styleConstants.fontSizeMD,
        textAlign: 'center',
        marginBottom: styleConstants.marginMD,
        fontWeight: '500',
    },
    confirmationButtons: {
        flexDirection: 'row',
        gap: styleConstants.gapSM,
    },

    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: styleConstants.marginSM,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: styleConstants.borderRadius2XL,
        margin: styleConstants.marginXS,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderWidth: styleConstants.borderSM,
        borderColor: 'black',
    },
    currentSelection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: styleConstants.marginSM,
    },
    currentText: {
        fontSize: styleConstants.fontSizeMD,
        marginRight: styleConstants.marginSM,
    },
    currentColor: {
        width: 20,
        height: 20,
        borderRadius: styleConstants.borderRadiusMD,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: styleConstants.marginSM,
    },
    sectionDescription: {
        fontSize: styleConstants.fontSizeSM,
        marginBottom: styleConstants.marginSM,
    },
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
});
