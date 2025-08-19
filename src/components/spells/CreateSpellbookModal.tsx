// REACT
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useCampaignStore, useSpellbookStore } from 'src/stores';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface CreateSpellbookModalProps {
    visible: boolean;
    onClose: () => void;
    onSpellbookCreated?: (spellbookId: string) => void;
    theme: any;
}

/**
 * Modal for creating a new spellbook.
 */
export default function CreateSpellbookModal({
    visible,
    onClose,
    onSpellbookCreated,
    theme
}: CreateSpellbookModalProps) {
    const { createSpellbook } = useSpellbookStore();
    const { selectedCampaign, campaigns } = useCampaignStore();
    const [spellbookName, setSpellbookName] = useState('');
    const [spellbookDescription, setSpellbookDescription] = useState('');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(selectedCampaign?.id || undefined);
    const [showCampaignSelector, setShowCampaignSelector] = useState(false);
    const styles = createBaseModalStyles(theme);

    // Keep selectedCampaignId synchronized with selectedCampaign
    useEffect(() => {
        setSelectedCampaignId(selectedCampaign?.id || undefined);
    }, [selectedCampaign?.id]);

    // Reset form when modal becomes visible
    useEffect(() => {
        if (visible) {
            setSpellbookName('');
            setSpellbookDescription('');
            setSelectedCampaignId(selectedCampaign?.id || undefined);
            setShowCampaignSelector(false);
        }
    }, [visible, selectedCampaign?.id]);

    const handleCreateSpellbook = () => {
        if (!spellbookName.trim()) {
            Alert.alert('Error', 'Please enter a spellbook name.');
            return;
        }

        try {
            const newSpellbookId = createSpellbook(spellbookName.trim(), spellbookDescription.trim() || undefined, selectedCampaignId);
            setSpellbookName('');
            setSpellbookDescription('');
            setSelectedCampaignId(selectedCampaign?.id || undefined);
            onClose();

            if (onSpellbookCreated) {
                onSpellbookCreated(newSpellbookId);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create spellbook. Please try again.');
        }
    };

    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return 'Don\'t link to a campaign';
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : 'Unknown campaign';
    };

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Create New Spellbook"
            width='90%'
            maxHeight="80%"
            footerContent={
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={handleCreateSpellbook}
                        style={[styles.footerButton, { backgroundColor: theme.primary }]}
                        disabled={!spellbookName.trim()}
                    >
                        <Text style={styles.footerButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View style={styles.modalSection}>
                <Text style={[styles.modalText, { marginBottom: 8 }]}>Name *</Text>
                <TextInput
                    style={styles.modalInput}
                    placeholder="Enter spellbook name..."
                    placeholderTextColor={theme.noticeText}
                    value={spellbookName}
                    onChangeText={setSpellbookName}
                    autoFocus
                />

                <Text style={[styles.modalText, { marginBottom: 8 }]}>Description (optional)</Text>
                <TextInput
                    style={[styles.modalInput, { minHeight: 80 }]}
                    placeholder="Enter description..."
                    placeholderTextColor={theme.noticeText}
                    value={spellbookDescription}
                    onChangeText={setSpellbookDescription}
                    multiline
                    numberOfLines={3}
                />

                <Text style={[styles.modalText, { marginBottom: 8 }]}>Campaign (optional)</Text>

                {showCampaignSelector ? (
                    <View style={[styles.modalInput, { marginBottom: 0 }]}>
                        <TouchableOpacity
                            style={[{marginBottom: 8, paddingVertical: 4 }]}
                            onPress={() => {
                                setSelectedCampaignId(undefined);
                                setShowCampaignSelector(false);
                            }}
                        >
                            <Text style={styles.modalText}>Don't link to a campaign</Text>
                        </TouchableOpacity>
                        {campaigns.map((campaign, index) => (
                            <TouchableOpacity
                                key={campaign.id}
                                style={[{marginBottom: index === campaigns.length - 1 ? 0 : 8, paddingVertical: 4, borderTopWidth: 1, borderColor: theme.border }]}
                                onPress={() => {
                                    setSelectedCampaignId(campaign.id);
                                    setShowCampaignSelector(false);
                                }}
                            >
                                <Text style={styles.modalText}>{campaign.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.modalInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }]}
                        onPress={() => setShowCampaignSelector(!showCampaignSelector)}
                    >
                        <Text style={styles.modalText}>
                            {getCampaignName(selectedCampaignId)}
                        </Text>
                        <Ionicons name={showCampaignSelector ? 'chevron-up' : 'chevron-down'} size={20} color={theme.text} />
                    </TouchableOpacity>    
                )}
            </View>
        </BaseModal>
    );
}
