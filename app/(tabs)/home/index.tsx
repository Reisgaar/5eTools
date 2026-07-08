// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore, useCampaignStore, usePlayerStore, useSpellbookStore } from 'src/stores';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// Home dashboard: shows the active campaign and links out to the campaign-management screens.
export default function HomeScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();
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
            <View style={[commonStyles.container, { padding: 16, backgroundColor: currentTheme.background, flex: 1 }]}>
                {/* Management cards */}
                {cards.map(card => (
                    <TouchableOpacity
                        key={card.title}
                        onPress={() => router.push(card.href as any)}
                        style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.cardIcon, { backgroundColor: card.color }]}>
                            <Ionicons name={card.icon} size={22} color="white" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: currentTheme.text }}>{card.title}</Text>
                            <Text style={{ fontSize: 12, color: currentTheme.noticeText }}>{card.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={currentTheme.noticeText} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    banner: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
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
