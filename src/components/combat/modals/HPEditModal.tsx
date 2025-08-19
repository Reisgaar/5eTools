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
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
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
                <Text style={[styles.modalText, { fontStyle: 'italic', textAlign: 'center' }]}>
                    #{combatantNumber} {creatureName}
                </Text>
            </View>

            {/* HP Display */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30, gap: 12 }}>
                <TextInput
                    style={{
                        borderWidth: 2,
                        borderRadius: 8,
                        padding: 8,
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center',
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

                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>/</Text>

                <TouchableOpacity
                    style={{
                        borderWidth: 2,
                        borderRadius: 8,
                        padding: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.primary
                    }}
                    onPress={onMaxHpEdit}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>
                        {maxHp}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* HP Adjustment Buttons */}
            <View style={styles.modalSection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, gap: 12 }}>
                    {/* Decrement Buttons - Left Column */}
                    <View style={{ flex: 1, gap: 6, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
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
