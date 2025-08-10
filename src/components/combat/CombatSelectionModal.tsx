import React, { useState, useMemo } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Dimensions, FlatList } from 'react-native';
import { BaseModal } from '../ui';
import { CombatSelectionModalProps } from './types';
import { formatDate } from './utils';
import { createCombatStyles } from '../../styles/combat';

// CONTEXTS
import { useCampaign } from 'src/context/CampaignContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CombatSelectionModal({
  visible,
  onClose,
  beastToAdd,
  combats,
  currentCombatId,
  newCombatName,
  quantity,
  onNewCombatNameChange,
  onQuantityChange,
  onSelectCombat,
  onCreateNewCombat,
  theme
}: CombatSelectionModalProps) {
  const styles = createCombatStyles(theme);
  const { campaigns } = useCampaign();
  const [searchQuery, setSearchQuery] = useState('');

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
  const modalTitle = `Add ${beastToAdd?.name} to Combat`;

  return (
    <BaseModal
      visible={visible}
      onClose={onClose} 
      theme={theme} 
      title={modalTitle}
      width="90%"
      maxHeight="80%"
    >
      <View style={{ flex: 1, padding: 16 }}>
        {/* Quantity Selector */}
        <View style={styles.selectionContainer}>
          <Text style={[styles.selectionTitle, { color: theme.text }]}>Quantity</Text>
          <View style={styles.selectionRow}>
            <TouchableOpacity 
              onPress={() => {
                const currentQty = parseInt(quantity, 10) || 1;
                if (currentQty > 1) {
                  onQuantityChange(String(currentQty - 1));
                }
              }}
              style={[styles.selectionQuantityBtn, styles.selectionQuantityBtnLeft, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.selectionQuantityBtnText}>-</Text>
            </TouchableOpacity>
            
            <TextInput
              style={[styles.selectionQuantityInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }]}
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
              style={[styles.selectionQuantityBtn, styles.selectionQuantityBtnRight, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.selectionQuantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Filter */}
        <View style={{ marginBottom: 16 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 16,
              backgroundColor: theme.inputBackground,
              color: theme.text,
              borderColor: theme.border
            }}
            placeholder="Search combats..."
            placeholderTextColor={theme.noticeText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Existing Combats */}
        <View style={{ flex: 1, marginBottom: 16 }}>
          <Text style={[styles.selectionSectionTitle, { color: theme.text, marginBottom: 12 }]}>Select a combat</Text>
          {!combats || combats.length === 0 ? (
            <Text style={[styles.selectionEmptyText, { color: theme.noticeText }]}>
              Create a combat first.
            </Text>
          ) : filteredCombats.length === 0 ? (
            <Text style={[styles.selectionEmptyText, { color: theme.noticeText }]}>
              No combats found matching your search.
            </Text>
          ) : (
            <FlatList
              data={filteredCombats}
              keyExtractor={item => item.id}
              renderItem={({ item: combat }) => (
                <TouchableOpacity
                  onPress={() => onSelectCombat(combat.id)}
                  style={[
                    styles.selectionCombatOption,
                    { backgroundColor: theme.inputBackground, borderColor: currentCombatId === combat.id ? theme.primary : theme.border, marginBottom: 8 }
                  ]}
                >
                  <Text style={[styles.selectionCombatName, { color: theme.text }]}>
                    {combat.name}
                  </Text>
                  <Text style={[styles.selectionCombatInfo, { color: theme.noticeText }]}>
                    {`${formatDate(combat.createdAt)} • ${combat.combatants?.length || 0} creatures • ${getCampaignName(combat.campaignId)}`}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>

        {/* Create New Combat */}
        <View style={styles.selectionCreateSection}>
          <Text style={[styles.selectionSectionTitle, { color: theme.text }]}>Or create new combat</Text>
          <View style={styles.selectionCreateRow}>
            <TextInput
              style={[
                styles.selectionCreateInput,
                { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.primary }
              ]}
              placeholder="New combat name..."
              placeholderTextColor={theme.noticeText}
              value={newCombatName}
              onChangeText={onNewCombatNameChange}
            />
            <TouchableOpacity
              onPress={onCreateNewCombat}
              style={[
                styles.selectionCreateBtn,
                { backgroundColor: theme.primary }
              ]}
              disabled={!newCombatName.trim()}
            >
              <Text style={styles.selectionCreateBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BaseModal>
  );
}