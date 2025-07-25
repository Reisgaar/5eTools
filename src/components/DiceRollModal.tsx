import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DiceRollModalProps {
    visible: boolean;
    expression: string;
    result: number;
    breakdown: number[];
    modifier?: number;
    type?: 'damage' | 'hit' | 'save';
    label?: string;
    theme: any;
    onClose: () => void;
}

const DiceRollModal: React.FC<DiceRollModalProps> = ({ visible, expression, result, breakdown, modifier, type = 'damage', label, theme, onClose }) => {
    if (!visible) return null;
    let title = '';
    if (label) {
        title = label;
    } else if (type === 'hit') {
        title = 'Attack Roll';
    } else if (type === 'save') {
        title = 'Saving Roll';
    } else {
        title = 'Damage Roll';
    }
    return (
        <View style={styles.overlay} pointerEvents="auto">
            <View style={[styles.content, { backgroundColor: theme.card }]}>
                <Text style={[styles.title, { color: theme.text }]}>{`${title}: ${expression}`}</Text>
                <Text style={[styles.result, { color: theme.success || '#4ade80' }]}>{`Total: ${result}`}</Text>
                <Text style={[styles.breakdown, { color: theme.text }]}>Rolls: {breakdown.join(', ')}{modifier ? `  + ${modifier}` : ''}</Text>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.closeText, { color: theme.buttonText || 'white' }]}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Ensure it's on top
    },
    content: {
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        minWidth: 260,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    result: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    breakdown: {
        fontSize: 15,
        marginBottom: 16,
        textAlign: 'center',
    },
    closeBtn: {
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    closeText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DiceRollModal; 