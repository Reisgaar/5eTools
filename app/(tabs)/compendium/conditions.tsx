// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// UTILS
import { containsNormalized } from 'src/utils/stringUtils';

// Browser for conditions, diseases & statuses. Tapping a row opens the shared condition modal.
export default function ConditionsScreen() {
    const { currentTheme } = useAppSettingsStore();
    const { conditions, diseases, statuses, isLoading } = useData();
    const { openEntryModal } = useModal();

    const [search, setSearch] = React.useState('');

    const sections = React.useMemo(() => {
        const match = (arr: any[]) =>
            arr
                .filter(e => !search || containsNormalized(e.name, search))
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name));
        return [
            { title: 'Conditions', category: 'condition', data: match(conditions) },
            { title: 'Diseases', category: 'disease', data: match(diseases) },
            { title: 'Statuses', category: 'status', data: match(statuses) },
        ].filter(s => s.data.length > 0);
    }, [conditions, diseases, statuses, search]);

    const totalCount = conditions.length + diseases.length + statuses.length;

    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: 8 }]}>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search conditions & diseases..."
                placeholderTextColor={currentTheme.noticeText}
                style={[commonStyles.input, { color: currentTheme.text, borderColor: currentTheme.primary, marginBottom: 8 }]}
            />

            {isLoading && totalCount === 0 ? (
                <Text style={{ color: currentTheme.noticeText, textAlign: 'center', marginTop: 16 }}>Loading…</Text>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    {sections.length === 0 ? (
                        <Text style={{ color: currentTheme.noticeText, textAlign: 'center', marginTop: 16 }}>No results.</Text>
                    ) : (
                        sections.map(section => (
                            <View key={section.title} style={{ marginBottom: 12 }}>
                                <Text style={[styles.sectionTitle, { color: currentTheme.noticeText }]}>{section.title}</Text>
                                {section.data.map((item: any) => (
                                    <TouchableOpacity
                                        key={`${item.name}|${item.source}`}
                                        onPress={() => openEntryModal(section.category, item.name, item.source)}
                                        style={[commonStyles.itemCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
                                        activeOpacity={0.7}
                                    >
                                        <View style={commonStyles.itemInfoContainer}>
                                            <Text style={[commonStyles.itemName, { color: currentTheme.text }]}>
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}> ({item.source})</Text>
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        marginLeft: 4,
    },
});
