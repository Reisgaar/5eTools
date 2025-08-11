// REACT
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// CONTEXTS
import { useCampaign } from 'src/context/CampaignContext';
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useCombat } from 'src/context/CombatContext';
import { useSpellbook } from 'src/context/SpellbookContext';

interface CampaignSelectorModalProps {
    visible: boolean;
    onClose: () => void;
}

const CampaignSelectorModal: React.FC<CampaignSelectorModalProps> = ({ visible, onClose }) => {
    const { campaigns, selectedCampaignId, selectCampaign, clearSelectedCampaign } = useCampaign();
    const { currentTheme } = useAppSettings();
    const { getSortedCombats, reloadCombats } = useCombat();
    const { getSpellbooksByCampaign, clearSpellbookSelection } = useSpellbook();

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
        onClose();
    };

    const handleShowAll = async () => {
        // 1. Combats - Reload combats when changing campaign
        await reloadCombats();
        
        // 2. Spells - Deselect spellbook if exists
        clearSpellbookSelection();
        
        // 3. Home - Reload players (this will be handled by the Home component's useEffect)
        
        clearSelectedCampaign();
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={[styles.modalContent, { backgroundColor: currentTheme.card }]} activeOpacity={1} onPress={() => {}}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                            Select Campaign
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={currentTheme.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.separator, { backgroundColor: currentTheme.border }]} />

                    <FlatList
                        data={campaigns}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.campaignItem,
                                    { backgroundColor: selectedCampaignId === item.id ? currentTheme.primary + '20' : 'transparent' }
                                ]}
                                onPress={() => handleSelectCampaign(item.id)}
                            >
                                <View style={styles.campaignContent}>
                                    <Text style={[styles.campaignName, { color: currentTheme.text }]}>
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.campaignDescription, { color: currentTheme.noticeText }]}>
                                        {item.description && `${item.description} • `}
                                        {getSortedCombats(item.id).length} combats • {getSpellbooksByCampaign(item.id).length} spellbooks
                                    </Text>
                                </View>
                                {selectedCampaignId === item.id && (
                                    <Ionicons name="checkmark-circle" size={20} color={currentTheme.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                        ListHeaderComponent={
                            <TouchableOpacity
                                style={[
                                    styles.campaignItem,
                                    { backgroundColor: !selectedCampaignId ? currentTheme.primary + '20' : 'transparent' }
                                ]}
                                onPress={handleShowAll}
                            >
                                <View style={styles.campaignContent}>
                                    <Text style={[styles.campaignName, { color: currentTheme.text }]}>
                                        All Campaigns
                                    </Text>
                                    <Text style={[styles.campaignDescription, { color: currentTheme.noticeText }]}>
                                        Show all campaigns • {getSortedCombats(null).length} combats • {getSpellbooksByCampaign(undefined).length} spellbooks
                                    </Text>
                                </View>
                                {!selectedCampaignId && (
                                    <Ionicons name="checkmark-circle" size={20} color={currentTheme.primary} />
                                )}
                            </TouchableOpacity>
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text style={[styles.emptyText, { color: currentTheme.noticeText }]}>
                                    No campaigns available
                                </Text>
                            </View>
                        }
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 12,
        padding: 0,
        marginHorizontal: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
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
    separator: {
        height: 1,
        marginBottom: 0,
    },
});

export default CampaignSelectorModal;
