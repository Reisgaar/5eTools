import { useState, useMemo } from 'react';

/**
 * useSpellbookSearch hook.
 */
export default function useSpellbookSearch(spellbooks: any[]) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSpellbooks = useMemo(() => {
        if (!searchQuery.trim()) return spellbooks;

        return spellbooks.filter(spellbook =>
            spellbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (spellbook.description && spellbook.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [spellbooks, searchQuery]);

    return {
        searchQuery,
        setSearchQuery,
        filteredSpellbooks
    };
}
