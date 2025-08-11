import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, ScrollView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBaseModalStyles } from '../../styles/baseModalStyles';

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
    
    // Interaction handlers
    onCreaturePress?: (name: string, source: string) => void;
    onSpellPress?: (name: string, source: string) => void;
}

export default function BaseModal({ 
    visible, 
    onClose, 
    children, 
    theme,
    title,
    subtitle,
    tokenUrl,
    width,
    height,
    maxHeight,
    maxWidth,
    zIndex = 1000,
    showFooter = false,
    footerContent,
    scrollable = false,
    scrollContentStyle,
    onCreaturePress,
    onSpellPress
}: BaseModalProps) {
    const styles = createBaseModalStyles(theme);
    
    const modalContent = (
        <View style={[
            styles.modalContent,
            { zIndex },
            ...(width ? [{ width: width as any }] : []),
            ...(height ? [{ height: height as any }] : []),
            ...(maxHeight ? [{ maxHeight: maxHeight as any }] : []),
            ...(maxWidth ? [{ maxWidth: maxWidth as any }] : [])
        ]}>
            {/* Header */}
            <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                    {tokenUrl && (
                        <Image 
                            source={{ uri: tokenUrl }} 
                            style={styles.modalToken}
                            resizeMode="contain"
                        />
                    )}
                    <View style={styles.modalHeaderInfo}>
                        {title && (
                            <Text style={styles.modalTitle}>{title}</Text>
                        )}
                        {subtitle && (
                            <Text style={styles.modalSubtitle}>{subtitle}</Text>
                        )}
                    </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
            </View>
            
            {/* Separator */}
            <View style={styles.modalSeparator} />
            
            {/* Content */}
            {scrollable ? (
                <ScrollView 
                    style={styles.modalScrollView}
                    contentContainerStyle={[styles.modalScrollContent, scrollContentStyle]}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                    bounces={false}
                    alwaysBounceVertical={false}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={styles.modalBody}>
                    {children}
                </View>
            )}
            
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
            <View 
                style={[styles.modalOverlay, { zIndex: zIndex - 1 }]} 
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => onClose()}
            >
                <View 
                    style={styles.modalContainer}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(e) => e.stopPropagation()}
                >
                    {modalContent}
                </View>
            </View>
        </Modal>
    );
}
