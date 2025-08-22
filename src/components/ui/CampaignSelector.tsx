// REACT
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useCampaignStore } from 'src/stores';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface CampaignSelectorProps {
    selectedCampaignId?: string;
    onCampaignChange: (campaignId?: string) => void;
    theme: any;
    label?: string;
}

/**
 * Component for selecting a campaign.
 */
export default function CampaignSelector({
    selectedCampaignId,
    onCampaignChange,
    theme,
}: CampaignSelectorProps): JSX.Element {
    const { campaigns } = useCampaignStore();
    const [showCampaignSelector, setShowCampaignSelector] = useState(false);
    const styles = createBaseModalStyles(theme);

    const getCampaignName = (campaignId?: string) => {
        if (!campaignId) return 'Don\'t link to a campaign';
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign ? campaign.name : 'Unknown campaign';
    };

    return (
        <View>
            <Text style={[styles.modalText, { marginBottom: 8 }]}>
                {showCampaignSelector ? 'Select one option' : 'Campaign (optional)'}
            </Text>
            {showCampaignSelector ? (
                <View style={[styles.modalInput, { marginBottom: 0 }]}>
                    <TouchableOpacity
                        style={[{marginBottom: 8, paddingVertical: 4 }]}
                        onPress={() => {
                            onCampaignChange(undefined);
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
                                onCampaignChange(campaign.id);
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
    );
};
