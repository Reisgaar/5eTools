// REACT
import React from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// CONTEXTS
import { useRouter } from 'expo-router';
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useData } from 'src/context/DataContext';

// UTILS
import { regenerateAllIndexes } from 'src/utils/fileStorage';

// COMPONENTS
import { Ionicons } from '@expo/vector-icons';
import { StorageManagementModal, ConfirmModal } from 'src/components/modals';

export default function SettingsScreen() {
    const { themeName, currentTheme, setTheme, useAdvancedDiceRoll, setUseAdvancedDiceRoll } = useAppSettings();
    const { simpleBeasts, simpleSpells, isLoading, isInitialized, reloadData, clearData } = useData();
    const router = useRouter();

    // Storage management state
    const [storageModalVisible, setStorageModalVisible] = React.useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<(() => Promise<void>) | null>(null);
    const [confirmMessage, setConfirmMessage] = React.useState('');

    const showConfirmModal = (message: string, action: () => Promise<void>) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmModalVisible(true);
    };

    const handleReload = async () => {
        try {
            await reloadData();
            // After reloading data, regenerate all indexes for better performance
            await regenerateAllIndexes();
            Alert.alert('Success', 'Data loaded and indexes regenerated successfully.');
        } catch (error) {
            console.error('❌ Error during data reload:', error);
            Alert.alert('Error', 'Failed to reload data. Please try again.');
        }
    };

    const handleClear = async () => {
        showConfirmModal(
            'This will clear all data (beasts, spells, combats, players, spellbooks, campaigns). This action cannot be undone.',
            async () => {
                try {
                    await clearData();
                    Alert.alert('Success', 'All data has been cleared successfully.');
                } catch (error) {
                    console.error('❌ Error clearing data:', error);
                    Alert.alert('Error', 'Failed to clear data. Please try again.');
                }
            }
        );
    };

    const handleRegenerateIndexes = async () => {
        showConfirmModal(
            'This will regenerate all indexes (beasts, spells, combats, relations, classes, filter indexes) from existing data files. This action cannot be undone.',
            async () => {
                try {
                    await regenerateAllIndexes();
                    Alert.alert('Success', 'All indexes have been regenerated successfully.');
                } catch (error) {
                    console.error('❌ Error regenerating indexes:', error);
                    Alert.alert('Error', 'Failed to regenerate indexes. Please try again.');
                }
            }
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={{ marginBottom: 16, borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderBottomColor: currentTheme.primary }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: currentTheme.text }}>Settings</Text>
            </View>
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background, paddingTop: 0 }]}> 
                <View style={{ justifyContent: 'center', marginBottom: 12 }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Theme</Text>
                    <View style={commonStyles.row}>
                        <Pressable
                            onPress={() => setTheme('light')}
                            style={[
                                commonStyles.langButton,
                                themeName === 'light' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>Light</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setTheme('dark')}
                            style={[
                                commonStyles.langButton,
                                themeName === 'dark' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>Dark</Text>
                        </Pressable>
                    </View>
                </View>
                
                <View style={{ justifyContent: 'center', marginBottom: 12 }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Dice Rolling</Text>
                    <View style={commonStyles.row}>
                        <Pressable
                            onPress={() => setUseAdvancedDiceRoll(false)}
                            style={[
                                commonStyles.langButton,
                                !useAdvancedDiceRoll && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>Simple</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setUseAdvancedDiceRoll(true)}
                            style={[
                                commonStyles.langButton,
                                useAdvancedDiceRoll && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>Advanced</Text>
                        </Pressable>
                    </View>
                    <Text style={[styles.settingDescription, { color: currentTheme.noticeText }]}>
                        {useAdvancedDiceRoll 
                            ? 'Advanced mode allows you to configure advantage/disadvantage and situational bonuses before rolling.'
                            : 'Simple mode rolls dice immediately without configuration options.'
                        }
                    </Text>
                </View>
                
                <View style={{ justifyContent: 'center', marginBottom: 12 }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Data Management</Text>
                    <Pressable 
                        onPress={() => setStorageModalVisible(true)} 
                        style={[commonStyles.button, { backgroundColor: currentTheme.primary, marginTop: 8 }]}
                    > 
                        <Text style={[commonStyles.buttonText, { color: currentTheme.buttonText || 'white' }]}>Storage Management</Text>
                    </Pressable>
                    <Pressable 
                        onPress={handleRegenerateIndexes} 
                        style={[commonStyles.button, { backgroundColor: '#f59e0b', marginTop: 8 }]}
                    > 
                        <Text style={[commonStyles.buttonText, { color: 'white' }]}>Regenerate All Indexes</Text>
                    </Pressable>
                    <Text style={[styles.settingDescription, { color: currentTheme.noticeText, marginTop: 4 }]}>
                        Regenerates all indexes (beasts, spells, combats, relations, classes, filter indexes) from existing data files. This improves filter performance on Android.
                    </Text>
                </View>

                {/* Data Loading Section */}
                <View style={{ justifyContent: 'center', marginBottom: 12 }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Data Loading</Text>
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                        <TouchableOpacity 
                            onPress={handleReload}
                            disabled={isLoading}
                            style={{
                                backgroundColor: currentTheme.primary,
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                opacity: isLoading ? 0.6 : 1,
                                flex: 1
                            }}
                        >
                            {isLoading
                                ? ( <ActivityIndicator color="white" size="small" />)
                                : (<Text style={{ color: 'white', fontWeight: '600' }}>
                                    {(!isInitialized || (simpleBeasts.length === 0 && simpleSpells.length === 0)) ? 'Load Data' : 'Reload Data'}
                                  </Text>)
                            }
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={handleClear}
                            disabled={isLoading}
                            style={{
                                backgroundColor: '#dc2626',
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                opacity: isLoading ? 0.6 : 1,
                                flex: 1
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: '600' }}>
                                Clear Data
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Data Status - Fixed height container to prevent layout shift */}
                    <View style={{ 
                        height: 60, 
                        marginTop: 12,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {isInitialized && !isLoading && (simpleBeasts.length > 0 || simpleSpells.length > 0) ? (
                            <View style={{ 
                                backgroundColor: currentTheme.confirmButtonBackground, 
                                padding: 12, 
                                borderRadius: 8, 
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
                                    ✓ Data loaded successfully
                                </Text>
                                <Text style={{ color: 'white', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                                    {simpleBeasts.length} beasts, {simpleSpells.length} spells
                                </Text>
                            </View>
                        ) : isLoading ? (
                            <View style={{ 
                                backgroundColor: currentTheme.innerBackground, 
                                padding: 12, 
                                borderRadius: 8, 
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <ActivityIndicator size="small" color={currentTheme.primary} />
                                <Text style={{ color: currentTheme.noticeText, fontSize: 12, marginTop: 4 }}>
                                    Loading data...
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>
                
                {/* Storage Management Modal */}
                <StorageManagementModal
                    visible={storageModalVisible}
                    onClose={() => setStorageModalVisible(false)}
                />

                {/* Confirm Modal */}
                <ConfirmModal
                    visible={confirmModalVisible}
                    title="Confirm Action"
                    message={confirmMessage}
                    onConfirm={async () => {
                        if (confirmAction) {
                            await confirmAction();
                        }
                    }}
                    onClose={() => setConfirmModalVisible(false)}
                    theme={currentTheme}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6,
    },
    settingDescription: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
});
