// REACT
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface MaxHPEditModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (maxHp: number) => void;
    onReopenHpModal: () => void;
    creatureName: string;
    combatantNumber: number;
    initialMaxHp: number;
    currentHp: number;
    theme: any;
}

/**
 * Modal used to edit the max HP of a combatant.
 */
export default function MaxHPEditModal({
    visible,
    onClose,
    onAccept,
    onReopenHpModal,
    creatureName,
    combatantNumber,
    initialMaxHp,
    currentHp,
    theme
}: MaxHPEditModalProps): React.JSX.Element {
    const [maxHp, setMaxHp] = useState(initialMaxHp);
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);

    // Update local value when initial value changes
    useEffect(() => {
        setMaxHp(initialMaxHp);
    }, [initialMaxHp]);

    const handleValueChange = (amount: number) => {
        setMaxHp(prev => Math.max(1, prev + amount));
    };

    const handleAccept = () => {
        onAccept(maxHp);
        onClose();
        onReopenHpModal();
    };

    const handleCancel = () => {
        setMaxHp(initialMaxHp);
        onClose();
        onReopenHpModal();
    };

    // Create title with current HP info
    const modalTitle = `Edit Max HP - #${combatantNumber} ${creatureName}`;
    const modalSubtitle = `Current: ${currentHp}`;

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
                        onPress={handleCancel}
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
            {/* Max HP Display */}
            <View style={[commonStyles.row_center_center, commonStyles.mb_xl, commonStyles.gap_md]}>
                <Text style={[styles.modalText, commonStyles.text_bold]}>Max HP:</Text>
                <TextInput
                    style={[commonStyles.bw_sm, commonStyles.br_md, commonStyles.px_lg, commonStyles.py_md, commonStyles.text_2xl, commonStyles.text_bold, commonStyles.text_center, commonStyles.text_primary, {
                        minWidth: 80,
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.primary
                    }]}
                    value={String(maxHp)}
                    onChangeText={(text) => {
                        const num = parseInt(text, 10);
                        if (!isNaN(num)) {
                            setMaxHp(Math.max(1, num));
                        } else if (text === '') {
                            setMaxHp(1);
                        }
                    }}
                    keyboardType="numeric"
                    textAlign="center"
                />
            </View>
                
            <View style={[{ flexDirection: 'row' }, commonStyles.jc_between, commonStyles.w_100, commonStyles.mb_xl, commonStyles.gap_md]}>
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
        </BaseModal>
    );
}
