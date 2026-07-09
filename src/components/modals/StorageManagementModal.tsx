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
import { getCommonStyles } from 'src/styles/commonStyles';

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
}: StorageManagementModalProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const { isInitialized, simpleBeasts, simpleSpells, availableClasses, spellClassRelations } = useData();

    const styles = createBaseModalStyles(currentTheme);
    const commonStyles = getCommonStyles(currentTheme);
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
                <View style={[commonStyles.row_center_center, commonStyles.w_100, { gap: '4%' }]}>
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
                    <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.text_center]}>
                        Loading storage information...
                    </Text>
                </View>
            ) : storageInfo ? (
                <View style={styles.modalSection}>
                    <View style={[styles.modalSection, commonStyles.br_md, commonStyles.p_lg, { backgroundColor: currentTheme.innerBackground }]}>
                        <Text style={[styles.modalSectionTitle, commonStyles.text_primary, commonStyles.text_center]}>
                            {storageInfo.summary}
                        </Text>
                    </View>

                    <View style={styles.modalSection}>
                        <Text style={[styles.modalSectionTitle, commonStyles.text_primary]}>
                            Storage Breakdown:
                        </Text>
                        {storageInfo.details.map((detail, index) => (
                            <Text key={index} style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                                • {detail}
                            </Text>
                        ))}
                    </View>

                    {isInitialized && (
                        <View style={styles.modalSection}>
                            <Text style={[styles.modalSectionTitle, commonStyles.text_primary]}>
                                Data Loaded:
                            </Text>
                            <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                                • Beasts: {simpleBeasts.length} loaded
                            </Text>
                            <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                                • Spells: {simpleSpells.length} loaded
                            </Text>
                            <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                                • Available Classes: {availableClasses.length} classes
                            </Text>
                            <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                                • Spell-Class Relations: {spellClassRelations.length} relations
                            </Text>

                            {availableClasses.length > 0 && (
                                <View style={styles.modalSection}>
                                    <Text style={[styles.modalSectionTitle, commonStyles.text_primary]}>
                                        Classes Available:
                                    </Text>
                                    <Text style={[styles.modalText, commonStyles.text_grey]}>
                                        {availableClasses.join(', ')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={[styles.modalSection, commonStyles.br_md, commonStyles.p_lg, commonStyles.bwl_lg, { backgroundColor: currentTheme.innerBackground, borderLeftColor: currentTheme.primary }]}>
                        <Text style={[styles.modalSectionTitle, commonStyles.text_primary]}>
                            About Storage:
                        </Text>
                        <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                            • Token cache stores creature tokens for faster loading
                        </Text>
                        <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                            • Image cache stores full creature images
                        </Text>
                        <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                            • Data storage contains your beasts, spells, and other data
                        </Text>
                        <Text style={[styles.modalText, commonStyles.text_grey, commonStyles.mb_xs]}>
                            • Cleaning caches will free up space but may slow down initial loading
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={styles.modalSection}>
                    <Text style={[styles.modalText, commonStyles.text_center, { color: '#d32f2f' }]}>
                        Failed to load storage information
                    </Text>
                </View>
            )}
        </BaseModal>
    );
};
