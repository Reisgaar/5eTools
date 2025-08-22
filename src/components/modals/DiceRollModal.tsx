// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

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
export default function DiceRollModal({ visible, expression, result, breakdown, modifier, type = 'damage', label, theme, onClose }: DiceRollModalProps): JSX.Element | null {
    const baseModalStyles = createBaseModalStyles(theme);
    
    if (!visible) return null;

    let title = label ? label
        : type === 'hit' ? 'Attack Roll'
            : type === 'save' ? 'Saving Roll'
                : 'Damage Roll';

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={title}
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[baseModalStyles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={baseModalStyles.footerButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.result, { color: theme.primary }]}>{`Total: ${result}`}</Text>
                <Text style={[styles.breakdown, { color: theme.text, fontStyle: 'italic' }]}>
                    Roll: {breakdown.join(', ')}{modifier ? `  + ${modifier}` : ''} ({expression})
                </Text>
            </View>
        </BaseModal>
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
