// REACT
import React, { useState, useMemo } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useCampaignStore } from 'src/stores';

// MODELS
import { CombatSelectionModalProps } from 'src/models/interfaces/combat';

// UTILS
import { formatDate } from 'src/utils/combatUtils';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

/**
 * Modal for selecting a combat.
 */
export default function CombatSelectionModal({
    visible,
    onClose,
    beastToAdd,
    combats,
    quantity,
    onQuantityChange,
    onSelectCombat,
    theme
}: CombatSelectionModalProps): JSX.Element {
    const { campaigns } = useCampaignStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [tokenUrl, setTokenUrl] = useState<string | null>(null);
    const [selectedCombatId, setSelectedCombatId] = useState<string | null>(null);
    const baseModalStyles = createBaseModalStyles(theme);

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

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={`Add ${beastToAdd?.name + ' '}to Combat`}
            footerContent={
                <View style={styles.beastInfoRow}>
                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
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

                    {/* Add Button */}
                    <View>
                        <TouchableOpacity
                            onPress={() => { selectedCombatId && onSelectCombat(selectedCombatId) }}
                            style={[
                                baseModalStyles.footerButton,
                                {
                                    width: 80,
                                    backgroundColor: selectedCombatId ? theme.primary : theme.secondary,
                                    opacity: selectedCombatId ? 1 : 0.5
                                }
                            ]}
                            disabled={!selectedCombatId}
                        >
                            <Text style={baseModalStyles.footerButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        >
                    <View>
                        {/* Search Filter */}
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Search</Text>
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
                                <>
                                    {filteredCombats.map((combat) => (
                                        <TouchableOpacity
                                            key={combat.id}
                                            style={[
                                                styles.combatItem,
                                                { borderColor: theme.border },
                                                combat.id === selectedCombatId && { backgroundColor: theme.primary + '20' }
                                            ]}
                                            onPress={() => setSelectedCombatId(combat.id)}
                                        >
                                            <View style={styles.combatContent}>
                                                <Text style={[styles.combatName, { color: theme.text }]}>{combat.name}</Text>
                                                <Text style={[styles.combatCount, { color: theme.noticeText }]}>
                                                    {getCampaignName(combat.campaignId)} • {formatDate(combat.createdAt)}
                                                </Text>
                                            </View>
                                            {combat.id === selectedCombatId && (
                                                <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </View>
                    </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
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
        width: 32,
        height: 32,
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
        minWidth: 50,
        paddingVertical: 6,
        paddingHorizontal: 12,
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
    beastInfoRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    beastTokenContainer: {
        width: 50,
        height: 50,
        borderRadius: 20,
        overflow: 'hidden',
    },
    beastToken: {
        width: '100%',
        height: '100%',
    },
    beastName: {
        fontSize: 16,
        fontWeight: '600',
    },
    quantityContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
});
