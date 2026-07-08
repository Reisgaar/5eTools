// REACT
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { DataExportModal, DataImportModal } from 'src/components/modals';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const { currentTheme, themeName, setTheme, useAdvancedDiceRoll, setUseAdvancedDiceRoll } = useAppSettingsStore();

    // Data export/import state
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [importModalVisible, setImportModalVisible] = React.useState(false);

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
