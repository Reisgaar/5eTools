// REACT
import React from 'react';
import { getCommonStyles } from 'src/styles/commonStyles';
import { View, Text } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// COMPONENTS
import { BaseModal, Button, ListItem } from 'src/components/ui';

// INTERFACES
interface SpellbookSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectSpellbook: (spellbookId: string | null) => void;
    onCreateSpellbook: () => void;
}

/**
 * Modal for selecting a spellbook.
 */
export default function SpellbookSelectorModal({
    visible,
    onClose,
    onSelectSpellbook,
    onCreateSpellbook
}: SpellbookSelectorModalProps) {
    const { spellbooks, currentSpellbookId, selectSpellbook, clearSpellbookSelection, getSpellbooksByCampaign, deleteSpellbook } = useSpellbookStore();
    const { selectedCampaignId } = useCampaignStore();
    const { currentTheme } = useAppSettingsStore();

    // Get spellbooks filtered by selected campaign
    const filteredSpellbooks = getSpellbooksByCampaign(selectedCampaignId);
    const commonStyles = getCommonStyles(currentTheme);

    /**
     * Handles the selection of a spellbook.
     */
    const handleSelectSpellbook = (spellbookId: string | null) => {
        if (spellbookId) {
            selectSpellbook(spellbookId);
        } else {
            clearSpellbookSelection();
        }
        onSelectSpellbook(spellbookId);
    };

    /**
     * Handles the clearing of the spellbook filter.
     */
    const handleClearFilter = () => {
        clearSpellbookSelection();
        onSelectSpellbook(null);
    };

    /**
     * Handles the deletion of a spellbook.
     */
    const handleDeleteSpellbook = () => {
        if (!currentSpellbookId) return;

        const spellbookToDelete = spellbooks.find(sb => sb.id === currentSpellbookId);
        if (!spellbookToDelete) return;

        if (currentSpellbookId === spellbookToDelete.id)
            clearSpellbookSelection();

        try {
            deleteSpellbook(currentSpellbookId);
            onSelectSpellbook(null);
        } catch (error) {
            console.error('Error deleting spellbook:', error);
        }
    };

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={currentTheme}
            title='Select Spellbook'
            footerContent={
                <View style={[commonStyles.w_100, commonStyles.row_center_center, commonStyles.gap_sm]}>
                    <View style={{ flex: 1 }}><Button title="Delete" variant="danger" size="sm" onPress={handleDeleteSpellbook} fullWidth /></View>
                    <View style={{ flex: 1 }}><Button title="New" icon="add" variant="secondary" size="sm" onPress={onCreateSpellbook} fullWidth /></View>
                    <View style={{ flex: 1 }}><Button title="Done" variant="primary" size="sm" onPress={onClose} fullWidth /></View>
                </View>
            }
        >
            {filteredSpellbooks.length > 0 ? (
                <>
                    <ListItem
                        selected={currentSpellbookId === null}
                        onPress={handleClearFilter}
                        title="All Spells"
                        subtitle="Show all spells without filter"
                        trailing={currentSpellbookId === null ? <Ionicons name="checkmark-circle" size={22} color={currentTheme.primary} /> : undefined}
                    />
                    {filteredSpellbooks.map((spellbook) => (
                        <ListItem
                            key={`${spellbook.id}_${spellbook.name}`}
                            selected={currentSpellbookId === spellbook.id}
                            onPress={() => handleSelectSpellbook(spellbook.id)}
                            title={spellbook.name}
                            subtitle={`${spellbook.description ? `${spellbook.description} • ` : ''}${(spellbook.spellsIndex || []).length} spells`}
                            trailing={currentSpellbookId === spellbook.id ? <Ionicons name="checkmark-circle" size={22} color={currentTheme.primary} /> : undefined}
                        />
                    ))}
                </>
            ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={[commonStyles.text_lg, commonStyles.text_grey, commonStyles.text_center]}>
                        No spellbooks available
                    </Text>
                </View>
            )}
        </BaseModal>
    );
};
