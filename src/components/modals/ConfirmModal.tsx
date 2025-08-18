// REACT
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// INTERFACES
interface ConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    theme: any;
}

/**
 * ConfirmModal component.
 */
export default function ConfirmModal({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Accept',
    cancelText = 'Cancel',
    theme
}: ConfirmModalProps): JSX.Element {
    const styles = createBaseModalStyles(theme);

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={title}
            maxHeight="60%"
        >
            <View style={styles.modalSection}>
                <Text style={[styles.modalText, { color: theme.text, marginBottom: 20, textAlign: 'center' }]}>
                    {message}
                </Text>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    onPress={onClose}
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                        {cancelText}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        onConfirm();
                        onClose();
                    }}
                    style={[styles.modalButton, { backgroundColor: theme.danger || '#dc2626' }]}
                >
                    <Text style={[styles.modalButtonText, { color: 'white' }]}>
                        {confirmText}
                    </Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
};
