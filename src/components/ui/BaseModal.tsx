// REACT
import React from 'react';
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
    showFooter?: boolean;
    footerContent?: React.ReactNode;

    // Scroll configuration
    scrollable?: boolean;
    scrollContentStyle?: any;

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
    showFooter = false,
    footerContent,
    scrollable = false,
    scrollContentStyle
}: BaseModalProps) {
    const styles = createBaseModalStyles(theme);

    const modalContent = (
        <View style={[
            styles.modalContent,
            { zIndex: 10 , maxHeight: SCREEN_HEIGHT * 0.8, maxWidth: SCREEN_WIDTH * 0.9 }
        ]}>
            {/* Header */}
            <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                    {tokenUrl && (
                        <Image source={{ uri: tokenUrl }} style={styles.modalToken} resizeMode="contain" />
                    )}
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
            <View style={[styles.modalBody]}>
                {scrollable ? (
                    <ScrollView
                        contentContainerStyle={scrollContentStyle}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        scrollEventThrottle={16}
                        bounces={false}
                        alwaysBounceVertical={false}
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <>{children}</>
                )}
            </View>

            {/* Footer */}
            {showFooter && (
                <View style={styles.modalFooter}>
                    {footerContent}
                </View>
            )}
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                onClose();
            }}>
                <View style={[styles.modalOverlay]}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalContainer}>
                            {modalContent}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
