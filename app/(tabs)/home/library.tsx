// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ActivityIndicator, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore, useLibraryStore } from 'src/stores';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// DATA (indexes only — content is fetched on demand)
import { BOOKS_INDEX, ADVENTURES_INDEX } from 'src/data/bundledData';
import DOWNLOAD_SIZES from 'src/data/downloadSizes.json';

// UTILS
import { docKey, LibraryType } from 'src/utils/libraryStorage';
import { containsNormalized } from 'src/utils/stringUtils';

const BOOKS: any[] = (() => { try { return BOOKS_INDEX().book || []; } catch { return []; } })();
const ADVENTURES: any[] = (() => { try { return ADVENTURES_INDEX().adventure || []; } catch { return []; } })();

const SIZES: Record<string, number> = DOWNLOAD_SIZES as any;

// Book groups, in display order. "screen" (DM screens) is intentionally excluded from the
// library, and any book without a recognised group falls into "other".
const GROUP_ORDER = ['core', 'supplement', 'supplement-alt', 'setting', 'setting-alt', 'organized-play', 'recipe', 'homecraft', 'other'];
const GROUP_TITLES: Record<string, string> = {
    core: 'Core Rulebooks',
    setting: 'Settings',
    'setting-alt': 'Alternate Settings',
    supplement: 'Supplements',
    'supplement-alt': 'Alternate Supplements',
    'organized-play': 'Organized Play',
    recipe: 'Recipes',
    homecraft: 'Homecraft',
    other: 'Other',
};
const normGroup = (g?: string): string => (g && GROUP_ORDER.includes(g) ? g : 'other');

const formatBytes = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function LibraryScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const { downloaded, downloading, error, download, remove, clearError } = useLibraryStore();
    const [search, setSearch] = React.useState('');

    const sections = React.useMemo(() => {
        const matches = (x: any) => !search || containsNormalized(x.name, search);
        const books = BOOKS.filter(b => b.group !== 'screen').filter(matches);
        const advs = ADVENTURES.filter(matches);
        const isDown = (type: LibraryType, id: string) => downloaded.has(docKey(type, id));
        const byName = (a: any, b: any) => a.name.localeCompare(b.name);

        const result: { title: string; type: LibraryType | 'mixed'; data: any[] }[] = [];

        // Downloaded first, for quick access (books + adventures together).
        const downloadedItems = [
            ...books.filter(b => isDown('book', b.id)).map(b => ({ ...b, __type: 'book' as LibraryType })),
            ...advs.filter(a => isDown('adventure', a.id)).map(a => ({ ...a, __type: 'adventure' as LibraryType })),
        ].sort(byName);
        if (downloadedItems.length) result.push({ title: 'Downloaded', type: 'mixed', data: downloadedItems });

        // Available books, grouped and ordered.
        const availBooks = books.filter(b => !isDown('book', b.id));
        const byGroup: Record<string, any[]> = {};
        for (const b of availBooks) (byGroup[normGroup(b.group)] ||= []).push(b);
        for (const g of GROUP_ORDER) {
            if (byGroup[g]?.length) result.push({ title: GROUP_TITLES[g], type: 'book', data: byGroup[g].sort(byName) });
        }

        // Available adventures.
        const availAdvs = advs.filter(a => !isDown('adventure', a.id)).sort(byName);
        if (availAdvs.length) result.push({ title: 'Adventures', type: 'adventure', data: availAdvs });

        return result;
    }, [search, downloaded]);

    const renderRow = (item: any, sectionType: LibraryType | 'mixed') => {
        const type: LibraryType = item.__type || (sectionType as LibraryType);
        const key = docKey(type, item.id);
        const isDownloaded = downloaded.has(key);
        const isDownloading = downloading.has(key);
        const size = formatBytes(SIZES[key]);

        return (
            <TouchableOpacity
                activeOpacity={isDownloaded ? 0.7 : 1}
                onPress={() => { if (isDownloaded) router.push({ pathname: '/home/reader', params: { type, id: item.id } } as any); }}
                style={[styles.row, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
            >
                <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: currentTheme.text }]}>{item.name}</Text>
                    <Text style={[styles.sub, { color: currentTheme.noticeText }]}>
                        {[item.source, item.published ? String(item.published).slice(0, 4) : null].filter(Boolean).join(' • ')}
                    </Text>
                </View>

                {isDownloading ? (
                    <ActivityIndicator color={currentTheme.primary} style={{ width: 40 }} />
                ) : isDownloaded ? (
                    <View style={[commonStyles.row_start_center, commonStyles.gap_sm]}>
                        <Ionicons name="chevron-forward" size={20} color={currentTheme.noticeText} />
                        <TouchableOpacity onPress={() => remove(type, item.id)} style={[styles.iconBtn, { backgroundColor: '#dc2626' }]}>
                            <Ionicons name="trash-outline" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={commonStyles.ai_center}>
                        <TouchableOpacity onPress={() => download(type, item.id)} style={[styles.iconBtn, { backgroundColor: currentTheme.primary }]}>
                            <Ionicons name="cloud-download-outline" size={18} color="white" />
                        </TouchableOpacity>
                        {size ? <Text style={[styles.size, { color: currentTheme.noticeText }]}>{size}</Text> : null}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: styleConstants.paddingSM }]}>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search books & adventures..."
                placeholderTextColor={currentTheme.noticeText}
                style={[commonStyles.input, { color: currentTheme.text, borderColor: currentTheme.primary, marginBottom: styleConstants.marginSM }]}
            />

            {error ? (
                <TouchableOpacity onPress={clearError} style={[styles.errorBar, { borderColor: '#dc2626' }]}>
                    <Text style={{ color: '#dc2626', fontSize: styleConstants.fontSizeSM }}>{error} (tap to dismiss)</Text>
                </TouchableOpacity>
            ) : null}

            <SectionList
                sections={sections}
                keyExtractor={(item, idx) => `${item.__type || 'x'}-${item.id}-${item.source}-${idx}`}
                renderItem={({ item, section }) => renderRow(item, (section as any).type)}
                renderSectionHeader={({ section }) => (
                    <Text style={[styles.sectionHeader, { color: currentTheme.noticeText, backgroundColor: currentTheme.background }]}>
                        {section.title}
                    </Text>
                )}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                initialNumToRender={12}
                windowSize={11}
                removeClippedSubviews
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, padding: styleConstants.paddingMD, marginBottom: styleConstants.marginSM, gap: styleConstants.gapSM },
    name: { fontSize: styleConstants.fontSizeMD, fontWeight: '600' },
    sub: { fontSize: styleConstants.fontSizeSM, fontStyle: 'italic' },
    iconBtn: { width: 32, height: 32, borderRadius: styleConstants.borderRadiusXL, alignItems: 'center', justifyContent: 'center' },
    size: { fontSize: styleConstants.fontSizeXS, marginTop: styleConstants.margin2XS },
    sectionHeader: { fontSize: styleConstants.fontSizeSM, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, paddingVertical: styleConstants.paddingXS, marginLeft: styleConstants.marginXS },
    errorBar: { borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, padding: styleConstants.paddingSM, marginBottom: styleConstants.marginSM },
});
