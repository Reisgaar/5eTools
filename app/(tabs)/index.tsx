// REACT
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// CONTEXTS
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useCampaign } from 'src/context/CampaignContext';

// STYLES
import { commonStyles } from 'src/style/styles';
import { modalStyles } from 'src/styles/modalStyles';

// COMPONENTS
import { ImagePicker as PlayerImagePicker } from 'src/components/ui';
import CampaignSelector from 'src/components/ui/CampaignSelector';
import ConfirmModal from 'src/components/modals/ConfirmModal';

const DEFAULT_TOKEN_URL = "data:image/jpeg;base64,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";

// Home screen tab displaying campaign selection and player management.
export default function HomeScreen() {
    const { currentTheme } = useAppSettings();
    const { campaigns, selectedCampaign, createCampaign, deleteCampaign, updateCampaign } = useCampaign();

    // Campaign modal state
    const [campaignModalVisible, setCampaignModalVisible] = React.useState(false);
    const [editCampaign, setEditCampaign] = React.useState<any | null>(null);
    const [campaignForm, setCampaignForm] = React.useState({ name: '', description: '' });

    // Player management state
    const [players, setPlayers] = React.useState<any[]>([]);
    const [playerModalVisible, setPlayerModalVisible] = React.useState(false);
    const [editPlayer, setEditPlayer] = React.useState<any | null>(null);
    const [playerForm, setPlayerForm] = React.useState({ name: '', race: '', class: '', maxHp: '', ac: '', passivePerception: '', initiativeBonus: '', tokenUrl: '', campaignId: '' });
    const [selectedImageUri, setSelectedImageUri] = React.useState<string | null>(null);

    // Confirmation modal state
    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(null);
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmMessage, setConfirmMessage] = React.useState('');

    // Load players on mount
    React.useEffect(() => {
        (async () => {
            const { loadPlayersList } = await import('src/utils/fileStorage');
            const list = await loadPlayersList();
            setPlayers(list);
        })();
    }, []);

    // Filter players by selected campaign
    const filteredPlayers = React.useMemo(() => {
        const selectedCampaignId = selectedCampaign?.id;
        if (!selectedCampaignId) {
            // Show all players when no campaign is selected
            return players;
        } else {
            // Show only players from the selected campaign
            return players.filter(player => player.campaignId === selectedCampaignId);
        }
    }, [players, selectedCampaign?.id]);

    // Helper function to get campaign name
    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return null;
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : null;
    };



    // Campaign functions
    const handleSaveCampaign = async () => {
        if (!campaignForm.name.trim()) {
            Alert.alert('Name is required');
            return;
        }
        if (editCampaign) {
            updateCampaign(editCampaign.id, campaignForm.name, campaignForm.description);
        } else {
            createCampaign(campaignForm.name, campaignForm.description);
        }
        setCampaignModalVisible(false);
        setEditCampaign(null);
        setCampaignForm({ name: '', description: '' });
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
        setCampaignForm({ name: '', description: '' });
        setCampaignModalVisible(true);
    };

    const openEditCampaignModal = (campaign: any) => {
        setEditCampaign(campaign);
        setCampaignForm({ name: campaign.name, description: campaign.description || '' });
        setCampaignModalVisible(true);
    };

    // Player functions
    const handleSavePlayer = async () => {
        if (!playerForm.name.trim()) {
            Alert.alert('Name is required');
            return;
        }
        const { addPlayer, updatePlayer, loadPlayersList } = await import('src/utils/fileStorage');
        const playerData = {
            name: playerForm.name,
            race: playerForm.race,
            class: playerForm.class,
            maxHp: parseInt(playerForm.maxHp) || 0,
            ac: parseInt(playerForm.ac) || 0,
            passivePerception: parseInt(playerForm.passivePerception) || 10,
            initiativeBonus: (() => {
                const value = playerForm.initiativeBonus.trim();
                if (!value) return 0;
                const cleanValue = value.replace(/^\+/, '');
                const parsed = parseInt(cleanValue);
                return isNaN(parsed) ? 0 : parsed;
            })(),
            tokenUrl: selectedImageUri || playerForm.tokenUrl?.trim() || '',
            campaignId: playerForm.campaignId || undefined,
        };
        if (editPlayer) {
            await updatePlayer(editPlayer.name, playerData);
        } else {
            await addPlayer(playerData);
        }
        const list = await loadPlayersList();
        setPlayers(list);
        setPlayerModalVisible(false);
        setEditPlayer(null);
        setPlayerForm({ name: '', race: '', class: '', maxHp: '', ac: '', passivePerception: '', initiativeBonus: '', tokenUrl: '', campaignId: '' });
        setSelectedImageUri(null);
    };

    const handleDeletePlayer = async (name: string) => {
        setConfirmTitle('Delete Player');
        setConfirmMessage(`Are you sure you want to delete the player "${name}"?`);
        setConfirmAction(() => async () => {
            const { removePlayer, loadPlayersList } = await import('src/utils/fileStorage');
            await removePlayer(name);
            const list = await loadPlayersList();
            setPlayers(list);
        });
        setConfirmModalVisible(true);
    };

    const openAddPlayerModal = () => {
        setEditPlayer(null);
        setPlayerForm({ 
            name: '', 
            race: '', 
            class: '', 
            maxHp: '', 
            ac: '', 
            passivePerception: '', 
            initiativeBonus: '', 
            tokenUrl: '', 
            campaignId: selectedCampaign?.id || '' 
        });
        setSelectedImageUri(null);
        setPlayerModalVisible(true);
    };

    const openEditPlayerModal = (player: any) => {
        setEditPlayer(player);
        setPlayerForm({
            name: player.name,
            race: player.race,
            class: player.class,
            maxHp: player.maxHp?.toString() || '',
            ac: player.ac?.toString() || '',
            passivePerception: player.passivePerception?.toString() || '',
            initiativeBonus: player.initiativeBonus?.toString() || '',
            tokenUrl: player.tokenUrl || '',
            campaignId: player.campaignId || '',
        });
        setPlayerModalVisible(true);
    };

    return (
        <View style={[commonStyles.container, { backgroundColor: currentTheme.background, flex: 1 }]}>
            <ScrollView style={{ flex: 1, padding: 16 }}>
                {/* Header */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: currentTheme.text, marginBottom: 8 }}>
                        5e Tools
                    </Text>
                    <Text style={{ fontSize: 16, color: currentTheme.noticeText, marginBottom: 16 }}>
                        Manage campaigns and your players
                    </Text>
                </View>

                {/* Campaigns Section */}
                <View style={{ marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.text }}>
                            Campaigns
                        </Text>
                        <TouchableOpacity onPress={openAddCampaignModal} style={styles.addButton}>
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    {campaigns.length > 0 ? (
                        <View style={{ borderWidth: 1, borderColor: currentTheme.primary, borderRadius: 8, overflow: 'hidden' }}>
                            <FlatList
                                data={campaigns}
                                keyExtractor={item => item.id}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.campaignItem, { 
                                        borderBottomWidth: index === campaigns.length - 1 ? 0 : 1, 
                                        borderBottomColor: currentTheme.primary,
                                        backgroundColor: currentTheme.card
                                    }]}>
                                        <View style={styles.campaignContent}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.campaignName, { color: currentTheme.text }]}>
                                                    {item.name}
                                                </Text>
                                                {item.description && (
                                                    <Text style={[styles.campaignDescription, { color: currentTheme.noticeText }]}>
                                                        {item.description}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.campaignActions}>
                                            <TouchableOpacity 
                                                onPress={() => openEditCampaignModal(item)} 
                                                style={[styles.actionButton, { backgroundColor: currentTheme.primary, marginRight: 8 }]}
                                            >
                                                <Ionicons name="pencil" size={16} color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={() => handleDeleteCampaign(item.id)}
                                                style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
                                            >
                                                <Ionicons name="trash" size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <View style={[styles.emptyState, { backgroundColor: currentTheme.card }]}>
                            <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                                No campaigns created. Create your first campaign to get started.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Players Section */}
                <View style={{ marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.text }}>
                            Players
                        </Text>
                        <TouchableOpacity onPress={openAddPlayerModal} style={styles.addButton}>
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    {filteredPlayers.length > 0 ? (
                        <View style={{ borderWidth: 1, borderColor: currentTheme.primary, borderRadius: 8, overflow: 'hidden' }}>
                            <FlatList
                                data={filteredPlayers}
                                keyExtractor={item => item.name}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.playerItem, { 
                                        borderBottomWidth: index === filteredPlayers.length - 1 ? 0 : 1, 
                                        borderBottomColor: currentTheme.primary,
                                        backgroundColor: currentTheme.card
                                    }]}>
                                        <View style={styles.playerContent}>
                                        <Image
                                            source={{ uri: item.tokenUrl || DEFAULT_TOKEN_URL }}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                marginRight: 12,
                                                borderWidth: 2,
                                                borderColor: '#22c55a'
                                            }}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.playerName, { color: currentTheme.text }]}>
                                                {item.name}
                                            </Text>
                                            <Text style={[styles.playerDetails, { color: currentTheme.noticeText }]}>
                                                {item.race} - {item.class}
                                            </Text>
                                            {getCampaignName(item.campaignId) && (
                                                <Text style={[styles.playerDetails, { color: currentTheme.noticeText, fontSize: 12 }]}>
                                                    Campaign: {getCampaignName(item.campaignId)}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    <View style={styles.playerActions}>
                                        <TouchableOpacity 
                                            onPress={() => openEditPlayerModal(item)} 
                                            style={[styles.actionButton, { backgroundColor: currentTheme.primary, marginRight: 8 }]}
                                        >
                                            <Ionicons name="pencil" size={16} color="white" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => handleDeletePlayer(item.name)}
                                            style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
                                        >
                                            <Ionicons name="trash" size={16} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <View style={[styles.emptyState, { backgroundColor: currentTheme.card }]}>
                            <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                                No players created. Add your first player character.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Campaign Modal */}
            <Modal visible={campaignModalVisible} animationType="slide" transparent>
                <TouchableOpacity style={modalStyles.modalOverlay} activeOpacity={1} onPress={() => { setCampaignModalVisible(false); setEditCampaign(null); }}>
                    <TouchableOpacity style={[modalStyles.modalContent, { backgroundColor: currentTheme.card }]} activeOpacity={1} onPress={() => {}}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={[modalStyles.modalTitle, { color: currentTheme.text }]}>
                                {editCampaign ? 'Edit Campaign' : 'Create Campaign'}
                            </Text>
                            <TouchableOpacity onPress={() => { setCampaignModalVisible(false); setEditCampaign(null); }} style={modalStyles.closeButton}>
                                <Ionicons name="close" size={24} color={currentTheme.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={[modalStyles.separator, { backgroundColor: currentTheme.border }]} />
                        
                        <View style={modalStyles.modalBody}>
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Campaign Name</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="Enter campaign name"
                                placeholderTextColor={currentTheme.noticeText}
                                value={campaignForm.name}
                                onChangeText={text => setCampaignForm(prev => ({ ...prev, name: text }))}
                            />
                            
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Description (Optional)</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="Enter campaign description"
                                placeholderTextColor={currentTheme.noticeText}
                                value={campaignForm.description}
                                onChangeText={text => setCampaignForm(prev => ({ ...prev, description: text }))}
                                multiline
                                numberOfLines={3}
                            />
                            
                            <View style={modalStyles.modalButtons}>
                                <TouchableOpacity 
                                    onPress={handleSaveCampaign} 
                                    style={[modalStyles.modalButton, { backgroundColor: currentTheme.primary }]}
                                >
                                    <Text style={[modalStyles.modalButtonText, { color: 'white' }]}>
                                        {editCampaign ? 'Save' : 'Create'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Player Modal */}
            <Modal visible={playerModalVisible} animationType="slide" transparent>
                <TouchableOpacity style={modalStyles.modalOverlay} activeOpacity={1} onPress={() => { setPlayerModalVisible(false); setEditPlayer(null); }}>
                    <TouchableOpacity style={[modalStyles.modalContent, { backgroundColor: currentTheme.card }]} activeOpacity={1} onPress={() => {}}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={[modalStyles.modalTitle, { color: currentTheme.text }]}>
                                {editPlayer ? 'Edit Player' : 'Add Player'}
                            </Text>
                            <TouchableOpacity onPress={() => { setPlayerModalVisible(false); setEditPlayer(null); }} style={modalStyles.closeButton}>
                                <Ionicons name="close" size={24} color={currentTheme.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={[modalStyles.separator, { backgroundColor: currentTheme.border }]} />
                        
                        <ScrollView showsVerticalScrollIndicator={false} style={modalStyles.modalBody}>
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Character Name</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="Enter character name"
                                placeholderTextColor={currentTheme.noticeText}
                                value={playerForm.name}
                                onChangeText={text => setPlayerForm(prev => ({ ...prev, name: text }))}
                            />
                            
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Race</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="e.g., Human, Elf, Dwarf"
                                placeholderTextColor={currentTheme.noticeText}
                                value={playerForm.race}
                                onChangeText={text => setPlayerForm(prev => ({ ...prev, race: text }))}
                            />
                            
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Class</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="e.g., Fighter, Wizard, Cleric"
                                placeholderTextColor={currentTheme.noticeText}
                                value={playerForm.class}
                                onChangeText={text => setPlayerForm(prev => ({ ...prev, class: text }))}
                            />
                            
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Maximum Hit Points</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="e.g., 25"
                                placeholderTextColor={currentTheme.noticeText}
                                keyboardType="numeric"
                                value={playerForm.maxHp}
                                onChangeText={text => setPlayerForm(prev => ({ ...prev, maxHp: text }))}
                            />
                            
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Armor Class</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="e.g., 16"
                                placeholderTextColor={currentTheme.noticeText}
                                keyboardType="numeric"
                                value={playerForm.ac}
                                onChangeText={text => setPlayerForm(prev => ({ ...prev, ac: text }))}
                            />
                            
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Passive Perception</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="e.g., 14"
                                placeholderTextColor={currentTheme.noticeText}
                                keyboardType="numeric"
                                value={playerForm.passivePerception}
                                onChangeText={text => setPlayerForm(prev => ({ ...prev, passivePerception: text }))}
                            />
                            
                            <Text style={[modalStyles.fieldLabel, { color: currentTheme.text }]}>Initiative Bonus</Text>
                            <TextInput
                                style={[modalStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
                                placeholder="e.g., +3, -1, 2"
                                placeholderTextColor={currentTheme.noticeText}
                                keyboardType="numeric"
                                value={playerForm.initiativeBonus}
                                onChangeText={text => setPlayerForm(prev => ({ ...prev, initiativeBonus: text }))}
                            />
                            
                            <CampaignSelector
                                selectedCampaignId={playerForm.campaignId || undefined}
                                onCampaignChange={(campaignId) => setPlayerForm(prev => ({ ...prev, campaignId: campaignId || '' }))}
                                theme={currentTheme}
                                label="Campaign (optional)"
                            />
                            
                            <PlayerImagePicker
                                currentImageUri={selectedImageUri || playerForm.tokenUrl}
                                onImageSelected={setSelectedImageUri}
                                theme={currentTheme}
                            />
                        </ScrollView>
                        
                        <View style={modalStyles.modalButtons}>
                            <TouchableOpacity 
                                onPress={handleSavePlayer} 
                                style={[modalStyles.modalButton, { backgroundColor: currentTheme.primary }]}
                            >
                                <Text style={[modalStyles.modalButtonText, { color: 'white' }]}>
                                    {editPlayer ? 'Save' : 'Add'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmModal
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={() => {
                    if (confirmAction) {
                        confirmAction();
                    }
                }}
                title={confirmTitle}
                message={confirmMessage}
                theme={currentTheme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#22c55e',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    campaignItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    campaignContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    campaignName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    campaignDescription: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    campaignActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    playerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    playerDetails: {
        fontSize: 12,
        color: '#666',
    },
    playerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyState: {
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 12,
        padding: 24,
        marginHorizontal: 20,
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    closeButton: {
        padding: 4,
    },
    separator: {
        height: 1,
        marginBottom: 0,
    },
});
