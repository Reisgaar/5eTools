// REACT
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

const LEVELS = [
    { label: 'C', value: 0 },
    ...Array.from({ length: 9 }, (_, i) => ({ label: String(i + 1), value: i + 1 }))
];
const ALL_LEVEL_VALUES = LEVELS.map(lvl => lvl.value);

type SpellLevel = 'all' | number;

const SCHOOL_MAP: Record<string, string> = {
    A: 'Abjuration',
    C: 'Conjuration',
    D: 'Divination',
    E: 'Enchantment',
    V: 'Evocation',
    I: 'Illusion',
    N: 'Necromancy',
    T: 'Transmutation',
};

function getFullSchool(school: string) {
    if (!school) return '';
    // Some datasets use lowercase or full word already
    const key = school.charAt(0).toUpperCase();
    return SCHOOL_MAP[key] || school;
}

function formatComponents(components: any) {
    if (!components) return '';
    if (Array.isArray(components)) return components.join(', ');
    if (typeof components === 'object') return Object.keys(components).join(', ');
    return String(components);
}

export default function SpellsScreen() {
    const { simpleBeasts, simpleSpells, isLoading, isInitialized, getFullBeast, getFullSpell } = useData();
    const { currentTheme: theme } = useAppSettings();
    const { openBeastModal, openSpellModal } = useModal();
    const [search, setSearch] = useState('');
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]); // multi-select
    const [pageReady, setPageReady] = useState(false);

    // Defer heavy computations to after navigation
    useEffect(() => {
        if (simpleSpells.length > 0) {
            // Small delay to ensure navigation is complete
            const timer = setTimeout(() => {
                setPageReady(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [simpleSpells.length]);

    // Multi-select level filter logic
    const allSelected = selectedLevels.length === ALL_LEVEL_VALUES.length;
    const noneSelected = selectedLevels.length === 0;

    function handleLevelPress(value: number | 'all') {
        if (value === 'all') {
            if (allSelected || noneSelected) {
                // Unselect all levels, keep 'All' visually selected
                setSelectedLevels([]);
            } else {
                // Select all levels
                setSelectedLevels([...ALL_LEVEL_VALUES]);
            }
        } else {
            let newLevels;
            if (selectedLevels.includes(value)) {
                newLevels = selectedLevels.filter(lvl => lvl !== value);
            } else {
                newLevels = [...selectedLevels, value];
            }
            setSelectedLevels(newLevels);
        }
    }

    const handleCreaturePress = async (name: string) => {
        const beast = simpleBeasts.find(b => b.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (beast) {
            openBeastModal(beast);
        }
    };

    const handleSpellPress = async (name: string) => {
        const spell = simpleSpells.find(s => s.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (spell) {
            openSpellModal(spell);
        }
    };

    // Filtered and sorted spells - only compute when page is ready
    const filteredSpells = useMemo(() => {
        if (!pageReady) return [];
        
        let result = simpleSpells;
        if (!noneSelected && !allSelected) {
            result = result.filter(spell => selectedLevels.includes(Number(spell.level)));
        }
        if (search.trim()) {
            result = result.filter((spell: any) => {
                const nameMatch = spell.name?.toLowerCase().includes(search.toLowerCase());
                const schoolMatch = spell.school?.toLowerCase().includes(search.toLowerCase());
                return nameMatch || schoolMatch;
            });
        }
        // Sort alphabetically by name
        return result.slice().sort((a: any, b: any) => a.name.localeCompare(b.name));
    }, [simpleSpells, search, selectedLevels, pageReady]);

    const selectedSpellFullSchool = ''; // No longer needed as modal handles display

    const renderSpellItem = ({ item: spell, index }: { item: any, index: number }) => (
        <TouchableOpacity key={spell.name + index} style={[styles.spellCard, { backgroundColor: theme.card, borderColor: theme.primary }]} onPress={() => handleSpellPress(spell.name)}>
            <Text>
                <Text style={[styles.spellLevel, { color: theme.text }]}>{spell.level === 0 ? 'C' : spell.level}{' - '}</Text>
                <Text style={[styles.spellName, { color: theme.text }]}>{spell.name}{' '}</Text>
                <Text style={[styles.spellInfo, { color: theme.text }]}>{getFullSchool(spell.school)} ({spell.source || spell._source || 'Unknown'})</Text>
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { flex: 1, backgroundColor: theme.background, paddingBottom: 0 }]}>
            <Text style={[styles.title, { color: theme.text }]}>Spells</Text>
            <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                placeholder="Search by name or school..."
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor={theme.noticeText}
            />
            {/* Level Filter Bar */}
            <View style={[styles.levelBar, { paddingVertical: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }]}>
                {/* All button */}
                <TouchableOpacity
                    key="all"
                    style={[styles.levelBtn, (allSelected || noneSelected) && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                    onPress={() => handleLevelPress('all')}
                >
                    <Text style={[styles.levelBtnText, { color: theme.text}, (allSelected || noneSelected) && { color: 'white', fontWeight: 'bold' }, { fontSize: 12 } ]}>All</Text>
                </TouchableOpacity>
                {LEVELS.map(lvl => (
                    <TouchableOpacity
                        key={lvl.value}
                        style={[styles.levelBtn, { backgroundColor: theme.card, borderColor: theme.text }, selectedLevels.includes(lvl.value) && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                        onPress={() => handleLevelPress(lvl.value)}
                    >
                        <Text style={[styles.levelBtnText, { color: theme.text }, selectedLevels.includes(lvl.value) && { color: 'white', fontWeight: 'bold' }]}>{lvl.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Content Area */}
            <View style={{ flex: 1 }}>
                {/* Loading states */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={{ color: theme.noticeText, marginTop: 8 }}>
                            Loading data...
                        </Text>
                    </View>
                )}
                
                {!isLoading && !pageReady && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={{ color: theme.noticeText, marginTop: 8 }}>
                            Preparing spells...
                        </Text>
                    </View>
                )}
                
                {/* Main content */}
                {!isLoading && pageReady && (
                    <FlatList
                        data={filteredSpells}
                        keyExtractor={(item, idx) => item.name + idx}
                        renderItem={renderSpellItem}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        ListEmptyComponent={
                                <Text style={[styles.loading, { color: theme.noticeText }]}>No spells found.</Text>
                        }
                    />
                )}
            </View>
            
            {/* BeastDetailModal and SpellDetailModal are now handled by context */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        padding: 20,
        backgroundColor: '#121212',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#222',
        color: 'white',
        borderColor: '#333',
    },
    loading: {
        color: '#aaa',
        marginVertical: 16,
        textAlign: 'center',
    },
    spellCard: {
        backgroundColor: '#232323',
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    spellLevel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    spellName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    spellInfo: {
        fontSize: 10,
        fontStyle: 'italic',
    },
    levelBar: {
        marginBottom: 16,
        flexGrow: 0,
    },
    levelBtn: {
        width: '8%',
        padding: 4,
        borderRadius: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelBtnActive: {
        backgroundColor: '#4a90e2',
        borderColor: '#4a90e2',
    },
    levelBtnText: {
        color: '#ccc',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    levelBtnTextActive: {
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 20,
        alignItems: 'stretch',
        elevation: 6,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalField: {
        color: '#ccc',
        fontSize: 15,
        marginBottom: 4,
    },
    modalEntry: {
        color: '#eee',
        fontSize: 15,
        marginBottom: 6,
    },
    closeBtn: {
        marginTop: 18,
        backgroundColor: '#4a90e2',
        borderRadius: 8,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
});
