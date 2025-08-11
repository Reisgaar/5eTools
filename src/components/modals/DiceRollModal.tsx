import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { useModal } from '../../context/ModalContext';
import { getModalZIndex } from '../../styles/modals';

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
    const { beastStackDepth, spellStackDepth } = useModal();
    const maxStackDepth = Math.max(beastStackDepth, spellStackDepth);
    const dynamicZIndex = getModalZIndex(maxStackDepth + 1); // Dice modals should be above other modals
    
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
        <Modal visible={visible} animationType="slide" transparent>
            <View 
                style={[styles.overlay, { zIndex: dynamicZIndex }]} 
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => onClose()}
            >
                <View 
                    style={[styles.content, { backgroundColor: theme.card, zIndex: dynamicZIndex }]}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerInfo}>
                            <Text style={[styles.title, { color: theme.text }]}>{`${title}: ${expression}`}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18 }}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={[styles.separator, { backgroundColor: theme.border }]} />
                    
                    {/* Content */}
                    <View style={styles.body}>
                        <Text style={[styles.result, { color: theme.success || '#4ade80' }]}>{`Total: ${result}`}</Text>
                        <Text style={[styles.breakdown, { color: theme.text }]}>
                            Rolls: {breakdown.join(', ')}{modifier ? `  + ${modifier}` : ''}
                        </Text>
                        
                        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.primary }]}>
                            <Text style={[styles.closeText, { color: theme.buttonText || 'white' }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    headerInfo: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    separator: {
        height: 1,
        width: '100%',
        marginBottom: 16,
    },
    body: {
        alignItems: 'center',
        width: '100%',
    },
    result: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    breakdown: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    closeBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DiceRollModal; 