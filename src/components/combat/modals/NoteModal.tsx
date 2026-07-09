// REACT
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

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
}: NoteModalProps): React.JSX.Element {
    const [noteText, setNoteText] = useState(currentNote);
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);

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
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, { gap: '4%' }]}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.footerButton, { backgroundColor: theme.secondary }]}
                    >
                        <Text style={styles.footerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleAccept}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            {/* Notes Section */}
            <View style={styles.modalSection}>
                <Text style={[styles.modalNoticeText, commonStyles.text_grey]}>
                    Add notes about this creature for quick reference during combat.
                </Text>
                <TextInput
                    style={[styles.noteInput, commonStyles.text_primary, {
                        backgroundColor: theme.inputBackground,
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
        </BaseModal>
    );
};
