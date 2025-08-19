// REACT
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// CONTEXTS
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// COMPONENTS
import { AddToSpellbookModal, SpellbookSelectorModal, CreateSpellbookModal } from 'src/components/spells';
import { SchoolFilterModal, ClassFilterModal, OtherFilterModal } from 'src/components/spells/modals';
import { ConfirmModal } from 'src/components/modals';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// HOOKS
import { useSpellFilters } from 'src/hooks/useSpellFilters';

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
    const { currentTheme } = useAppSettingsStore();
    const { selectedCampaign } = useCampaignStore();
    const { simpleBeasts, simpleSpells, spells, spellSourceLookup, availableClasses, isLoading, isInitialized, getFullBeast, getFullSpell } = useData();
    const { openBeastModal, openSpellModal } = useModal();
    const { spellbooks, currentSpellbookId, getCurrentSpellbook, getSpellbooksByCampaign, addSpellToSpellbook, removeSpellFromSpellbook, isSpellInSpellbook, selectSpellbook, clearSpellbookSelection, getSpellbookSpells } = useSpellbookStore();
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]); // multi-select
    const [pageReady, setPageReady] = useState(false);
    const [addToSpellbookModalVisible, setAddToSpellbookModalVisible] = useState(false);
    const [spellbookSelectorModalVisible, setSpellbookSelectorModalVisible] = useState(false);
    const [createSpellbookModalVisible, setCreateSpellbookModalVisible] = useState(false);
    const [selectedSpellForSpellbook, setSelectedSpellForSpellbook] = useState<any>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [spellToRemove, setSpellToRemove] = useState<any>(null);
    
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

    // Handle campaign changes - only clear spellbook if there's an actual campaign mismatch
    useEffect(() => {
        if (currentSpellbookId && selectedCampaign?.id) {
            const currentSpellbook = getCurrentSpellbook();
            if (currentSpellbook && currentSpellbook.campaignId && currentSpellbook.campaignId !== selectedCampaign.id) {
                clearSpellbookSelection();
            }
        }
    }, [currentSpellbookId, selectedCampaign?.id, getCurrentSpellbook, clearSpellbookSelection]);

    // Multi-select level filter logic
    const allSelected = selectedLevels.length === ALL_LEVEL_VALUES.length;
    const noneSelected = selectedLevels.length === 0;

    // Filter spells by selected levels - show all if none or all are selected
    const filteredSpells = useMemo(() => {
        let baseSpells;
        
        // If a spellbook is selected, use its spells
        if (currentSpellbookId) {
            const spellbookSpells = getSpellbookSpells(currentSpellbookId);
            baseSpells = spellbookSpells;
        } else {
            // Otherwise use all spells from the filter hook
            baseSpells = filters.filteredSpells;
        }
        
        // Apply level filter
        const levelFiltered = noneSelected || allSelected 
            ? baseSpells 
            : baseSpells.filter(spell => selectedLevels.includes(spell.level));
        
        return levelFiltered;
    }, [filters.filteredSpells, selectedLevels, noneSelected, allSelected, currentSpellbookId, getSpellbookSpells]);

    function handleLevelPress(value: number) {
        let newLevels;
        if (selectedLevels.includes(value)) {
            newLevels = selectedLevels.filter(lvl => lvl !== value);
        } else {
            newLevels = [...selectedLevels, value];
        }
        setSelectedLevels(newLevels);
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

    const selectedSpellFullSchool = ''; // No longer needed as modal handles display

    const handleAddToSpellbook = (spell: any) => {
        if (currentSpellbookId) {
            // If a spellbook is selected, ask for confirmation before removing
            setSpellToRemove(spell);
            setConfirmModalVisible(true);
        } else {
            // If no spellbook is selected, show modal to select which spellbook
            setSelectedSpellForSpellbook(spell);
            setAddToSpellbookModalVisible(true);
        }
    };

    const handleConfirmRemoveSpell = () => {
        if (spellToRemove && currentSpellbookId) {
            removeSpellFromSpellbook(currentSpellbookId, spellToRemove.name, spellToRemove.source);
        }
        setConfirmModalVisible(false);
        setSpellToRemove(null);
    };

    const renderSpellItem = ({ item }: { item: any }) => {
        const spell = item;
        const isRitual = spell.ritual === true;
        const isInCurrentSpellbook = currentSpellbookId ? isSpellInSpellbook(currentSpellbookId, spell.name, spell.source) : false;
        
        return (
            <View style={[commonStyles.itemCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}>
                <TouchableOpacity 
                    style={commonStyles.itemInfoContainer}
                    onPress={() => handleSpellPress(spell)}
                >
                    <Text style={[commonStyles.itemName, { color: currentTheme.text }]}>
                        <Text style={{ fontWeight: 'bold' }}>
                            {spell.name}
                            {isRitual && ' (R)'}
                        </Text>
                        <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{'\n'}{spell.level === 0 ? 'C' : spell.level} - {getFullSchool(spell.school)} ({spell.source || spell._source || 'Unknown'})</Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleAddToSpellbook(spell)}
                    style={[styles.spellbookButton, { 
                        backgroundColor: currentSpellbookId ? '#dc2626' : currentTheme.primary,
                        borderColor: currentSpellbookId ? '#dc2626' : currentTheme.primary
                    }]}
                >
                    <Ionicons 
                        name={currentSpellbookId ? "remove" : "add"} 
                        size={16} 
                        color="white" 
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, paddingBottom: 0, paddingHorizontal: 8 }]}>
            <View style={[styles.spellbookAbsoluteButtonWrapper, { backgroundColor: currentTheme.card, borderColor: currentTheme.text + '70' }]}>
                <TouchableOpacity
                    onPress={() => setSpellbookSelectorModalVisible(true)}
                    style={[styles.spellbookAbsoluteButton, { backgroundColor: currentTheme.primary }]}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                        {currentSpellbookId ? getCurrentSpellbook()?.name || 'Spellbook' : 'Spellbook'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Title Row with Filter Buttons */}
            <View style={[{ marginBottom: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}]}>
                <Text style={[{ fontSize: 16, fontWeight: 'bold', color: currentTheme.text, marginRight: 12}]}>Filters:</Text>
                <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity
                        onPress={filters.openSchoolFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedSchools.length > 0 ? currentTheme.primary : currentTheme.text, flex: 1, marginRight: 4 }]}
                    >
                        <Text style={{ color: filters.selectedSchools.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: 11 }}>
                            School
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openClassFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedClasses.length > 0 ? currentTheme.primary : currentTheme.text, flex: 1, marginHorizontal: 2 }]}
                    >
                        <Text style={{ color: filters.selectedClasses.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: 11 }}>
                            Class
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openOtherFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedOthers.length > 0 ? currentTheme.primary : currentTheme.text, flex: 1, marginHorizontal: 2 }]}
                    >
                        <Text style={{ color: filters.selectedOthers.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: 11 }}>
                            Other
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.clearAllFilters}
                        style={[commonStyles.filterBtn, { borderColor: '#ef4444', flex: 1, marginLeft: 4 }]}
                    >
                        <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 11 }}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Level Filter Bar */}
            <View style={styles.levelFilterContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                    <TouchableOpacity
                        key={level}
                        style={[
                            styles.levelButton,
                            { backgroundColor: selectedLevels.includes(level) ? currentTheme.primary : currentTheme.innerBackground, borderColor: currentTheme.primary }
                        ]}
                        onPress={() => handleLevelPress(level)}
                    >
                        <Text style={[
                            styles.levelButtonText,
                            { color: selectedLevels.includes(level) ? 'white' : currentTheme.text }
                        ]}>
                            {level === 0 ? 'C' : level}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Search Input with Clear Button */}
            <View style={{ flexDirection: 'row', marginBottom: 0 }}>
                <TextInput
                    style={[commonStyles.input, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text, borderColor: currentTheme.card, flex: 1, marginRight: 8 }]}
                    placeholder="Search by name..."
                    value={filters.search}
                    onChangeText={filters.setSearch}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholderTextColor={currentTheme.noticeText}
                />
            </View>
            
            {/* Applied Filters Text */}
            {filters.hasActiveFilters && (
                <View style={styles.filterSummaryContainer}>
                    {filters.getFilterSummary().map((filterLine, index) => (
                        <Text key={index} style={[styles.filterSummaryText, { color: currentTheme.noticeText }]}>
                            {filterLine}
                        </Text>
                    ))}
                </View>
            )}
            
            {/* Content Area */}
            <View style={{ flex: 1 }}>
                {/* Loading states */}
                {isLoading && (
                    <View style={commonStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: 8 }}>
                            Loading data...
                        </Text>
                    </View>
                )}
                
                {!isLoading && !pageReady && (
                    <View style={commonStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: 8 }}>
                            Preparing spells...
                        </Text>
                    </View>
                )}
                
                {/* Main content */}
                {!isLoading && pageReady && (
                    <FlatList
                        data={filteredSpells.sort((a, b) => a.name.localeCompare(b.name))}
                        keyExtractor={(item, idx) => item.name + idx}
                        renderItem={renderSpellItem}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        ListEmptyComponent={
                                <Text style={[commonStyles.loading, { color: currentTheme.noticeText }]}>No spells found.</Text>
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
                theme={currentTheme}
            />
            
            {/* Spellbook Selector Modal */}
            <SpellbookSelectorModal
                visible={spellbookSelectorModalVisible}
                onClose={() => setSpellbookSelectorModalVisible(false)}
                onSelectSpellbook={(spellbookId) => {
                    if (spellbookId) {
                        selectSpellbook(spellbookId);
                    } else {
                        clearSpellbookSelection();
                    }
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
                theme={currentTheme}
            />
            
            {/* Other Filter Modal */}
            <OtherFilterModal
                visible={filters.otherFilterModalVisible}
                onClose={() => filters.setOtherFilterModalVisible(false)}
                theme={currentTheme}
                options={filters.otherOptions}
                selectedOptions={filters.pendingOthers}
                onToggleOption={filters.togglePendingOther}
                onSelectAll={filters.selectAllPendingOthers}
                onApply={filters.applyOtherFilter}
                isApplying={filters.filterApplying}
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
                theme={currentTheme}
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
                theme={currentTheme}
            />

            {/* Confirm Remove Spell Modal */}
            <ConfirmModal
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={handleConfirmRemoveSpell}
                title="Remove Spell"
                message={`Are you sure you want to remove "${spellToRemove?.name}" from the spellbook?`}
                theme={currentTheme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    levelFilterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 8,
        gap: 6,
        paddingHorizontal: 4,
    },
    levelButton: {
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 1,
        flex: 1,
        maxWidth: '9%',
    },
    levelButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    filterSummaryContainer: {
        paddingVertical: 4,
    },
    filterSummaryText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    spellbookButton: {
        borderWidth: 1,
        width: 32,
        height: 32,
        borderRadius: 100,

        minHeight: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    spellbookAbsoluteButtonWrapper: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderTopLeftRadius: 8,
        paddingTop: 8,
        paddingRight: 6,
        paddingBottom: 6,
        paddingLeft: 8,
    },
    spellbookAbsoluteButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    }
});



