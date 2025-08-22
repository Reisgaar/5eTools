// REACT
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

// STORES
import { useCampaignStore, useSpellbookStore } from 'src/stores';

// COMPONENTS
import { BaseModal } from 'src/components/ui';
import SpellbookItem from 'src/components/spells/SpellbookItem';
import useSpellbookSearch from 'src/components/spells/useSpellbookSearch';

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
    const { getSpellbooksByCampaign, addSpellToSpellbook, removeSpellFromSpellbook, isSpellInSpellbook } = useSpellbookStore();
    const { selectedCampaign } = useCampaignStore();
    const filteredSpellbooks = getSpellbooksByCampaign(selectedCampaign?.id);
    const { searchQuery, setSearchQuery, filteredSpellbooks: searchedSpellbooks } = useSpellbookSearch(filteredSpellbooks);
    const styles = createBaseModalStyles(theme);

    const handleToggleSpellbook = (spellbookId: string) => {
        if (!spell) return;

        if (isSpellInSpellbook(spellbookId, spell.name, spell.source)) {
            removeSpellFromSpellbook(spellbookId, spell.name, spell.source);
        } else {
            addSpellToSpellbook(spellbookId, spell.name, spell.source, {
                level: spell.level,
                school: spell.school,
                ritual: spell.ritual,
                concentration: spell.concentration,
                availableClasses: spell.availableClasses
            });
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
                footerContent={
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.footerButton, { backgroundColor: theme.primary }]}
                        >
                            <Text style={styles.footerButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                }
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
                        <>
                            {searchedSpellbooks.map((spellbook) => (
                                <View key={spellbook.id}>
                                    {renderSpellbookItem({ item: spellbook })}
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </BaseModal>
        </>
    );
}
