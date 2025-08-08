import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';

interface ValueEditModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (value: number) => void;
    title: string;
    creatureName?: string;
    combatantNumber?: number;
    initialValue: number;
    theme: any;
}

export default function ValueEditModal({
    visible,
    onClose,
    onAccept,
    title,
    creatureName,
    combatantNumber,
    initialValue,
    theme
}: ValueEditModalProps) {
    const [value, setValue] = useState(initialValue);

    // Update local value when initialValue changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleIncrement = (amount: number) => {
        setValue(prev => prev + amount);
    };

    const handleDecrement = (amount: number) => {
        setValue(prev => Math.max(0, prev - amount));
    };

    const handleAccept = () => {
        onAccept(value);
        onClose();
    };

    const handleCancel = () => {
        setValue(initialValue); // Reset to original value
        onClose();
    };

    return (
        <BaseModal visible={visible} onClose={handleCancel} theme={theme} title={title}>
            
            {/* Creature Name */}
            {creatureName && combatantNumber && (
                <View style={styles.creatureNameContainer}>
                    <Text style={[styles.creatureName, { color: theme.text }]}>
                        #{combatantNumber} {creatureName}
                    </Text>
                </View>
            )}
                    
            {/* Value Display and Input */}
            <View style={styles.valueContainer}>
                        <TextInput
                            style={[styles.valueInput, { 
                                backgroundColor: theme.inputBackground, 
                                color: theme.text, 
                                borderColor: theme.primary 
                            }]}
                            value={String(value)}
                            onChangeText={(text) => {
                                const num = parseInt(text, 10);
                                if (!isNaN(num)) {
                                    setValue(Math.max(0, num));
                                } else if (text === '') {
                                    setValue(0);
                                }
                            }}
                            keyboardType="numeric"
                            textAlign="center"
                        />
                    </View>

                    {/* Increment/Decrement Buttons */}
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

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
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
    valueContainer: {
        marginBottom: 24,
        width: '100%',
    },
    valueInput: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 