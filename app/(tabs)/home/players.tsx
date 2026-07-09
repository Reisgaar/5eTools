// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, usePlayerStore } from 'src/stores';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import ConfirmModal from 'src/components/modals/ConfirmModal';
import PlayerFormModal from 'src/components/modals/PlayerFormModal';

const DEFAULT_TOKEN_URL = 'https://5e.tools/img/blank.webp';

// Player management screen (independent, reached from Home). Scoped to the selected campaign.
export default function PlayersScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
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
                <TouchableOpacity onPress={openAddPlayerModal} style={styles.addButton}>
                    <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingBottom: styleConstants.paddingLG }}>
                {filteredPlayers.length > 0 ? (
                    <ScrollView style={[styles.container, { borderColor: currentTheme.primary, backgroundColor: currentTheme.card }]}>
                        {filteredPlayers.map(item => (
                            <View key={item.name} style={[styles.playerItem, {
                                borderBottomWidth: styleConstants.borderXS,
                                borderBottomColor: currentTheme.primary,
                                backgroundColor: currentTheme.card
                            }]}>
                                <View style={styles.playerContent}>
                                    <Image
                                        source={{ uri: item.tokenUrl || DEFAULT_TOKEN_URL }}
                                        style={{ width: 40, height: 40, borderRadius: styleConstants.borderRadius2XL, marginRight: styleConstants.marginMD, borderWidth: styleConstants.borderSM, borderColor: '#22c55a' }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.playerName, { color: currentTheme.text }]}>{item.name}</Text>
                                        <Text style={[styles.playerDetails, { color: currentTheme.noticeText }]}>{item.race} - {item.class}</Text>
                                        {getCampaignName(item.campaignId) ? (
                                            <Text style={[styles.playerDetails, { color: currentTheme.noticeText, fontSize: styleConstants.fontSizeSM }]}>
                                                Campaign: {getCampaignName(item.campaignId)}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                                <View style={styles.playerActions}>
                                    <TouchableOpacity onPress={() => openEditPlayerModal(item)} style={[styles.actionButton, { backgroundColor: currentTheme.primary, marginRight: styleConstants.marginSM }]}>
                                        <Ionicons name="pencil" size={16} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeletePlayer(item.name)} style={[styles.actionButton, { backgroundColor: '#dc2626' }]}>
                                        <Ionicons name="trash" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={[styles.emptyContainer, styles.container, { borderColor: currentTheme.primary, backgroundColor: currentTheme.card }]}>
                        <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                            No players created. Create your first player to get started.
                        </Text>
                    </View>
                )}
            </View>

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
    addButton: { backgroundColor: '#22c55e', width: 28, height: 28, borderRadius: styleConstants.borderRadiusLG, alignItems: 'center', justifyContent: 'center' },
    playerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: styleConstants.paddingMD, paddingHorizontal: styleConstants.paddingLG },
    playerContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    playerName: { fontSize: styleConstants.fontSizeLG, fontWeight: '600', marginBottom: styleConstants.margin2XS },
    playerDetails: { fontSize: styleConstants.fontSizeSM, color: '#666' },
    playerActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { width: 32, height: 32, borderRadius: styleConstants.borderRadiusXL, alignItems: 'center', justifyContent: 'center' },
    container: { flex: 1, borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, overflow: 'hidden' },
    emptyContainer: { padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' },
});
