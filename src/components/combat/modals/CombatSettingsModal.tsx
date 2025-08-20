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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '2%' }}>
                {/* Status Conditions Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onStatusPress}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Ionicons name="medical" size={18} color={theme.primary} />
                        <Text style={[styles.optionTitle, { color: theme.text, marginLeft: 4 }]}>Status</Text>
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
                            Add or remove status effects
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Color Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onColorPress}
                >
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Ionicons name="color-palette" size={18} color={theme.primary} />
                        <Text style={[styles.optionTitle, { color: theme.text, marginLeft: 4 }]}>Color</Text>
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
                            Change creature highlight color
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Notes Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onNotePress}
                >
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Ionicons name="document-text" size={18} color={theme.primary} />
                        <Text style={[styles.optionTitle, { color: theme.text, marginLeft: 4 }]}>Notes</Text>
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
                            Add or edit creature notes
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Delete Option */}
                <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={onDeletePress}
                >
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Ionicons name="trash" size={18} color={theme.danger || '#f44336'} />
                        <Text style={[styles.optionTitle, { color: theme.danger || '#f44336', marginLeft: 4 }]}>Remove</Text>
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionDescription, { color: theme.noticeText }]}>
                            Permanently remove this creature
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
};
