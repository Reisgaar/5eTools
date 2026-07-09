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
import { getCommonStyles } from 'src/styles/commonStyles';

/**
 * List of combats.
 */
export default function CombatList({
    combats,
    currentCombatId,
    onSelectCombat,
    onCreateCombat,
    onEditCombat,
    onDeleteCombat,
    theme
}: CombatListProps): React.JSX.Element {
    const styles = createCombatStyles(theme);
    const commonStyles = getCommonStyles(theme);
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
            {/* Create Combat Floating Button */}
            <TouchableOpacity
                onPress={onCreateCombat}
                style={[commonStyles.ai_center, commonStyles.jc_center, {
                    position: 'absolute',
                    right: 10,
                    bottom: 10,
                    zIndex: 1,
                    backgroundColor: theme.primary,
                    width: 60,
                    height: 60,
                    borderRadius: 30
                }]}
            >
                <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>

            {/* Search Input */}
            <TextInput
                style={[styles.listCombatNameInput, commonStyles.text_primary, commonStyles.mb_md, { backgroundColor: theme.inputBackground, borderColor: theme.primary }]}
                placeholder="Search combats..."
                placeholderTextColor={theme.noticeText}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <Text style={[styles.listSectionTitle, commonStyles.text_primary]}>Saved Combats</Text>
            <View style={[styles.listContainerBox, { backgroundColor: theme.card, borderColor: theme.primary, flex: 1, padding: 0 }]}>
                {/* Existing Combats */}
                <View>
                    {!filteredCombats || filteredCombats.length === 0 ? (
                        <View style={[commonStyles.h_100, commonStyles.jc_center, commonStyles.ai_center]}>
                            <Text style={[styles.listEmptyText, commonStyles.text_grey]}>
                                {searchQuery.trim() ? 'No combats found matching your search.' : 'No combats created yet'}
                            </Text>
                        </View>
                    ) : (
                        <ScrollView style={commonStyles.h_100}>
                            <View style={{ flex: 1, padding: 0 }}>
                                {filteredCombats.map(combat => (
                                    <View key={combat.id} style={styles.listCombatOption}>
                                        <TouchableOpacity
                                            onPress={() => onSelectCombat(combat.id)}
                                            style={{ flex: 1 }}
                                        >
                                            <View style={[commonStyles.row_between_center, { flex: 1 }]}>
                                                <View style={[commonStyles.ai_start, { flex: 1, flexDirection: 'column' }]}>
                                                    <Text style={[styles.listCombatName, commonStyles.text_primary]}>{combat.name}</Text>
                                                    <Text style={[styles.listCombatCount, commonStyles.text_grey, commonStyles.text_sm, { marginLeft: 0 }]}>
                                                        Campaign: {getCampaignName(combat.campaignId)}
                                                    </Text>
                                                    <Text style={[styles.listCombatCount, commonStyles.text_grey, { marginLeft: 0 }]}>
                                                        {`(${combat.combatants?.length || 0} creatures)`}
                                                    </Text>
                                                </View>
                                                <View style={[commonStyles.ai_center, commonStyles.jc_between, { flexDirection: 'column' }]}>
                                                    {/* Edit and Delete Buttons */}
                                                    {(onEditCombat || onDeleteCombat) && (
                                                        <View style={[{ flexDirection: 'row' }, commonStyles.ai_center, commonStyles.ml_sm]}>
                                                            {onEditCombat && (
                                                                <TouchableOpacity 
                                                                    onPress={() => onEditCombat(combat)} 
                                                                    style={[commonStyles.br_lg, commonStyles.ai_center, commonStyles.jc_center, commonStyles.mr_sm, {
                                                                        backgroundColor: theme.primary,
                                                                        width: 28,
                                                                        height: 28
                                                                    }]}
                                                                >
                                                                    <Ionicons name="pencil" size={16} color="white" />
                                                                </TouchableOpacity>
                                                            )}
                                                            {onDeleteCombat && (
                                                                <TouchableOpacity 
                                                                    onPress={() => onDeleteCombat(combat.id)}
                                                                    style={[commonStyles.br_lg, commonStyles.ai_center, commonStyles.jc_center, {
                                                                        backgroundColor: '#dc2626',
                                                                        width: 28,
                                                                        height: 28
                                                                    }]}
                                                                >
                                                                    <Ionicons name="trash" size={16} color="white" />
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    )}
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
