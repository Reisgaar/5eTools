// REACT
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STYLES
import { modalStyles } from 'src/styles/modalStyles';

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

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
    visible, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Delete', 
    cancelText = 'Cancel',
    theme 
}) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableOpacity style={modalStyles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={[modalStyles.modalContent, { backgroundColor: theme.card }]} activeOpacity={1} onPress={() => {}}>
                    <View style={modalStyles.modalHeader}>
                        <Text style={[modalStyles.modalTitle, { color: theme.text }]}>
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={[modalStyles.separator, { backgroundColor: theme.border }]} />
                    
                    <View style={modalStyles.modalBody}>
                        <Text style={[modalStyles.emptyText, { color: theme.text, marginBottom: 20 }]}>
                            {message}
                        </Text>
                        
                        <View style={modalStyles.modalButtons}>
                            <TouchableOpacity 
                                onPress={onClose} 
                                style={[modalStyles.modalButton, { backgroundColor: theme.innerBackground, marginRight: 8, borderWidth: 1, borderColor: theme.border }]}
                            >
                                <Text style={[modalStyles.modalButtonText, { color: theme.text }]}>
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => {
                                    onConfirm();
                                    onClose();
                                }} 
                                style={[modalStyles.modalButton, { backgroundColor: '#dc2626' }]}
                            >
                                <Text style={[modalStyles.modalButtonText, { color: 'white' }]}>
                                    {confirmText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default ConfirmModal;
