// REACT
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// UTILS
import { equalsNormalized } from 'src/utils/stringUtils';

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
import { commonStyles } from 'src/styles/commonStyles';

/**
 * Screen that displays the bestiary.
 */
export default function BestiaryScreen() {
    const { currentTheme } = useAppSettingsStore();
    const { simpleBeasts, simpleSpells, isLoading, isInitialized, getFullBeast, getFullSpell } = useData();
    const { addCombatantToCombat, getSortedCombats } = useCombat();
    const { openBeastModal, openSpellModal } = useModal();
    const { selectedCampaignId } = useCampaignStore();
    const [combatSelectionModalVisible, setCombatSelectionModalVisible] = useState(false);
    const [beastToAdd, setBeastToAdd] = useState<any | null>(null);
    const [quantity, setQuantity] = useState('1');
    const [pageReady, setPageReady] = useState(false);

    // Use custom hook for all filter logic - but defer initialization
    const filters = useBestiaryFilters({ simpleBeasts, beasts: simpleBeasts });

    // Memoize combats to avoid unnecessary recalculations
    const sortedCombats = React.useMemo(() => {
        return getSortedCombats(selectedCampaignId);
    }, [getSortedCombats, selectedCampaignId]);

    // Display beasts individually (no grouping)
    const groupedBeasts = React.useMemo(() => {
        if (!pageReady) return [];
        
        // Return each beast as an individual item, sorted by name
        return filters.filteredBeasts
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(beast => [beast]); // Wrap each beast in an array to maintain compatibility
    }, [filters.filteredBeasts, pageReady]);

    // Defer heavy computations to after navigation
    useEffect(() => {
        if (simpleBeasts.length > 0) {
            // Small delay to ensure navigation is complete
            const timer = setTimeout(() => {
                setPageReady(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [simpleBeasts.length]);

    // Find full beast by name (async)
    const handleGetFullBeast = async (name: string, source: string) => {
        try {
            // Find the beast in simpleBeasts to get the source
            const simpleBeast = simpleBeasts.find(b => equalsNormalized(b.name, name) && equalsNormalized(b.source, source));
            if (!simpleBeast) return null;
            
            return await getFullBeast(name, simpleBeast.source);
        } catch (error) {
            console.error('Error getting full beast:', error);
            return null;
        }
    };

    // Combat selection handlers
    const handleAddToCombat = async (beast: any) => {
        const fullBeast = await handleGetFullBeast(beast.name, beast.source);
        setBeastToAdd(fullBeast || beast);
        setQuantity('1');
        setCombatSelectionModalVisible(true);
    };
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
    const handleViewBeastDetails = async (beast: any) => {
        openBeastModal(beast);
    };
    const handleCreaturePress = async (name: string, source: string) => {
        const beast = simpleBeasts.find(b => equalsNormalized(b.name, name) && equalsNormalized(b.source, source));
        if (beast) {
            openBeastModal(beast);
        }
    };

    const handleSpellPress = async (name: string, source: string) => {
        const spell = simpleSpells.find(s => equalsNormalized(s.name, name) && equalsNormalized(s.source, source));
        if (spell) {
            openSpellModal(spell);
        }
    };

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, paddingBottom: 0, paddingHorizontal: 8 }]}>
            {/* Combat Selection Modal */}
            <CombatSelectionModal
                visible={combatSelectionModalVisible}
                onClose={() => setCombatSelectionModalVisible(false)}
                beastToAdd={beastToAdd}
                combats={sortedCombats}
                currentCombatId={null} // Removed currentCombatId from props
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
            <View style={[{ marginBottom: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}]}>
                <Text style={[{ fontSize: 16, fontWeight: 'bold', color: currentTheme.text, marginRight: 12}]}>Filters:</Text>
                <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity
                        onPress={filters.openCRFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedCRs.length > 0 ? currentTheme.primary : currentTheme.text }]}
                    >
                        <Text style={{ color: filters.selectedCRs.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: 12 }}>
                            CR
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openTypeFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedTypes.length > 0 ? currentTheme.primary : currentTheme.text }]}
                    >
                        <Text style={{ color: filters.selectedTypes.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: 12 }}>
                            Type
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openSourceFilterModal}
                        style={[commonStyles.filterBtn, { borderColor: filters.selectedSources.length > 0 ? currentTheme.primary : currentTheme.text }]}
                    >
                        <Text style={{ color: filters.selectedSources.length > 0 ? currentTheme.primary : currentTheme.text, fontWeight: 'bold', fontSize: 12 }}>
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
                        <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 12 }}>
                            Clear
                        </Text>
                    </TouchableOpacity>
                    </View>
            </View>
            {/* Search Input */}
            <TextInput
                style={[styles.input, { backgroundColor: currentTheme.inputBackground, color: currentTheme.text, borderColor: currentTheme.card }]}
                placeholder="Search by name..."
                placeholderTextColor={currentTheme.noticeText}
                value={filters.search}
                onChangeText={filters.setSearch}
            />
            {/* Filter Summary */}
            {filters.getFilterSummary().length > 0 && (
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
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: 8 }}>
                            Loading data...
                        </Text>
                    </View>
                )}
                
                {!isLoading && !pageReady && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                        <Text style={{ color: currentTheme.noticeText, marginTop: 8 }}>
                            Preparing bestiary...
                        </Text>
                    </View>
                )}
                
                {/* Filter applying overlay */}
                {pageReady && filters.filterApplying && (
                    <View style={styles.activityOverlay}>
                        <ActivityIndicator size="large" color={currentTheme.primary} />
                    </View>
                )}
                
                {/* Main content */}
                {!isLoading && pageReady && (
                    groupedBeasts.length === 0 ? (
                    <Text style={{ color: currentTheme.noticeText, marginVertical: 16 }}>No beasts found.</Text>
                ) : (
                    <FlatList
                        data={groupedBeasts}
                        keyExtractor={(item, idx) => `${item[0].name}-${item[0].source}-${idx}`}
                        renderItem={({ item }) => (
                            <BeastListItem
                                beast={item[0]}
                                onAddToCombat={handleAddToCombat}
                                onViewDetails={handleViewBeastDetails}
                                theme={currentTheme}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 40 }}
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
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 12,
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
        paddingVertical: 20,
    },
    filterSummaryContainer: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
    },
    filterSummaryText: {
        fontSize: 12,
        textAlign: 'left',
    },
});
