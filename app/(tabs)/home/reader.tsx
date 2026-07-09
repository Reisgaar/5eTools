// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { useLocalSearchParams } from 'expo-router';

// STORES / CONTEXTS
import { useAppSettingsStore, useLibraryStore } from 'src/stores';
import { useModal } from 'src/context/ModalContext';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// UTILS
import { renderEntries } from 'src/utils/replaceTags';
import { LibraryType } from 'src/utils/libraryStorage';

export default function ReaderScreen() {
    const { type, id } = useLocalSearchParams<{ type: LibraryType; id: string }>();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const { getDocument } = useLibraryStore();
    const { openEntryModal, openBeastModal, openSpellModal } = useModal();

    const [doc, setDoc] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [chapter, setChapter] = React.useState<number | null>(null);

    React.useEffect(() => {
        let alive = true;
        setLoading(true);
        getDocument(type as LibraryType, String(id)).then(d => {
            if (alive) { setDoc(d); setLoading(false); }
        });
        return () => { alive = false; };
    }, [type, id, getDocument]);

    const chapters: any[] = doc?.data || [];

    if (loading) {
        return (
            <View style={[commonStyles.container, styles.center, { backgroundColor: currentTheme.background }]}>
                <ActivityIndicator size="large" color={currentTheme.primary} />
            </View>
        );
    }

    if (!doc || chapters.length === 0) {
        return (
            <View style={[commonStyles.container, styles.center, { backgroundColor: currentTheme.background }]}>
                <Text style={{ color: currentTheme.noticeText, textAlign: 'center', paddingHorizontal: 24 }}>
                    Could not load this document. Try re-downloading it from the Library.
                </Text>
            </View>
        );
    }

    // Chapter list
    if (chapter === null) {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: currentTheme.background }} contentContainerStyle={commonStyles.p_md}>
                {chapters.map((ch, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => setChapter(i)}
                        style={[styles.chapterRow, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
                        activeOpacity={0.7}
                    >
                        <Text style={{ color: currentTheme.text, fontSize: styleConstants.fontSizeMD, fontWeight: '600', flex: 1 }}>
                            {ch.name || `Chapter ${i + 1}`}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={currentTheme.noticeText} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }

    // Selected chapter content
    const ch = chapters[chapter];
    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <TouchableOpacity
                onPress={() => setChapter(null)}
                style={[styles.backBar, { borderBottomColor: currentTheme.primary }]}
            >
                <Ionicons name="list" size={18} color={currentTheme.primary} />
                <Text style={{ color: currentTheme.primary, fontWeight: 'bold', marginLeft: styleConstants.marginXS }}>All chapters</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ padding: styleConstants.paddingMD, paddingBottom: 40 }}>
                <Text style={{ color: currentTheme.text, fontSize: styleConstants.fontSizeXL, fontWeight: 'bold', marginBottom: styleConstants.marginSM }}>
                    {ch.name || `Chapter ${chapter + 1}`}
                </Text>
                {renderEntries(
                    ch.entries,
                    0,
                    currentTheme,
                    (name, source) => openBeastModal({ name, source }),
                    (name, source) => openSpellModal({ name, source }),
                    {},
                    undefined,
                    undefined,
                    (cat, name, source) => openEntryModal(cat, name, source)
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    chapterRow: { flexDirection: 'row', alignItems: 'center', borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, padding: styleConstants.paddingMD, marginBottom: styleConstants.marginSM },
    backBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: styleConstants.paddingMD, paddingVertical: styleConstants.paddingSM, borderBottomWidth: styleConstants.borderXS },
});
