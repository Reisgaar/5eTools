// REACT
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Platform } from 'react-native';

// STORES
import { useCampaignStore, useSpellbookStore } from 'src/stores';

// COMPONENTS
import { BaseModal } from 'src/components/ui';
import SpellbookItem from 'src/components/spells/SpellbookItem';
import useSpellbookSearch from 'src/components/spells/useSpellbookSearch';
import { ConfirmModal } from 'src/components/modals/';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// INTERFACES
interface AddToSpellbookModalProps {
    visible: boolean;
    onClose: () => void;
    spell: any;
    theme: any;
}

/**
 * Modal for adding a spell to a spellbook.
 */
export default function AddToSpellbookModal({
    visible,
    onClose,
    spell,
    theme
}: AddToSpellbookModalProps) {
    const { spellbooks, getSpellbooksByCampaign, addSpellToSpellbook, removeSpellFromSpellbook, isSpellInSpellbook } = useSpellbookStore();
    const { selectedCampaign } = useCampaignStore();
    const filteredSpellbooks = getSpellbooksByCampaign(selectedCampaign?.id);
    const { searchQuery, setSearchQuery, filteredSpellbooks: searchedSpellbooks } = useSpellbookSearch(filteredSpellbooks);
    const styles = createBaseModalStyles(theme);

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
            // Add spell with details
            addSpellToSpellbook(spellbookId, spell.name, spell.source, {
                level: spell.level,
                school: spell.school,
                ritual: spell.ritual,
                concentration: spell.concentration,
                availableClasses: spell.availableClasses
            });
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
            <BaseModal
                visible={visible}
                onClose={onClose}
                theme={theme}
                title="Add to Spellbook"
                subtitle={spell ? `Level ${spell.level === 0 ? 'Cantrip' : spell.level} • ${spell.school} • ${spell.source}` : undefined}
                width='90%'
                maxHeight="80%"
                scrollable={true}
            >
                {/* Search */}
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Search Spellbooks</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Search spellbooks..."
                        placeholderTextColor={theme.noticeText}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Spellbooks List */}
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Select Spellbooks</Text>
                    {searchedSpellbooks.length === 0 ? (
                        <Text style={styles.modalNoticeText}>
                            {searchQuery.trim() ? 'No spellbooks found matching your search.' : 'No spellbooks available. Create one first!'}
                        </Text>
                    ) : (
                        <FlatList
                            data={searchedSpellbooks}
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
