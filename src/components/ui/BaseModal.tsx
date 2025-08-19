// REACT
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// CONSTANTS
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// INTERFACES
interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    theme: any;

    // Header configuration
    title?: string;
    subtitle?: string;
    tokenUrl?: string;

    // Layout configuration
    width?: number | string;
    height?: number | string;
    maxHeight?: number | string;
    maxWidth?: number | string;

    // Z-index for modal stacking
    zIndex?: number;

    // Footer configuration
    footerContent?: React.ReactNode;
}

/**
 * BaseModal component.
 */
export default function BaseModal({
    visible,
    onClose,
    children,
    theme,
    title,
    subtitle,
    tokenUrl,
    footerContent
}: BaseModalProps) {
    const styles = createBaseModalStyles(theme);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={[styles.modalOverlay]}>
                <View
                    style={[
                        styles.baseModalContainer,
                        { maxHeight: SCREEN_HEIGHT * 0.8, width: SCREEN_WIDTH * 0.9 },
                        isKeyboardVisible && { transform: [{ translateX: '-50%' }, { translateY: '-85%' }] }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderContent}>
                            {tokenUrl && (<Image source={{ uri: tokenUrl }} style={styles.modalToken} resizeMode="contain" />)}
                            <View style={styles.modalHeaderInfo}>
                                {title && ( <Text style={styles.modalTitle}>{title}</Text> )}
                                {subtitle && ( <Text style={styles.modalSubtitle}>{subtitle}</Text> )}
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Separator */}
                    <View style={styles.modalSeparator} />

                    {/* Content */}
                    <View style={[styles.modalBody, { flex: 1, maxHeight: 300 }]}>
                        <ScrollView showsVerticalScrollIndicator={true}>
                            {children}
                        </ScrollView>
                    </View>

                    {/* Footer */}
                    {footerContent && (
                        <View style={styles.modalFooter}>
                            {footerContent}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}
