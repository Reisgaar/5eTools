// REACT
import { useMemo, useState } from 'react';

// UTILS
import { containsNormalized } from 'src/utils/stringUtils';

// CONSTANTS
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
    const key = school.charAt(0).toUpperCase();
    return SCHOOL_MAP[key] || school;
}

function extractSpellClasses(spell: any, spellSourceLookup: any): string[] {
    const allClasses = new Set<string>();

    // First try to get classes from the spell source lookup
    if (spellSourceLookup && spell.source && spellSourceLookup[spell.source]) {
        const sourceData = spellSourceLookup[spell.source];
        if (sourceData[spell.name] && sourceData[spell.name].class) {
            Object.values(sourceData[spell.name].class).forEach((bookData: any) => {
                if (typeof bookData === 'object') {
                    Object.keys(bookData).forEach((className: string) => {
                        if (bookData[className]) {
                            allClasses.add(className);
                        }
                    });
                }
            });
        }
    }

    // Fallback to spell.classes if available
    if (spell.classes) {
        if (typeof spell.classes === 'object') {
            Object.keys(spell.classes).forEach((className: string) => allClasses.add(className));
        } else if (Array.isArray(spell.classes)) {
            spell.classes.forEach((className: string) => allClasses.add(className));
        }
    }

    return Array.from(allClasses);
}

