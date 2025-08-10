import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '../../styles/commonStyles';

interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    theme: any;
    title?: string;
    width?: number | string;
    height?: number | string;
    maxHeight?: number | string;
}

export default function BaseModal({ visible, onClose, children, theme, title, width, height, maxHeight }: BaseModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={[commonStyles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity 
                    style={[
                        commonStyles.modalContent, 
                        { backgroundColor: theme.background },
                        width && { width },
                        height && { height },
                        maxHeight && { maxHeight }
                    ]}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header with close button */}
                    <View style={commonStyles.modalHeader}>
                        {title && title.trim() !== '' && (
                            <View style={{ flex: 1 }}>
                                <Text style={[commonStyles.modalTitle, { color: theme.text }]}>
                                    {title}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity onPress={onClose} style={commonStyles.modalCloseButton}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Separator line */}
                    <View style={[commonStyles.modalSeparator, { backgroundColor: theme.primary }]} />
                    
                    {/* Content */}
                    {children}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
