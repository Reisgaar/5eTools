// REACT
import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, Keyboard, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

// CONSTANTS
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// INTERFACES
interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
    onBack?: () => void;   // when set, shows a back button (left) to pop the modal nav stack
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

    // Set false when the children manage their own scrolling (e.g. a ReorderableList/FlatList),
    // so we don't nest a scroll view inside another.
    scrollable?: boolean;

    // When this value changes, the internal scroll view jumps back to the top (e.g. wizard steps).
    scrollResetKey?: string | number;
}

/**
 * BaseModal component.
 */
export default function BaseModal({
    visible,
    onClose,
    onBack,
    children,
    theme,
    title,
    subtitle,
    tokenUrl,
    footerContent,
    scrollable = true,
    scrollResetKey,
}: BaseModalProps) {
    const styles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [scrollResetKey]);

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
            <GestureHandlerRootView style={[styles.modalOverlay]}>
                <View
                    style={[
                        styles.baseModalContainer,
                        { maxHeight: SCREEN_HEIGHT * 0.8, width: SCREEN_WIDTH * 0.9 },
                        isKeyboardVisible && { transform: [{ translateX: '-50%' }, { translateY: '-85%' }] }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        {onBack && (
                            <TouchableOpacity onPress={onBack} style={[commonStyles.pr_sm, commonStyles.jc_center]} accessibilityLabel="Back">
                                <Ionicons name="chevron-back" size={24} color={theme.text} />
                            </TouchableOpacity>
                        )}
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
                        {scrollable ? (
                            <ScrollView ref={scrollRef} showsVerticalScrollIndicator={true}>
                                {children}
                            </ScrollView>
                        ) : (
                            children
                        )}
                    </View>

                    {/* Footer */}
                    {footerContent && (
                        <View style={styles.modalFooter}>
                            {footerContent}
                        </View>
                    )}
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
}
