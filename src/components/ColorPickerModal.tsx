import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: theme.card }]}>
                    <Text style={[styles.title, { color: theme.text }]}>Select Color</Text>
                    
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
                                    <Ionicons name="checkmark" size={20} color={color.includes('255, 255, 255') ? '#000' : '#fff'} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Current Selection */}
                    {selectedColor && (
                        <View style={styles.currentSelection}>
                            <Text style={[styles.currentText, { color: theme.text }]}>Selected:</Text>
                            <View style={[styles.currentColor, { backgroundColor: selectedColor }]} />
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { borderColor: theme.primary }]}
                            onPress={handleClear}
                        >
                            <Text style={[styles.actionButtonText, { color: theme.primary }]}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { borderColor: theme.primary }]}
                            onPress={onClose}
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
        width: '90%',
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
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 8,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#666',
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#000',
    },
    currentSelection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    currentText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    currentColor: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#666',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 8,
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