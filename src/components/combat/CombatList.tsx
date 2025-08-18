// REACT
import React, { useState, useMemo } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useCampaignStore } from 'src/stores';

// MODELS
import { CombatListProps } from 'src/models/interfaces/combat';

// UTILS
import { formatDate } from 'src/utils/combatUtils';

// STYLES
import { createCombatStyles } from 'src/styles/combat';

/**
 * List of combats.
 */
export default function CombatList({
    combats,
    currentCombatId,
    onSelectCombat,
    onCreateCombat,
    theme
}: CombatListProps): JSX.Element {
    const styles = createCombatStyles(theme);
    const [searchQuery, setSearchQuery] = useState('');
    const { campaigns } = useCampaignStore();

    // Filter combats by name
    const filteredCombats = useMemo(() => {
        if (!searchQuery.trim()) return combats;

        return combats.filter(combat =>
            combat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [combats, searchQuery]);

    // Helper function to get campaign name
    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return 'No campaign';

        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : 'Unknown campaign';
    };

    return (
        <View style={styles.listContainer}>
            {/* Header with search and create button */}
            <TouchableOpacity
                onPress={onCreateCombat}
                style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 10,
                    zIndex: 1,
                    backgroundColor: theme.primary,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>

            {/* Search Input */}
            <TextInput
                style={[styles.listCombatNameInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary, marginBottom: 12 }]}
                placeholder="Search combats..."
                placeholderTextColor={theme.noticeText}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <Text style={[styles.listSectionTitle, { color: theme.text }]}>Saved Combats</Text>
            <View style={[styles.listContainerBox, { backgroundColor: theme.card, borderColor: theme.primary, flex: 1, padding: 0 }]}>
                {/* Existing Combats */}
                <View>
                    {!filteredCombats || filteredCombats.length === 0 ? (
                        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.listEmptyText, { color: theme.noticeText }]}>
                                {searchQuery.trim() ? 'No combats found matching your search.' : 'No combats created yet'}
                            </Text>
                        </View>
                    ) : (
                        <ScrollView style={{ height: '100%' }}>
                            <View style={{ flex: 1, padding: 12 }}>
                                {filteredCombats.map(combat => (
                                    <View key={combat.id} style={styles.listCombatListItem}>
                                        <TouchableOpacity
                                            onPress={() => onSelectCombat(combat.id)}
                                            style={[
                                                styles.listCombatOption,
                                                { backgroundColor: theme.inputBackground },
                                                currentCombatId === combat.id && { borderColor: theme.primary, borderWidth: 2 },
                                                combat.isActive && { borderColor: '#4CAF50', borderWidth: 2 }
                                            ]}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                        <Text style={[styles.listCombatName, { color: theme.text }]}>{combat.name}</Text>
                                                        {combat.isActive && (
                                                            <View style={styles.listActiveBadge}>
                                                                <Text style={styles.listActiveBadgeText}>ACTIVE</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text style={[styles.listCombatCount, { color: theme.noticeText }]}>
                                                        {`(${combat.combatants?.length || 0} creatures)`}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={[styles.listCombatCount, { color: theme.noticeText, fontSize: 12 }]}>
                                                        {formatDate(combat.createdAt)}
                                                    </Text>
                                                    <Text style={[styles.listCombatCount, { color: theme.noticeText, fontSize: 12 }]}>
                                                        {getCampaignName(combat.campaignId)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
        </View>
    );
}
