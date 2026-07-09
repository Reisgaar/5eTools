// REACT
import React from 'react';
import { View, Text } from 'react-native';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { BaseModal, Button } from 'src/components/ui';

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
}: ConfirmModalProps): React.JSX.Element {
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);



    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={title}
            footerContent={
                <View style={[commonStyles.row_center_center, commonStyles.w_100, { gap: '4%' }]}>
                    <View style={{ flex: 1 }}>
                        <Button title={cancelText} variant="secondary" onPress={onClose} fullWidth />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title={confirmText} variant="primary" onPress={() => { onConfirm(); }} fullWidth />
                    </View>
                </View>
            }
        >
            <View style={commonStyles.my_xl}>
                <Text style={[styles.modalText, commonStyles.text_md, commonStyles.text_primary, commonStyles.text_center]}>
                    {message}
                </Text>
            </View>
        </BaseModal>
    );
};
