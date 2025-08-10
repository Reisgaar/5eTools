import React, { useState, useMemo } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CombatSelectionModalProps } from './types';
import { formatDate } from './utils';
import { getTokenUrl } from 'src/utils/tokenCache';

// CONTEXTS
import { useCampaign } from 'src/context/CampaignContext';

export default function CombatSelectionModal({
  visible,
  onClose,
  beastToAdd,
  combats,
  currentCombatId,
  quantity,
  onQuantityChange,
  onSelectCombat,
  theme
}: CombatSelectionModalProps) {
  const { campaigns } = useCampaign();
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenUrl, setTokenUrl] = useState<string | null>(null);

  // Load token URL when beast changes
  React.useEffect(() => {
    if (beastToAdd) {
      console.log('Beast to add:', beastToAdd.name, 'Token URL:', beastToAdd.tokenUrl);
      // Try to get token URL from beast data first
      if (beastToAdd.tokenUrl) {
        console.log('Using beast token URL:', beastToAdd.tokenUrl);
        setTokenUrl(beastToAdd.tokenUrl);
      } else {
        // Generate a default token URL for 5e.tools
        const defaultUrl = `https://5e.tools/img/bestiary/tokens/${beastToAdd.source}/${encodeURIComponent(beastToAdd.name)}.webp`;
        console.log('Using default token URL:', defaultUrl);
        setTokenUrl(defaultUrl);
      }
    } else {
      setTokenUrl(null);
    }
  }, [beastToAdd]);

  // Filter combats by search query
  const filteredCombats = useMemo(() => {
    if (!searchQuery.trim()) return combats;
    return combats.filter(combat => 
      combat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [combats, searchQuery]);

  // Helper function to get campaign name
  const getCampaignName = (campaignId?: string) => {
    if (!campaignId) return 'No campaign';
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? `Campaign ${campaign.name}` : 'Unknown campaign';
  };

  // Create title with beast name
  const modalTitle = `Add to Combat`;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.modalContent, { backgroundColor: theme.card }]} activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {modalTitle}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          <View style={styles.modalBody}>
            {/* Beast Info and Quantity Selector */}
            <View style={styles.beastInfoSection}>
              <View style={styles.beastInfoRow}>
                {/* Beast Token */}
                {beastToAdd && tokenUrl && (
                  <View style={styles.beastTokenContainer}>
                    <Image
                      source={{ uri: tokenUrl }}
                      style={styles.beastToken}
                      onError={() => {
                        console.warn('Failed to load token image for:', beastToAdd.name);
                      }}
                    />
                  </View>
                )}
                
                {/* Beast Name */}
                <View style={styles.beastNameContainer}>
                  <Text style={[styles.beastName, { color: theme.text }]} numberOfLines={2}>
                    {beastToAdd?.name || 'Unknown Beast'}
                  </Text>
                </View>
                
                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                  <Text style={[styles.quantityLabel, { color: theme.text }]}>Quantity</Text>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity 
                      onPress={() => {
                        const currentQty = parseInt(quantity, 10) || 1;
                        if (currentQty > 1) {
                          onQuantityChange(String(currentQty - 1));
                        }
                      }}
                      style={[styles.quantityButton, { backgroundColor: theme.primary }]}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <TextInput
                      style={[styles.quantityInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }]}
                      value={quantity}
                      onChangeText={onQuantityChange}
                      keyboardType="numeric"
                      textAlign="center"
                    />
                    
                    <TouchableOpacity 
                      onPress={() => {
                        const currentQty = parseInt(quantity, 10) || 1;
                        onQuantityChange(String(currentQty + 1));
                      }}
                      style={[styles.quantityButton, { backgroundColor: theme.primary }]}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Search Filter */}
            <View style={styles.searchSection}>
              <TextInput
                style={[styles.searchInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
                placeholder="Search combats..."
                placeholderTextColor={theme.noticeText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Combat List */}
            <View style={styles.combatListSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Combat</Text>
              {filteredCombats.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.noticeText }]}>No combats found</Text>
              ) : (
                <ScrollView style={styles.combatListScroll}>
                  {filteredCombats.map((combat) => (
                    <TouchableOpacity
                      key={combat.id}
                      style={[
                        styles.combatItem,
                        { borderColor: theme.border },
                        combat.id === currentCombatId && { backgroundColor: theme.primary + '20' }
                      ]}
                      onPress={() => onSelectCombat(combat.id)}
                    >
                      <View style={styles.combatContent}>
                        <Text style={[styles.combatName, { color: theme.text }]}>{combat.name}</Text>
                        <Text style={[styles.combatCount, { color: theme.noticeText }]}>
                          {getCampaignName(combat.campaignId)} • {formatDate(combat.createdAt)}
                        </Text>
                      </View>
                      {combat.id === currentCombatId && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

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
  separator: {
    height: 1,
    marginBottom: 0,
  },
  modalBody: {
    padding: 20,
  },
  quantitySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    marginHorizontal: 8,
    fontSize: 16,
  },
  searchSection: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  combatListSection: {
    marginBottom: 16,
  },
  combatListScroll: {
    maxHeight: 200,
  },
  combatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginBottom: 4,
    borderRadius: 6,
  },
  combatContent: {
    flex: 1,
  },
  combatName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  combatCount: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 8,
  },
  beastInfoSection: {
    marginBottom: 16,
  },
  beastInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  beastTokenContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  beastToken: {
    width: '100%',
    height: '100%',
  },
  beastNameContainer: {
    flex: 1,
    marginRight: 10,
  },
  beastName: {
    fontSize: 16,
    fontWeight: '600',
    maxWidth: '80%',
  },
  quantityContainer: {
    marginLeft: 10,
  },
  quantityLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
});