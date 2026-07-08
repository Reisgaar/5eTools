// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore } from 'src/stores';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

interface CompendiumEntry {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    href: string;
}

interface CompendiumSection {
    title: string;
    entries: CompendiumEntry[];
}

// The Compendium hub: content types grouped into sections. Each drills into its own screen
// (back-stacked), so adding new content types never needs a new tab.
export default function CompendiumScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();

    const sections: CompendiumSection[] = [
        {
            title: 'Reference',
            entries: [
                { title: 'Bestiary', subtitle: 'Monsters & NPCs', icon: 'paw', href: '/compendium/bestiary' },
                { title: 'Spells', subtitle: 'Spell reference', icon: 'sparkles', href: '/compendium/spells' },
                { title: 'Items', subtitle: 'Equipment & magic items', icon: 'cube', href: '/compendium/items' },
            ],
        },
        {
            title: 'Rules',
            entries: [
                { title: 'Rules Glossary', subtitle: 'Rules & variant rules', icon: 'book', href: '/compendium/rules-glossary' },
                { title: 'Actions', subtitle: 'Combat & general actions', icon: 'flash', href: '/compendium/actions' },
                { title: 'Conditions & Diseases', subtitle: 'Conditions, diseases, statuses', icon: 'medkit', href: '/compendium/conditions' },
            ],
        },
        {
            title: 'Character',
            entries: [
                { title: 'Races', subtitle: 'Species & subraces', icon: 'people', href: '/compendium/races' },
                { title: 'Classes', subtitle: 'Classes & features', icon: 'shield', href: '/compendium/classes' },
                { title: 'Backgrounds', subtitle: 'Character backgrounds', icon: 'person-circle', href: '/compendium/backgrounds' },
                { title: 'Feats', subtitle: 'Character feats', icon: 'ribbon', href: '/compendium/feats' },
            ],
        },
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={[commonStyles.container, { padding: 16, backgroundColor: currentTheme.background, flex: 1 }]}>
                {sections.map(section => (
                    <View key={section.title} style={{ marginBottom: 8 }}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.noticeText }]}>{section.title}</Text>
                        {section.entries.map(entry => (
                            <TouchableOpacity
                                key={entry.title}
                                onPress={() => router.push(entry.href as any)}
                                style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.cardIcon, { backgroundColor: currentTheme.primary }]}>
                                    <Ionicons name={entry.icon} size={22} color="white" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: currentTheme.text }}>{entry.title}</Text>
                                    <Text style={{ fontSize: 12, color: currentTheme.noticeText }}>{entry.subtitle}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={currentTheme.noticeText} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        gap: 14,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
