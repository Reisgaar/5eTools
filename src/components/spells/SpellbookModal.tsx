import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../ui';
import { commonStyles } from '../../styles/commonStyles';
import { useSpellbook } from '../../context/SpellbookContext';

interface SpellbookModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
}

export default function SpellbookModal({ visible, onClose, theme }: SpellbookModalProps) {
    const { spellbooks, currentSpellbookId, createSpellbook, deleteSpellbook, selectSpellbook } = useSpellbook();
    const [newSpellbookName, setNewSpellbookName] = useState('');
    const [newSpellbookDescription, setNewSpellbookDescription] = useState('');

    const handleCreateSpellbook = () => {
        if (newSpellbookName.trim()) {
            createSpellbook(newSpellbookName.trim(), newSpellbookDescription.trim() || undefined);
            setNewSpellbookName('');
            setNewSpellbookDescription('');
        }
    };

    const handleDeleteSpellbook = (id: string, name: string) => {
        Alert.alert(
            'Delete Spellbook',
            `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => deleteSpellbook(id)
                }
            ]
        );
    };

    const renderSpellbookItem = ({ item }: { item: any }) => (
        <View style={[commonStyles.modalItem, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <TouchableOpacity 
                style={commonStyles.modalItemInfo}
                onPress={() => selectSpellbook(item.id)}
            >
                <Text style={[commonStyles.modalItemName, { color: theme.text }]}>{item.name}</Text>
                {item.description && (
                    <Text style={[commonStyles.modalItemDescription, { color: theme.noticeText }]}>{item.description}</Text>
                )}
                <Text style={[commonStyles.modalItemStats, { color: theme.noticeText }]}>
                    {item.spells.length} spells • Created {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                {currentSpellbookId === item.id && (
                    <View style={[{ width: 24, height: 24, borderRadius: 12, marginRight: 8, alignItems: 'center' as const, justifyContent: 'center' as const }, { backgroundColor: theme.primary }]}>
                        <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => handleDeleteSpellbook(item.id, item.name)}
                    style={[commonStyles.modalActionButton, { backgroundColor: '#dc2626' }]}
                >
                    <Ionicons name="trash" size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Spellbooks">

                    {/* Create new spellbook */}
                    <View style={[commonStyles.section, { backgroundColor: theme.card }]}>
                        <Text style={[commonStyles.sectionTitle, { color: theme.text }]}>Create New Spellbook</Text>
                        <TextInput
                            style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                            placeholder="Spellbook name..."
                            placeholderTextColor={theme.noticeText}
                            value={newSpellbookName}
                            onChangeText={setNewSpellbookName}
                        />
                        <TextInput
                            style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                            placeholder="Description (optional)..."
                            placeholderTextColor={theme.noticeText}
                            value={newSpellbookDescription}
                            onChangeText={setNewSpellbookDescription}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={handleCreateSpellbook}
                            style={[commonStyles.modalActionButton, { backgroundColor: theme.primary }]}
                            disabled={!newSpellbookName.trim()}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Create Spellbook</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Spellbooks list */}
                    <View style={commonStyles.spellbooksSection}>
                        <Text style={[commonStyles.sectionTitle, { color: theme.text }]}>Your Spellbooks</Text>
                        {spellbooks.length === 0 ? (
                            <Text style={[commonStyles.emptyText, { color: theme.noticeText }]}>
                                No spellbooks yet. Create your first one above!
                            </Text>
                        ) : (
                            <FlatList
                                data={spellbooks}
                                renderItem={renderSpellbookItem}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
        </BaseModal>
    );
}


