import { useMemo, useState } from 'react';
import { normalizeString, containsNormalized, includesNormalized } from 'src/utils/stringUtils';

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
    
    // Pending (modal) filter states
    const [pendingSchools, setPendingSchools] = useState<string[]>([]);
    const [pendingClasses, setPendingClasses] = useState<string[]>([]);
    const [filterApplying, setFilterApplying] = useState(false);
    const [schoolFilterModalVisible, setSchoolFilterModalVisible] = useState(false);
    const [classFilterModalVisible, setClassFilterModalVisible] = useState(false);

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
            
            return matchesName && matchesSchool && matchesClass;
        });
    }, [simpleSpells, spells, spellSourceLookup, search, selectedSchools, selectedClasses]);

    // Modal handlers
    const openSchoolFilterModal = () => {
        setPendingSchools(selectedSchools);
        setSchoolFilterModalVisible(true);
    };
    
    const openClassFilterModal = () => {
        setPendingClasses(selectedClasses);
        setClassFilterModalVisible(true);
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

    return {
        search,
        setSearch,
        selectedSchools,
        setSelectedSchools,
        selectedClasses,
        setSelectedClasses,
        pendingSchools,
        setPendingSchools,
        pendingClasses,
        setPendingClasses,
        filterApplying,
        setFilterApplying,
        schoolFilterModalVisible,
        setSchoolFilterModalVisible,
        classFilterModalVisible,
        setClassFilterModalVisible,
        schoolOptions,
        classOptions,
        filteredSpells,
        getSchoolFilterText,
        getClassFilterText,
        openSchoolFilterModal,
        openClassFilterModal,
        togglePendingSchool,
        selectAllPendingSchools,
        applySchoolFilter,
        togglePendingClass,
        selectAllPendingClasses,
        applyClassFilter,
        getFullSchool
    };
}
