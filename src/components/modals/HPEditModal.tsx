import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';

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
}: HPEditModalProps) {
    const [currentHp, setCurrentHp] = useState(initialCurrentHp);

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

    const handleCancel = () => {
        setCurrentHp(initialCurrentHp);
        onClose();
    };

    // Create title
    const modalTitle = "Edit Current HP";

    return (
        <BaseModal visible={visible} onClose={handleCancel} theme={theme} title={modalTitle}>
            {/* Creature Name */}
            <View style={styles.creatureNameContainer}>
                <Text style={[styles.creatureName, { color: theme.text }]}>
                    #{combatantNumber} {creatureName}
                </Text>
            </View>

            {/* HP Display */}
            <View style={styles.hpDisplayContainer}>
                <TextInput
                    style={[styles.currentHpInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
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
                
                <Text style={[styles.separator, { color: theme.text }]}>/</Text>
                
                <TouchableOpacity
                    style={[styles.maxHpDisplay, { 
                        backgroundColor: theme.inputBackground, 
                        borderColor: theme.primary 
                    }]}
                    onPress={onMaxHpEdit}
                >
                    <Text style={[styles.maxHpText, { color: theme.text }]}>
                        {maxHp}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* HP Adjustment Buttons */}
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
    creatureNameContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    creatureName: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    hpDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
    },
    currentHpInput: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 80,
    },
    separator: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    maxHpDisplay: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    maxHpText: {
        fontSize: 24,
        fontWeight: 'bold',
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
