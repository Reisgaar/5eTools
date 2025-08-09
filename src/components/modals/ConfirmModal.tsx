import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';

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

export default function ConfirmModal({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    theme
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <BaseModal visible={visible} onClose={handleCancel} theme={theme} title={title}>
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <Text style={{ 
                    color: theme.text, 
                    fontSize: 16, 
                    textAlign: 'center',
                    marginBottom: 24
                }}>
                    {message}
                </Text>
                
                <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 12
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: '#eee',
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                            alignItems: 'center'
                        }}
                        onPress={handleCancel}
                    >
                        <Text style={{ 
                            color: theme.text, 
                            fontWeight: 'bold',
                            fontSize: 16
                        }}>
                            {cancelText}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: theme.primary,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                            alignItems: 'center'
                        }}
                        onPress={handleConfirm}
                    >
                        <Text style={{ 
                            color: theme.buttonText || 'white', 
                            fontWeight: 'bold',
                            fontSize: 16
                        }}>
                            {confirmText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}
