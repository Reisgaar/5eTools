import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { BaseModal } from '../ui';
import { commonStyles } from '../../styles/commonStyles';
import { useSpellbook } from '../../context/SpellbookContext';
import SpellbookItem from './SpellbookItem';
import { useSpellbookSearch } from './useSpellbookSearch';
import ConfirmModal from '../modals/ConfirmModal';

interface AddToSpellbookModalProps {
    visible: boolean;
    onClose: () => void;
    spell: any;
    theme: any;
}

export default function AddToSpellbookModal({ 
    visible, 
    onClose, 
    spell, 
    theme 
}: AddToSpellbookModalProps) {
    const { spellbooks, addSpellToSpellbook, removeSpellFromSpellbook, isSpellInSpellbook } = useSpellbook();
    const { searchQuery, setSearchQuery, filteredSpellbooks } = useSpellbookSearch(spellbooks);
    
    // Confirm modal state
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingRemoval, setPendingRemoval] = useState<{
        spellbookId: string;
        spellName: string;
        spellbookName: string;
    } | null>(null);

    const handleToggleSpellbook = (spellbookId: string) => {
        if (!spell) return;
        
        if (isSpellInSpellbook(spellbookId, spell.name, spell.source)) {
            // Show confirmation before removing
            const spellbook = spellbooks.find(sb => sb.id === spellbookId);
            setPendingRemoval({
                spellbookId,
                spellName: spell.name,
                spellbookName: spellbook?.name || 'Unknown'
            });
            setConfirmModalVisible(true);
        } else {
            // Add spell directly
            addSpellToSpellbook(spellbookId, spell.name, spell.source);
        }
    };

    const handleConfirmRemoval = () => {
        if (pendingRemoval && spell) {
            removeSpellFromSpellbook(pendingRemoval.spellbookId, spell.name, spell.source);
            setPendingRemoval(null);
        }
    };

    const renderSpellbookItem = ({ item }: { item: any }) => {
        if (!spell) return null;
        
        const isInSpellbook = isSpellInSpellbook(item.id, spell.name, spell.source);
        
        return (
            <SpellbookItem
                spellbook={item}
                theme={theme}
                isInSpellbook={isInSpellbook}
                onPress={() => handleToggleSpellbook(item.id)}
                showToggleButton={true}
            />
        );
    };

    return (
        <>
            <BaseModal visible={visible} onClose={onClose} theme={theme} title="Add to Spellbook">
                {/* Spell Info */}
                {spell && (
                    <View style={[commonStyles.section, { backgroundColor: theme.card, marginBottom: 16 }]}>
                        <Text style={[commonStyles.modalItemName, { color: theme.text }]}>{spell.name}</Text>
                        <Text style={[commonStyles.modalItemDescription, { color: theme.noticeText }]}>
                            Level {spell.level === 0 ? 'Cantrip' : spell.level} • {spell.school} • {spell.source}
                        </Text>
                    </View>
                )}

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
                    <Text style={[commonStyles.sectionTitle, { color: theme.text }]}>Select Spellbooks</Text>
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
            
            {/* Confirm Removal Modal */}
            <ConfirmModal
                visible={confirmModalVisible}
                onClose={() => {
                    setConfirmModalVisible(false);
                    setPendingRemoval(null);
                }}
                onConfirm={handleConfirmRemoval}
                title="Remove Spell"
                message={`Are you sure you want to remove "${pendingRemoval?.spellName}" from "${pendingRemoval?.spellbookName}"?`}
                confirmText="Remove"
                cancelText="Cancel"
                theme={theme}
            />
        </>
    );
}