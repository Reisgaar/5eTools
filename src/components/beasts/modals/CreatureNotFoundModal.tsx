// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Modal, View, Text, StyleSheet } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { Button } from 'src/components/ui';

// INTERFACES
interface CreatureNotFoundModalProps {
    visible: boolean;
    creatureName: string;
    onClose: () => void;
    theme: any;
}

/**
 * Modal that displays when a creature is not found.
 */
export default function CreatureNotFoundModal({
    visible,
    creatureName,
    onClose,
    theme
}: CreatureNotFoundModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <View style={[styles.modal, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.header}>
                        <Ionicons name="alert-circle" size={24} color="#f44336" />
                        <Text style={[styles.title, { color: theme.text }]}>Creature Not Found</Text>
                    </View>

                    <View style={[styles.separator, { backgroundColor: theme.border }]} />

                    <View style={styles.content}>
                        <Text style={[styles.message, { color: theme.text }]}>
                            The creature "{creatureName}" could not be found in the available sources.
                        </Text>
                        <Text style={[styles.subMessage, { color: theme.noticeText }]}>
                            This creature may not be available in the current data set or may have a different name.
                        </Text>
                    </View>

                    <Button title='OK' variant='primary' onPress={onClose} fullWidth />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '80%',
        maxWidth: 400,
        borderRadius: styleConstants.borderRadius2XL,
        padding: styleConstants.paddingXL,
        borderWidth: styleConstants.borderXS,
        ...styleConstants.shadowLG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: styleConstants.marginLG,
    },
    title: {
        fontSize: styleConstants.fontSizeXL,
        fontWeight: 'bold',
        marginLeft: styleConstants.marginSM,
    },
    content: {
        marginBottom: styleConstants.marginXL,
    },
    message: {
        fontSize: styleConstants.fontSizeLG,
        marginBottom: styleConstants.marginSM,
        textAlign: 'center',
    },
    subMessage: {
        fontSize: styleConstants.fontSizeMD,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    separator: {
        height: 1,
        marginVertical: styleConstants.marginLG,
    },
});
