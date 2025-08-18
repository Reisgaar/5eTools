// REACT
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface NoteModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (note: string) => void;
    currentNote?: string;
    creatureName?: string;
    combatantNumber?: number;
    theme: any;
}

/**
 * Modal used to edit the notes of a combatant.
 */
export default function NoteModal({
    visible,
    onClose,
    onAccept,
    currentNote = '',
    creatureName = 'Creature',
    combatantNumber,
    theme
}: NoteModalProps): JSX.Element {
    const [noteText, setNoteText] = useState(currentNote);
    const styles = createBaseModalStyles(theme);

    React.useEffect(() => {
        setNoteText(currentNote);
    }, [currentNote, visible]);

    const handleAccept = () => {
        onAccept(noteText);
        onClose();
    };

    const modalTitle = 'Creature Notes';
    const modalSubtitle = combatantNumber ? `#${combatantNumber} ${creatureName}` : creatureName;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={modalTitle}
            subtitle={modalSubtitle}
            maxHeight="85%"
        >
            {/* Notes Section */}
            <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Notes</Text>
                <Text style={[styles.modalNoticeText, { color: theme.noticeText }]}>
                    Add notes about this creature for quick reference during combat.
                </Text>
                <TextInput
                    style={[styles.noteInput, {
                        backgroundColor: theme.inputBackground,
                        color: theme.text,
                        borderColor: theme.border
                    }]}
                    placeholder="Add notes about this creature..."
                    placeholderTextColor={theme.noticeText}
                    value={noteText}
                    onChangeText={setNoteText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={handleAccept}
                >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Save</Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
};
