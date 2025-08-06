import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseModal from './BaseModal';
import { commonStyles } from 'src/styles/commonStyles';
import { useSpellbook } from 'src/context/SpellbookContext';

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
        <View style={[styles.spellbookItem, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <TouchableOpacity 
                style={styles.spellbookInfo}
                onPress={() => selectSpellbook(item.id)}
            >
                <Text style={[styles.spellbookName, { color: theme.text }]}>{item.name}</Text>
                {item.description && (
                    <Text style={[styles.spellbookDescription, { color: theme.noticeText }]}>{item.description}</Text>
                )}
                <Text style={[styles.spellbookStats, { color: theme.noticeText }]}>
                    {item.spells.length} spells • Created {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            <View style={styles.spellbookActions}>
                {currentSpellbookId === item.id && (
                    <View style={[styles.currentIndicator, { backgroundColor: theme.primary }]}>
                        <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => handleDeleteSpellbook(item.id, item.name)}
                    style={[styles.deleteButton, { backgroundColor: '#dc2626' }]}
                >
                    <Ionicons name="trash" size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Spellbooks">

                    {/* Create new spellbook */}
                    <View style={[styles.createSection, { backgroundColor: theme.card }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Create New Spellbook</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                            placeholder="Spellbook name..."
                            placeholderTextColor={theme.noticeText}
                            value={newSpellbookName}
                            onChangeText={setNewSpellbookName}
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card }]}
                            placeholder="Description (optional)..."
                            placeholderTextColor={theme.noticeText}
                            value={newSpellbookDescription}
                            onChangeText={setNewSpellbookDescription}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={handleCreateSpellbook}
                            style={[styles.createButton, { backgroundColor: theme.primary }]}
                            disabled={!newSpellbookName.trim()}
                        >
                            <Text style={styles.createButtonText}>Create Spellbook</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Spellbooks list */}
                    <View style={styles.spellbooksSection}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Spellbooks</Text>
                        {spellbooks.length === 0 ? (
                            <Text style={[styles.emptyText, { color: theme.noticeText }]}>
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 16,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    createSection: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 12,
    },
    createButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    spellbooksSection: {
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
    },
    spellbookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    spellbookInfo: {
        flex: 1,
    },
    spellbookName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    spellbookDescription: {
        fontSize: 14,
        marginBottom: 4,
    },
    spellbookStats: {
        fontSize: 12,
    },
    spellbookActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
