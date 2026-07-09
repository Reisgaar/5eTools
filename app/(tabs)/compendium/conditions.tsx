// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// UTILS
import { containsNormalized } from 'src/utils/stringUtils';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// Browser for conditions, diseases & statuses. Tapping a row opens the shared condition modal.
export default function ConditionsScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
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
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: styleConstants.paddingSM }]}>
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search conditions & diseases..."
                placeholderTextColor={currentTheme.noticeText}
                style={[commonStyles.input, { color: currentTheme.text, borderColor: currentTheme.border, marginBottom: styleConstants.marginSM }]}
            />

            {isLoading && totalCount === 0 ? (
                <Text style={{ color: currentTheme.noticeText, textAlign: 'center', marginTop: styleConstants.marginLG }}>Loading…</Text>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: tabInset }}>
                    {sections.length === 0 ? (
                        <Text style={{ color: currentTheme.noticeText, textAlign: 'center', marginTop: styleConstants.marginLG }}>No results.</Text>
                    ) : (
                        sections.map(section => (
                            <View key={section.title} style={commonStyles.mb_md}>
                                <Text style={[styles.sectionTitle, { color: currentTheme.noticeText }]}>{section.title}</Text>
                                {section.data.map((item: any, idx: number) => (
                                    <TouchableOpacity
                                        key={`${item.source}|${item.name}|${idx}`}
                                        onPress={() => openEntryModal(section.category, item.name, item.source)}
                                        style={[commonStyles.itemCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}
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
        fontSize: styleConstants.fontSizeSM,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: styleConstants.marginXS,
        marginLeft: styleConstants.marginXS,
    },
});
