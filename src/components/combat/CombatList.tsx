// REACT
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

// STORES
import { useCampaignStore } from 'src/stores';

// COMPONENTS
import { Button, ListItem, ActionMenu } from 'src/components/ui';

// MODELS
import { CombatListProps } from 'src/models/interfaces/combat';

// UTILS
import { formatDate } from 'src/utils/combatUtils';

// STYLES
import { createCombatStyles } from 'src/styles/combat';
import { getCommonStyles } from 'src/styles/commonStyles';

// HOOKS
import { useTabBarInset } from 'src/hooks/useTabBarInset';

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
    const tabInset = useTabBarInset();
    const { campaigns } = useCampaignStore();

    const filteredCombats = combats;

    // Helper function to get campaign name
    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return 'No campaign';

        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : 'Unknown campaign';
    };

    return (
        <View style={styles.listContainer}>
            <View style={[commonStyles.row_between_center, commonStyles.mb_sm]}>
                <Text style={[styles.listSectionTitle, commonStyles.text_primary]}>Saved Combats</Text>
                <Button title="New" icon="add" size="sm" onPress={onCreateCombat} />
            </View>
            {!filteredCombats || filteredCombats.length === 0 ? (
                <View style={[commonStyles.jc_center, commonStyles.ai_center, { flex: 1 }]}>
                    <Text style={[styles.listEmptyText, commonStyles.text_grey]}>No combats created yet</Text>
                </View>
            ) : (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: tabInset }}>
                    {filteredCombats.map(combat => {
                        const actions = [];
                        if (onEditCombat) actions.push({ label: 'Edit', icon: 'pencil' as const, onPress: () => onEditCombat(combat) });
                        if (onDeleteCombat) actions.push({ label: 'Delete', icon: 'trash' as const, destructive: true, onPress: () => onDeleteCombat(combat.id) });
                        return (
                            <ListItem
                                key={combat.id}
                                onPress={() => onSelectCombat(combat.id)}
                                title={combat.name}
                                subtitle={`${getCampaignName(combat.campaignId)} • ${combat.combatants?.length || 0} creatures`}
                                trailing={actions.length ? <ActionMenu title={combat.name} actions={actions} /> : undefined}
                            />
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
}
