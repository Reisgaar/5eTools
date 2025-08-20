// REACT
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

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
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%' }}>
                    <TouchableOpacity
                        onPress={handleDeleteSpellbook}
                        style={[styles.footerButton, { backgroundColor: '#dc2626', width: '33%' }]}
                    >
                        <Text style={[styles.footerButtonText, { fontSize: 14 }]}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onCreateSpellbook}
                        style={[styles.footerButton, { backgroundColor: '#008000', width: '33%' }]}
                    >
                        <Text style={[styles.footerButtonText, { fontSize: 14 }]}>Create New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.footerButton, { backgroundColor: currentTheme.primary, width: '33%' }]}
                    >
                        <Text style={[styles.footerButtonText, { fontSize: 14 }]}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            }
        >
            {filteredSpellbooks.length > 0 ? (
                <>
                    <TouchableOpacity
                        style={[
                            styles.spellbookItem,
                            { backgroundColor: currentSpellbookId === null ? currentTheme.primary + '20' : 'transparent' }
                        ]}
                        onPress={handleClearFilter}
                    >
                        <View style={styles.spellbookContent}>
                            <Text style={[styles.spellbookName, { color: currentTheme.text }]}>
                                All Spells
                            </Text>
                            <Text style={[styles.spellbookDescription, { color: currentTheme.noticeText }]}>
                                Show all spells without filter
                            </Text>
                        </View>
                        {currentSpellbookId === null && (
                            <Ionicons name="checkmark-circle" size={20} color={currentTheme.primary} />
                        )}
                    </TouchableOpacity>

                    {filteredSpellbooks.map((spellbook) => (
                        <TouchableOpacity
                            key={`${spellbook.id}_${spellbook.name}`}
                            style={[
                                styles.spellbookItem,
                                { backgroundColor: currentSpellbookId === spellbook.id ? currentTheme.primary + '20' : 'transparent' }
                            ]}
                            onPress={() => handleSelectSpellbook(spellbook.id)}
                        >
                            <View style={styles.spellbookContent}>
                                <Text style={[styles.spellbookName, { color: currentTheme.text }]}>
                                    {spellbook.name}
                                </Text>
                                <Text style={[styles.spellbookDescription, { color: currentTheme.noticeText }]}>
                                    {spellbook.description && `${spellbook.description} • `}
                                    {(spellbook.spellsIndex || []).length} spells
                                </Text>
                            </View>
                            {currentSpellbookId === spellbook.id && (
                                <Ionicons name="checkmark-circle" size={20} color={currentTheme.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: currentTheme.noticeText }]}>
                        No spellbooks available
                    </Text>
                </View>
            )}
        </BaseModal>
    );
};

const styles = StyleSheet.create({
    footerButton: {
        width: '48%',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    spellbookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    spellbookContent: {
        flex: 1,
    },
    spellbookName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    spellbookDescription: {
        fontSize: 14,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        marginVertical: 10,
    },
});
