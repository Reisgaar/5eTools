// REACT
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// EXPO

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// COMPONENTS
import { AddToSpellbookModal, SpellListItem } from 'src/components/spells';
import { SchoolFilterModal, ClassFilterModal, OtherFilterModal } from 'src/components/spells/modals';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// HOOKS
import { useSpellFilters } from 'src/hooks/useSpellFilters';

// UTILS
import { applySourceFilters } from 'src/utils/sourceFilter';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

const LEVELS = [
    { label: 'C', value: 0 },
    ...Array.from({ length: 9 }, (_, i) => ({ label: String(i + 1), value: i + 1 }))
];
const ALL_LEVEL_VALUES = LEVELS.map(lvl => lvl.value);

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

export default function SpellsScreen() {
    const { currentTheme, preferredEdition, ignoredSources } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { simpleSpells, spells, spellSourceLookup, availableClasses, isLoading, loadError, reloadData } = useData();
    const { openSpellModal } = useModal();
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]); // multi-select
    const [pageReady, setPageReady] = useState(false);
    const [addToSpellbookModalVisible, setAddToSpellbookModalVisible] = useState(false);
    const [selectedSpellForSpellbook, setSelectedSpellForSpellbook] = useState<any>(null);

    // Apply the global source filter (ignored books + edition dedupe) before filtering/search.
    const ignoredSet = useMemo(() => new Set(ignoredSources), [ignoredSources]);
    const visibleSpells = useMemo(
        () => applySourceFilters(simpleSpells, { preferredEdition, ignoredSources: ignoredSet }),
        [simpleSpells, preferredEdition, ignoredSet]
    );

    // Use the spell filters hook for UI state management
    const filters = useSpellFilters(visibleSpells, spells, spellSourceLookup, availableClasses);

    // Defer heavy computations to after navigation
    useEffect(() => {
        if (simpleSpells.length === 0) return undefined;
        // Small delay to ensure navigation is complete
        const timer = setTimeout(() => {
            setPageReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [simpleSpells.length]);

    // Multi-select level filter logic
    const allSelected = selectedLevels.length === ALL_LEVEL_VALUES.length;
    const noneSelected = selectedLevels.length === 0;

    // Filter spells by selected levels - show all if none or all are selected
    const filteredSpells = useMemo(() => {
        const baseSpells = filters.filteredSpells;

        // Apply level filter
        const levelFiltered = noneSelected || allSelected
            ? baseSpells
            : baseSpells.filter(spell => selectedLevels.includes(spell.level));

        // Sort here (on a copy) so the FlatList doesn't mutate/re-sort a memoized array every render
        return levelFiltered.slice().sort((a, b) => a.name.localeCompare(b.name));
    }, [filters.filteredSpells, selectedLevels, noneSelected, allSelected]);

    function handleLevelPress(value: number) {
        let newLevels;
        if (selectedLevels.includes(value)) {
            newLevels = selectedLevels.filter(lvl => lvl !== value);
        } else {
            newLevels = [...selectedLevels, value];
        }
        setSelectedLevels(newLevels);
    }

    const handleSpellPress = useCallback((spell: any) => {
        openSpellModal(spell);
    }, [openSpellModal]);

    // Open the "add to spellbook" picker (spellbooks are created/managed on the Home screen).
    const handleAddToSpellbook = useCallback((spell: any) => {
        setSelectedSpellForSpellbook(spell);
        setAddToSpellbookModalVisible(true);
    }, []);

    const renderSpellItem = useCallback(({ item }: { item: any }) => (
        <SpellListItem
            spell={item}
            schoolLabel={getFullSchool(item.school)}
            hasSpellbook={false}
            onPress={handleSpellPress}
            onAddToSpellbook={handleAddToSpellbook}
            theme={currentTheme}
        />
    ), [handleSpellPress, handleAddToSpellbook, currentTheme]);

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, paddingTop: styleConstants.paddingSM, paddingBottom: 0, paddingHorizontal: styleConstants.paddingSM }]}>
            {/* Title Row with Filter Buttons */}
            <View style={[commonStyles.row_start_center, commonStyles.mb_md, { display: 'flex' }]}>
                <Text style={[{ fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', color: currentTheme.text, marginRight: styleConstants.marginMD}]}>Filters:</Text>
                <View style={[commonStyles.row_start_center, commonStyles.gap_sm, { flex: 1, display: 'flex' }]}>
                    <TouchableOpacity
                        onPress={filters.openSchoolFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedSchools.length > 0 ? currentTheme.primary : currentTheme.text, flex: 1, marginRight: styleConstants.marginXS }]}
                    >
                        <Text style={{ color: filters.selectedSchools.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: styleConstants.fontSizeXS }}>
                            School
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openClassFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedClasses.length > 0 ? currentTheme.primary : currentTheme.text, flex: 1, marginHorizontal: styleConstants.margin2XS }]}
                    >
                        <Text style={{ color: filters.selectedClasses.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: styleConstants.fontSizeXS }}>
                            Class
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openOtherFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedOthers.length > 0 ? currentTheme.primary : currentTheme.text, flex: 1, marginHorizontal: styleConstants.margin2XS }]}
                    >
                        <Text style={{ color: filters.selectedOthers.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: styleConstants.fontSizeXS }}>
                            Other
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.clearAllFilters}
                        style={[commonStyles.filterBtn, { borderColor: '#ef4444', flex: 1, marginLeft: styleConstants.marginXS }]}
                    >
                        <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: styleConstants.fontSizeXS }}>Clear</Text>
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
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    style={[commonStyles.input, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text, borderColor: currentTheme.card, flex: 1, marginBottom: 0 }]}
                    placeholder="Search by name..."
                    value={filters.search}
                    onChangeText={filters.setSearch}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholderTextColor={currentTheme.noticeText}
                />
            </View>
            
            {/* Applied Filters Text */}
            <View style={styles.filterSummaryContainer}>
                {filters.hasActiveFilters && (
                    <>
                        {filters.getFilterSummary().map((filterLine, index) => (
                            <Text key={index} style={styles.filterSummaryText}>
                                {filterLine}
                            </Text>
                        ))}
                    </>
                )}
            </View>

            <View style={{ height: 1, width: '150%', marginLeft: -25, backgroundColor: currentTheme.primary }}/>
            
            {/* Content Area */}
            <View style={{ flex: 1 }}>
                {/* Error state (e.g. offline with no data) — recoverable via retry */}
                {!isLoading && loadError && simpleSpells.length === 0 && (
                    <View style={commonStyles.loadingContainer}>
                        <Text style={{ color: currentTheme.noticeText, marginTop: styleConstants.marginSM, textAlign: 'center', paddingHorizontal: 24 }}>
                            {loadError}
                        </Text>
                        <TouchableOpacity
                            onPress={() => reloadData()}
                            style={[commonStyles.filterBtn, { borderColor: currentTheme.primary, marginTop: styleConstants.marginLG }]}
                        >
                            <Text style={{ color: currentTheme.primary, fontWeight: 'bold' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Loading states */}
                {isLoading && (
                    <View style={commonStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: styleConstants.marginSM }}>
                            Loading data...
                        </Text>
                    </View>
                )}

                {!isLoading && !loadError && !pageReady && (
                    <View style={commonStyles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: styleConstants.marginSM }}>
                            Preparing spells...
                        </Text>
                    </View>
                )}
                
                {/* Main content */}
                {!isLoading && pageReady && (
                    <FlatList
                        style={commonStyles.py_xs}
                        data={filteredSpells}
                        keyExtractor={(item, index) => `${item.source}|${item.name}|${item.level}|${index}`}
                        renderItem={renderSpellItem}
                        contentContainerStyle={{ paddingBottom: tabInset }}
                        initialNumToRender={15}
                        maxToRenderPerBatch={15}
                        windowSize={11}
                        removeClippedSubviews
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
        </View>
    );
}

const styles = StyleSheet.create({
    levelFilterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: styleConstants.marginSM,
        gap: styleConstants.gapXS,
        paddingHorizontal: styleConstants.paddingXS,
    },
    levelButton: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusXL,
        paddingVertical: styleConstants.paddingXS,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: styleConstants.margin2XS,
        flex: 1,
        maxWidth: '9%',
    },
    levelButtonText: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: 'bold',
    },
    filterSummaryContainer: {
        paddingTop: styleConstants.paddingXS,
        paddingBottom: styleConstants.paddingXS,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: styleConstants.gapXS,
    },
    filterSummaryText: {
        fontSize: styleConstants.fontSizeXS,
        backgroundColor: '#666666',
        color: '#ffffff',
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
    },
    spellbookAbsoluteButtonWrapper: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 1,
        borderTopWidth: styleConstants.borderXS,
        borderLeftWidth: styleConstants.borderXS,
        borderTopLeftRadius: 8,
        paddingTop: styleConstants.paddingSM,
        paddingRight: styleConstants.paddingXS,
        paddingBottom: styleConstants.paddingXS,
        paddingLeft: styleConstants.paddingSM,
    },
    spellbookAbsoluteButton: {
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingXS,
        borderRadius: styleConstants.borderRadiusMD,
    }
});



