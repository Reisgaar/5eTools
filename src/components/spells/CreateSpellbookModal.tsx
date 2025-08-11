import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../ui';
import { createBaseModalStyles } from '../../styles/baseModalStyles';
import { useSpellbook } from '../../context/SpellbookContext';
import { useCampaign } from '../../context/CampaignContext';

interface CreateSpellbookModalProps {
    visible: boolean;
    onClose: () => void;
    onSpellbookCreated?: (spellbookId: string) => void;
    theme: any;
}

export default function CreateSpellbookModal({ 
    visible, 
    onClose, 
    onSpellbookCreated,
    theme 
}: CreateSpellbookModalProps) {
    const { createSpellbook } = useSpellbook();
    const { selectedCampaign, campaigns } = useCampaign();
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
        if (!campaignId) return 'No campaign selected';
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : 'Unknown campaign';
    };

    return (
        <BaseModal 
            visible={visible} 
            onClose={onClose} 
            theme={theme} 
            title="Create New Spellbook"
            width={Platform.OS === 'web' ? 450 : '90%'}
            maxHeight="80%"
            scrollable={true}
        >
            <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Spellbook Details</Text>
                
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
                <TouchableOpacity
                    style={[styles.modalInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                    onPress={() => setShowCampaignSelector(!showCampaignSelector)}
                >
                    <Text style={styles.modalText}>
                        {getCampaignName(selectedCampaignId)}
                    </Text>
                    <Ionicons name={showCampaignSelector ? "chevron-up" : "chevron-down"} size={20} color={theme.text} />
                </TouchableOpacity>
                
                {showCampaignSelector && (
                    <ScrollView style={{ maxHeight: 200, marginBottom: 24 }}>
                        <TouchableOpacity
                            style={[styles.modalInput, { marginBottom: 8, paddingVertical: 12 }]}
                            onPress={() => {
                                setSelectedCampaignId(undefined);
                                setShowCampaignSelector(false);
                            }}
                        >
                            <Text style={styles.modalText}>No campaign selected</Text>
                        </TouchableOpacity>
                        {campaigns.map(campaign => (
                            <TouchableOpacity
                                key={campaign.id}
                                style={[styles.modalInput, { marginBottom: 8, paddingVertical: 12 }]}
                                onPress={() => {
                                    setSelectedCampaignId(campaign.id);
                                    setShowCampaignSelector(false);
                                }}
                            >
                                <Text style={styles.modalText}>{campaign.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
            
            <View style={styles.modalSection}>
                <TouchableOpacity
                    onPress={handleCreateSpellbook}
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    disabled={!spellbookName.trim()}
                >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Create</Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
}
