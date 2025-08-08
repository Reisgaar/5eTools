// REACT
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';
import { useSpellbook } from 'src/context/SpellbookContext';
import { AddToSpellbookModal, SpellbookSelectorModal, CreateSpellbookModal } from 'src/components/spells';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import { commonStyles } from 'src/styles/commonStyles';

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
    const { spellbooks, currentSpellbookId, getCurrentSpellbook, addSpellToSpellbook, removeSpellFromSpellbook, isSpellInSpellbook, selectSpellbook } = useSpellbook();
    const [search, setSearch] = useState('');
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]); // multi-select
    const [pageReady, setPageReady] = useState(false);
    const [addToSpellbookModalVisible, setAddToSpellbookModalVisible] = useState(false);
    const [spellbookSelectorModalVisible, setSpellbookSelectorModalVisible] = useState(false);
    const [createSpellbookModalVisible, setCreateSpellbookModalVisible] = useState(false);
    const [selectedSpellForSpellbook, setSelectedSpellForSpellbook] = useState<any>(null);
    
    // Confirm modal state for removing spells from spellbook
    const [confirmRemoveModalVisible, setConfirmRemoveModalVisible] = useState(false);
    const [pendingSpellRemoval, setPendingSpellRemoval] = useState<{
        spell: any;
        spellbookName: string;
    } | null>(null);
    const [viewMode, setViewMode] = useState<'all' | 'spellbook'>('all'); // 'all' or 'spellbook'

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

    // Handle spellbook availability
    useEffect(() => {
        // If we're in spellbook mode but no spellbooks exist, switch to "all" mode
        if (viewMode === 'spellbook' && spellbooks.length === 0) {
            setViewMode('all');
        }
    }, [spellbooks.length, viewMode]);

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

    const handleCreaturePress = async (name: string, source: string) => {
        const beast = simpleBeasts.find(b => b.name.trim().toLowerCase() === name.trim().toLowerCase() && b.source.trim().toLowerCase() === source.trim().toLowerCase());
        if (beast) {
            openBeastModal(beast);
        }
    };

    const handleSpellPress = async (spell: any) => {
        openSpellModal(spell);
    };

    // Filtered and sorted spells - only compute when page is ready
    const filteredSpells = useMemo(() => {
        if (!pageReady) return [];
        
        let result = simpleSpells;
        
        // Apply spellbook filter if in spellbook view mode
        if (viewMode === 'spellbook' && currentSpellbookId) {
            const currentSpellbook = getCurrentSpellbook();
            if (currentSpellbook) {
                result = result.filter((spell: any) => {
                    const spellId = `${spell.name}-${spell.source}`;
                    return currentSpellbook.spells.includes(spellId);
                });
            }
        }
        
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
    }, [simpleSpells, search, selectedLevels, pageReady, viewMode, currentSpellbookId, spellbooks]);

    const selectedSpellFullSchool = ''; // No longer needed as modal handles display

    const handleAddToSpellbook = (spell: any) => {
        if (viewMode === 'all') {
            // In "all spells" mode, show modal to select which spellbook
            setSelectedSpellForSpellbook(spell);
            setAddToSpellbookModalVisible(true);
        } else if (viewMode === 'spellbook' && currentSpellbookId) {
            // In "spellbook" mode, show confirmation before removing
            const currentSpellbook = getCurrentSpellbook();
            setPendingSpellRemoval({
                spell,
                spellbookName: currentSpellbook?.name || 'Unknown'
            });
            setConfirmRemoveModalVisible(true);
        }
    };

    const handleConfirmSpellRemoval = () => {
        if (pendingSpellRemoval && currentSpellbookId) {
            removeSpellFromSpellbook(currentSpellbookId, pendingSpellRemoval.spell.name, pendingSpellRemoval.spell.source);
            setPendingSpellRemoval(null);
            setConfirmRemoveModalVisible(false);
        }
    };



    const renderSpellItem = ({ item: spell, index }: { item: any, index: number }) => {
        const isInCurrentSpellbook = currentSpellbookId ? isSpellInSpellbook(currentSpellbookId, spell.name, spell.source) : false;
        
        return (
            <View style={[commonStyles.itemCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
                <TouchableOpacity 
                    style={commonStyles.itemInfoContainer}
                    onPress={() => handleSpellPress(spell)}
                >
                    <Text style={[commonStyles.itemName, { color: theme.text }]}>
                        <Text style={{ fontWeight: 'bold' }}>{spell.level === 0 ? 'C' : spell.level} - {spell.name}</Text>
                        <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}> - {getFullSchool(spell.school)} ({spell.source || spell._source || 'Unknown'})</Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddToSpellbook(spell)}
                    style={[commonStyles.itemActionButton, { backgroundColor: viewMode === 'spellbook' && isInCurrentSpellbook ? '#dc2626' : theme.primary }]}
                >
                    <Ionicons 
                        name={viewMode === 'spellbook' && isInCurrentSpellbook ? "remove" : "add"} 
                        size={16} 
                        color="white" 
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: theme.background, paddingBottom: 0 }]}>
            <View style={commonStyles.header}>
                <Text style={[commonStyles.title, { color: theme.text }]}>Spells</Text>
            </View>
            
            {/* View Mode Selector */}
            <View style={commonStyles.viewModeSelector}>
                <TouchableOpacity
                    style={[commonStyles.viewModeButton, { backgroundColor: viewMode === 'all' ? theme.primary : theme.card }]}
                    onPress={() => setViewMode('all')}
                >
                    <Text style={[commonStyles.viewModeText, { color: viewMode === 'all' ? 'white' : theme.text }]}>
                        All Spells
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[commonStyles.viewModeButton, { backgroundColor: viewMode === 'spellbook' ? theme.primary : theme.card }]}
                    onPress={() => {
                        if (spellbooks.length === 0) {
                            // If no spellbooks exist, show create modal
                            setCreateSpellbookModalVisible(true);
                        } else {
                            // If spellbooks exist, switch to spellbook view
                            setViewMode('spellbook');
                        }
                    }}
                >
                    <Text style={[commonStyles.viewModeText, { color: viewMode === 'spellbook' ? 'white' : theme.text }]}>
                        Spellbook
                    </Text>
                </TouchableOpacity>
            </View>
            
            {/* Current Spellbook Info */}
            {viewMode === 'spellbook' && (
                <View style={[commonStyles.currentSelectionInfo, { backgroundColor: theme.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <TouchableOpacity 
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => setSpellbookSelectorModalVisible(true)}
                    >
                        <Ionicons name="book" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                        <Text style={[commonStyles.currentSelectionText, { color: theme.text, flex: 1 }]}>
                            {currentSpellbookId ? 
                                `${getCurrentSpellbook()?.name || 'Unknown'} (${getCurrentSpellbook()?.spells.length || 0} spells)` :
                                'Select a spellbook'
                            }
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setCreateSpellbookModalVisible(true)}
                        style={[commonStyles.headerButton, { backgroundColor: theme.primary, marginLeft: 8 }]}
                    >
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
            
            <TextInput
                style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                placeholder="Search by name or school..."
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor={theme.noticeText}
            />
            {/* Level Filter Bar */}
            <View style={[commonStyles.levelBar, { paddingVertical: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }]}>
                {/* All button */}
                <TouchableOpacity
                    key="all"
                    style={[commonStyles.levelBtn, (allSelected || noneSelected) && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                    onPress={() => handleLevelPress('all')}
                >
                    <Text style={[commonStyles.levelBtnText, { color: theme.text}, (allSelected || noneSelected) && { color: 'white', fontWeight: 'bold' }, { fontSize: 12 } ]}>All</Text>
                </TouchableOpacity>
                {LEVELS.map(lvl => (
                    <TouchableOpacity
                        key={lvl.value}
                        style={[commonStyles.levelBtn, { backgroundColor: theme.card, borderColor: theme.text }, selectedLevels.includes(lvl.value) && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                        onPress={() => handleLevelPress(lvl.value)}
                    >
                        <Text style={[commonStyles.levelBtnText, { color: theme.text }, selectedLevels.includes(lvl.value) && { color: 'white', fontWeight: 'bold' }]}>{lvl.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Content Area */}
            <View style={{ flex: 1 }}>
                {/* Loading states */}
                {isLoading && (
                    <View style={commonStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={{ color: theme.noticeText, marginTop: 8 }}>
                            Loading data...
                        </Text>
                    </View>
                )}
                
                {!isLoading && !pageReady && (
                    <View style={commonStyles.loadingContainer}>
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
                                <Text style={[commonStyles.loading, { color: theme.noticeText }]}>No spells found.</Text>
                        }
                    />
                )}
            </View>
            
            {/* BeastDetailModal and SpellDetailModal are now handled by context */}
            

            
            {/* Add to Spellbook Modal */}
            <AddToSpellbookModal
                visible={addToSpellbookModalVisible}
                onClose={() => {
                    setAddToSpellbookModalVisible(false);
                    setSelectedSpellForSpellbook(null);
                }}
                spell={selectedSpellForSpellbook}
                theme={theme}
            />
            
            {/* Spellbook Selector Modal */}
            <SpellbookSelectorModal
                visible={spellbookSelectorModalVisible}
                onClose={() => setSpellbookSelectorModalVisible(false)}
                onSelectSpellbook={(spellbookId) => {
                    selectSpellbook(spellbookId);
                    setSpellbookSelectorModalVisible(false);
                }}
                onSpellbookDeleted={(deletedSpellbookId) => {
                    // If the deleted spellbook was the current one, switch back to "all" mode
                    if (deletedSpellbookId === currentSpellbookId) {
                        setViewMode('all');
                    }
                }}
                theme={theme}
            />
            
            {/* Create Spellbook Modal */}
            <CreateSpellbookModal
                visible={createSpellbookModalVisible}
                onClose={() => setCreateSpellbookModalVisible(false)}
                onSpellbookCreated={(spellbookId) => {
                    selectSpellbook(spellbookId);
                    setCreateSpellbookModalVisible(false);
                    // If this is the first spellbook, switch to spellbook view
                    if (spellbooks.length === 0) {
                        setViewMode('spellbook');
                    }
                }}
                theme={theme}
            />
            
            {/* Confirm Remove Spell Modal */}
            <ConfirmModal
                visible={confirmRemoveModalVisible}
                onClose={() => {
                    setConfirmRemoveModalVisible(false);
                    setPendingSpellRemoval(null);
                }}
                onConfirm={handleConfirmSpellRemoval}
                title="Remove Spell"
                message={`Are you sure you want to remove "${pendingSpellRemoval?.spell.name}" from "${pendingSpellRemoval?.spellbookName}"?`}
                confirmText="Remove"
                cancelText="Cancel"
                theme={theme}
            />
        </View>
    );
}


