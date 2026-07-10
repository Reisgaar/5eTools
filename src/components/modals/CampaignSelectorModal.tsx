// REACT
import React from 'react';
import { View, Text } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';
import { useModal } from 'src/context/ModalContext';

// COMPONENTS
import { BaseModal, Button, ListItem } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface CampaignSelectorModalProps {
    visible: boolean;
}

/**
 * Modal for selecting a campaign.
 */
export default function CampaignSelectorModal({ visible }: CampaignSelectorModalProps): React.JSX.Element {
    const { campaigns, selectedCampaignId, selectCampaign, clearSelectedCampaign } = useCampaignStore();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const { getSortedCombats, reloadCombats } = useCombat();
    const { getSpellbooksByCampaign, clearSpellbookSelection } = useSpellbookStore();
    const { closeCampaignSelectorModal } = useModal();


    const handleSelectCampaign = async (campaignId: string | null) => {
        // 1. Combats - Reload combats when changing campaign
        await reloadCombats();

        // 2. Spells - Deselect spellbook if exists
        clearSpellbookSelection();

        // 3. Home - Reload players (this will be handled by the Home component's useEffect)

        if (campaignId) {
            selectCampaign(campaignId);
        } else {
            clearSelectedCampaign();
        }
        closeCampaignSelectorModal();
    };

    const handleShowAll = async () => {
        // 1. Combats - Reload combats when changing campaign
        await reloadCombats();

        // 2. Spells - Deselect spellbook if exists
        clearSpellbookSelection();

        // 3. Home - Reload players (this will be handled by the Home component's useEffect)

        clearSelectedCampaign();
        closeCampaignSelectorModal();
    };

    return (
        <BaseModal
            visible={visible}
            onClose={closeCampaignSelectorModal}
            theme={currentTheme}
            title="Select Campaign"
            width='90%'
            maxHeight="80%"
            footerContent={
                <View style={[commonStyles.row_center_center, commonStyles.w_100]}>
                    <View style={{ flex: 1 }}>
                        <Button title="Cancel" variant="secondary" onPress={closeCampaignSelectorModal} fullWidth />
                    </View>
                </View>
            }
        >
            {campaigns && campaigns.length > 0 ? (
                <>
                    <ListItem
                        selected={!selectedCampaignId}
                        onPress={handleShowAll}
                        title="All Campaigns"
                        subtitle={`Show all • ${getSortedCombats(null).length} combats • ${getSpellbooksByCampaign(undefined).length} spellbooks`}
                        trailing={!selectedCampaignId ? <Ionicons name="checkmark-circle" size={22} color={currentTheme.primary} /> : undefined}
                    />
                    {campaigns.map(campaign => (
                        <ListItem
                            key={campaign.id}
                            selected={selectedCampaignId === campaign.id}
                            onPress={() => handleSelectCampaign(campaign.id)}
                            title={campaign.name}
                            subtitle={`${campaign.description ? `${campaign.description} • ` : ''}${getSortedCombats(campaign.id).length} combats • ${getSpellbooksByCampaign(campaign.id).length} spellbooks`}
                            trailing={selectedCampaignId === campaign.id ? <Ionicons name="checkmark-circle" size={22} color={currentTheme.primary} /> : undefined}
                        />
                    ))}
                </>
            ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={[commonStyles.text_lg, commonStyles.text_grey, commonStyles.text_center]}>
                        No campaigns available
                    </Text>
                </View>
            )}
        </BaseModal>
    );
};
