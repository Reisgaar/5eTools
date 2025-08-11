import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../context/DataContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { getStorageUsage, getStorageSummary, cleanupAllCaches } from '../../utils/storageManager';
import { clearImageCache } from '../../utils/tokenCache';
import { createModalStyles, getModalZIndex } from '../../styles/modals';
import { useModal } from '../../context/ModalContext';

interface StorageManagementModalProps {
    visible: boolean;
    onClose: () => void;
}

export const StorageManagementModal: React.FC<StorageManagementModalProps> = ({
    visible,
    onClose
}) => {
    const { currentTheme } = useAppSettings();
    const { isInitialized, simpleBeasts, simpleSpells, availableClasses, spellClassRelations } = useData();
    const { beastStackDepth, spellStackDepth } = useModal();
    const maxStackDepth = Math.max(beastStackDepth, spellStackDepth);
    const dynamicZIndex = getModalZIndex(maxStackDepth + 1); // Storage modals should be above other modals
    
    const modalStyles = createModalStyles(currentTheme);
    const [storageInfo, setStorageInfo] = useState<{
        summary: string;
        details: string[];
        needsCleanup: boolean;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCleaning, setIsCleaning] = useState(false);

    useEffect(() => {
        if (visible) {
            loadStorageInfo();
        }
    }, [visible]);

    const loadStorageInfo = async () => {
        setIsLoading(true);
        try {
            const info = await getStorageSummary();
            setStorageInfo(info);
        } catch (error) {
            console.error('Error loading storage info:', error);
            setStorageInfo(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCleanup = async () => {
        Alert.alert(
            'Clean Caches',
            'This will remove all cached images and old token data. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clean',
                    style: 'destructive',
                    onPress: async () => {
                        setIsCleaning(true);
                        try {
                            const result = await cleanupAllCaches();
                            Alert.alert('Cleanup Complete', result.message);
                            await loadStorageInfo();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clean caches. Please try again.');
                        } finally {
                            setIsCleaning(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={modalStyles.modalOverlay}>
                {/* Close area at the top */}
                <TouchableOpacity 
                    style={modalStyles.modalCloseArea} 
                    activeOpacity={1} 
                    onPress={onClose}
                />
                <View 
                    style={[modalStyles.modalContent, { backgroundColor: currentTheme.card }]} 
                >
                    <View style={modalStyles.modalHeader}>
                        <Text style={[modalStyles.modalTitle, { color: currentTheme.text }]}>
                            Storage Management
                        </Text>
                        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                            <Ionicons name="close" size={24} color={currentTheme.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={[modalStyles.separator, { backgroundColor: currentTheme.border }]} />

                    <View style={modalStyles.modalBody}>
                        {isLoading ? (
                            <View style={modalStyles.loadingContainer}>
                                <Text style={[modalStyles.loadingText, { color: currentTheme.noticeText }]}>
                                    Loading storage information...
                                </Text>
                            </View>
                        ) : storageInfo ? (
                            <ScrollView 
                                style={modalStyles.scrollView} 
                                contentContainerStyle={modalStyles.scrollContent}
                                showsVerticalScrollIndicator={true}
                            >
                                <View style={[modalStyles.summarySection, { backgroundColor: currentTheme.innerBackground }]}>
                                    <Text style={[modalStyles.summaryText, { color: currentTheme.text }]}>
                                        {storageInfo.summary}
                                    </Text>
                                </View>

                                <View style={modalStyles.detailsSection}>
                                    <Text style={[modalStyles.sectionTitle, { color: currentTheme.text }]}>
                                        Storage Breakdown:
                                    </Text>
                                    {storageInfo.details.map((detail, index) => (
                                        <Text key={index} style={[modalStyles.detailText, { color: currentTheme.noticeText }]}>
                                            • {detail}
                                        </Text>
                                    ))}
                                </View>

                                {isInitialized && (
                                    <View style={modalStyles.dataSection}>
                                        <Text style={[modalStyles.sectionTitle, { color: currentTheme.text }]}>
                                            Data Loaded:
                                        </Text>
                                        <Text style={[modalStyles.detailText, { color: currentTheme.noticeText }]}>
                                            • Beasts: {simpleBeasts.length} loaded
                                        </Text>
                                        <Text style={[modalStyles.detailText, { color: currentTheme.noticeText }]}>
                                            • Spells: {simpleSpells.length} loaded
                                        </Text>
                                        <Text style={[modalStyles.detailText, { color: currentTheme.noticeText }]}>
                                            • Available Classes: {availableClasses.length} classes
                                        </Text>
                                        <Text style={[modalStyles.detailText, { color: currentTheme.noticeText }]}>
                                            • Spell-Class Relations: {spellClassRelations.length} relations
                                        </Text>
                                        
                                        {availableClasses.length > 0 && (
                                            <View style={modalStyles.classesSection}>
                                                <Text style={[modalStyles.subsectionTitle, { color: currentTheme.text }]}>
                                                    Classes Available:
                                                </Text>
                                                <Text style={[modalStyles.detailText, { color: currentTheme.noticeText }]}>
                                                    {availableClasses.join(', ')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                <View style={[modalStyles.infoSection, { backgroundColor: currentTheme.innerBackground, borderLeftColor: currentTheme.primary }]}>
                                    <Text style={[modalStyles.infoTitle, { color: currentTheme.text }]}>
                                        About Storage:
                                    </Text>
                                    <Text style={[modalStyles.infoText, { color: currentTheme.noticeText }]}>
                                        • Token cache stores creature tokens for faster loading
                                    </Text>
                                    <Text style={[modalStyles.infoText, { color: currentTheme.noticeText }]}>
                                        • Image cache stores full creature images
                                    </Text>
                                    <Text style={[modalStyles.infoText, { color: currentTheme.noticeText }]}>
                                        • Data storage contains your beasts, spells, and other data
                                    </Text>
                                    <Text style={[modalStyles.infoText, { color: currentTheme.noticeText }]}>
                                        • Cleaning caches will free up space but may slow down initial loading
                                    </Text>
                                </View>
                            </ScrollView>
                        ) : (
                            <View style={modalStyles.errorContainer}>
                                <Text style={[modalStyles.errorText, { color: '#d32f2f' }]}>
                                    Failed to load storage information
                                </Text>
                            </View>
                        )}

                        <View style={modalStyles.actionsSection}>
                            <TouchableOpacity 
                                onPress={loadStorageInfo}
                                style={[modalStyles.actionButton, { backgroundColor: currentTheme.primary }]}
                            >
                                <Text style={[modalStyles.actionButtonText, { color: 'white' }]}>
                                    Refresh
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={handleCleanup}
                                disabled={isCleaning}
                                style={[
                                    modalStyles.actionButton, 
                                    { 
                                        backgroundColor: isCleaning ? currentTheme.disabledButtonBackground : '#ff9800',
                                        opacity: isCleaning ? 0.6 : 1
                                    }
                                ]}
                            >
                                <Text style={[modalStyles.actionButtonText, { color: 'white' }]}>
                                    {isCleaning ? "Cleaning..." : "Clean All Caches"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 12,
        padding: 0,
        marginHorizontal: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '85%',
        minHeight: 300, // Ensure minimum height
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    separator: {
        height: 1,
        marginBottom: 0,
    },
    modalBody: {
        padding: 20,
        flex: 1,
        minHeight: 0, // Important for flex to work properly
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
        marginBottom: 16,
        minHeight: 100, // Minimum height for scroll to work
        maxHeight: 400, // Maximum height before scrolling
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20, // Add some bottom padding
    },
    summarySection: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detailsSection: {
        marginBottom: 20,
    },
    dataSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subsectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    classesSection: {
        marginTop: 8,
        paddingLeft: 8,
    },
    detailText: {
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
    infoSection: {
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
    actionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
