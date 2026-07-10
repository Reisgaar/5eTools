// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// UTILS
import { formatItemType, formatValue, formatWeight } from 'src/utils/itemUtils';

interface ItemPickerModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    items: any[];
    onSelect: (item: any) => void;
}

const CAP = 60; // non-virtualized list — cap results and rely on search to narrow.

/** Searchable compendium-item picker. Returns the chosen item via onSelect. */
export default function ItemPickerModal({ visible, onClose, theme, items, onSelect }: ItemPickerModalProps) {
    const [query, setQuery] = React.useState('');

    React.useEffect(() => { if (visible) setQuery(''); }, [visible]);

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = q ? (items || []).filter(i => i.name?.toLowerCase().includes(q)) : (items || []);
        return base.slice(0, CAP);
    }, [items, query]);

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Add Item" scrollable={false}>
            <TextInput
                style={[styles.search, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                placeholder="Search items…"
                placeholderTextColor={theme.noticeText}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
            />
            <ScrollView style={{ maxHeight: 230 }} keyboardShouldPersistTaps="handled">
                {filtered.length === 0 ? (
                    <Text style={{ color: theme.noticeText, textAlign: 'center', padding: styleConstants.paddingLG }}>No items match.</Text>
                ) : (
                    filtered.map((item, i) => {
                        const meta = [formatItemType(item), formatWeight(item.weight), formatValue(item.value)].filter(Boolean).join(' · ');
                        return (
                            <TouchableOpacity
                                key={`${item.name}|${item.source}|${i}`}
                                activeOpacity={0.7}
                                onPress={() => { onSelect(item); onClose(); }}
                                style={[styles.row, { borderBottomColor: theme.border }]}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeMD }}>{item.name} <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeXS }}>({item.source})</Text></Text>
                                    {meta ? <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>{meta}</Text> : null}
                                </View>
                            </TouchableOpacity>
                        );
                    })
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
