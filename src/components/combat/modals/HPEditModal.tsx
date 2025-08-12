import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../../ui';
import { createBaseModalStyles } from '../../../styles/baseModalStyles';
import { modalStyles } from '../../../styles/modalStyles';

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
    const modalTitle = "Edit Current HP";

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title={modalTitle}>
            {/* Creature Name */}
            <View style={modalStyles.creatureNameContainer}>
                <Text style={[styles.modalText, { fontStyle: 'italic', textAlign: 'center' }]}>
                    #{combatantNumber} {creatureName}
                </Text>
            </View>

            {/* HP Display */}
            <View style={modalStyles.hpDisplayContainer}>
                <TextInput
                    style={[modalStyles.currentHpInput, { 
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
                
                <Text style={[modalStyles.hpSeparator, { color: theme.text }]}>/</Text>
                
                <TouchableOpacity
                    style={[modalStyles.maxHpDisplay, { 
                        backgroundColor: theme.inputBackground, 
                        borderColor: theme.primary 
                    }]}
                    onPress={onMaxHpEdit}
                >
                    <Text style={[modalStyles.maxHpText, { color: theme.text }]}>
                        {maxHp}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* HP Adjustment Buttons */}
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


