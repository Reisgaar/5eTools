// REACT
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
interface StatusModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (conditions: string[]) => void;
    currentConditions?: string[];
    creatureName?: string;
    combatantNumber?: number;
    theme: any;
}

/**
 * Modal used to edit the status conditions of a combatant.
 */
export default function StatusModal({
    visible,
    onClose,
    onAccept,
    currentConditions = [],
    creatureName = 'Creature',
    combatantNumber,
    theme
}: StatusModalProps): React.JSX.Element {
    const [selectedConditions, setSelectedConditions] = useState<string[]>(currentConditions);
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);

    React.useEffect(() => {
        setSelectedConditions(currentConditions);
    }, [currentConditions, visible]);

    const handleToggleCondition = (cond: string) => {
        setSelectedConditions(prev =>
            prev.includes(cond)
                ? prev.filter(c => c !== cond)
                : [...prev, cond]
        );
    };

    const handleAccept = () => {
        onAccept(selectedConditions);
        onClose();
    };

    const modalTitle = 'Status Conditions';
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
            {/* Status Conditions Section */}
            <View style={styles.modalSection}>
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
            </View>
        </BaseModal>
    );
};
