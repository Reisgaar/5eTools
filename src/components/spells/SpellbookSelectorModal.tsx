import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { BaseModal } from '../ui';
import { commonStyles } from '../../styles/commonStyles';
import { useSpellbook } from '../../context/SpellbookContext';
import SpellbookItem from './SpellbookItem';
import { useSpellbookSearch } from './useSpellbookSearch';
import ConfirmModal from '../modals/ConfirmModal';

interface SpellbookSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectSpellbook: (spellbookId: string) => void;
    onSpellbookDeleted?: (spellbookId: string) => void;
    theme: any;
}

export default function SpellbookSelectorModal({ 
    visible, 
    onClose, 
    onSelectSpellbook,
    onSpellbookDeleted,
    theme 
}: SpellbookSelectorModalProps) {
    const { spellbooks, currentSpellbookId, deleteSpellbook } = useSpellbook();
    const { searchQuery, setSearchQuery, filteredSpellbooks } = useSpellbookSearch(spellbooks);
    
    // Confirm modal state
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingDeletion, setPendingDeletion] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const handleSelectSpellbook = (spellbookId: string) => {
        onSelectSpellbook(spellbookId);
        onClose();
    };

    const handleDeleteSpellbook = (id: string, name: string) => {
        // Show confirmation before deleting
        setPendingDeletion({ id, name });
        setConfirmModalVisible(true);
    };

    const handleConfirmDeletion = () => {
        if (pendingDeletion) {
            const deletedId = pendingDeletion.id;
            deleteSpellbook(deletedId);
            setPendingDeletion(null);
            
            // Notify parent component about the deletion
            if (onSpellbookDeleted) {
                onSpellbookDeleted(deletedId);
            }
        }
    };

    const renderSpellbookItem = ({ item }: { item: any }) => (
        <SpellbookItem
            spellbook={item}
            theme={theme}
            isSelected={currentSpellbookId === item.id}
            onPress={() => handleSelectSpellbook(item.id)}
            onDelete={() => handleDeleteSpellbook(item.id, item.name)}
            showDeleteButton={true}
        />
    );

    return (
        <>
            <BaseModal visible={visible} onClose={onClose} theme={theme} title="Select Spellbook">
                {/* Search */}
                <TextInput
                    style={[commonStyles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.card, marginBottom: 16 }]}
                    placeholder="Search spellbooks..."
                    placeholderTextColor={theme.noticeText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                {/* Spellbooks List */}
                <View style={commonStyles.spellbooksSection}>
                    <Text style={[commonStyles.sectionTitle, { color: theme.text }]}>Your Spellbooks</Text>
                    {filteredSpellbooks.length === 0 ? (
                        <Text style={[commonStyles.emptyText, { color: theme.noticeText }]}>
                            {searchQuery.trim() ? 'No spellbooks found matching your search.' : 'No spellbooks available. Create one first!'}
                        </Text>
                    ) : (
                        <FlatList
                            data={filteredSpellbooks}
                            renderItem={renderSpellbookItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </BaseModal>
            
            {/* Confirm Deletion Modal */}
            <ConfirmModal
                visible={confirmModalVisible}
                onClose={() => {
                    setConfirmModalVisible(false);
                    setPendingDeletion(null);
                }}
                onConfirm={handleConfirmDeletion}
                title="Delete Spellbook"
                message={`Are you sure you want to delete "${pendingDeletion?.name}"? This action cannot be undone and all spells in this spellbook will be lost.`}
                confirmText="Delete"
                cancelText="Cancel"
                theme={theme}
            />
        </>
    );
}