export function useSpellFilters(simpleSpells: any[], spells: any[], spellSourceLookup: any, availableClasses: string[]) {
    // Search and filter states
    const [search, setSearch] = useState('');
    const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedOthers, setSelectedOthers] = useState<string[]>([]); // For ritual, concentration, etc.

    // Pending (modal) filter states
    const [pendingSchools, setPendingSchools] = useState<string[]>([]);
    const [pendingClasses, setPendingClasses] = useState<string[]>([]);
    const [pendingOthers, setPendingOthers] = useState<string[]>([]);
    const [filterApplying, setFilterApplying] = useState(false);
    const [schoolFilterModalVisible, setSchoolFilterModalVisible] = useState(false);
    const [classFilterModalVisible, setClassFilterModalVisible] = useState(false);
    const [otherFilterModalVisible, setOtherFilterModalVisible] = useState(false);

    // Get unique schools for filter modal
    const schoolOptions = useMemo(() => {
        const schools = Array.from(new Set(simpleSpells.map(spell => getFullSchool(spell.school)))).filter(Boolean).sort();
        return schools;
    }, [simpleSpells]);

    // Get unique classes for filter modal
    const classOptions = useMemo(() => {
        // Use the available classes from the context, which are already processed and sorted
        return availableClasses;
    }, [availableClasses]);

    // Get other filter options
    const otherOptions = useMemo(() => {
        return [
            { label: 'Ritual', value: 'ritual' },
            { label: 'Concentration', value: 'concentration' }
        ];
    }, []);

    // Clear all filters
    const clearAllFilters = () => {
        setSearch('');
        setSelectedSchools([]);
        setSelectedClasses([]);
        setSelectedOthers([]);
    };

    // Check if any filters are active
    const hasActiveFilters = search !== '' || selectedSchools.length > 0 || selectedClasses.length > 0 || selectedOthers.length > 0;

    // Filtered list
    const filteredSpells = useMemo(() => {
        return simpleSpells.filter(spell => {
            const matchesName = containsNormalized(spell.name, search);
            const spellSchool = getFullSchool(spell.school);
            const matchesSchool = selectedSchools.length === 0 || selectedSchools.includes(spellSchool);

            // For class filtering, we check the available classes directly on the spell
            let matchesClass = true;
            if (selectedClasses.length > 0) {
                // Use the availableClasses property that was added to each spell
                const spellClasses = spell.availableClasses || [];
                // Check if any of the selected classes is in the spell's available classes
                matchesClass = selectedClasses.some(selectedClass =>
                    spellClasses.includes(selectedClass)
                );
            }

            // For other filters (ritual, concentration)
            let matchesOthers = true;
            if (selectedOthers.length > 0) {
                matchesOthers = selectedOthers.every(filterType => {
                    switch (filterType) {
                        case 'ritual':
                            return spell.ritual === true;
                        case 'concentration':
                            return spell.concentration === true;
                        default:
                            return true;
                    }
                });
            }

            return matchesName && matchesSchool && matchesClass && matchesOthers;
        });
    }, [simpleSpells, spells, spellSourceLookup, search, selectedSchools, selectedClasses, selectedOthers]);

    // Modal handlers
    // Modal handlers
    const openSchoolFilterModal = () => {
        setPendingSchools([...selectedSchools]);
        setSchoolFilterModalVisible(true);
    };

    const openClassFilterModal = () => {
        setPendingClasses([...selectedClasses]);
        setClassFilterModalVisible(true);
    };

    const openOtherFilterModal = () => {
        setPendingOthers([...selectedOthers]);
        setOtherFilterModalVisible(true);
    };

    // School Filter Modal handlers
    const togglePendingSchool = (school: string) => {
        setPendingSchools(prev =>
            prev.includes(school) ? prev.filter(s => s !== school) : [...prev, school]
        );
    };

    const selectAllPendingSchools = () => {
        if (pendingSchools.length < schoolOptions.length) {
            setPendingSchools([...schoolOptions]);
        } else {
            setPendingSchools([]);
        }
    };

    const applySchoolFilter = () => {
        setSchoolFilterModalVisible(false);
        setFilterApplying(true);
        setTimeout(() => {
            setSelectedSchools(pendingSchools);
            setFilterApplying(false);
        }, 200);
    };

    // Class Filter Modal handlers
    const togglePendingClass = (className: string) => {
        setPendingClasses(prev =>
            prev.includes(className) ? prev.filter(c => c !== className) : [...prev, className]
        );
    };

    const selectAllPendingClasses = () => {
        if (pendingClasses.length < classOptions.length) {
            setPendingClasses([...classOptions]);
        } else {
            setPendingClasses([]);
        }
    };

    const applyClassFilter = () => {
        setClassFilterModalVisible(false);
        setFilterApplying(true);
        setTimeout(() => {
            setSelectedClasses(pendingClasses);
            setFilterApplying(false);
        }, 200);
    };

    // Other Filter Modal handlers
    const togglePendingOther = (otherType: string) => {
        setPendingOthers(prev =>
            prev.includes(otherType) ? prev.filter(o => o !== otherType) : [...prev, otherType]
        );
    };

    const selectAllPendingOthers = () => {
        if (pendingOthers.length < otherOptions.length) {
            setPendingOthers(otherOptions.map(o => o.value));
        } else {
            setPendingOthers([]);
        }
    };

    const applyOtherFilter = () => {
        setOtherFilterModalVisible(false);
        setFilterApplying(true);
        setTimeout(() => {
            setSelectedOthers(pendingOthers);
            setFilterApplying(false);
        }, 200);
    };

    // Helper functions to get display text for selected filters
    const getSchoolFilterText = () => {
        if (selectedSchools.length === 0) return 'School';
        if (selectedSchools.length === 1) return `School: ${selectedSchools[0]}`;
        if (selectedSchools.length <= 3) return `School: ${selectedSchools.join(', ')}`;
        return `School: ${selectedSchools.length} selected`;
    };

    const getClassFilterText = () => {
        if (selectedClasses.length === 0) return 'Class';
        if (selectedClasses.length === 1) return `Class: ${selectedClasses[0]}`;
        if (selectedClasses.length <= 3) return `Class: ${selectedClasses.join(', ')}`;
        return `Class: ${selectedClasses.length} selected`;
    };

    // Function to get other filter text
    const getOtherFilterText = () => {
        if (selectedOthers.length === 0) return 'Other';
        if (selectedOthers.length === 1) {
            const option = otherOptions.find(o => o.value === selectedOthers[0]);
            return `Other: ${option?.label || selectedOthers[0]}`;
        }
        if (selectedOthers.length <= 2) {
            const labels = selectedOthers.map(value => {
                const option = otherOptions.find(o => o.value === value);
                return option?.label || value;
            });
            return `Other: ${labels.join(', ')}`;
        }
        return `Other: ${selectedOthers.length} selected`;
    };

    // Function to generate filter summary
    const getFilterSummary = (): string[] => {
        const summary: string[] = [];

        if (search) {
            summary.push(`Search: "${search}"`);
        }

        if (selectedSchools.length > 0) {
            summary.push(`School: ${selectedSchools.join(', ')}`);
        }

        if (selectedClasses.length > 0) {
            summary.push(`Class: ${selectedClasses.join(', ')}`);
        }

        if (selectedOthers.length > 0) {
            const labels = selectedOthers.map(value => {
                const option = otherOptions.find(o => o.value === value);
                return option?.label || value;
            });
            summary.push(`Type: ${labels.join(', ')}`);
        }

        return summary;
    };

    return {
        search,
        setSearch,
        selectedSchools,
        setSelectedSchools,
        selectedClasses,
        setSelectedClasses,
        selectedOthers,
        setSelectedOthers,
        pendingSchools,
        setPendingSchools,
        pendingClasses,
        setPendingClasses,
        pendingOthers,
        setPendingOthers,
        filterApplying,
        setFilterApplying,
        schoolFilterModalVisible,
        setSchoolFilterModalVisible,
        classFilterModalVisible,
        setClassFilterModalVisible,
        otherFilterModalVisible,
        setOtherFilterModalVisible,
        schoolOptions,
        classOptions,
        otherOptions,
        filteredSpells,
        openSchoolFilterModal,
        openClassFilterModal,
        openOtherFilterModal,
        togglePendingSchool,
        selectAllPendingSchools,
        applySchoolFilter,
        togglePendingClass,
        selectAllPendingClasses,
        applyClassFilter,
        togglePendingOther,
        selectAllPendingOthers,
        applyOtherFilter,
        getSchoolFilterText,
        getClassFilterText,
        getOtherFilterText,
        getFullSchool,
        clearAllFilters,
        hasActiveFilters,
        getFilterSummary
    };
}
