// REACT
import React, { useCallback, useEffect, useState } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// UTILS
import { applySourceFilters } from 'src/utils/sourceFilter';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// UTILS

// COMPONENTS
import { BeastListItem } from 'src/components/beasts';
import { CombatSelectionModal } from 'src/components/combat';
import { CRFilterModal, SourceFilterModal } from 'src/components/beasts/modals';
import { TypeFilterModal } from 'src/components/modals';

// HOOKS
import useBestiaryFilters from 'src/hooks/useBestiaryFilters';

// CONSTANTS
import { books as sourceIdToNameMap } from 'src/constants/books';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

/**
 * Screen that displays the bestiary.
 */
export default function BestiaryScreen() {
    const { currentTheme, preferredEdition, ignoredSources } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { simpleBeasts, isLoading, loadError, reloadData, getFullBeast } = useData();
    const { addCombatantToCombat, getSortedCombats } = useCombat();
    const { openBeastModal } = useModal();
    const { selectedCampaignId } = useCampaignStore();
    const [combatSelectionModalVisible, setCombatSelectionModalVisible] = useState(false);
    const [beastToAdd, setBeastToAdd] = useState<any | null>(null);
    const [quantity, setQuantity] = useState('1');
    const [pageReady, setPageReady] = useState(false);

    // Apply the global source filter (ignored books + edition dedupe) before filtering/search.
    const ignoredSet = React.useMemo(() => new Set(ignoredSources), [ignoredSources]);
    const visibleBeasts = React.useMemo(
        () => applySourceFilters(simpleBeasts, { preferredEdition, ignoredSources: ignoredSet }),
        [simpleBeasts, preferredEdition, ignoredSet]
    );

    // Use custom hook for all filter logic - but defer initialization
    const filters = useBestiaryFilters({ simpleBeasts: visibleBeasts, beasts: visibleBeasts });

    // Memoize combats to avoid unnecessary recalculations
    const sortedCombats = React.useMemo(() => {
        return getSortedCombats(selectedCampaignId);
    }, [getSortedCombats, selectedCampaignId]);

    // Display beasts individually (no grouping), sorted by name
    const sortedBeasts = React.useMemo(() => {
        if (!pageReady) return [];
        return filters.filteredBeasts
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [filters.filteredBeasts, pageReady]);

    // Defer heavy computations to after navigation
    useEffect(() => {
        if (simpleBeasts.length === 0) return undefined;
        // Small delay to ensure navigation is complete
        const timer = setTimeout(() => {
            setPageReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [simpleBeasts.length]);

    // Find full beast by name (async). getFullBeast does an O(1) index lookup and
    // returns null when the beast isn't found, so no pre-scan is needed here.
    const handleGetFullBeast = useCallback(async (name: string, source: string) => {
        try {
            return await getFullBeast(name, source);
        } catch (error) {
            console.error('Error getting full beast:', error);
            return null;
        }
    }, [getFullBeast]);

    // Combat selection handlers (stable identities so memoized list rows don't re-render)
    const handleAddToCombat = useCallback(async (beast: any) => {
        const fullBeast = await handleGetFullBeast(beast.name, beast.source);
        setBeastToAdd(fullBeast || beast);
        setQuantity('1');
        setCombatSelectionModalVisible(true);
    }, [handleGetFullBeast]);

    const handleSelectCombat = (combatId: string) => {
        if (beastToAdd) {
            const qty = parseInt(quantity, 10) || 1;
            for (let i = 0; i < qty; i++) {
                addCombatantToCombat(beastToAdd, combatId);
            }
        }
        setCombatSelectionModalVisible(false);
        setBeastToAdd(null);
        setQuantity('1');
    };

    const handleViewBeastDetails = useCallback((beast: any) => {
        openBeastModal(beast);
    }, [openBeastModal]);

    const renderBeastItem = useCallback(({ item }: { item: any }) => (
        <BeastListItem
            beast={item}
            onAddToCombat={handleAddToCombat}
            onViewDetails={handleViewBeastDetails}
            theme={currentTheme}
        />
    ), [handleAddToCombat, handleViewBeastDetails, currentTheme]);

    const beastKeyExtractor = useCallback(
        (item: any, index: number) => `${item.source}|${item.name}|${item.CR}|${index}`,
        []
    );

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, paddingTop: styleConstants.paddingSM, paddingBottom: 0, paddingHorizontal: styleConstants.paddingSM }]}>
            {/* Combat Selection Modal */}
            <CombatSelectionModal
                visible={combatSelectionModalVisible}
                onClose={() => setCombatSelectionModalVisible(false)}
                beastToAdd={beastToAdd}
                combats={sortedCombats}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onSelectCombat={handleSelectCombat}
                theme={currentTheme}
            />
            {/* CR Filter Modal */}
            <CRFilterModal
                visible={filters.filterModalVisible}
                onClose={() => filters.setFilterModalVisible(false)}
                crOptions={filters.crOptions}
                selectedCRs={filters.pendingCRs}
                onToggleCR={filters.togglePendingCR}
                onSelectAll={filters.selectAllPendingCRs}
                onApply={filters.applyCRFilter}
                theme={currentTheme}
            />
            {/* Type Filter Modal */}
            <TypeFilterModal
                visible={filters.typeFilterModalVisible}
                onClose={() => filters.setTypeFilterModalVisible(false)}
                typeOptions={filters.typeOptions}
                selectedTypes={filters.pendingTypes}
                onToggleType={filters.togglePendingType}
                onClear={filters.selectAllPendingTypes}
                onApply={filters.applyTypeFilter}
                theme={currentTheme}
            />
            {/* Source Filter Modal */}
            <SourceFilterModal
                visible={filters.sourceFilterModalVisible}
                onClose={() => filters.setSourceFilterModalVisible(false)}
                sourceOptions={filters.sourceOptions}
                selectedSources={filters.pendingSources}
                onToggleSource={filters.togglePendingSource}
                onClear={filters.selectAllPendingSources}
                onApply={filters.applySourceFilter}
                theme={currentTheme}
                sourceIdToNameMap={sourceIdToNameMap}
            />
            {/* Filter Buttons */}
            <View style={[commonStyles.row_start_center, commonStyles.mb_md, { display: 'flex' }]}>
                <Text style={[{ fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', color: currentTheme.text, marginRight: styleConstants.marginMD}]}>Filters:</Text>
                <View style={[commonStyles.row_evenly_center, commonStyles.gap_sm, { flex: 1, display: 'flex' }]}>
                    <TouchableOpacity
                        onPress={filters.openCRFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedCRs.length > 0 ? currentTheme.primary : currentTheme.text }]}
                    >
                        <Text style={{ color: filters.selectedCRs.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: styleConstants.fontSizeSM }}>
                            CR
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openTypeFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedTypes.length > 0 ? currentTheme.primary : currentTheme.text }]}
                    >
                        <Text style={{ color: filters.selectedTypes.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: styleConstants.fontSizeSM }}>
                            Type
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openSourceFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedSources.length > 0 ? currentTheme.primary : currentTheme.text }]}
                    >
                        <Text style={{ color: filters.selectedSources.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: styleConstants.fontSizeSM }}>
                            Source
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            filters.setSelectedCRs([]);
                            filters.setSelectedTypes([]);
                            filters.setSelectedSources([]);
                        }}
                        style={[commonStyles.filterBtn, { borderColor: '#ef4444' }]}
                    >
                        <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: styleConstants.fontSizeSM }}>
                            Clear
                        </Text>
                    </TouchableOpacity>
                    </View>
            </View>
            {/* Search Input */}
            <TextInput
                style={[styles.input, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text, borderColor: currentTheme.card, marginBottom: 0 }]}
                placeholder="Search by name..."
                placeholderTextColor={currentTheme.noticeText}
                value={filters.search}
                onChangeText={filters.setSearch}
            />
            {/* Filter Summary */}
            <View style={styles.filterSummaryContainer}>
                {filters.getFilterSummary().length > 0 && (
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
                {!isLoading && loadError && simpleBeasts.length === 0 && (
                    <View style={styles.loadingContainer}>
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
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: styleConstants.marginSM }}>
                            Loading data...
                        </Text>
                    </View>
                )}

                {!isLoading && !loadError && !pageReady && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: styleConstants.marginSM }}>
                            Preparing bestiary...
                        </Text>
                    </View>
                )}
                
                {/* Main content */}
                {!isLoading && pageReady && (
                    sortedBeasts.length === 0 ? (
                    <Text style={{ color: currentTheme.noticeText, marginVertical: styleConstants.marginLG }}>No beasts found.</Text>
                ) : (
                    <FlatList
                        style={commonStyles.py_xs}
                        data={sortedBeasts}
                        keyExtractor={beastKeyExtractor}
                        renderItem={renderBeastItem}
                        contentContainerStyle={{ paddingBottom: tabInset }}
                        initialNumToRender={15}
                        maxToRenderPerBatch={15}
                        windowSize={11}
                        removeClippedSubviews
                    />
                    )
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: styleConstants.marginLG,
    },
    title: {
        fontSize: styleConstants.fontSize2XL,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    input: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM,
        fontSize: styleConstants.fontSizeLG,
        marginBottom: styleConstants.marginMD,
    },
    activityOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingXL,
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
});
