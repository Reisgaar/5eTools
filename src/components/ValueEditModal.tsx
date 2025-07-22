import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ValueEditModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (value: number) => void;
    title: string;
    initialValue: number;
    theme: any;
}

export default function ValueEditModal({
    visible,
    onClose,
    onAccept,
    title,
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
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: theme.card }]}>
                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                    
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
                    <View style={styles.buttonRow}>
                        {/* Decrement Buttons */}
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary }]}
                                onPress={() => handleDecrement(10)}
                            >
                                <Text style={styles.buttonText}>-10</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary }]}
                                onPress={() => handleDecrement(1)}
                            >
                                <Text style={styles.buttonText}>-1</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Increment Buttons */}
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary }]}
                                onPress={() => handleIncrement(1)}
                            >
                                <Text style={styles.buttonText}>+1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primary }]}
                                onPress={() => handleIncrement(10)}
                            >
                                <Text style={styles.buttonText}>+10</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { borderColor: theme.primary }]}
                            onPress={handleCancel}
                        >
                            <Text style={[styles.actionButtonText, { color: theme.primary }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.primary }]}
                            onPress={handleAccept}
                        >
                            <Text style={[styles.actionButtonText, { color: 'white' }]}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '80%',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 60,
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