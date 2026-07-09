// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// INTERFACES
interface DeleteCombatantModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    creatureName?: string;
    combatantNumber?: number;
    theme: any;
}

/**
 * Modal used to delete a combatant.
 */
export default function DeleteCombatantModal({
    visible,
    onClose,
    onConfirm,
    creatureName = 'Creature',
    combatantNumber,
    theme
}: DeleteCombatantModalProps): React.JSX.Element {
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const modalTitle = 'Remove from Combat';
    const modalSubtitle = combatantNumber ? `#${combatantNumber} ${creatureName}` : creatureName;

    return (
        <BaseModal
            visible={visible}
            onClose={handleCancel}
            theme={theme}
            title={modalTitle}
            subtitle={modalSubtitle}
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, { gap: '4%' }]}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={[styles.footerButton, { backgroundColor: theme.danger || '#f44336' }]}
                    >
                        <Text style={styles.footerButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            {/* Delete Section */}
            <View style={styles.modalSection}>
                <Text style={[styles.modalNoticeText, commonStyles.text_md, commonStyles.text_primary]}>
                    Deleting the creature will remove it from the combat tracker permanently.
                </Text>
                <Text style={[styles.modalNoticeText, commonStyles.text_md, commonStyles.text_primary, commonStyles.mt_xl]}>
                    Are you sure you want to remove "{creatureName}"?
                </Text>
            </View>
        </BaseModal>
    );
};
