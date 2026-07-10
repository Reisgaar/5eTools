// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// UTILS
import { formatLevel, getFullSchool } from 'src/utils/spellUtils';

interface SpellPickerModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    spells: any[];
    onSelect: (spell: any) => void;
}

const CAP = 60;

/** Searchable compendium-spell picker. Returns the chosen spell via onSelect. */
export default function SpellPickerModal({ visible, onClose, theme, spells, onSelect }: SpellPickerModalProps) {
    const [query, setQuery] = React.useState('');

    React.useEffect(() => { if (visible) setQuery(''); }, [visible]);

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = q ? (spells || []).filter(s => s.name?.toLowerCase().includes(q)) : (spells || []);
        return [...base].sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name)).slice(0, CAP);
    }, [spells, query]);

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Add Spell" scrollable={false}>
            <TextInput
                style={[styles.search, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                placeholder="Search spells…"
                placeholderTextColor={theme.noticeText}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
            />
            <ScrollView style={{ maxHeight: 230 }} keyboardShouldPersistTaps="handled">
                {filtered.length === 0 ? (
                    <Text style={{ color: theme.noticeText, textAlign: 'center', padding: styleConstants.paddingLG }}>No spells match.</Text>
                ) : (
                    filtered.map((spell, i) => (
                        <TouchableOpacity
                            key={`${spell.name}|${spell.source}|${i}`}
                            activeOpacity={0.7}
                            onPress={() => { onSelect(spell); onClose(); }}
                            style={[styles.row, { borderBottomColor: theme.border }]}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeMD }}>{spell.name} <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeXS }}>({spell.source})</Text></Text>
                                <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>{formatLevel(spell.level)} · {getFullSchool(spell.school)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
            <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeXS, textAlign: 'center', marginTop: styleConstants.marginXS }}>
                {query ? `${filtered.length}${filtered.length === CAP ? '+' : ''} result${filtered.length === 1 ? '' : 's'}` : `Showing first ${filtered.length} — search to narrow`}
            </Text>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    search: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusLG,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM,
        fontSize: styleConstants.fontSizeMD,
        marginBottom: styleConstants.marginSM,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingSM,
        borderBottomWidth: styleConstants.borderXS,
    },
});
