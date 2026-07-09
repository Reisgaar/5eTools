// REACT
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// CONTEXTS / STORES
import { useData } from 'src/context/DataContext';
import { useAppSettingsStore } from 'src/stores';

// DATA (indexes give friendly book/adventure names for anything the static map misses)
import { BOOKS_INDEX, ADVENTURES_INDEX } from 'src/data/bundledData';
import { SOURCE_NAMES } from 'src/constants/sourceNames';

// UTILS
import { containsNormalized } from 'src/utils/stringUtils';
import { EDITION_CORE_SOURCES } from 'src/utils/sourceFilter';

// Full source-code -> book name lookup: the authoritative 5etools map, supplemented by the
// bundled book/adventure indexes for any code it doesn't cover.
const NAME_BY_CODE: Record<string, string> = (() => {
    const map: Record<string, string> = { ...SOURCE_NAMES };
    try { for (const b of (BOOKS_INDEX().book || [])) if (b.id && !map[b.id]) map[b.id] = b.name; } catch { /* noop */ }
    try { for (const a of (ADVENTURES_INDEX().adventure || [])) if (a.id && !map[a.id]) map[a.id] = a.name; } catch { /* noop */ }
    return map;
})();

const nameForCode = (code: string): string =>
    NAME_BY_CODE[code] || NAME_BY_CODE[code.toUpperCase()] || code;

interface IgnoreSourcesModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
}

export default function IgnoreSourcesModal({ visible, onClose, theme }: IgnoreSourcesModalProps) {
    const { allSources } = useData();
    const { ignoredSources, toggleIgnoredSource } = useAppSettingsStore();
    const [search, setSearch] = React.useState('');
    const commonStyles = getCommonStyles(theme);

    const ignoredSet = React.useMemo(() => new Set(ignoredSources), [ignoredSources]);

    const rows = React.useMemo(() => {
        return allSources
            // The core rulebooks (PHB/DMG/MM + 2024 versions) are governed by the Rules Edition
            // setting, so they're not blocklistable here.
            .filter(code => !EDITION_CORE_SOURCES.has(code.toLowerCase()))
            .map(code => ({ code, name: nameForCode(code) }))
            .filter(r => !search || containsNormalized(r.name, search) || containsNormalized(r.code, search))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allSources, search]);

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Ignored Books" subtitle={`${ignoredSources.length} hidden`}>
            <Text style={[commonStyles.text_grey, commonStyles.text_sm, commonStyles.mb_sm]}>
                Hidden books are removed from every list (bestiary, spells, items…). Toggle a book to hide or show it.
            </Text>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search books..."
                placeholderTextColor={theme.noticeText}
                style={[commonStyles.bw_xs, commonStyles.br_md, commonStyles.text_primary, commonStyles.px_sm, commonStyles.py_xs, commonStyles.mb_sm, { borderColor: theme.primary }]}
            />
            {rows.map(row => {
                const ignored = ignoredSet.has(row.code.toLowerCase());
                return (
                    <TouchableOpacity
                        key={row.code}
                        onPress={() => toggleIgnoredSource(row.code)}
                        style={[{ flexDirection: 'row' }, commonStyles.ai_center, commonStyles.py_sm, commonStyles.bwb_xs, { borderBottomColor: theme.border }]}
                    >
                        <Ionicons
                            name={ignored ? 'eye-off' : 'eye'}
                            size={18}
                            color={ignored ? '#dc2626' : theme.primary}
                            style={{ width: 26 }}
                        />
                        <Text style={[commonStyles.text_sm, { flex: 1, color: ignored ? theme.noticeText : theme.text }]}>
                            {row.name} <Text style={[commonStyles.text_grey, commonStyles.text_xs]}>({row.code})</Text>
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </BaseModal>
    );
}
