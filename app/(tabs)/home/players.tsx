// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';

// STORES
import { useAppSettingsStore, useCampaignStore, usePlayerStore } from 'src/stores';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { Button, ListItem, ActionMenu } from 'src/components/ui';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import PlayerFormModal from 'src/components/modals/PlayerFormModal';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

const DEFAULT_TOKEN_URL = 'https://5e.tools/img/blank.webp';

// Player management screen (independent, reached from Home). Scoped to the selected campaign.
export default function PlayersScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { campaigns, selectedCampaign } = useCampaignStore();
    const { players, loadPlayers, createPlayer, deletePlayer, updatePlayer } = usePlayerStore();

    const [playerModalVisible, setPlayerModalVisible] = React.useState(false);
    const [editPlayer, setEditPlayer] = React.useState<any | null>(null);

    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(null);
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmMessage, setConfirmMessage] = React.useState('');

    React.useEffect(() => {
        loadPlayers();
    }, [selectedCampaign?.id, loadPlayers]);

    const filteredPlayers = React.useMemo(() => {
        const selectedCampaignId = selectedCampaign?.id;
        if (!selectedCampaignId) return players;
        return players.filter(player => player.campaignId === selectedCampaignId);
    }, [players, selectedCampaign?.id]);

    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return null;
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : null;
    };

    const handleSavePlayer = async (playerData: any) => {
        if (editPlayer) {
            updatePlayer(editPlayer.name, playerData);
        } else {
            createPlayer(playerData);
        }
        setPlayerModalVisible(false);
        setEditPlayer(null);
    };

    const handleDeletePlayer = async (name: string) => {
        setConfirmTitle('Delete Player');
        setConfirmMessage(`Are you sure you want to delete the player "${name}"?`);
        setConfirmAction(() => () => deletePlayer(name));
        setConfirmModalVisible(true);
    };

    const openAddPlayerModal = () => {
        setEditPlayer(null);
        setPlayerModalVisible(true);
    };

    const openEditPlayerModal = (player: any) => {
        setEditPlayer(player);
        setPlayerModalVisible(true);
    };

    return (
        <View style={[commonStyles.container, { padding: styleConstants.paddingLG, backgroundColor: currentTheme.background, flex: 1 }]}>
            <View style={[commonStyles.row_between_center, commonStyles.mb_sm]}>
                <Text style={{ fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', color: currentTheme.text }}>Players</Text>
                <Button title="New" icon="add" size="sm" onPress={openAddPlayerModal} />
            </View>

            {filteredPlayers.length > 0 ? (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: tabInset }}>
                    {filteredPlayers.map(item => {
                        const campaign = getCampaignName(item.campaignId);
                        return (
                            <ListItem
                                key={item.name}
                                leading={
                                    <Image
                                        source={{ uri: item.tokenUrl || DEFAULT_TOKEN_URL }}
                                        style={{ width: 44, height: 44, borderRadius: styleConstants.borderRadiusCircle, borderWidth: styleConstants.borderXS, borderColor: currentTheme.border }}
                                    />
                                }
                                title={item.name}
                                subtitle={
                                    <View>
                                        <Text style={{ color: currentTheme.noticeText, fontSize: styleConstants.fontSizeSM, marginTop: styleConstants.margin2XS }}>{item.race} - {item.class}</Text>
                                        {campaign ? (
                                            <Text style={{ color: currentTheme.noticeText, fontSize: styleConstants.fontSizeSM }}>Campaign: {campaign}</Text>
                                        ) : null}
                                    </View>
                                }
                                trailing={
                                    <ActionMenu
                                        title={item.name}
                                        actions={[
                                            { label: 'Edit', icon: 'pencil', onPress: () => openEditPlayerModal(item) },
                                            { label: 'Delete', icon: 'trash', destructive: true, onPress: () => handleDeletePlayer(item.name) },
                                        ]}
                                    />
                                }
                            />
                        );
                    })}
                </ScrollView>
            ) : (
                <View style={[styles.emptyContainer, { flex: 1 }]}>
                    <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                        No players created. Create your first player to get started.
                    </Text>
                </View>
            )}

            <PlayerFormModal
                visible={playerModalVisible}
                onClose={() => { setPlayerModalVisible(false); setEditPlayer(null); }}
                onSave={handleSavePlayer}
                player={editPlayer}
                campaigns={campaigns}
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
    playerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: styleConstants.paddingMD, paddingHorizontal: styleConstants.paddingLG },
    playerContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    playerName: { fontSize: styleConstants.fontSizeLG, fontWeight: '600', marginBottom: styleConstants.margin2XS },
    playerDetails: { fontSize: styleConstants.fontSizeSM, color: '#666' },
    playerActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { width: 32, height: 32, borderRadius: styleConstants.borderRadiusXL, alignItems: 'center', justifyContent: 'center' },
    container: { flex: 1, borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, overflow: 'hidden' },
    emptyContainer: { padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' },
});
