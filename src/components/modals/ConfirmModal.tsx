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
    onConfirm: () => void | Promise<void>;
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
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.footerButton, { backgroundColor: theme.secondary }]}
                    >
                        <Text style={styles.footerButtonText}>{cancelText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => {
                            await onConfirm();
                        }}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>{confirmText}</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View style={{ marginVertical: 20 }}>
                <Text style={[styles.modalText, { fontSize: 14, color: theme.text, textAlign: 'center' }]}>
                    {message}
                </Text>
            </View>
        </BaseModal>
    );
};
