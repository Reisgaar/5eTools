import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../../ui';
import { createBaseModalStyles } from '../../../styles/baseModalStyles';
import { modalStyles } from '../../../styles/modalStyles';

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
        >
            {/* Max HP Display */}
            <View style={modalStyles.maxHpContainer}>
                <Text style={[styles.modalText, { fontWeight: 'bold' }]}>Max HP:</Text>
                <TextInput
                    style={[modalStyles.maxHpInput, { 
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

            {/* Max HP Adjustment Buttons */}
            <View style={modalStyles.editButtonContainer}>
                {/* Decrement Buttons - Left Column */}
                <View style={modalStyles.buttonColumn}>
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
                <View style={modalStyles.buttonColumn}>
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


