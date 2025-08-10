import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../ui';
import { commonStyles } from '../../styles/commonStyles';
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

    const handleCancel = () => {
        setSpellbookName('');
        setSpellbookDescription('');
        setSelectedCampaignId(selectedCampaign?.id || undefined);
        onClose();
    };

    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return 'No campaign';
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : 'Unknown campaign';
    };

    return (
        <BaseModal visible={visible} onClose={handleCancel} theme={theme} title="Create New Spellbook">
            <View style={[commonStyles.section, { backgroundColor: theme.card, marginBottom: 16 }]}>
                <Text style={[commonStyles.sectionTitle, { color: theme.text, marginBottom: 16 }]}>Spellbook Details</Text>
                
                <Text style={[commonStyles.modalItemDescription, { color: theme.text, marginBottom: 8 }]}>Name *</Text>
                <TextInput
                    style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card, marginBottom: 16 }]}
                    placeholder="Enter spellbook name..."
                    placeholderTextColor={theme.noticeText}
                    value={spellbookName}
                    onChangeText={setSpellbookName}
                    autoFocus
                />
                
                <Text style={[commonStyles.modalItemDescription, { color: theme.text, marginBottom: 8 }]}>Description (optional)</Text>
                <TextInput
                    style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card, marginBottom: 16, minHeight: 80 }]}
                    placeholder="Enter description..."
                    placeholderTextColor={theme.noticeText}
                    value={spellbookDescription}
                    onChangeText={setSpellbookDescription}
                    multiline
                    numberOfLines={3}
                />
                
                <Text style={[commonStyles.modalItemDescription, { color: theme.text, marginBottom: 8 }]}>Campaign (optional)</Text>
                <TouchableOpacity
                    style={[commonStyles.input, { backgroundColor: theme.inputBackground, borderColor: theme.card, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                    onPress={() => setShowCampaignSelector(!showCampaignSelector)}
                >
                    <Text style={{ color: theme.text, flex: 1 }}>
                        {getCampaignName(selectedCampaignId)}
                    </Text>
                    <Ionicons name={showCampaignSelector ? "chevron-up" : "chevron-down"} size={20} color={theme.text} />
                </TouchableOpacity>
                
                {showCampaignSelector && (
                    <ScrollView style={{ maxHeight: 200, marginBottom: 24 }}>
                        <TouchableOpacity
                            style={[commonStyles.input, { backgroundColor: theme.inputBackground, borderColor: theme.card, marginBottom: 8, paddingVertical: 12 }]}
                            onPress={() => {
                                setSelectedCampaignId(undefined);
                                setShowCampaignSelector(false);
                            }}
                        >
                            <Text style={{ color: theme.text }}>No campaign</Text>
                        </TouchableOpacity>
                        {campaigns.map(campaign => (
                            <TouchableOpacity
                                key={campaign.id}
                                style={[commonStyles.input, { backgroundColor: theme.inputBackground, borderColor: theme.card, marginBottom: 8, paddingVertical: 12 }]}
                                onPress={() => {
                                    setSelectedCampaignId(campaign.id);
                                    setShowCampaignSelector(false);
                                }}
                            >
                                <Text style={{ color: theme.text }}>{campaign.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={[commonStyles.modalActionButton, { backgroundColor: '#6b7280', flex: 1, paddingVertical: 12 }]}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleCreateSpellbook}
                        style={[commonStyles.modalActionButton, { backgroundColor: theme.primary, flex: 1, paddingVertical: 12 }]}
                        disabled={!spellbookName.trim()}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}
