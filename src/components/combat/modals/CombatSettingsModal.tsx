// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// INTERFACES
interface CombatSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onStatusPress: () => void;
  onColorPress: () => void;
  onNotePress: () => void;
  onDeletePress: () => void;
  creatureName?: string;
  combatantNumber?: number;
  theme: any;
}

/**
 * Modal used to edit the settings of a combatant.
 */
export default function CombatSettingsModal({
    visible,
    onClose,
    onStatusPress,
    onColorPress,
    onNotePress,
    onDeletePress,
    creatureName = 'Creature',
    combatantNumber,
    theme
}: CombatSettingsModalProps): JSX.Element {
    const styles = createBaseModalStyles(theme);

    const modalTitle = 'Combat Settings';
    const modalSubtitle = combatantNumber ? `#${combatantNumber} ${creatureName}` : creatureName;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={modalTitle}
            subtitle={modalSubtitle}
        >
            {/* Settings Options */}
            <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: theme.text }]}>What would you like to do?</Text>

                {/* Status Conditions Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onStatusPress}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="medical" size={24} color={theme.primary} />
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionTitle, { color: theme.text }]}>Status Conditions</Text>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
              Add or remove status effects
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.noticeText} />
                </TouchableOpacity>

                {/* Color Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onColorPress}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="color-palette" size={24} color={theme.primary} />
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionTitle, { color: theme.text }]}>Color</Text>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
              Change creature highlight color
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.noticeText} />
                </TouchableOpacity>

                {/* Notes Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onNotePress}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="document-text" size={24} color={theme.primary} />
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionTitle, { color: theme.text }]}>Notes</Text>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
              Add or edit creature notes
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.noticeText} />
                </TouchableOpacity>

                {/* Delete Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onDeletePress}
                >
                    <View style={[styles.optionIcon, { backgroundColor: (theme.danger || '#f44336') + '20' }]}>
                        <Ionicons name="trash" size={24} color={theme.danger || '#f44336'} />
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionTitle, { color: theme.danger || '#f44336' }]}>Remove from Combat</Text>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
              Permanently remove this creature
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.noticeText} />
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
};
