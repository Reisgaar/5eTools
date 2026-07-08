// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import ConfirmModal from 'src/components/modals/ConfirmModal';
import CampaignFormModal from 'src/components/modals/CampaignFormModal';

// Campaign management screen (independent, reached from Home).
export default function CampaignsScreen() {
    const { currentTheme } = useAppSettingsStore();
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
        <View style={[commonStyles.container, { padding: 16, backgroundColor: currentTheme.background, flex: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: currentTheme.text }}>Campaigns</Text>
                <TouchableOpacity onPress={openAddCampaignModal} style={styles.addButton}>
                    <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingBottom: 16 }}>
                {campaigns.length > 0 ? (
                    <ScrollView style={[styles.container, { borderColor: currentTheme.primary, backgroundColor: currentTheme.card }]}>
                        {campaigns.map(item => (
                            <View key={item.id} style={[styles.campaignItem, {
                                borderBottomWidth: 1,
                                borderBottomColor: currentTheme.primary,
                                backgroundColor: currentTheme.card
                            }]}>
                                <View style={styles.campaignContent}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.campaignName, { color: currentTheme.text }]}>{item.name}</Text>
                                        {item.description ? (
                                            <Text style={[styles.campaignDescription, { color: currentTheme.noticeText }]}>{item.description}</Text>
                                        ) : null}
                                    </View>
                                </View>
                                <View style={styles.campaignActions}>
                                    <TouchableOpacity onPress={() => openEditCampaignModal(item)} style={[styles.actionButton, { backgroundColor: currentTheme.primary, marginRight: 8 }]}>
                                        <Ionicons name="pencil" size={16} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteCampaign(item.id)} style={[styles.actionButton, { backgroundColor: '#dc2626' }]}>
                                        <Ionicons name="trash" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={[styles.emptyContainer, styles.container, { borderColor: currentTheme.primary, backgroundColor: currentTheme.card }]}>
                        <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                            No campaigns created. Create your first campaign to get started.
                        </Text>
                    </View>
                )}
            </View>

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
    addButton: { backgroundColor: '#22c55e', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    campaignItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
    campaignContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    campaignName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    campaignDescription: { fontSize: 12, fontStyle: 'italic' },
    campaignActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    container: { flex: 1, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
    emptyContainer: { padding: 20, alignItems: 'center', justifyContent: 'center' },
});
