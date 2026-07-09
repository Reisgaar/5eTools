// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { Button, ListItem, ActionMenu } from 'src/components/ui';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import CampaignFormModal from 'src/components/modals/CampaignFormModal';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// Campaign management screen (independent, reached from Home).
export default function CampaignsScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { campaigns, createCampaign, deleteCampaign, updateCampaign } = useCampaignStore();

    const [campaignModalVisible, setCampaignModalVisible] = React.useState(false);
    const [editCampaign, setEditCampaign] = React.useState<any | null>(null);

    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(null);
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmMessage, setConfirmMessage] = React.useState('');

    const handleSaveCampaign = async (campaignData: { name: string; description: string }) => {
        if (editCampaign) {
            updateCampaign(editCampaign.id, campaignData.name, campaignData.description);
        } else {
            createCampaign(campaignData.name, campaignData.description);
        }
        setCampaignModalVisible(false);
        setEditCampaign(null);
    };

    const handleDeleteCampaign = async (id: string) => {
        const campaign = campaigns.find(c => c.id === id);
        setConfirmTitle('Delete Campaign');
        setConfirmMessage(`Are you sure you want to delete the campaign "${campaign?.name}"?`);
        setConfirmAction(() => () => deleteCampaign(id));
        setConfirmModalVisible(true);
    };

    const openAddCampaignModal = () => {
        setEditCampaign(null);
        setCampaignModalVisible(true);
    };

    const openEditCampaignModal = (campaign: any) => {
        setEditCampaign(campaign);
        setCampaignModalVisible(true);
    };

    return (
        <View style={[commonStyles.container, { padding: styleConstants.paddingLG, backgroundColor: currentTheme.background, flex: 1 }]}>
            <View style={[commonStyles.row_between_center, commonStyles.mb_sm]}>
                <Text style={{ fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', color: currentTheme.text }}>Campaigns</Text>
                <Button title="New" icon="add" size="sm" onPress={openAddCampaignModal} />
            </View>

            {campaigns.length > 0 ? (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: tabInset }}>
                    {campaigns.map(item => (
                        <ListItem
                            key={item.id}
                            title={item.name}
                            subtitle={item.description || undefined}
                            trailing={
                                <ActionMenu
                                    title={item.name}
                                    actions={[
                                        { label: 'Edit', icon: 'pencil', onPress: () => openEditCampaignModal(item) },
                                        { label: 'Delete', icon: 'trash', destructive: true, onPress: () => handleDeleteCampaign(item.id) },
                                    ]}
                                />
                            }
                        />
                    ))}
                </ScrollView>
            ) : (
                <View style={[styles.emptyContainer, { flex: 1 }]}>
                    <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                        No campaigns created. Create your first campaign to get started.
                    </Text>
                </View>
            )}

            <CampaignFormModal
                visible={campaignModalVisible}
                onClose={() => { setCampaignModalVisible(false); setEditCampaign(null); }}
                onSave={handleSaveCampaign}
                campaign={editCampaign}
                theme={currentTheme}
            />

            <ConfirmModal
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={() => { if (confirmAction) confirmAction(); }}
                title={confirmTitle}
                message={confirmMessage}
                theme={currentTheme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    campaignItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: styleConstants.paddingMD, paddingHorizontal: styleConstants.paddingLG },
    campaignContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    campaignName: { fontSize: styleConstants.fontSizeLG, fontWeight: '600', marginBottom: styleConstants.margin2XS },
    campaignDescription: { fontSize: styleConstants.fontSizeSM, fontStyle: 'italic' },
    campaignActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { width: 32, height: 32, borderRadius: styleConstants.borderRadiusXL, alignItems: 'center', justifyContent: 'center' },
    container: { flex: 1, borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, overflow: 'hidden' },
    emptyContainer: { padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' },
});
