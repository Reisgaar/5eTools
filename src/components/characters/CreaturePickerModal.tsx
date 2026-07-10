// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

interface CreaturePickerModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    beasts: any[];
    onSelect: (beast: any) => void;
}

const CAP = 60;

/** Searchable bestiary picker. Returns the chosen creature via onSelect. */
export default function CreaturePickerModal({ visible, onClose, theme, beasts, onSelect }: CreaturePickerModalProps) {
    const [query, setQuery] = React.useState('');

    React.useEffect(() => { if (visible) setQuery(''); }, [visible]);

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = q ? (beasts || []).filter(b => b.name?.toLowerCase().includes(q)) : (beasts || []);
        return base.slice(0, CAP);
    }, [beasts, query]);

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Add Creature" scrollable={false}>
            <TextInput
                style={[styles.search, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                placeholder="Search creatures…"
                placeholderTextColor={theme.noticeText}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
            />
            <ScrollView style={{ maxHeight: 230 }} keyboardShouldPersistTaps="handled">
                {filtered.length === 0 ? (
                    <Text style={{ color: theme.noticeText, textAlign: 'center', padding: styleConstants.paddingLG }}>No creatures match.</Text>
                ) : (
                    filtered.map((b, i) => (
                        <TouchableOpacity
                            key={`${b.name}|${b.source}|${i}`}
                            activeOpacity={0.7}
                            onPress={() => { onSelect(b); onClose(); }}
                            style={[styles.row, { borderBottomColor: theme.border }]}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeMD }}>{b.name} <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeXS }}>({b.source})</Text></Text>
                                <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>CR {String(b.CR)} · {b.type}</Text>
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
