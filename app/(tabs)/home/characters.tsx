// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, View, Image } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore, useCampaignStore, useCharacterStore } from 'src/stores';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import ReorderableList, { useReorderableDrag } from 'react-native-reorderable-list';
import { ListItem, ActionMenu, Button } from 'src/components/ui';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import CharacterWizardModal from 'src/components/characters/CharacterWizardModal';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// UTILS
import { reorderFullBySubset } from 'src/utils/reorder';
import { classSummary } from 'src/utils/characterUtils';

const DEFAULT_TOKEN_URL = 'https://5e.tools/img/blank.webp';

// A single draggable character row (tap to open the sheet, long-press to reorder).
function CharacterRow({ item, campaign, onOpen, onEdit, onDelete }: { item: any; campaign: string | null; onOpen: (c: any) => void; onEdit: (c: any) => void; onDelete: (name: string) => void }) {
    const drag = useReorderableDrag();
    const { currentTheme } = useAppSettingsStore();
    const summary = classSummary(item);
    return (
        <ListItem
            onPress={() => onOpen(item)}
            onLongPress={drag}
            leading={
                <Image
                    source={{ uri: item.tokenUrl || DEFAULT_TOKEN_URL }}
                    style={{ width: 44, height: 44, borderRadius: styleConstants.borderRadiusCircle, borderWidth: styleConstants.borderXS, borderColor: currentTheme.border }}
                />
            }
            title={item.name}
            subtitle={
                <View>
                    <Text style={{ color: currentTheme.noticeText, fontSize: styleConstants.fontSizeSM, marginTop: styleConstants.margin2XS }}>
                        {[item.race, summary].filter(Boolean).join(' • ')}
                    </Text>
                    {campaign ? (
                        <Text style={{ color: currentTheme.noticeText, fontSize: styleConstants.fontSizeSM }}>Campaign: {campaign}</Text>
                    ) : null}
                </View>
            }
            trailing={
                <ActionMenu
                    title={item.name}
                    actions={[
                        { label: 'Open Sheet', icon: 'reader-outline', onPress: () => onOpen(item) },
                        { label: 'Edit', icon: 'pencil', onPress: () => onEdit(item) },
                        { label: 'Delete', icon: 'trash', destructive: true, onPress: () => onDelete(item.name) },
                    ]}
                />
            }
        />
    );
}

// Character management screen (reached from Home). Scoped to the selected campaign.
export default function CharactersScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { campaigns, selectedCampaign } = useCampaignStore();
    const { players, loadPlayers, createPlayer, deletePlayer, updatePlayer, reorderPlayers } = useCharacterStore();

    const [formModalVisible, setFormModalVisible] = React.useState(false);
    const [editCharacter, setEditCharacter] = React.useState<any | null>(null);

    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(null);
    const [confirmTitle, setConfirmTitle] = React.useState('');
    const [confirmMessage, setConfirmMessage] = React.useState('');

    React.useEffect(() => {
        loadPlayers();
    }, [selectedCampaign?.id, loadPlayers]);

    const filteredCharacters = React.useMemo(() => {
        const selectedCampaignId = selectedCampaign?.id;
        if (!selectedCampaignId) return players;
        return players.filter(c => c.campaignId === selectedCampaignId);
    }, [players, selectedCampaign?.id]);

    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return null;
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : null;
    };

    const handleSave = async (data: any) => {
        if (editCharacter) {
            updatePlayer(editCharacter.name, data);
        } else {
            createPlayer(data);
        }
        setFormModalVisible(false);
        setEditCharacter(null);
    };

    const handleDelete = async (name: string) => {
        setConfirmTitle('Delete Character');
        setConfirmMessage(`Are you sure you want to delete the character "${name}"?`);
        setConfirmAction(() => () => deletePlayer(name));
        setConfirmModalVisible(true);
    };

    const openAddModal = () => {
        setEditCharacter(null);
        setFormModalVisible(true);
    };

    const openEditModal = (character: any) => {
        setEditCharacter(character);
        setFormModalVisible(true);
    };

    const openSheet = (character: any) => {
        router.push({ pathname: '/home/character', params: { name: character.name } });
    };

    return (
        <View style={[commonStyles.container, { padding: styleConstants.paddingLG, backgroundColor: currentTheme.background, flex: 1 }]}>
            <View style={[commonStyles.row_between_center, commonStyles.mb_sm]}>
                <Text style={{ fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', color: currentTheme.text }}>Characters</Text>
                <Button title="New" icon="add" size="sm" onPress={openAddModal} />
            </View>

            {filteredCharacters.length > 0 ? (
                <ReorderableList
                    data={filteredCharacters}
                    keyExtractor={(item: any) => item.name}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: tabInset }}
                    onReorder={({ from, to }) => reorderPlayers(reorderFullBySubset(players, filteredCharacters, from, to, (c: any) => c.name))}
                    renderItem={({ item }) => (
                        <CharacterRow
                            item={item}
                            campaign={getCampaignName(item.campaignId)}
                            onOpen={openSheet}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    )}
                />
            ) : (
                <View style={[styles.emptyContainer, { flex: 1 }]}>
                    <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                        No characters yet. Create your first character to get started.
                    </Text>
                </View>
            )}

            <CharacterWizardModal
                visible={formModalVisible}
                onClose={() => { setFormModalVisible(false); setEditCharacter(null); }}
                onSave={handleSave}
                character={editCharacter}
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
    emptyContainer: { padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' },
});
