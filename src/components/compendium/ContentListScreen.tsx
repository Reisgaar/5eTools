// REACT
import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// COMPONENTS
import { ListItem } from 'src/components/ui';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// HOOKS
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// UTILS
import { containsNormalized } from 'src/utils/stringUtils';
import { applySourceFilters } from 'src/utils/sourceFilter';

interface ContentListScreenProps {
    // The bundled entries to browse (each has at least name + source, and optional entries).
    items: any[];
    // Content category passed to the entry modal ('action' | 'feat' | 'background' | …).
    category: string;
    // For combined lists (e.g. cults + boons), derive the category per item; overrides `category`.
    categoryOf?: (item: any) => string;
    searchPlaceholder: string;
    // Optional secondary line shown under the name (e.g. a feat's category).
    getSubtitle?: (item: any) => string | undefined;
}

/**
 * Reusable searchable list for a single reference-content type. Rows open the shared
 * EntryDetailModal via openEntryModal(category, name, source).
 */
export default function ContentListScreen({ items, category, categoryOf, searchPlaceholder, getSubtitle }: ContentListScreenProps) {
    const { currentTheme, preferredEdition, ignoredSources } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { openEntryModal } = useModal();
    const [search, setSearch] = React.useState('');

    const ignoredSet = React.useMemo(() => new Set(ignoredSources), [ignoredSources]);

    const filtered = React.useMemo(() =>
        applySourceFilters(items, { preferredEdition, ignoredSources: ignoredSet })
            .filter(e => !search || containsNormalized(e.name, search))
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name)),
    [items, search, preferredEdition, ignoredSet]);

    const renderItem = React.useCallback(({ item }: { item: any }) => {
        const subtitle = getSubtitle?.(item);
        return (
            <ListItem
                onPress={() => openEntryModal(categoryOf ? categoryOf(item) : category, item.name, item.source)}
                title={
                    <Text style={[commonStyles.itemName, { color: currentTheme.text }]}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                            {subtitle ? `  ${subtitle}` : ''} ({item.source})
                        </Text>
                    </Text>
                }
            />
        );
    }, [openEntryModal, category, categoryOf, getSubtitle, currentTheme]);

    return (
        <View style={[commonStyles.container, styles.container, { backgroundColor: currentTheme.background }]}>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={searchPlaceholder}
                placeholderTextColor={currentTheme.noticeText}
                style={[commonStyles.input, styles.search, { color: currentTheme.text, borderColor: currentTheme.border }]}
            />

            <FlatList
                data={filtered}
                keyExtractor={(item, index) => `${item.source}|${item.name}|${index}`}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContent, { paddingBottom: tabInset }]}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                windowSize={11}
                removeClippedSubviews
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <Text style={[styles.empty, { color: currentTheme.noticeText }]}>No results.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: styleConstants.paddingSM },
    search: { marginBottom: styleConstants.marginSM },
    listContent: { paddingBottom: styleConstants.padding2XL + styleConstants.paddingSM },
    empty: { textAlign: 'center', marginTop: styleConstants.marginLG },
});
