// REACT
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
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

/**
 * Modal used to edit a value.
 */
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
}: ValueEditModalProps): JSX.Element {
    const [value, setValue] = useState(initialValue);
    const styles = createBaseModalStyles(theme);

    // Update local value when initialValue changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleValueChange = (amount: number) => {
        setValue(prev => Math.max(0, prev + amount));
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
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={onClose}
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
            {/* Value Display and Input */}
            <TextInput
                style={[styles.modalInput, {
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.primary,
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingVertical: 6,
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

            {/* Increment/Decrement Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, gap: 12 }}>
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
        </BaseModal>
    );
}
