// REACT
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useData } from 'src/context/DataContext';

// STYLES
import { commonStyles } from 'src/style/styles';

// Home screen tab displaying data summary and management actions for beasts and spells.
export default function HomeScreen() {
    const { currentTheme } = useAppSettings();
    const { simpleBeasts, simpleSpells, availableClasses, spellClassRelations, isLoading, isInitialized, reloadData, clearData } = useData();

    const handleReload = async () => {
        await reloadData();
    };

    const handleClear = async () => {
        await clearData();
    };

    return (
        <View style={[commonStyles.container, { backgroundColor: currentTheme.background, flex: 1 }]}>
            <ScrollView style={{ flex: 1, padding: 16 }}>
                {/* Header */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: currentTheme.text,marginBottom: 8 }}>
                        D&D Data Manager
                    </Text>
                    <Text style={{ fontSize: 16, color: currentTheme.noticeText, marginBottom: 16 }}>
                        Manage your beasts and spells data
                    </Text>
                </View>

                {/* Loading State */}
                {isLoading && (
                    <View style={{ alignItems: 'center', marginVertical: 20 }}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: 8 }}>
                            Loading data...
                        </Text>
                    </View>
                )}

                {isInitialized && !isLoading && (simpleBeasts.length > 0 || simpleSpells.length > 0) ? (
                  <View>
                    {/* Beasts Section */}
                    <View style={{ backgroundColor: currentTheme.card, padding: 16, borderRadius: 8, marginBottom: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.text, marginBottom: 8 }}>
                            Beasts
                        </Text>
                        <Text style={{ fontSize: 16, color: currentTheme.noticeText }}>
                            Total: {simpleBeasts.length} creatures
                        </Text>
                    </View>

                    {/* Spells Section */}
                    <View style={{ backgroundColor: currentTheme.card, padding: 16, borderRadius: 8, marginBottom: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.text, marginBottom: 8 }}>
                            Spells
                        </Text>
                        <Text style={{ fontSize: 16, color: currentTheme.noticeText }}>
                            Total: {simpleSpells.length} spells
                        </Text>
                    </View>

                    {/* Spell-Class Relations Section */}
                    <View style={{ backgroundColor: currentTheme.card, padding: 16, borderRadius: 8, marginBottom: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.text, marginBottom: 8 }}>
                            Spell-Class Relations
                        </Text>
                        <Text style={{ fontSize: 16, color: currentTheme.noticeText, marginBottom: 4 }}>
                            Total: {spellClassRelations.length} relations
                        </Text>
                        <Text style={{ fontSize: 16, color: currentTheme.noticeText, marginBottom: 4 }}>
                            Classes: {availableClasses.length} available
                        </Text>
                        {availableClasses.length > 0 && (
                            <View style={{ marginTop: 8 }}>
                                <Text style={{ fontSize: 14, color: currentTheme.noticeText, fontStyle: 'italic', marginBottom: 4 }}>
                                    Available Classes:
                                </Text>
                                <Text style={{ fontSize: 12, color: currentTheme.noticeText, lineHeight: 16 }}>
                                    {availableClasses.slice(0, 10).join(', ')}
                                    {availableClasses.length > 10 && ` ... and ${availableClasses.length - 10} more`}
                                </Text>
                            </View>
                        )}
                        {spellClassRelations.length > 0 && (
                            <View style={{ marginTop: 8 }}>
                                <Text style={{ fontSize: 14, color: currentTheme.noticeText, fontStyle: 'italic', marginBottom: 4 }}>
                                    Sample Relations:
                                </Text>
                                <Text style={{ fontSize: 12, color: currentTheme.noticeText, lineHeight: 16 }}>
                                    {spellClassRelations.slice(0, 3).map((relation, index) => 
                                        `${relation.spellName} → ${relation.className} (${relation.book})`
                                    ).join('\n')}
                                    {spellClassRelations.length > 3 && `\n... and ${spellClassRelations.length - 3} more relations`}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Status */}
                    <View style={{ backgroundColor: currentTheme.confirmButtonBackground, padding: 12, borderRadius: 8, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
                            ✓ Data loaded successfully
                        </Text>
                        <Text style={{ color: 'white', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                            Data is stored locally and ready to use
                        </Text>
                    </View>
                  </View>
                ) : (!isLoading && (
                  <View style={{ alignItems: 'center', marginVertical: 20 }}>
                      <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                          No data available. Tap &quot;Reload Data&quot; to fetch from network.
                      </Text>
                  </View>
                ))}
                    
                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
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
            </ScrollView>
        </View>
    );
}
