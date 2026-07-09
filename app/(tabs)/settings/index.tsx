// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { DataExportModal, DataImportModal, IgnoreSourcesModal } from 'src/components/modals';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const {
        currentTheme, themeMode, setThemeMode, useAdvancedDiceRoll, setUseAdvancedDiceRoll,
        preferredEdition, setPreferredEdition, ignoredSources,
    } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

    // Data export/import state
    const [exportModalVisible, setExportModalVisible] = React.useState(false);
    const [importModalVisible, setImportModalVisible] = React.useState(false);
    const [ignoreSourcesVisible, setIgnoreSourcesVisible] = React.useState(false);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background }]}>

                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Theme</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <View style={[commonStyles.row, { marginTop: 0 }]}>
                        {(['auto', 'light', 'dark'] as const).map(mode => (
                            <Pressable
                                key={mode}
                                onPress={() => setThemeMode(mode)}
                                style={[
                                    commonStyles.langButton,
                                    { backgroundColor: currentTheme.settingsButton },
                                    themeMode === mode && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                                ]}
                            >
                                <Text style={{ color: currentTheme.text, opacity: themeMode === mode ? 1 : 0.3, textTransform: 'capitalize' }}>
                                    {mode}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
                <View style={[styles.sectionTip]}>
                    <Text style={[styles.sectionTipText, { color: currentTheme.noticeText }]}>
                        Auto follows your device&apos;s light/dark setting.
                    </Text>
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

                {/* Rules Edition Section */}
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Rules Edition</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <View style={[commonStyles.row, { marginTop: 0 }]}>
                        {([['2014', '2014'], ['2024', '2024'], ['both', 'Both']] as const).map(([value, label]) => (
                            <Pressable
                                key={value}
                                onPress={() => setPreferredEdition(value)}
                                style={[
                                    commonStyles.langButton,
                                    { backgroundColor: currentTheme.settingsButton },
                                    preferredEdition === value && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                                ]}
                            >
                                <Text style={{ color: currentTheme.text, opacity: preferredEdition === value ? 1 : 0.3 }}>{label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
                <View style={[styles.sectionTip]}>
                    <Text style={[styles.sectionTipText, { color: currentTheme.noticeText }]}>
                        When something exists in both the 2014 and 2024 core books (e.g. a spell or monster), only the selected edition&apos;s version is shown. Choose &quot;Both&quot; to keep both versions.
                    </Text>
                </View>

                {/* Books (ignore sources) Section */}
                <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Books</Text>
                <View style={[styles.sectionContainer, { backgroundColor: currentTheme.settingsContainer }]}>
                    <TouchableOpacity
                        onPress={() => setIgnoreSourcesVisible(true)}
                        style={[commonStyles.button, { marginTop: 0, backgroundColor: currentTheme.primary }]}
                    >
                        <View style={commonStyles.row_center_center}>
                            <Ionicons name="eye-off-outline" size={18} color="white" />
                            <Text style={[commonStyles.buttonText, { color: 'white', marginLeft: styleConstants.marginXS }]}>
                                Manage ignored books{ignoredSources.length > 0 ? ` (${ignoredSources.length})` : ''}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.sectionTip]}>
                    <Text style={[styles.sectionTipText, { color: currentTheme.noticeText }]}>
                        Hide books you don&apos;t use so the bestiary, spells and other lists stay manageable.
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
                            <View style={commonStyles.row_center_center}>
                                <Ionicons name="share-outline" size={20} color="white" />
                                <Text style={[commonStyles.buttonText, { color: 'white', marginLeft: styleConstants.marginXS }]}>Export</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setImportModalVisible(true)}
                            style={[commonStyles.button, { marginTop: 0, backgroundColor: currentTheme.primary, flex: 1 }]}
                        >
                            <View style={commonStyles.row_center_center}>
                                <Ionicons name="download-outline" size={20} color="white" />
                                <Text style={[commonStyles.buttonText, { color: 'white', marginLeft: styleConstants.marginXS }]}>Import</Text>
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

                <IgnoreSourcesModal
                    visible={ignoreSourcesVisible}
                    onClose={() => setIgnoreSourcesVisible(false)}
                    theme={currentTheme}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: styleConstants.fontSizeMD,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginLeft: styleConstants.marginXS
    },
    sectionContainer: {
        marginTop: styleConstants.marginXS,
        marginBottom: 26,
        backgroundColor: 'white',
        borderRadius: styleConstants.borderRadiusMD,
        padding: styleConstants.paddingSM
    },
    sectionTip: {
        marginTop: -24,
        marginBottom: 26
    },
    sectionTipText: {
        fontSize: styleConstants.fontSizeXS,
        textAlign: 'left',
        fontStyle: 'italic',
        marginLeft: styleConstants.marginXS
    },
});
