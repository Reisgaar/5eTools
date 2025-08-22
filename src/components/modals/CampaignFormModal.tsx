// REACT
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface CampaignData {
    name: string;
    description: string;
}

interface CampaignFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (campaignData: CampaignData) => Promise<void>;
    campaign?: CampaignData | null; // For editing existing campaign
    theme: any;
}

/**
 * CampaignFormModal component for creating and editing campaigns.
 */
export default function CampaignFormModal({
    visible,
    onClose,
    onSave,
    campaign,
    theme
}: CampaignFormModalProps) {
    const baseModalStyles = createBaseModalStyles(theme);
    
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form when modal opens or campaign changes
    useEffect(() => {
        if (visible) {
            if (campaign) {
                // Editing existing campaign
                setFormData({
                    name: campaign.name,
                    description: campaign.description || ''
                });
            } else {
                // Creating new campaign
                setFormData({
                    name: '',
                    description: ''
                });
            }
        }
    }, [visible, campaign]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            // You might want to show an alert here
            return;
        }

        setIsLoading(true);
        try {
            const campaignData: CampaignData = {
                name: formData.name.trim(),
                description: formData.description.trim()
            };

            await onSave(campaignData);
            onClose();
        } catch (error) {
            console.error('Error saving campaign:', error);
            // You might want to show an error alert here
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const updateFormField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <BaseModal
            visible={visible}
            onClose={handleCancel}
            theme={theme}
            title={campaign ? 'Edit Campaign' : 'Create Campaign'}
            maxHeight="70%"
        >
            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Campaign Name</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="Enter campaign name"
                    placeholderTextColor={theme.noticeText}
                    value={formData.name}
                    onChangeText={(text) => updateFormField('name', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Description (Optional)</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="Enter campaign description"
                    placeholderTextColor={theme.noticeText}
                    value={formData.description}
                    onChangeText={(text) => updateFormField('description', text)}
                    multiline
                    numberOfLines={3}
                />
            </View>

            <View style={baseModalStyles.actionRow}>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[baseModalStyles.modalButton, baseModalStyles.modalButtonPrimary]}
                    disabled={isLoading}
                >
                    <Text style={[baseModalStyles.modalButtonText, { color: 'white' }]}>
                        {isLoading ? 'Saving...' : (campaign ? 'Save' : 'Create')}
                    </Text>
                </TouchableOpacity>
            </View>
        </BaseModal>
    );
}
