import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCampaign } from 'src/context/CampaignContext';

interface CampaignSelectorProps {
    selectedCampaignId?: string;
    onCampaignChange: (campaignId?: string) => void;
    theme: any;
    label?: string;
}

const CampaignSelector: React.FC<CampaignSelectorProps> = ({
    selectedCampaignId,
    onCampaignChange,
    theme,
    label = "Campaign (optional)"
}) => {
    const { campaigns } = useCampaign();
    const [showCampaignSelector, setShowCampaignSelector] = useState(false);

    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return 'No campaign';
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : 'Unknown campaign';
    };

    return (
        <View>
            <Text style={{ color: theme.text, marginBottom: 8, fontSize: 14, fontWeight: '500' }}>
                {label}
            </Text>
            <TouchableOpacity
                style={{
                    backgroundColor: theme.inputBackground,
                    borderWidth: 1,
                    borderColor: theme.card,
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16
                }}
                onPress={() => setShowCampaignSelector(!showCampaignSelector)}
            >
                <Text style={{ color: theme.text, flex: 1 }}>
                    {getCampaignName(selectedCampaignId)}
                </Text>
                <Ionicons name={showCampaignSelector ? "chevron-up" : "chevron-down"} size={20} color={theme.text} />
            </TouchableOpacity>
            
            {showCampaignSelector && (
                <ScrollView style={{ maxHeight: 200, marginBottom: 16 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: theme.inputBackground,
                            borderWidth: 1,
                            borderColor: theme.card,
                            borderRadius: 8,
                            marginBottom: 8,
                            paddingVertical: 12,
                            paddingHorizontal: 16
                        }}
                        onPress={() => {
                            onCampaignChange(undefined);
                            setShowCampaignSelector(false);
                        }}
                    >
                        <Text style={{ color: theme.text }}>No campaign</Text>
                    </TouchableOpacity>
                    {campaigns.map(campaign => (
                        <TouchableOpacity
                            key={campaign.id}
                            style={{
                                backgroundColor: theme.inputBackground,
                                borderWidth: 1,
                                borderColor: theme.card,
                                borderRadius: 8,
                                marginBottom: 8,
                                paddingVertical: 12,
                                paddingHorizontal: 16
                            }}
                            onPress={() => {
                                onCampaignChange(campaign.id);
                                setShowCampaignSelector(false);
                            }}
                        >
                            <Text style={{ color: theme.text }}>{campaign.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default CampaignSelector;
