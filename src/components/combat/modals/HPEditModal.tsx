// REACT
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

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
}: HPEditModalProps): JSX.Element {
    const [currentHp, setCurrentHp] = useState(initialCurrentHp);
    const styles = createBaseModalStyles(theme);

    // Update local value when initial value changes
    useEffect(() => {
        setCurrentHp(initialCurrentHp);
    }, [initialCurrentHp]);

    const handleIncrement = (amount: number) => {
        setCurrentHp(prev => Math.min(maxHp, prev + amount));
    };

    const handleDecrement = (amount: number) => {
        setCurrentHp(prev => prev - amount);
    };

    const handleAccept = () => {
        onAccept(currentHp);
        onClose();
    };

    // Create title
    const modalTitle = 'Edit Current HP';

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title={modalTitle} maxHeight="85%">
            {/* Creature Name */}
            <View style={styles.modalSection}>
                <Text style={[styles.modalText, { fontStyle: 'italic', textAlign: 'center' }]}>
                    #{combatantNumber} {creatureName}
                </Text>
            </View>

            {/* HP Display */}
            <View style={styles.modalSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, gap: 12 }}>
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

                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>/</Text>

                    <TouchableOpacity
                        style={{
                            borderWidth: 2,
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            minWidth: 80,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.inputBackground,
                            borderColor: theme.primary
                        }}
                        onPress={onMaxHpEdit}
                    >
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>
                            {maxHp}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* HP Adjustment Buttons */}
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
