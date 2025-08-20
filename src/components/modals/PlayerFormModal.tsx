// REACT
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View } from 'react-native';

// COMPONENTS
import { BaseModal, ImagePicker as PlayerImagePicker } from 'src/components/ui';
import CampaignSelector from 'src/components/ui/CampaignSelector';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface PlayerData {
    name: string;
    race: string;
    class: string;
    maxHp: number;
    ac: number;
    passivePerception: number;
    initiativeBonus: number;
    tokenUrl: string;
    campaignId?: string;
}

interface PlayerFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (playerData: PlayerData) => Promise<void>;
    player?: PlayerData | null; // For editing existing player
    campaigns: { id: string; name: string }[];
    theme: any;
}

/**
 * PlayerFormModal component for creating and editing players.
 */
export default function PlayerFormModal({
    visible,
    onClose,
    onSave,
    player,
    campaigns,
    theme
}: PlayerFormModalProps) {
    const baseModalStyles = createBaseModalStyles(theme);
    
    const [formData, setFormData] = useState({
        name: '',
        race: '',
        class: '',
        maxHp: '',
        ac: '',
        passivePerception: '',
        initiativeBonus: '',
        tokenUrl: '',
        campaignId: ''
    });
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form when modal opens or player changes
    useEffect(() => {
        if (visible) {
            if (player) {
                // Editing existing player
                setFormData({
                    name: player.name,
                    race: player.race,
                    class: player.class,
                    maxHp: player.maxHp?.toString() || '',
                    ac: player.ac?.toString() || '',
                    passivePerception: player.passivePerception?.toString() || '',
                    initiativeBonus: player.initiativeBonus?.toString() || '',
                    tokenUrl: player.tokenUrl || '',
                    campaignId: player.campaignId || '',
                });
                setSelectedImageUri(null);
            } else {
                // Creating new player
                setFormData({
                    name: '',
                    race: '',
                    class: '',
                    maxHp: '',
                    ac: '',
                    passivePerception: '',
                    initiativeBonus: '',
                    tokenUrl: '',
                    campaignId: ''
                });
                setSelectedImageUri(null);
            }
        }
    }, [visible, player]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            // You might want to show an alert here
            return;
        }

        setIsLoading(true);
        try {
            const playerData: PlayerData = {
                name: formData.name,
                race: formData.race,
                class: formData.class,
                maxHp: parseInt(formData.maxHp) || 0,
                ac: parseInt(formData.ac) || 0,
                passivePerception: parseInt(formData.passivePerception) || 10,
                initiativeBonus: (() => {
                    const value = formData.initiativeBonus.trim();
                    if (!value) return 0;
                    const cleanValue = value.replace(/^\+/, '');
                    const parsed = parseInt(cleanValue);
                    return isNaN(parsed) ? 0 : parsed;
                })(),
                tokenUrl: selectedImageUri || formData.tokenUrl?.trim() || '',
                campaignId: formData.campaignId || undefined,
            };

            await onSave(playerData);
            onClose();
        } catch (error) {
            console.error('Error saving player:', error);
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
            title={player ? 'Edit Player' : 'Add Player'}
            maxHeight="90%"
            footerContent={(
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={[baseModalStyles.modalButton, baseModalStyles.modalButtonPrimary, { 
                            width: '48%', 
                            marginRight: '2%', 
                            backgroundColor: '#dc2626' 
                        }]}
                        disabled={isLoading}
                    >
                        <Text style={[baseModalStyles.modalButtonText, { color: 'white' }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[baseModalStyles.modalButton, baseModalStyles.modalButtonPrimary, { 
                            width: '48%', 
                            marginLeft: '2%' 
                        }]}
                        disabled={isLoading}
                    >
                        <Text style={[baseModalStyles.modalButtonText, { color: 'white' }]}>
                            {isLoading ? 'Saving...' : (player ? 'Save' : 'Add')}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        >
            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Character Name</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="Enter character name"
                    placeholderTextColor={theme.noticeText}
                    value={formData.name}
                    onChangeText={(text) => updateFormField('name', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Race</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="e.g., Human, Elf, Dwarf"
                    placeholderTextColor={theme.noticeText}
                    value={formData.race}
                    onChangeText={(text) => updateFormField('race', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Class</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="e.g., Fighter, Wizard, Cleric"
                    placeholderTextColor={theme.noticeText}
                    value={formData.class}
                    onChangeText={(text) => updateFormField('class', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Maximum Hit Points</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="e.g., 25"
                    placeholderTextColor={theme.noticeText}
                    keyboardType="numeric"
                    value={formData.maxHp}
                    onChangeText={(text) => updateFormField('maxHp', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Armor Class</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="e.g., 16"
                    placeholderTextColor={theme.noticeText}
                    keyboardType="numeric"
                    value={formData.ac}
                    onChangeText={(text) => updateFormField('ac', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Passive Perception</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="e.g., 14"
                    placeholderTextColor={theme.noticeText}
                    keyboardType="numeric"
                    value={formData.passivePerception}
                    onChangeText={(text) => updateFormField('passivePerception', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <Text style={[baseModalStyles.modalSectionTitle, { color: theme.text }]}>Initiative Bonus</Text>
                <TextInput
                    style={[baseModalStyles.modalInput, { 
                        backgroundColor: theme.inputBackground, 
                        color: theme.text, 
                        borderColor: theme.border 
                    }]}
                    placeholder="e.g., +3, -1, 2"
                    placeholderTextColor={theme.noticeText}
                    keyboardType="numeric"
                    value={formData.initiativeBonus}
                    onChangeText={(text) => updateFormField('initiativeBonus', text)}
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <CampaignSelector
                    selectedCampaignId={formData.campaignId || undefined}
                    onCampaignChange={(campaignId) => updateFormField('campaignId', campaignId || '')}
                    theme={theme}
                    label="Campaign (optional)"
                />
            </View>

            <View style={baseModalStyles.modalSection}>
                <PlayerImagePicker
                    currentImageUri={selectedImageUri || formData.tokenUrl}
                    onImageSelected={setSelectedImageUri}
                    theme={theme}
                />
            </View>
        </BaseModal>
    );
}
