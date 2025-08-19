// REACT
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';
import { useModal } from 'src/context/ModalContext';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface CampaignSelectorModalProps {
    visible: boolean;
}

/**
 * Modal for selecting a campaign.
 */
export default function CampaignSelectorModal({ visible }: CampaignSelectorModalProps): JSX.Element {
    const { campaigns, selectedCampaignId, selectCampaign, clearSelectedCampaign } = useCampaignStore();
    const { currentTheme } = useAppSettingsStore();
    const styles = createBaseModalStyles(currentTheme);
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
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={closeCampaignSelectorModal}
                        style={[styles.footerButton, { backgroundColor: currentTheme.primary }]}
                    >
                        <Text style={styles.footerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            {campaigns && campaigns.length > 0 ? (
                <>
                    <TouchableOpacity
                        style={[
                            localStyles.campaignItem,
                            { backgroundColor: !selectedCampaignId ? currentTheme.primary + '20' : 'transparent' }
                        ]}
                        onPress={handleShowAll}
                    >
                        <View style={localStyles.campaignContent}>
                            <Text style={[localStyles.campaignName, { color: currentTheme.text }]}>
                                All Campaigns
                            </Text>
                            <Text style={[localStyles.campaignDescription, { color: currentTheme.noticeText }]}>
                                Show all campaigns • {getSortedCombats(null).length} combats • {getSpellbooksByCampaign(undefined).length} spellbooks
                            </Text>
                        </View>
                        {!selectedCampaignId && (
                            <Ionicons name="checkmark-circle" size={20} color={currentTheme.primary} />
                        )}
                    </TouchableOpacity>
                    {campaigns.map(campaign => (
                        <TouchableOpacity
                            key={campaign.id}
                            style={[
                                localStyles.campaignItem,
                                { backgroundColor: selectedCampaignId === campaign.id ? currentTheme.primary + '20' : 'transparent' }
                            ]}
                            onPress={() => handleSelectCampaign(campaign.id)}
                        >
                            <View style={localStyles.campaignContent}>
                                <Text style={[localStyles.campaignName, { color: currentTheme.text }]}>
                                    {campaign.name}
                                </Text>
                                <Text style={[localStyles.campaignDescription, { color: currentTheme.noticeText }]}>
                                    {campaign.description && `${campaign.description} • `}
                                    {getSortedCombats(campaign.id).length} combats • {getSpellbooksByCampaign(campaign.id).length} spellbooks
                                </Text>
                            </View>
                            {selectedCampaignId === campaign.id && (
                                <Ionicons name="checkmark-circle" size={20} color={currentTheme.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </>) : (
                    <View style={localStyles.emptyState}>
                        <Text style={[localStyles.emptyText, { color: currentTheme.noticeText }]}>
                            No campaigns available
                        </Text>
                    </View>
                )}
        </BaseModal>
    );
};

const localStyles = StyleSheet.create({
    campaignItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    campaignContent: {
        flex: 1,
    },
    campaignName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    campaignDescription: {
        fontSize: 14,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
