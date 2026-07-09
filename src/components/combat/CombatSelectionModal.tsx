// REACT
import React, { useState, useMemo } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';

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
}: CombatSelectionModalProps): React.JSX.Element {
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
        fontSize: styleConstants.fontSizeLG,
        fontWeight: '600',
        marginBottom: styleConstants.marginSM,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: styleConstants.borderRadius2XL,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeXL,
    },
    quantityInput: {
        minWidth: 50,
        paddingVertical: styleConstants.paddingXS,
        paddingHorizontal: styleConstants.paddingMD,
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        textAlign: 'center',
        marginHorizontal: styleConstants.marginSM,
        fontSize: styleConstants.fontSizeLG,
    },
    searchSection: {
        marginBottom: styleConstants.marginLG,
    },
    searchInput: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        padding: styleConstants.paddingMD,
        fontSize: styleConstants.fontSizeLG,
    },
    combatListSection: {
        marginBottom: styleConstants.marginLG,
    },
    combatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingLG,
        borderBottomWidth: styleConstants.borderXS,
        marginBottom: styleConstants.marginXS,
        borderRadius: styleConstants.borderRadiusSM,
    },
    combatContent: {
        flex: 1,
    },
    combatName: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: '600',
        marginBottom: styleConstants.marginXS,
    },
    combatCount: {
        fontSize: styleConstants.fontSizeMD,
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginVertical: styleConstants.marginSM,
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
        borderRadius: styleConstants.borderRadius2XL,
        overflow: 'hidden',
    },
    beastToken: {
        width: '100%',
        height: '100%',
    },
    beastName: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: '600',
    },
    quantityContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityLabel: {
        fontSize: styleConstants.fontSizeMD,
        marginBottom: styleConstants.marginXS,
    },
});
