import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { BaseModal } from '../ui/BaseModal';
import { CustomButton } from '../ui/CustomButton';
import { getStorageSummary, cleanupAllCaches, formatBytes } from '../../utils/storageManager';

interface StorageManagementModalProps {
    visible: boolean;
    onClose: () => void;
}

export const StorageManagementModal: React.FC<StorageManagementModalProps> = ({
    visible,
    onClose
}) => {
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
            setStorageInfo({
                summary: 'Error loading storage information',
                details: ['Failed to read storage data'],
                needsCleanup: false
            });
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
                            await loadStorageInfo(); // Refresh the info
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
        <BaseModal
            visible={visible}
            onClose={onClose}
            title="Storage Management"
            contentStyle={styles.modalContent}
        >
            <ScrollView style={styles.container}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading storage information...</Text>
                    </View>
                ) : storageInfo ? (
                    <View style={styles.content}>
                        <View style={styles.summarySection}>
                            <Text style={styles.summaryText}>{storageInfo.summary}</Text>
                        </View>

                        <View style={styles.detailsSection}>
                            <Text style={styles.sectionTitle}>Storage Breakdown:</Text>
                            {storageInfo.details.map((detail, index) => (
                                <Text key={index} style={styles.detailText}>
                                    • {detail}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.actionsSection}>
                            <CustomButton
                                title="Refresh"
                                onPress={loadStorageInfo}
                                style={styles.refreshButton}
                                disabled={isLoading}
                            />
                            
                            <CustomButton
                                title={isCleaning ? "Cleaning..." : "Clean All Caches"}
                                onPress={handleCleanup}
                                style={[
                                    styles.cleanupButton,
                                    storageInfo.needsCleanup && styles.cleanupButtonUrgent
                                ]}
                                disabled={isCleaning}
                            />
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>About Storage:</Text>
                            <Text style={styles.infoText}>
                                • Token cache stores creature tokens for faster loading
                            </Text>
                            <Text style={styles.infoText}>
                                • Image cache stores full creature images
                            </Text>
                            <Text style={styles.infoText}>
                                • Data storage contains your beasts, spells, and other data
                            </Text>
                            <Text style={styles.infoText}>
                                • Cleaning caches will free up space but may slow down initial loading
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Failed to load storage information</Text>
                    </View>
                )}
            </ScrollView>
        </BaseModal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        maxHeight: '80%',
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
    },
    summarySection: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    detailsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    detailText: {
        fontSize: 14,
        marginBottom: 4,
        color: '#666',
        lineHeight: 20,
    },
    actionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
    },
    refreshButton: {
        flex: 1,
        backgroundColor: '#2196f3',
    },
    cleanupButton: {
        flex: 1,
        backgroundColor: '#ff9800',
    },
    cleanupButtonUrgent: {
        backgroundColor: '#f44336',
    },
    infoSection: {
        backgroundColor: '#e3f2fd',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2196f3',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1976d2',
    },
    infoText: {
        fontSize: 14,
        marginBottom: 4,
        color: '#424242',
        lineHeight: 20,
    },
});
