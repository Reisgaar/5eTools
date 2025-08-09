import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';

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

export default function MaxHPEditModal({
    visible,
    onClose,
    onAccept,
    creatureName,
    combatantNumber,
    initialMaxHp,
    currentHp,
    theme
}: MaxHPEditModalProps) {
    const [maxHp, setMaxHp] = useState(initialMaxHp);

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

    const handleCancel = () => {
        setMaxHp(initialMaxHp);
        onClose();
    };

    // Create title with current HP info
    const modalTitle = `Edit Max HP - #${combatantNumber} ${creatureName} (Current: ${currentHp})`;

    return (
        <BaseModal visible={visible} onClose={handleCancel} theme={theme} title={modalTitle}>
            {/* Max HP Display */}
            <View style={styles.maxHpContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Max HP:</Text>
                <TextInput
                    style={[styles.maxHpInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
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

            {/* Current HP Info */}
            <View style={styles.currentHpInfo}>
                <Text style={[styles.infoText, { color: theme.text }]}>
                    Current HP: {currentHp}
                </Text>
            </View>

            {/* Max HP Adjustment Buttons */}
            <View style={styles.buttonContainer}>
                {/* Decrement Buttons - Left Column */}
                <View style={styles.buttonColumn}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => handleDecrement(10)}
                    >
                        <Text style={styles.buttonText}>-10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => handleDecrement(5)}
                    >
                        <Text style={styles.buttonText}>-5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => handleDecrement(1)}
                    >
                        <Text style={styles.buttonText}>-1</Text>
                    </TouchableOpacity>
                </View>

                {/* Increment Buttons - Right Column */}
                <View style={styles.buttonColumn}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => handleIncrement(10)}
                    >
                        <Text style={styles.buttonText}>+10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => handleIncrement(5)}
                    >
                        <Text style={styles.buttonText}>+5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => handleIncrement(1)}
                    >
                        <Text style={styles.buttonText}>+1</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Action Button */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={handleAccept}
                >
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>Accept</Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    maxHpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    maxHpInput: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 80,
    },
    currentHpInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    buttonColumn: {
        flex: 1,
        gap: 8,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionContainer: {
        width: '100%',
    },
    actionButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
