// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// INTERFACES
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

/**
 * DiceRollModal component.
 */
export default function DiceRollModal({ visible, expression, result, breakdown, modifier, type = 'damage', label, theme, onClose }: DiceRollModalProps): React.JSX.Element | null {
    if (!visible) return null;

    let title = label ? label
        : type === 'hit' ? 'Attack Roll'
            : type === 'save' ? 'Saving Roll'
                : 'Damage Roll';

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
        zIndex: 100,
    },
    content: {
        borderRadius: styleConstants.borderRadiusLG,
        padding: 24,
        alignItems: 'center',
        minWidth: 260,
    },
    title: {
        fontSize: styleConstants.fontSizeXL,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginMD,
    },
    result: {
        fontSize: styleConstants.fontSize2XL,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginSM,
    },
    breakdown: {
        fontSize: styleConstants.fontSizeMD,
        marginBottom: styleConstants.marginLG,
        textAlign: 'center',
    },
    closeBtn: {
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: 24,
        paddingVertical: styleConstants.paddingSM,
    },
    closeText: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeLG,
    },
});
