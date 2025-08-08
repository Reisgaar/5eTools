import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { BaseModal } from '../ui';
import { commonStyles } from '../../styles/commonStyles';
import { useSpellbook } from '../../context/SpellbookContext';

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
    const [spellbookName, setSpellbookName] = useState('');
    const [spellbookDescription, setSpellbookDescription] = useState('');

    const handleCreateSpellbook = () => {
        if (!spellbookName.trim()) {
            Alert.alert('Error', 'Please enter a spellbook name.');
            return;
        }

        try {
            const newSpellbookId = createSpellbook(spellbookName.trim(), spellbookDescription.trim() || undefined);
            setSpellbookName('');
            setSpellbookDescription('');
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
        onClose();
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
                    style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card, marginBottom: 24, minHeight: 80 }]}
                    placeholder="Enter description..."
                    placeholderTextColor={theme.noticeText}
                    value={spellbookDescription}
                    onChangeText={setSpellbookDescription}
                    multiline
                    numberOfLines={3}
                />
                
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
