// REACT
import React, { useEffect, useState } from 'react';

// REACT NATIVE
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import BeastListItem, { GroupedBeastListItem } from 'src/components/BeastListItem';
import CombatSelectionModal from 'src/components/CombatSelectionModal';
import CRFilterModal from 'src/components/CRFilterModal';
import SourceFilterModal from 'src/components/SourceFilterModal';
import TypeFilterModal from 'src/components/TypeFilterModal';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useCombat } from 'src/context/CombatContext';
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// HOOKS
import { useBestiaryFilters } from 'src/hooks/useBestiaryFilters';

// CONSTANTS
import { books as sourceIdToNameMap } from 'src/constants/books';

export default function BestiaryScreen() {
    const { currentTheme } = useAppSettings();
    const { simpleBeasts, simpleSpells, isLoading, isInitialized, getFullBeast, getFullSpell } = useData();
    const { combats, currentCombatId, addCombatantToCombat, createCombat, selectCombat } = useCombat();
    const { openBeastModal, openSpellModal } = useModal();
    const [combatSelectionModalVisible, setCombatSelectionModalVisible] = useState(false);
    const [beastToAdd, setBeastToAdd] = useState<any | null>(null);
    const [newCombatName, setNewCombatName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [pageReady, setPageReady] = useState(false);

    // Use custom hook for all filter logic - but defer initialization
    const filters = useBestiaryFilters(simpleBeasts, []);

    // Group beasts by name for display
    const groupedBeasts = React.useMemo(() => {
        if (!pageReady) return [];
        
        const grouped = new Map<string, any[]>();
        
        filters.filteredBeasts.forEach(beast => {
            const name = beast.name;
            if (!grouped.has(name)) {
                grouped.set(name, []);
            }
            grouped.get(name)!.push(beast);
        });
        
        // Convert to array and sort by name
        return Array.from(grouped.values()).sort((a, b) => 
            a[0].name.localeCompare(b[0].name)
        );
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
    const handleGetFullBeast = async (name: string) => {
        try {
            // Find the beast in simpleBeasts to get the source
            const simpleBeast = simpleBeasts.find(b => b.name === name);
            if (!simpleBeast) return null;
            
            return await getFullBeast(name, simpleBeast.source);
        } catch (error) {
            console.error('Error getting full beast:', error);
            return null;
        }
    };

    // Combat selection handlers
    const handleAddToCombat = async (beast: any) => {
        const fullBeast = await handleGetFullBeast(beast.name);
        setBeastToAdd(fullBeast || beast);
        setQuantity('1');
        setCombatSelectionModalVisible(true);
    };
    const handleSelectCombat = (combatId: string) => {
        selectCombat(combatId);
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
    const handleCreateNewCombat = () => {
        if (newCombatName.trim()) {
            const combatId = createCombat(newCombatName.trim());
            if (beastToAdd) {
                const qty = parseInt(quantity, 10) || 1;
                for (let i = 0; i < qty; i++) {
                    addCombatantToCombat(beastToAdd, combatId);
                }
            }
            setCombatSelectionModalVisible(false);
            setBeastToAdd(null);
            setNewCombatName('');
            setQuantity('1');
        }
    };
    const handleViewBeastDetails = async (beast: any) => {
        openBeastModal(beast);
    };
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

    function getFullSchool(school: string) {
        if (!school) return '';
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
        const key = school.charAt(0).toUpperCase();
        return SCHOOL_MAP[key] || school;
    }

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background, padding: 20, paddingBottom: 0 }}>
            {/* Combat Selection Modal */}
            <CombatSelectionModal
                visible={combatSelectionModalVisible}
                onClose={() => setCombatSelectionModalVisible(false)}
                beastToAdd={beastToAdd}
                combats={combats}
                currentCombatId={currentCombatId}
                newCombatName={newCombatName}
                quantity={quantity}
                onNewCombatNameChange={setNewCombatName}
                onQuantityChange={setQuantity}
                onSelectCombat={handleSelectCombat}
                onCreateNewCombat={handleCreateNewCombat}
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
            {/* Title Row with Filter Buttons */}
            <View style={[styles.titleRow, { justifyContent: 'space-between' }]}>
                <Text style={[styles.title, { color: currentTheme.text }]}>Bestiary</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={filters.openCRFilterModal}
                        style={[styles.filterBtn, { borderColor: currentTheme.primary }]}
                    >
                        <Text style={{ color: currentTheme.primary, fontWeight: 'bold', fontSize: 12 }}>CR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openTypeFilterModal}
                        style={[styles.filterBtn, { borderColor: currentTheme.primary }]}
                    >
                        <Text style={{ color: currentTheme.primary, fontWeight: 'bold', fontSize: 12 }}>Type</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={filters.openSourceFilterModal}
                        style={[styles.filterBtn, { borderColor: currentTheme.primary, marginRight: 0 }]}
                    >
                        <Text style={{ color: currentTheme.primary, fontWeight: 'bold', fontSize: 12 }}>Source</Text>
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
                autoCorrect={false}
                autoCapitalize="none"
            />
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
                            keyExtractor={(item, idx) => item[0].name + idx}
                        renderItem={({ item }) => (
                                item.length === 1 ? (
                            <BeastListItem
                                        beast={item[0]}
                                        onAddToCombat={handleAddToCombat}
                                        onViewDetails={handleViewBeastDetails}
                                        theme={currentTheme}
                                    />
                                ) : (
                                    <GroupedBeastListItem
                                        beasts={item}
                                onAddToCombat={handleAddToCombat}
                                onViewDetails={handleViewBeastDetails}
                                theme={currentTheme}
                            />
                                )
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
    filterBtn: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
        zIndex: 1000,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
});
