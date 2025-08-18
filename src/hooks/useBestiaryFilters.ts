// REACT
import { useMemo, useState, useEffect, useCallback } from 'react';

// UTILS
import { normalizeString } from 'src/utils/stringUtils';
import { getBeastType, getBeastSource } from 'src/utils/beastUtils';
import { getStorage } from 'src/utils/storage';

// INTERFACES
interface BestiaryFiltersProps {
    simpleBeasts: any[];
    beasts: any[];
}

/**
 * useBestiaryFilters hook.
 */
export default function useBestiaryFilters({ simpleBeasts, beasts }: BestiaryFiltersProps) {
    // Search and filter states
    const [search, setSearch] = useState('');
    const [selectedCRs, setSelectedCRs] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    // Pending (modal) filter states
    const [pendingCRs, setPendingCRs] = useState<string[]>([]);
    const [pendingTypes, setPendingTypes] = useState<string[]>([]);
    const [pendingSources, setPendingSources] = useState<string[]>([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [typeFilterModalVisible, setTypeFilterModalVisible] = useState(false);
    const [sourceFilterModalVisible, setSourceFilterModalVisible] = useState(false);

    // Filter indexes for optimization
    const [filterIndexes, setFilterIndexes] = useState<{ cr: string[], type: string[], source: string[] } | null>(null);

    // Load filter indexes on mount
    useEffect(() => {
        const loadFilterIndexes = async () => {
            try {
                const storage = getStorage();
                const indexes = await storage.loadFilterIndexes();
                setFilterIndexes(indexes);
            } catch (error) {
                console.log('Filter indexes not available, using fallback method');
            }
        };
        loadFilterIndexes();
    }, []);

    // Pre-compute beast data for faster filtering
    const beastData = useMemo(() => {
        return simpleBeasts.map(beast => ({
            ...beast,
            normalizedName: normalizeString(beast.name),
            normalizedType: getBeastType(beast),
            normalizedSource: getBeastSource(beast),
            crString: String(beast.CR && beast.CR !== '' ? beast.CR : 'Unknown')
        }));
    }, [simpleBeasts]);

    // Get unique CRs for filter modal - use indexes if available
    const crOptions = useMemo(() => {
        if (filterIndexes?.cr) {
            return filterIndexes.cr;
        }

        // Fallback to original method
        const crs = Array.from(new Set(beastData.map(b => b.crString)));
        // Sort: numbers/fractions first, then 'Unknown' last
        const known = crs.filter(cr => cr !== 'Unknown').sort((a, b) => {
            // Handle fractions as numbers for sorting
            const parseCR = (val: string) => {
                if (val.includes('/')) {
                    const [num, denom] = val.split('/').map(Number);
                    return denom ? num / denom : 0;
                }
                const n = parseFloat(val);
                return isNaN(n) ? 0 : n;
            };
            return parseCR(a) - parseCR(b);
        });
        const unknown = crs.includes('Unknown') ? ['Unknown'] : [];
        return [...known, ...unknown];
    }, [beastData, filterIndexes]);

    // Get unique types for filter modal - use indexes if available
    const typeOptions = useMemo(() => {
        if (filterIndexes?.type) {
            return filterIndexes.type;
        }

        // Fallback to original method
        const types = Array.from(new Set(beastData.map(b => b.normalizedType))).filter(Boolean).sort();
        return types;
    }, [beastData, filterIndexes]);

    // Get unique sources for filter modal - use indexes if available
    const sourceOptions = useMemo(() => {
        if (filterIndexes?.source) {
            return filterIndexes.source;
        }

        // Fallback to original method
        const sources = Array.from(new Set(beastData.map(b => b.normalizedSource))).filter(Boolean).sort();
        return sources;
    }, [beastData, filterIndexes]);

    // Pre-compute normalized search term
    const normalizedSearch = useMemo(() => normalizeString(search), [search]);

    // Pre-compute normalized filter arrays
    const normalizedSelectedTypes = useMemo(() => selectedTypes.map(normalizeString), [selectedTypes]);
    const normalizedSelectedSources = useMemo(() => selectedSources.map(normalizeString), [selectedSources]);

    // Filtered list - only apply filters when not in modal state
    const filteredBeasts = useMemo(() => {
        // If any filter modal is open, don't apply filters yet
        if (filterModalVisible || typeFilterModalVisible || sourceFilterModalVisible) {
            if (!normalizedSearch) return beastData;
            return beastData.filter(b => b.normalizedName.includes(normalizedSearch));
        }

        return beastData.filter(b => {
            // Name filter
            const matchesName = !normalizedSearch || b.normalizedName.includes(normalizedSearch);
            if (!matchesName) return false;

            // CR filter
            const matchesCR = selectedCRs.length === 0 || selectedCRs.includes(b.crString);
            if (!matchesCR) return false;

            // Type filter
            const matchesType = selectedTypes.length === 0 || normalizedSelectedTypes.includes(b.normalizedType);
            if (!matchesType) return false;

            // Source filter
            const matchesSource = selectedSources.length === 0 || normalizedSelectedSources.includes(b.normalizedSource);
            return matchesSource;
        });
    }, [beastData, normalizedSearch, selectedCRs, selectedTypes, selectedSources, normalizedSelectedTypes, normalizedSelectedSources, filterModalVisible, typeFilterModalVisible, sourceFilterModalVisible]);

    // Modal handlers - optimized with useCallback
    const openCRFilterModal = useCallback(() => {
        setPendingCRs(selectedCRs);
        setFilterModalVisible(true);
    }, [selectedCRs]);

    const openTypeFilterModal = useCallback(() => {
        setPendingTypes(selectedTypes);
        setTypeFilterModalVisible(true);
    }, [selectedTypes]);

    const openSourceFilterModal = useCallback(() => {
        setPendingSources(selectedSources);
        setSourceFilterModalVisible(true);
    }, [selectedSources]);

    const toggleCR = useCallback((cr: string | number) => {
        const crStr = String(cr);
        setSelectedCRs(prev =>
            prev.includes(crStr) ? prev.filter(c => c !== crStr) : [...prev, crStr]
        );
    }, []);

    const selectAllCRs = useCallback(() => {
        if (selectedCRs.length < crOptions.length) {
            setSelectedCRs([...crOptions]);
        } else {
            setSelectedCRs([]);
        }
    }, [selectedCRs.length, crOptions]);

    const applyFilter = useCallback(() => setFilterModalVisible(false), []);

    // CR Filter Modal handlers
    const togglePendingCR = useCallback((cr: string | number) => {
        const crStr = String(cr);
        setPendingCRs(prev =>
            prev.includes(crStr) ? prev.filter(c => c !== crStr) : [...prev, crStr]
        );
    }, []);

    const selectAllPendingCRs = useCallback(() => {
        if (pendingCRs.length < crOptions.length) {
            setPendingCRs([...crOptions]);
        } else {
            setPendingCRs([]);
        }
    }, [pendingCRs.length, crOptions]);

    const applyCRFilter = useCallback(() => {
        setFilterModalVisible(false);
        setSelectedCRs(pendingCRs);
    }, [pendingCRs]);

    // Type Filter Modal handlers
    const togglePendingType = useCallback((type: string) => {
        setPendingTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    }, []);

    const selectAllPendingTypes = useCallback(() => {
        if (pendingTypes.length < typeOptions.length) {
            setPendingTypes([...typeOptions]);
        } else {
            setPendingTypes([]);
        }
    }, [pendingTypes.length, typeOptions]);

    const applyTypeFilter = useCallback(() => {
        setTypeFilterModalVisible(false);
        setSelectedTypes(pendingTypes);
    }, [pendingTypes]);

    // Source Filter Modal handlers
    const togglePendingSource = useCallback((source: string) => {
        setPendingSources(prev =>
            prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
        );
    }, []);

    const selectAllPendingSources = useCallback(() => {
        if (pendingSources.length < sourceOptions.length) {
            setPendingSources([...sourceOptions]);
        } else {
            setPendingSources([]);
        }
    }, [pendingSources.length, sourceOptions]);

    const applySourceFilter = useCallback(() => {
        setSourceFilterModalVisible(false);
        setSelectedSources(pendingSources);
    }, [pendingSources]);

    // Helper functions to get display text for selected filters - optimized with useCallback
    const getCRFilterText = useCallback(() => {
        if (selectedCRs.length === 0) return 'CR';
        if (selectedCRs.length === 1) return `CR: ${selectedCRs[0]}`;
        if (selectedCRs.length <= 3) return `CR: ${selectedCRs.join(', ')}`;
        return `CR: ${selectedCRs.length} selected`;
    }, [selectedCRs]);

    const getTypeFilterText = useCallback(() => {
        if (selectedTypes.length === 0) return 'Type';
        if (selectedTypes.length === 1) return `Type: ${selectedTypes[0]}`;
        if (selectedTypes.length <= 3) return `Type: ${selectedTypes.join(', ')}`;
        return `Type: ${selectedTypes.length} selected`;
    }, [selectedTypes]);

    const getSourceFilterText = useCallback(() => {
        if (selectedSources.length === 0) return 'Source';
        if (selectedSources.length === 1) return `Source: ${selectedSources[0]}`;
        if (selectedSources.length <= 3) return `Source: ${selectedSources.join(', ')}`;
        return `Source: ${selectedSources.length} selected`;
    }, [selectedSources]);

    // Function to get source acronym (e.g., "Player's Handbook" -> "PHB")
    const getSourceAcronym = (sourceName: string): string => {
        const acronymMap: { [key: string]: string } = {
            'Player\'s Handbook': 'PHB',
            'Dungeon Master\'s Guide': 'DMG',
            'Monster Manual': 'MM',
            'Volo\'s Guide to Monsters': 'VGtM',
            'Mordenkainen\'s Tome of Foes': 'MToF',
            'Tasha\'s Cauldron of Everything': 'TCoE',
            'Xanathar\'s Guide to Everything': 'XGtE',
            'Fizban\'s Treasury of Dragons': 'FToD',
            'Mordenkainen Presents: Monsters of the Multiverse': 'MPMM',
            'The Wild Beyond the Witchlight': 'WBtW',
            'Van Richten\'s Guide to Ravenloft': 'VRGtR',
            'Strixhaven: A Curriculum of Chaos': 'SACoC',
            'Candlekeep Mysteries': 'CM',
            'Icewind Dale: Rime of the Frostmaiden': 'IDRotF',
            'Explorer\'s Guide to Wildemount': 'EGtW',
            'Eberron: Rising from the Last War': 'ERftLW',
            'Acquisitions Incorporated': 'AI',
            'Guildmasters\' Guide to Ravnica': 'GGtR',
            'Mythic Odysseys of Theros': 'MOoT',
            'Theros: Beyond Death': 'TBD',
            'Baldur\'s Gate: Descent into Avernus': 'BGDiA',
            'Dragon Heist': 'DH',
            'Dungeon of the Mad Mage': 'DotMM',
            'Ghosts of Saltmarsh': 'GoS',
            'Princes of the Apocalypse': 'PotA',
            'Out of the Abyss': 'OotA',
            'Curse of Strahd': 'CoS',
            'Storm King\'s Thunder': 'SKT',
            'Tales from the Yawning Portal': 'TftYP',
            'Tomb of Annihilation': 'ToA',
            'Hoard of the Dragon Queen': 'HotDQ',
            'The Rise of Tiamat': 'RoT',
            'Lost Mine of Phandelver': 'LMoP',
            'Tyranny of Dragons': 'ToD',
            'Elemental Evil Player\'s Companion': 'EEPC',
            'Sword Coast Adventurer\'s Guide': 'SCAG',
            'Unearthed Arcana': 'UA',
            'Adventure League': 'AL',
            'Homebrew': 'HB',
            'Critical Role': 'CR',
            'D&D Beyond': 'DDB',
            'Dungeon Master\'s Guild': 'DMG',
            'Kobold Press': 'KP',
            'Green Ronin': 'GR',
            'Paizo': 'PZ',
            'Wizards of the Coast': 'WotC',
            'Other': 'OTH'
        };

        return acronymMap[sourceName] || sourceName.substring(0, 3).toUpperCase();
    };

    // Function to generate filter summary
    const getFilterSummary = (): string[] => {
        const summary: string[] = [];

        if (selectedCRs.length > 0) {
            summary.push(`CR: ${selectedCRs.join(', ')}`);
        }

        if (selectedTypes.length > 0) {
            summary.push(`Type: ${selectedTypes.join(', ')}`);
        }

        if (selectedSources.length > 0) {
            const sourceAcronyms = selectedSources.map(source => getSourceAcronym(source));
            summary.push(`Source: ${sourceAcronyms.join(', ')}`);
        }

        return summary;
    };

    // Function to get source text with acronym
    const getSourceFilterTextWithAcronym = () => {
        if (selectedSources.length === 0) return 'Source';
        if (selectedSources.length === 1) {
            const acronym = getSourceAcronym(selectedSources[0]);
            return `Source: ${selectedSources[0]} (${acronym})`;
        }
        if (selectedSources.length <= 3) {
            const withAcronyms = selectedSources.map(source => {
                const acronym = getSourceAcronym(source);
                return `${source} (${acronym})`;
            });
            return `Source: ${withAcronyms.join(', ')}`;
        }
        return `Source: ${selectedSources.length} selected`;
    };

    return {
        search,
        setSearch,
        selectedCRs,
        setSelectedCRs,
        selectedTypes,
        setSelectedTypes,
        selectedSources,
        setSelectedSources,
        pendingCRs,
        setPendingCRs,
        pendingTypes,
        setPendingTypes,
        pendingSources,
        setPendingSources,
        filterModalVisible,
        setFilterModalVisible,
        typeFilterModalVisible,
        setTypeFilterModalVisible,
        sourceFilterModalVisible,
        setSourceFilterModalVisible,
        crOptions,
        typeOptions,
        sourceOptions,
        filteredBeasts,
        getCRFilterText,
        getTypeFilterText,
        getSourceFilterText,
        getSourceFilterTextWithAcronym,
        getFilterSummary,
        getSourceAcronym,
        openCRFilterModal,
        openTypeFilterModal,
        openSourceFilterModal,
        toggleCR,
        selectAllCRs,
        applyFilter,
        togglePendingCR,
        selectAllPendingCRs,
        applyCRFilter,
        togglePendingType,
        selectAllPendingTypes,
        applyTypeFilter,
        togglePendingSource,
        selectAllPendingSources,
        applySourceFilter,
        getBeastType
    };
}
