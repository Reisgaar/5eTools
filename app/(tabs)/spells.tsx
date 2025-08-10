// REACT
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useCampaign } from 'src/context/CampaignContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';
import { useSpellbook } from 'src/context/SpellbookContext';
import { AddToSpellbookModal, SpellbookSelectorModal, CreateSpellbookModal } from 'src/components/spells';
import { ConfirmModal, SchoolFilterModal, ClassFilterModal } from 'src/components/modals';
import { commonStyles } from 'src/styles/commonStyles';
import { useSpellFilters } from 'src/hooks/useSpellFilters';
import { normalizeString, equalsNormalized } from 'src/utils/stringUtils';

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
    const { selectedCampaign } = useCampaign();
    const { simpleBeasts, simpleSpells, spells, spellSourceLookup, availableClasses, isLoading, isInitialized, getFullBeast, getFullSpell } = useData();
    const { currentTheme: theme } = useAppSettings();
    const { openBeastModal, openSpellModal } = useModal();
    const { spellbooks, currentSpellbookId, getCurrentSpellbook, getSpellbooksByCampaign, addSpellToSpellbook, removeSpellFromSpellbook, isSpellInSpellbook, selectSpellbook, clearSpellbookSelection } = useSpellbook();
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
    
    // Use the spell filters hook for UI state management
    const filters = useSpellFilters(simpleSpells, spells, spellSourceLookup, availableClasses);

    // Get spellbooks filtered by selected campaign
    const filteredSpellbooks = getSpellbooksByCampaign(selectedCampaign?.id);

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

    // Handle campaign changes - deselect spellbook if it doesn't belong to selected campaign
    useEffect(() => {
        if (currentSpellbookId) {
            const currentSpellbook = getCurrentSpellbook();
            const selectedCampaignId = selectedCampaign?.id;
            if (currentSpellbook && currentSpellbook.campaignId !== selectedCampaignId) {
                clearSpellbookSelection();
            }
        }
    }, [currentSpellbookId, selectedCampaign?.id]);

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
        
        let result: any[];
        
        // Get base spell list based on whether a spellbook is selected
        if (currentSpellbookId) {
            const currentSpellbook = getCurrentSpellbook();
            if (currentSpellbook) {
                if (currentSpellbook.spells.length === 0) {
                    console.log('Spellbook is empty');
                    return [];
                }
                
                // Get only the spells that are in the spellbook
                result = simpleSpells.filter((spell: any) => {
                    const spellId = `${spell.name}-${spell.source}`;
                    return currentSpellbook.spells.includes(spellId);
                });
                
                console.log(`Working with spellbook "${currentSpellbook.name}" - ${result.length} spells found`);
            } else {
                console.log('Current spellbook not found');
                return [];
            }
        } else {
            // No spellbook selected, work with all spells
            result = simpleSpells;
            console.log(`Working with all spells - ${result.length} total spells`);
        }
        
        // Apply search and filter filters to the base spell list
        result = result.filter((spell: any) => {
            // Search filter
            const matchesName = filters.search === '' || spell.name.toLowerCase().includes(filters.search.toLowerCase());
            
            // School filter
            const spellSchool = getFullSchool(spell.school);
            const matchesSchool = filters.selectedSchools.length === 0 || filters.selectedSchools.includes(spellSchool);
            
            // Class filter
            let matchesClass = true;
            if (filters.selectedClasses.length > 0) {
                const spellClasses = spell.availableClasses || [];
                matchesClass = filters.selectedClasses.some(selectedClass => 
                    spellClasses.includes(selectedClass)
                );
            }
            
            return matchesName && matchesSchool && matchesClass;
        });
        
        // Apply level filter
        if (!noneSelected && !allSelected) {
            result = result.filter(spell => selectedLevels.includes(Number(spell.level)));
        }
        
        // Sort alphabetically by name
        const sortedResult = result.slice().sort((a: any, b: any) => a.name.localeCompare(b.name));
        console.log(`Final filtered spells: ${sortedResult.length}`);
        return sortedResult;
    }, [simpleSpells, filters.search, filters.selectedSchools, filters.selectedClasses, selectedLevels, pageReady, currentSpellbookId]);

    const selectedSpellFullSchool = ''; // No longer needed as modal handles display

    const handleAddToSpellbook = (spell: any) => {
        if (currentSpellbookId) {
            // If a spellbook is selected, show confirmation before removing
            const currentSpellbook = getCurrentSpellbook();
            setPendingSpellRemoval({
                spell,
                spellbookName: currentSpellbook?.name || 'Unknown'
            });
            setConfirmRemoveModalVisible(true);
        } else {
            // If no spellbook is selected, show modal to select which spellbook
            setSelectedSpellForSpellbook(spell);
            setAddToSpellbookModalVisible(true);
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
                    style={[commonStyles.itemActionButton, { backgroundColor: currentSpellbookId && isInCurrentSpellbook ? '#dc2626' : theme.primary }]}
                >
                    <Ionicons 
                        name={currentSpellbookId && isInCurrentSpellbook ? "remove" : "add"} 
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
            
            <TextInput
                style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                placeholder="Search by name..."
                value={filters.search}
                onChangeText={filters.setSearch}
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor={theme.noticeText}
            />
            
            {/* Filter Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <TouchableOpacity
                    onPress={filters.openSchoolFilterModal}
                    style={[styles.filterBtn, { borderColor: filters.selectedSchools.length > 0 ? theme.primary : theme.text }]}
                >
                    <Text style={{ color: filters.selectedSchools.length > 0 ? theme.primary : theme.text, fontWeight: 'bold', fontSize: 12 }}>
                        {filters.getSchoolFilterText()}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={filters.openClassFilterModal}
                    style={[styles.filterBtn, { borderColor: filters.selectedClasses.length > 0 ? theme.primary : theme.text }]}
                >
                    <Text style={{ color: filters.selectedClasses.length > 0 ? theme.primary : theme.text, fontWeight: 'bold', fontSize: 12 }}>
                        {filters.getClassFilterText()}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSpellbookSelectorModalVisible(true)}
                    style={[styles.filterBtn, { borderColor: currentSpellbookId ? theme.primary : theme.text }]}
                >
                    <Text style={{ color: currentSpellbookId ? theme.primary : theme.text, fontWeight: 'bold', fontSize: 12 }}>
                        {currentSpellbookId ? getCurrentSpellbook()?.name || 'Spellbook' : 'Spellbook'}
                    </Text>
                </TouchableOpacity>
            </View>
            
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
                    setSpellbookSelectorModalVisible(false);
                }}
                onCreateSpellbook={() => {
                    setSpellbookSelectorModalVisible(false);
                    setCreateSpellbookModalVisible(true);
                }}
            />
            
            {/* Create Spellbook Modal */}
            <CreateSpellbookModal
                visible={createSpellbookModalVisible}
                onClose={() => setCreateSpellbookModalVisible(false)}
                onSpellbookCreated={(spellbookId) => {
                    setCreateSpellbookModalVisible(false);
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
            
            {/* School Filter Modal */}
            <SchoolFilterModal
                visible={filters.schoolFilterModalVisible}
                onClose={() => filters.setSchoolFilterModalVisible(false)}
                schoolOptions={filters.schoolOptions}
                selectedSchools={filters.pendingSchools}
                onToggleSchool={filters.togglePendingSchool}
                onClear={filters.selectAllPendingSchools}
                onApply={filters.applySchoolFilter}
                theme={theme}
            />
            
            {/* Class Filter Modal */}
            <ClassFilterModal
                visible={filters.classFilterModalVisible}
                onClose={() => filters.setClassFilterModalVisible(false)}
                classOptions={filters.classOptions}
                selectedClasses={filters.pendingClasses}
                onToggleClass={filters.togglePendingClass}
                onClear={filters.selectAllPendingClasses}
                onApply={filters.applyClassFilter}
                theme={theme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    filterBtn: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 32,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
});



