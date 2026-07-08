// REACT
import React from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore, useLibraryStore } from 'src/stores';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// DATA (indexes only — content is fetched on demand)
import { BOOKS_INDEX, ADVENTURES_INDEX } from 'src/data/bundledData';

// UTILS
import { docKey, LibraryType } from 'src/utils/libraryStorage';
import { containsNormalized } from 'src/utils/stringUtils';

const BOOKS: any[] = (() => { try { return BOOKS_INDEX().book || []; } catch { return []; } })();
const ADVENTURES: any[] = (() => { try { return ADVENTURES_INDEX().adventure || []; } catch { return []; } })();

export default function LibraryScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();
    const { downloaded, downloading, error, download, remove, clearError } = useLibraryStore();
    const [search, setSearch] = React.useState('');

    const sections = React.useMemo(() => {
        const filt = (arr: any[]) => arr.filter(x => !search || containsNormalized(x.name, search));
        return [
            { title: 'Books', type: 'book' as LibraryType, data: filt(BOOKS) },
            { title: 'Adventures', type: 'adventure' as LibraryType, data: filt(ADVENTURES) },
        ].filter(s => s.data.length > 0);
    }, [search]);

    const renderRow = (item: any, type: LibraryType) => {
        const key = docKey(type, item.id);
        const isDownloaded = downloaded.has(key);
        const isDownloading = downloading.has(key);

        return (
            <TouchableOpacity
                key={key}
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="chevron-forward" size={20} color={currentTheme.noticeText} />
                        <TouchableOpacity onPress={() => remove(type, item.id)} style={[styles.iconBtn, { backgroundColor: '#dc2626' }]}>
                            <Ionicons name="trash-outline" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => download(type, item.id)} style={[styles.iconBtn, { backgroundColor: currentTheme.primary }]}>
                        <Ionicons name="cloud-download-outline" size={18} color="white" />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: 8 }]}>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search books & adventures..."
                placeholderTextColor={currentTheme.noticeText}
                style={[commonStyles.input, { color: currentTheme.text, borderColor: currentTheme.primary, marginBottom: 8 }]}
            />

            {error ? (
                <TouchableOpacity onPress={clearError} style={[styles.errorBar, { borderColor: '#dc2626' }]}>
                    <Text style={{ color: '#dc2626', fontSize: 12 }}>{error} (tap to dismiss)</Text>
                </TouchableOpacity>
            ) : null}

            <SectionList
                sections={sections}
                keyExtractor={(item, idx) => `${item.id}-${idx}`}
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
    row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8, gap: 10 },
    name: { fontSize: 15, fontWeight: '600' },
    sub: { fontSize: 12, fontStyle: 'italic' },
    iconBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    sectionHeader: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, paddingVertical: 6, marginLeft: 4 },
    errorBar: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 },
});
