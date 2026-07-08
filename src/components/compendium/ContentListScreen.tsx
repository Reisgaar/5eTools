// REACT
import React from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// UTILS
import { containsNormalized } from 'src/utils/stringUtils';

interface ContentListScreenProps {
    // The bundled entries to browse (each has at least name + source, and optional entries).
    items: any[];
    // Content category passed to the entry modal ('action' | 'feat' | 'background' | …).
    category: string;
    searchPlaceholder: string;
    // Optional secondary line shown under the name (e.g. a feat's category).
    getSubtitle?: (item: any) => string | undefined;
}

/**
 * Reusable searchable list for a single reference-content type. Rows open the shared
 * EntryDetailModal via openEntryModal(category, name, source).
 */
export default function ContentListScreen({ items, category, searchPlaceholder, getSubtitle }: ContentListScreenProps) {
    const { currentTheme } = useAppSettingsStore();
    const { openEntryModal } = useModal();
    const [search, setSearch] = React.useState('');

    const filtered = React.useMemo(() =>
        items
            .filter(e => !search || containsNormalized(e.name, search))
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name)),
    [items, search]);

    const renderItem = React.useCallback(({ item }: { item: any }) => {
        const subtitle = getSubtitle?.(item);
        return (
            <TouchableOpacity
                onPress={() => openEntryModal(category, item.name, item.source)}
                style={[commonStyles.itemCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
                activeOpacity={0.7}
            >
                <View style={commonStyles.itemInfoContainer}>
                    <Text style={[commonStyles.itemName, { color: currentTheme.text }]}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                            {subtitle ? `  ${subtitle}` : ''} ({item.source})
                        </Text>
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }, [openEntryModal, category, getSubtitle, currentTheme]);

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: 8 }]}>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={searchPlaceholder}
                placeholderTextColor={currentTheme.noticeText}
                style={[commonStyles.input, { color: currentTheme.text, borderColor: currentTheme.primary, marginBottom: 8 }]}
            />

            <FlatList
                data={filtered}
                keyExtractor={(item) => `${item.name}|${item.source}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                windowSize={11}
                removeClippedSubviews
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <Text style={{ color: currentTheme.noticeText, textAlign: 'center', marginTop: 16 }}>No results.</Text>
                }
            />
        </View>
    );
}
