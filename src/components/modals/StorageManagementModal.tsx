// REACT
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { useData } from 'src/context/DataContext';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// UTILS
import { getStorageSummary, cleanupAllCaches } from 'src/utils/storageManager';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface StorageManagementModalProps {
    visible: boolean;
    onClose: () => void;
}

/**
 * StorageManagementModal component.
 */
export default function StorageManagementModal({
    visible,
    onClose
}: StorageManagementModalProps): JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const { isInitialized, simpleBeasts, simpleSpells, availableClasses, spellClassRelations } = useData();

    const styles = createBaseModalStyles(currentTheme);
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
                        } catch {
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
            theme={currentTheme}
            title="Storage Management"
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={loadStorageInfo}
                        style={[styles.footerButton, { backgroundColor: currentTheme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>Refresh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleCleanup}
                        style={[styles.footerButton, { backgroundColor: isCleaning ? currentTheme.disabledButtonBackground : '#ff9800' }]}
                    >
                        <Text style={styles.footerButtonText}>Clean</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            {isLoading ? (
                <View style={styles.modalSection}>
                    <Text style={[styles.modalText, { color: currentTheme.noticeText, textAlign: 'center' }]}>
                        Loading storage information...
                    </Text>
                </View>
            ) : storageInfo ? (
                <View style={styles.modalSection}>
                    <View style={[styles.modalSection, { backgroundColor: currentTheme.innerBackground, borderRadius: 8, padding: 16 }]}>
                        <Text style={[styles.modalSectionTitle, { color: currentTheme.text, textAlign: 'center' }]}>
                            {storageInfo.summary}
                        </Text>
                    </View>

                    <View style={styles.modalSection}>
                        <Text style={[styles.modalSectionTitle, { color: currentTheme.text }]}>
                            Storage Breakdown:
                        </Text>
                        {storageInfo.details.map((detail, index) => (
                            <Text key={index} style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                                • {detail}
                            </Text>
                        ))}
                    </View>

                    {isInitialized && (
                        <View style={styles.modalSection}>
                            <Text style={[styles.modalSectionTitle, { color: currentTheme.text }]}>
                                Data Loaded:
                            </Text>
                            <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                                • Beasts: {simpleBeasts.length} loaded
                            </Text>
                            <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                                • Spells: {simpleSpells.length} loaded
                            </Text>
                            <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                                • Available Classes: {availableClasses.length} classes
                            </Text>
                            <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                                • Spell-Class Relations: {spellClassRelations.length} relations
                            </Text>

                            {availableClasses.length > 0 && (
                                <View style={styles.modalSection}>
                                    <Text style={[styles.modalSectionTitle, { color: currentTheme.text }]}>
                                        Classes Available:
                                    </Text>
                                    <Text style={[styles.modalText, { color: currentTheme.noticeText }]}>
                                        {availableClasses.join(', ')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={[styles.modalSection, { backgroundColor: currentTheme.innerBackground, borderRadius: 8, padding: 16, borderLeftWidth: 4, borderLeftColor: currentTheme.primary }]}>
                        <Text style={[styles.modalSectionTitle, { color: currentTheme.text }]}>
                            About Storage:
                        </Text>
                        <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                            • Token cache stores creature tokens for faster loading
                        </Text>
                        <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                            • Image cache stores full creature images
                        </Text>
                        <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                            • Data storage contains your beasts, spells, and other data
                        </Text>
                        <Text style={[styles.modalText, { color: currentTheme.noticeText, marginBottom: 4 }]}>
                            • Cleaning caches will free up space but may slow down initial loading
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={styles.modalSection}>
                    <Text style={[styles.modalText, { color: '#d32f2f', textAlign: 'center' }]}>
                        Failed to load storage information
                    </Text>
                </View>
            )}
        </BaseModal>
    );
};
