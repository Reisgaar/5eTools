// REACT
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore } from 'src/stores';

// COMPONENTS
import { NavCard, SegmentedControl } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// HOOKS
import { useTabBarInset } from 'src/hooks/useTabBarInset';

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
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();

    const sections: CompendiumSection[] = [
        {
            title: 'Reference',
            entries: [
                { title: 'Bestiary', subtitle: 'Monsters & NPCs', icon: 'paw', href: '/compendium/bestiary' },
                { title: 'Spells', subtitle: 'Spell reference', icon: 'sparkles', href: '/compendium/spells' },
                { title: 'Items', subtitle: 'Equipment & magic items', icon: 'cube', href: '/compendium/items' },
                { title: 'Vehicles', subtitle: 'Ships, mounts & upgrades', icon: 'boat', href: '/compendium/vehicles' },
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
                { title: 'Optional Features', subtitle: 'Invocations, maneuvers…', icon: 'options', href: '/compendium/optional-features' },
                { title: 'Character Options', subtitle: 'Other creation options', icon: 'construct', href: '/compendium/char-options' },
                { title: 'Senses', subtitle: 'Darkvision, tremorsense…', icon: 'eye', href: '/compendium/senses' },
                { title: 'Skills', subtitle: 'Skill reference', icon: 'school', href: '/compendium/skills' },
                { title: 'Psionics', subtitle: 'Disciplines & talents', icon: 'pulse', href: '/compendium/psionics' },
            ],
        },
        {
            title: 'World',
            entries: [
                { title: 'Deities', subtitle: 'Gods & pantheons', icon: 'planet', href: '/compendium/deities' },
                { title: 'Cults & Boons', subtitle: 'Cults & demonic boons', icon: 'flame', href: '/compendium/cults-boons' },
                { title: 'Rewards', subtitle: 'Gifts, blessings, charms', icon: 'gift', href: '/compendium/rewards' },
                { title: 'Traps & Hazards', subtitle: 'Environmental dangers', icon: 'warning', href: '/compendium/traps-hazards' },
                { title: 'Languages', subtitle: 'Languages & scripts', icon: 'chatbubbles', href: '/compendium/languages' },
                { title: 'Bastions', subtitle: 'Bastion facilities', icon: 'home', href: '/compendium/bastions' },
                { title: 'Objects', subtitle: 'Siege & environmental objects', icon: 'cube-outline', href: '/compendium/objects' },
            ],
        },
    ];

    const [activeSection, setActiveSection] = React.useState(sections[0].title);
    const current = sections.find(s => s.title === activeSection) ?? sections[0];

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={{ paddingHorizontal: styleConstants.paddingLG, paddingTop: styleConstants.paddingMD }}>
                <SegmentedControl
                    options={sections.map(s => ({ key: s.title, label: s.title }))}
                    value={activeSection}
                    onChange={setActiveSection}
                />
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: tabInset }}>
                <View style={[commonStyles.container, commonStyles.p_lg, { backgroundColor: currentTheme.background }]}>
                    {current.entries.map(entry => (
                        <NavCard
                            key={entry.title}
                            title={entry.title}
                            subtitle={entry.subtitle}
                            icon={entry.icon}
                            onPress={() => router.push(entry.href as any)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
