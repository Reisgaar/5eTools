// REACT
import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// CONTEXTS
import { useData } from 'src/context/DataContext';

// UTILS
import { regenerateAllIndexes } from 'src/utils/fileStorage';

// COMPONENTS
import { StorageManagementModal, ConfirmModal, DataExportModal, DataImportModal } from 'src/components/modals';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const { currentTheme, themeName, setTheme, useAdvancedDiceRoll, setUseAdvancedDiceRoll } = useAppSettingsStore();
    const { simpleBeasts, simpleSpells, isLoading, isInitialized } = useData();

    // Storage management state
    const [storageModalVisible, setStorageModalVisible] = React.useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<(() => Promise<void>) | null>(null);
    const [confirmMessage, setConfirmMessage] = React.useState('');
    
    // Data export/import state
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [importModalVisible, setImportModalVisible] = React.useState(false);

    const showConfirmModal = (message: string, action: () => Promise<void>) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmModalVisible(true);
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
        <ScrollView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>

                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Theme</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <View style={[commonStyles.row, { marginTop: 0 }]}>
                        <Pressable
                            onPress={() => setTheme('light')}
                            style={[
                                commonStyles.langButton,
                                { backgroundColor: currentTheme.settingsButton },
                                themeName === 'light' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text, opacity: themeName === 'light' ? 1 : 0.3 }}>Light</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setTheme('dark')}
                            style={[
                                commonStyles.langButton,
                                { backgroundColor: currentTheme.settingsButton },
                                themeName === 'dark' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text, opacity: themeName === 'dark' ? 1 : 0.3 }}>Dark</Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Dice Rolling:</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <View style={[commonStyles.row, { marginTop: 0 }]}>
                        <Pressable
                            onPress={() => setUseAdvancedDiceRoll(false)}
                            style={[
                                commonStyles.langButton,
                                { backgroundColor: currentTheme.settingsButton },
                                !useAdvancedDiceRoll && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text, opacity: !useAdvancedDiceRoll ? 1 : 0.3 }}>Simple</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setUseAdvancedDiceRoll(true)}
                            style={[
                                commonStyles.langButton,
                                { backgroundColor: currentTheme.settingsButton },
                                useAdvancedDiceRoll && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text, opacity: useAdvancedDiceRoll ? 1 : 0.3 }}>Advanced</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={[styles.sectionTip]}>
                    <Text style={[styles.sectionTipText, { color: currentTheme.noticeText }]}>
                        {useAdvancedDiceRoll 
                            ? 'Advanced mode allows you to configure advantage/disadvantage and situational bonuses before rolling.'
                            : 'Simple mode rolls dice immediately without configuration options.'
                        }
                    </Text>
                </View>

                {/* Data Export/Import Section */}
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Data Export/Import</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <View style={[commonStyles.row, { marginTop: 0 }]}>
                        <TouchableOpacity 
                            onPress={() => setExportModalVisible(true)}
                            style={[commonStyles.button, { marginTop: 0, backgroundColor: currentTheme.primary, flex: 1 }]}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="share-outline" size={20} color="white" />
                                <Text style={[commonStyles.buttonText, { color: 'white', marginLeft: 6 }]}>Export</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setImportModalVisible(true)}
                            style={[commonStyles.button, { marginTop: 0, backgroundColor: currentTheme.primary, flex: 1 }]}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="download-outline" size={20} color="white" />
                                <Text style={[commonStyles.buttonText, { color: 'white', marginLeft: 6 }]}>Import</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.sectionTip]}>
                    <Text style={[styles.sectionTipText, { color: currentTheme.noticeText }]}>
                        Export your campaigns, players, spellbooks, and combats to share or backup. Import data from other devices or backups.
                    </Text>
                </View>

                {/* Data Status Section */}
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Data Amount</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <View style={{ 
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {isInitialized && !isLoading && (simpleBeasts.length > 0 || simpleSpells.length > 0) ? (
                            <View style={{ alignItems: 'center', width: '100%', display: 'flex', flexDirection: 'row', gap: 4 }}>
                                <View style={{ width: '50%', backgroundColor: currentTheme.innerBackground, borderRadius: 8, padding: 8 }}>
                                    <Text style={{ color: currentTheme.text, fontSize: 11, textAlign: 'center', textTransform: 'uppercase' }}>
                                        beasts
                                    </Text>
                                    <Text style={{ color: currentTheme.text, fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
                                        {simpleBeasts.length}
                                    </Text>
                                </View>
                                <View style={{ width: '50%', backgroundColor: currentTheme.innerBackground, borderRadius: 8, padding: 8 }}>
                                    <Text style={{ color: currentTheme.text, fontSize: 11, textAlign: 'center', textTransform: 'uppercase' }}>
                                        spells
                                    </Text>
                                    <Text style={{ color: currentTheme.text, fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
                                        {simpleSpells.length}
                                    </Text>
                                </View>
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
                                    Loading local data...
                                </Text>
                            </View>
                        ) : (
                            <View style={{ 
                                backgroundColor: currentTheme.innerBackground, 
                                padding: 12, 
                                borderRadius: 8, 
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <Text style={{ color: currentTheme.noticeText, fontSize: 12, marginTop: 4 }}>
                                    Local data is being loaded automatically.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                
                {/* Data Management Section */}
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Data Management</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <View style={[commonStyles.row, { marginTop: 0 }]}>
                        <Pressable 
                            onPress={() => setStorageModalVisible(true)} 
                            style={[commonStyles.button, { backgroundColor: currentTheme.primary, marginTop: 0, flex: 0.5 }]}
                        > 
                            <Text style={[commonStyles.buttonText, { fontSize: 14, textAlign: 'center', color: 'white' }]}>Storage Management</Text>
                        </Pressable>
                        <Pressable 
                            onPress={handleRegenerateIndexes} 
                            style={[commonStyles.button, { backgroundColor: '#ea8300', marginTop: 0, flex: 0.5 }]}
                        > 
                            <Text style={[commonStyles.buttonText, { fontSize: 14, textAlign: 'center', color: 'white' }]}>Regenerate All Indexes</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={[styles.sectionTip]}>
                    <Text style={[styles.sectionTipText, { color: currentTheme.noticeText}]}>
                        Regenerates all indexes (beasts, spells, combats, relations, classes, filter indexes) from existing data files. This improves filter performance on Android.
                    </Text>
                </View>
                
                {/* Storage Management Modal */}
                <StorageManagementModal
                    visible={storageModalVisible}
                    onClose={() => setStorageModalVisible(false)}
                />

                {/* Data Export Modal */}
                <DataExportModal
                    visible={exportModalVisible}
                    onClose={() => setExportModalVisible(false)}
                    theme={currentTheme}
                />

                {/* Data Import Modal */}
                <DataImportModal
                    visible={importModalVisible}
                    onClose={() => setImportModalVisible(false)}
                    theme={currentTheme}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginLeft: 4
    },
    sectionContainer: {
        marginTop: 4,
        marginBottom: 26,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8
    },
    sectionTip: {
        marginTop: -24,
        marginBottom: 26
    },
    sectionTipText: {
        fontSize: 11,
        textAlign: 'left',
        fontStyle: 'italic',
        marginLeft: 4
    },
});
