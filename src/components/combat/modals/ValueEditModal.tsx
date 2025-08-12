import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../../ui';
import { createBaseModalStyles } from '../../../styles/baseModalStyles';


interface ValueEditModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: (value: number) => void;
    title: string;
    creatureName?: string;
    combatantNumber?: number;
    initialValue: number;
    theme: any;
    isInitiative?: boolean;
    initiativeBonus?: number;
    isGroup?: boolean;
}

export default function ValueEditModal({
    visible,
    onClose,
    onAccept,
    title,
    creatureName,
    combatantNumber,
    initialValue,
    theme,
    isInitiative = false,
    initiativeBonus = 0,
    isGroup = false
}: ValueEditModalProps) {
    const [value, setValue] = useState(initialValue);
    const styles = createBaseModalStyles(theme);

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



    const handleRollInitiative = () => {
        // Roll 1d20 + initiative bonus
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + initiativeBonus;
        setValue(total);
    };

    // Create title with bonus for initiative
    const modalTitle = isInitiative 
        ? `${title} (Bonus: ${initiativeBonus >= 0 ? '+' : ''}${initiativeBonus})` 
        : title;

    const modalSubtitle = creatureName 
        ? `${!isGroup && combatantNumber ? `#${combatantNumber} ` : ''}${creatureName}`
        : undefined;

    return (
        <BaseModal 
            visible={visible} 
            onClose={onClose} 
            theme={theme} 
            title={modalTitle}
            subtitle={modalSubtitle}
            maxHeight="85%"
        >
            {/* Value Display and Input */}
            <View style={styles.modalSection}>
                <TextInput
                    style={[styles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.primary,
                        fontSize: 24,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderWidth: 2,
                        borderRadius: 8
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

            {/* Roll Initiative Button - Only for initiative */}
            {isInitiative && (
                <View style={styles.modalSection}>
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: theme.success || '#4CAF50' }]}
                        onPress={handleRollInitiative}
                    >
                        <Text style={[styles.modalButtonText, { color: 'white' }]}>
                            Roll Initiative (1d20{initiativeBonus >= 0 ? '+' : ''}{initiativeBonus})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

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

 