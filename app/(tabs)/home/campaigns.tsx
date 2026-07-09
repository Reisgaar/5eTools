// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, View } from 'react-native';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import ReorderableList, { useReorderableDrag } from 'react-native-reorderable-list';
import { Button, ListItem, ActionMenu } from 'src/components/ui';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import CampaignFormModal from 'src/components/modals/CampaignFormModal';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// UTILS
import { moveItem } from 'src/utils/reorder';

// A single draggable campaign row (long-press anywhere to reorder).
function CampaignRow({ item, onEdit, onDelete }: { item: any; onEdit: (c: any) => void; onDelete: (id: string) => void }) {
    const drag = useReorderableDrag();
    return (
        <ListItem
            onLongPress={drag}
            title={item.name}
            subtitle={item.description || undefined}
            trailing={
                <ActionMenu
                    title={item.name}
                    actions={[
                        { label: 'Edit', icon: 'pencil', onPress: () => onEdit(item) },
                        { label: 'Delete', icon: 'trash', destructive: true, onPress: () => onDelete(item.id) },
                    ]}
                />
            }
        />
    );
}

// Campaign management screen (independent, reached from Home).
export default function CampaignsScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { campaigns, createCampaign, deleteCampaign, updateCampaign, reorderCampaigns } = useCampaignStore();

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
                <ReorderableList
                    data={campaigns}
                    keyExtractor={(item: any) => item.id}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: tabInset }}
                    onReorder={({ from, to }) => reorderCampaigns(moveItem(campaigns, from, to))}
                    renderItem={({ item }) => (
                        <CampaignRow item={item} onEdit={openEditCampaignModal} onDelete={handleDeleteCampaign} />
                    )}
                />
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
    emptyContainer: { padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' },
});
