import { useMemo, useState } from 'react';

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

    // Helper to extract type string from beast
    function getBeastType(beast: any): string {
        if (!beast) return '';
        if (typeof beast.type === 'string') return beast.type.toLowerCase();
        if (typeof beast.type === 'object' && typeof beast.type.type === 'string') return beast.type.type.toLowerCase();
        return '';
    }

    // Get unique types for filter modal
    const typeOptions = useMemo(() => {
        const types = Array.from(new Set(beasts.map(getBeastType))).filter(Boolean).sort();
        return types;
    }, [beasts]);

    // Get unique sources for filter modal
    const sourceOptions = useMemo(() => {
        const sources = Array.from(new Set(beasts.map(b => typeof b.source === 'string' ? b.source.toLowerCase() : ''))).filter(Boolean).sort();
        return sources;
    }, [beasts]);

    // Filtered list
    const filteredBeasts = useMemo(() => {
        return simpleBeasts.filter(b => {
            const matchesName = b.name.toLowerCase().includes(search.toLowerCase());
            // Look up the full beast object for type/source (case-insensitive)
            const fullBeast = beasts.find(beast => beast.name.toLowerCase() === b.name.toLowerCase());
            const beastType = getBeastType(fullBeast);
            const beastSource = fullBeast && typeof fullBeast.source === 'string' ? fullBeast.source.toLowerCase() : '';
            const matchesCR = selectedCRs.length === 0 || selectedCRs.includes(String(b.CR));
            const matchesType = selectedTypes.length === 0 || selectedTypes.map(t => t.toLowerCase()).includes(beastType);
            const matchesSource = selectedSources.length === 0 || selectedSources.map(s => s.toLowerCase()).includes(beastSource);
            return matchesName && matchesCR && matchesType && matchesSource;
        });
    }, [simpleBeasts, search, selectedCRs, selectedTypes, selectedSources, beasts]);

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