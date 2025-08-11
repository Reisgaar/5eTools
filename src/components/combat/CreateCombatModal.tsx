import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCampaign } from 'src/context/CampaignContext';
import CampaignSelector from 'src/components/ui/CampaignSelector';

interface CreateCombatModalProps {
    visible: boolean;
    onClose: () => void;
    onCreateCombat: (name: string, campaignId?: string) => void;
    theme: any;
}

const CreateCombatModal: React.FC<CreateCombatModalProps> = ({
    visible,
    onClose,
    onCreateCombat,
    theme
}) => {
    const [combatName, setCombatName] = useState('');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined);

    const handleCreateCombat = () => {
        if (!combatName.trim()) {
            // Show error or alert
            return;
        }

        onCreateCombat(combatName.trim(), selectedCampaignId);
        setCombatName('');
        setSelectedCampaignId(undefined);
        onClose();
    };

    const handleCancel = () => {
        setCombatName('');
        setSelectedCampaignId(undefined);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Create New Combat
                        </Text>
                        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.separator, { backgroundColor: theme.border }]} />

                    <View style={styles.modalBody}>
                        <Text style={[styles.fieldLabel, { color: theme.text }]}>Combat Name *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                            placeholder="Enter combat name..."
                            placeholderTextColor={theme.noticeText}
                            value={combatName}
                            onChangeText={setCombatName}
                            autoFocus
                        />

                        <CampaignSelector
                            selectedCampaignId={selectedCampaignId}
                            onCampaignChange={setSelectedCampaignId}
                            theme={theme}
                            label="Campaign (optional)"
                        />
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={[styles.button, { backgroundColor: '#6b7280', marginRight: 8 }]}
                        >
                            <Text style={[styles.buttonText, { color: 'white' }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleCreateCombat}
                            style={[styles.button, { backgroundColor: theme.primary, marginLeft: 8 }]}
                            disabled={!combatName.trim()}
                        >
                            <Text style={[styles.buttonText, { color: 'white' }]}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 12,
        padding: 0,
        marginHorizontal: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        marginVertical: 10,
    },
});

export default CreateCombatModal;
