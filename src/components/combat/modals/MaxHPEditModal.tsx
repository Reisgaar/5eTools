// REACT
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface MaxHPEditModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (maxHp: number) => void;
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
    creatureName,
    combatantNumber,
    initialMaxHp,
    currentHp,
    theme
}: MaxHPEditModalProps): JSX.Element {
    const [maxHp, setMaxHp] = useState(initialMaxHp);
    const styles = createBaseModalStyles(theme);

    // Update local value when initial value changes
    useEffect(() => {
        setMaxHp(initialMaxHp);
    }, [initialMaxHp]);

    const handleIncrement = (amount: number) => {
        setMaxHp(prev => prev + amount);
    };

    const handleDecrement = (amount: number) => {
        setMaxHp(prev => Math.max(1, prev - amount));
    };

    const handleAccept = () => {
        onAccept(maxHp);
        onClose();
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
            maxHeight="85%"
        >
            {/* Max HP Display */}
            <View style={styles.modalSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, gap: 12 }}>
                    <Text style={[styles.modalText, { fontWeight: 'bold' }]}>Max HP:</Text>
                    <TextInput
                        style={{
                            borderWidth: 2,
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            fontSize: 24,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            minWidth: 80,
                            backgroundColor: theme.inputBackground,
                            color: theme.text,
                            borderColor: theme.primary
                        }}
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
            </View>

            {/* Max HP Adjustment Buttons */}
            <View style={styles.modalSection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, gap: 12 }}>
                    {/* Decrement Buttons - Left Column */}
                    <View style={{ flex: 1, gap: 6 }}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => handleDecrement(10)}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>-10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => handleDecrement(5)}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>-5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => handleDecrement(1)}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>-1</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Increment Buttons - Right Column */}
                    <View style={{ flex: 1, gap: 6 }}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => handleIncrement(10)}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>+10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => handleIncrement(5)}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>+5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            onPress={() => handleIncrement(1)}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>+1</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={handleAccept}
                >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Accept</Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
}
