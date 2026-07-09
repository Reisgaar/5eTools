// REACT
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore, useCampaignStore, usePlayerStore, useSpellbookStore } from 'src/stores';

// COMPONENTS
import { NavCard } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// Home dashboard: shows the active campaign and links out to the campaign-management screens.
export default function HomeScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const { campaigns, selectedCampaign } = useCampaignStore();
    const { players } = usePlayerStore();
    const { spellbooks } = useSpellbookStore();

    const playerCount = React.useMemo(() => {
        const id = selectedCampaign?.id;
        return id ? players.filter(p => p.campaignId === id).length : players.length;
    }, [players, selectedCampaign?.id]);

    const spellbookCount = React.useMemo(() => {
        const id = selectedCampaign?.id;
        return id ? spellbooks.filter(sb => sb.campaignId === id).length : spellbooks.length;
    }, [spellbooks, selectedCampaign?.id]);

    const cards: { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; href: string; color: string }[] = [
        { title: 'Campaigns', subtitle: `${campaigns.length} total`, icon: 'flag', href: '/home/campaigns', color: currentTheme.primary },
        { title: 'Players', subtitle: `${playerCount} ${selectedCampaign ? 'in campaign' : 'total'}`, icon: 'people', href: '/home/players', color: currentTheme.primary },
        { title: 'Spellbooks', subtitle: `${spellbookCount} ${selectedCampaign ? 'in campaign' : 'total'}`, icon: 'book', href: '/home/spellbooks', color: currentTheme.primary },
        { title: 'Library', subtitle: 'Books & adventures', icon: 'library', href: '/home/library', color: currentTheme.primary },
    ];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={[commonStyles.container, commonStyles.p_lg, { backgroundColor: currentTheme.background, flex: 1 }]}>
                {/* Management cards */}
                {cards.map(card => (
                    <NavCard
                        key={card.title}
                        title={card.title}
                        subtitle={card.subtitle}
                        icon={card.icon}
                        iconColor={card.color}
                        onPress={() => router.push(card.href as any)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}
