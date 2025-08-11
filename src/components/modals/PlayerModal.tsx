import React from 'react';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../ui';
import { createBaseModalStyles } from '../../styles/baseModalStyles';
import { DEFAULT_PLAYER_TOKEN } from '../../constants/tokens';
import { useCampaign } from '../../context/CampaignContext';

interface Player {
  name: string;
  race: string;
  class: string;
  campaignId?: string;
  tokenUrl?: string;
}

interface PlayerModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPlayers: () => void;
  allPlayers: Player[];
  selectedPlayers: string[];
  onPlayerToggle: (playerName: string) => void;
  theme: any;
}

export default function PlayerModal({
  visible,
  onClose,
  onAddPlayers,
  allPlayers,
  selectedPlayers,
  onPlayerToggle,
  theme
}: PlayerModalProps) {
  const { selectedCampaign, campaigns } = useCampaign();
  const styles = createBaseModalStyles(theme);

  // Filter players by selected campaign
  const filteredPlayers = React.useMemo(() => {
    const selectedCampaignId = selectedCampaign?.id || 'all';
    if (selectedCampaignId === 'all') {
      // Show all players when "all" is selected
      return allPlayers;
    } else {
      // Show only players from the selected campaign
      return allPlayers.filter(player => player.campaignId === selectedCampaignId);
    }
  }, [allPlayers, selectedCampaign?.id]);

  // Helper function to get campaign name
  const getCampaignName = (campaignId?: string) => {
    if (!campaignId) return null;
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : null;
  };
  
  return (
    <BaseModal 
      visible={visible} 
      onClose={onClose} 
      theme={theme} 
      title="Add Players to Combat"
      scrollable={true}
    >
      {filteredPlayers.length === 0 ? (
        <Text style={styles.modalNoticeText}>
          No players found.
        </Text>
      ) : (
        filteredPlayers.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.modalListItem,
              { marginBottom: 8, borderRadius: 8 }
            ]}
            onPress={() => onPlayerToggle(item.name)}
          >
            <Ionicons
              name={selectedPlayers.includes(item.name) ? 'checkbox' : 'square-outline'}
              size={22}
              color={theme.primary}
              style={{ marginRight: 12 }}
            />
            <Image
              source={{ uri: item.tokenUrl || DEFAULT_PLAYER_TOKEN }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 12,
                borderWidth: 2,
                borderColor: '#22c55a'
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalListItemText, { fontWeight: 'bold' }]}>{item.name}</Text>
              <Text style={styles.modalListItemSubtext}>
                {item.race} - {item.class}
              </Text>
              {getCampaignName(item.campaignId) && (
                <Text style={styles.modalNoticeText}>
                  Campaign: {getCampaignName(item.campaignId)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
      
      <TouchableOpacity 
        onPress={onAddPlayers} 
        style={[styles.modalButton, styles.modalButtonPrimary, { marginTop: 16 }]}
      > 
        <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Add</Text>
      </TouchableOpacity>
    </BaseModal>
  );
}
