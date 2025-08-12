import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../../ui';
import { createBaseModalStyles } from '../../../styles/baseModalStyles';

interface ColorPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectColor: (color: string | null) => void;
    currentColor?: string;
    theme: any;
}

const COLORS = [
    'rgba(255, 107, 107, 0.3)', // Light Red
    'rgba(255, 167, 38, 0.3)', // Light Orange
    'rgba(255, 235, 59, 0.3)', // Light Yellow
    'rgba(102, 187, 106, 0.3)', // Light Green
    'rgba(66, 165, 245, 0.3)', // Light Blue
    'rgba(171, 71, 188, 0.3)', // Light Purple
    'rgba(236, 64, 122, 0.3)', // Light Pink
    'rgba(141, 110, 99, 0.3)', // Light Brown
    'rgba(120, 144, 156, 0.3)', // Light Gray
    'rgba(255, 152, 0, 0.3)', // Light Dark Orange
];

export default function ColorPickerModal({
    visible,
    onClose,
    onSelectColor,
    currentColor,
    theme
}: ColorPickerModalProps) {
    const [selectedColor, setSelectedColor] = useState<string | undefined>(currentColor);
    const styles = createBaseModalStyles(theme);

    const handleSelectColor = (color: string) => {
        setSelectedColor(color);
    };

    const handleAccept = () => {
        onSelectColor(selectedColor || null);
        onClose();
    };

    const handleClear = () => {
        onSelectColor(null);
        onClose();
    };

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Select Color" maxHeight="75%">
            {/* Color Grid */}
            <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor === color && styles.selectedColor
                        ]}
                        onPress={() => handleSelectColor(color)}
                    >
                        {selectedColor === color && (
                            <Ionicons name="checkmark" size={20} color="#000" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Current Selection */}
            {selectedColor && (
                <View style={styles.currentSelection}>
                    <Text style={[styles.currentText, { color: theme.text }]}>Selected:</Text>
                    <View style={[styles.currentColor, { backgroundColor: selectedColor, borderColor: theme.border }]} />
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={handleClear}
                >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Clear</Text>
                </TouchableOpacity>
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

 