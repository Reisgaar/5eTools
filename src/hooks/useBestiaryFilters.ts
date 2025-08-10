import { useMemo, useState } from 'react';
import { normalizeString, extractBeastType, extractBeastSource, containsNormalized, includesNormalized } from 'src/utils/stringUtils';
import { getBeastType, getBeastSource, calculatePassivePerception } from 'src/utils/beastUtils';

export function useBestiaryFilters(simpleBeasts: any[], beasts: any[]) {
    // Search and filter states
    const [search, setSearch] = useState('');
    const [selectedCRs, setSelectedCRs] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    // Pending (modal) filter states
    const [pendingCRs, setPendingCRs] = useState<string[]>([]);
    const [pendingTypes, setPendingTypes] = useState<string[]>([]);
    const [pendingSources, setPendingSources] = useState<string[]>([]);
    const [filterApplying, setFilterApplying] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [typeFilterModalVisible, setTypeFilterModalVisible] = useState(false);
    const [sourceFilterModalVisible, setSourceFilterModalVisible] = useState(false);

    // Get unique CRs for filter modal
    const crOptions = useMemo(() => {
        const crs = Array.from(new Set(simpleBeasts.map(b => String(b.CR && b.CR !== '' ? b.CR : 'Unknown'))));
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
    }, [simpleBeasts]);

    // Helper to extract type string from beast (using utility function)
    function getBeastTypeLocal(beast: any): string {
        return getBeastType(beast);
    }

    // Get unique types for filter modal
    const typeOptions = useMemo(() => {
        const types = Array.from(new Set(simpleBeasts.map(getBeastType))).filter(Boolean).sort();
        return types;
    }, [simpleBeasts]);

    // Get unique sources for filter modal
    const sourceOptions = useMemo(() => {
        const sources = Array.from(new Set(simpleBeasts.map(getBeastSource))).filter(Boolean).sort();
        return sources;
    }, [simpleBeasts]);

    // Filtered list
    const filteredBeasts = useMemo(() => {
        return simpleBeasts.filter(b => {
            const matchesName = containsNormalized(b.name, search);
            const beastType = getBeastType(b);
            const beastSource = getBeastSource(b);
            const matchesCR = selectedCRs.length === 0 || selectedCRs.includes(String(b.CR));
            const matchesType = selectedTypes.length === 0 || includesNormalized(beastType, selectedTypes);
            const matchesSource = selectedSources.length === 0 || includesNormalized(beastSource, selectedSources);
            return matchesName && matchesCR && matchesType && matchesSource;
        });
    }, [simpleBeasts, search, selectedCRs, selectedTypes, selectedSources]);

    // Modal handlers
    const openCRFilterModal = () => {
        setPendingCRs(selectedCRs);
        setFilterModalVisible(true);
    };
    const openTypeFilterModal = () => {
        setPendingTypes(selectedTypes);
        setTypeFilterModalVisible(true);
    };
    const openSourceFilterModal = () => {
        setPendingSources(selectedSources);
        setSourceFilterModalVisible(true);
    };
    const toggleCR = (cr: string | number) => {
        const crStr = String(cr);
        setSelectedCRs(prev =>
            prev.includes(crStr) ? prev.filter(c => c !== crStr) : [...prev, crStr]
        );
    };
    const selectAllCRs = () => {
        if (selectedCRs.length < crOptions.length) {
            setSelectedCRs([...crOptions]);
        } else {
            setSelectedCRs([]);
        }
    };
    const applyFilter = () => setFilterModalVisible(false);

    // CR Filter Modal handlers
    const togglePendingCR = (cr: string | number) => {
        const crStr = String(cr);
        setPendingCRs(prev =>
            prev.includes(crStr) ? prev.filter(c => c !== crStr) : [...prev, crStr]
        );
    };
    const selectAllPendingCRs = () => {
        if (pendingCRs.length < crOptions.length) {
            setPendingCRs([...crOptions]);
        } else {
            setPendingCRs([]);
        }
    };
    const applyCRFilter = () => {
        setFilterModalVisible(false);
        setFilterApplying(true);
        setTimeout(() => {
            setSelectedCRs(pendingCRs);
            setFilterApplying(false);
        }, 200);
    };

    // Type Filter Modal handlers
    const togglePendingType = (type: string) => {
        setPendingTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };
    const selectAllPendingTypes = () => {
        if (pendingTypes.length < typeOptions.length) {
            setPendingTypes([...typeOptions]);
        } else {
            setPendingTypes([]);
        }
    };
    const applyTypeFilter = () => {
        setTypeFilterModalVisible(false);
        setFilterApplying(true);
        setTimeout(() => {
            setSelectedTypes(pendingTypes);
            setFilterApplying(false);
        }, 200);
    };

    // Source Filter Modal handlers
    const togglePendingSource = (source: string) => {
        setPendingSources(prev =>
            prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
        );
    };
    const selectAllPendingSources = () => {
        if (pendingSources.length < sourceOptions.length) {
            setPendingSources([...sourceOptions]);
        } else {
            setPendingSources([]);
        }
    };
    const applySourceFilter = () => {
        setSourceFilterModalVisible(false);
        setFilterApplying(true);
        setTimeout(() => {
            setSelectedSources(pendingSources);
            setFilterApplying(false);
        }, 200);
    };

    // Helper functions to get display text for selected filters
    const getCRFilterText = () => {
        if (selectedCRs.length === 0) return 'CR';
        if (selectedCRs.length === 1) return `CR: ${selectedCRs[0]}`;
        if (selectedCRs.length <= 3) return `CR: ${selectedCRs.join(', ')}`;
        return `CR: ${selectedCRs.length} selected`;
    };

    const getTypeFilterText = () => {
        if (selectedTypes.length === 0) return 'Type';
        if (selectedTypes.length === 1) return `Type: ${selectedTypes[0]}`;
        if (selectedTypes.length <= 3) return `Type: ${selectedTypes.join(', ')}`;
        return `Type: ${selectedTypes.length} selected`;
    };

    const getSourceFilterText = () => {
        if (selectedSources.length === 0) return 'Source';
        if (selectedSources.length === 1) return `Source: ${selectedSources[0]}`;
        if (selectedSources.length <= 3) return `Source: ${selectedSources.join(', ')}`;
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
        filterApplying,
        setFilterApplying,
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