// REACT
import React, { useEffect, useState } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface HPEditModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (currentHp: number) => void;
    onMaxHpEdit: () => void;
    creatureName: string;
    combatantNumber: number;
    initialCurrentHp: number;
    maxHp: number;
    theme: any;
}

/**
 * Modal used to edit the current HP of a combatant.
 */
export default function HPEditModal({
    visible,
    onClose,
    onAccept,
    onMaxHpEdit,
    creatureName,
    combatantNumber,
    initialCurrentHp,
    maxHp,
    theme
}: HPEditModalProps): React.JSX.Element {
    const [currentHp, setCurrentHp] = useState(initialCurrentHp);
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);

    // Update local value when initial value changes
    useEffect(() => {
        setCurrentHp(initialCurrentHp);
    }, [initialCurrentHp]);

    const handleValueChange = (amount: number) => {
        setCurrentHp(prev => Math.min(maxHp, prev + amount));
    };

    const handleAccept = () => {
        onAccept(currentHp);
        onClose();
    };

    // Create title
    const modalTitle = 'Edit Current HP';

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={modalTitle}
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, { gap: '4%' }]}>
                    <TouchableOpacity
                        onPress={handleAccept}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            {/* Creature Name */}
            <View style={styles.modalSection}>
                <Text style={[styles.modalText, commonStyles.text_center, { fontStyle: 'italic' }]}>
                    #{combatantNumber} {creatureName}
                </Text>
            </View>

            {/* HP Display */}
            <View style={[commonStyles.row_center_center, commonStyles.gap_md, { marginBottom: styleConstants.margin2XL }]}>
                <TextInput
                    style={[commonStyles.bw_sm, commonStyles.br_md, commonStyles.p_sm, commonStyles.text_xl, commonStyles.text_bold, commonStyles.text_center, commonStyles.text_primary, {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.primary
                    }]}
                    value={String(currentHp)}
                    onChangeText={(text) => {
                        const num = parseInt(text, 10);
                        if (!isNaN(num)) {
                            setCurrentHp(Math.min(maxHp, num));
                        } else if (text === '') {
                            setCurrentHp(0);
                        }
                    }}
                    keyboardType="numeric"
                    textAlign="center"
                />

                <Text style={[commonStyles.text_xl, commonStyles.text_bold, commonStyles.text_primary]}>/</Text>

                <TouchableOpacity
                    style={[commonStyles.bw_sm, commonStyles.br_md, commonStyles.p_sm, commonStyles.ai_center, commonStyles.jc_center, {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.primary
                    }]}
                    onPress={onMaxHpEdit}
                >
                    <Text style={[commonStyles.text_xl, commonStyles.text_bold, commonStyles.text_primary]}>
                        {maxHp}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* HP Adjustment Buttons */}
            <View style={styles.modalSection}>
                <View style={[{ flexDirection: 'row' }, commonStyles.jc_between, commonStyles.w_100, commonStyles.mb_xl, commonStyles.gap_md]}>
                    {/* Decrement Buttons - Left Column */}
                    <View style={[commonStyles.row_center_center, commonStyles.gap_xs, { flex: 1, flexWrap: 'wrap' }]}>
                        {[-10, 10, -5, 5, -1, 1].map((value) => (
                            <TouchableOpacity
                                key={value}
                                style={[styles.footerButton, { backgroundColor: theme.primary }]}
                                onPress={() => handleValueChange(value)}
                            >
                                <Text style={[styles.footerButtonText]}>
                                    {value > 0 ? `+${value}` : value}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </BaseModal>
    );
}
