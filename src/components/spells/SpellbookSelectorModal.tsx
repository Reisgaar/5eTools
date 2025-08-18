// REACT
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

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
    const { spellbooks, currentSpellbookId, selectSpellbook, clearSpellbookSelection, getSpellbooksByCampaign } = useSpellbookStore();
    const { selectedCampaignId } = useCampaignStore();
    const { currentTheme } = useAppSettingsStore();

    // Get spellbooks filtered by selected campaign
    const filteredSpellbooks = getSpellbooksByCampaign(selectedCampaignId);

    const handleSelectSpellbook = (spellbookId: string | null) => {
        if (spellbookId) {
            selectSpellbook(spellbookId);
        } else {
            clearSpellbookSelection();
        }
        onSelectSpellbook(spellbookId);
        onClose();
    };

    const handleClearFilter = () => {
        clearSpellbookSelection();
        onSelectSpellbook(null);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: currentTheme.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                            Select Spellbook
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={currentTheme.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.separator, { backgroundColor: currentTheme.border }]} />

                    <FlatList
                        data={filteredSpellbooks}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.spellbookItem,
                                    { backgroundColor: currentSpellbookId === item.id ? currentTheme.primary + '20' : 'transparent' }
                                ]}
                                onPress={() => handleSelectSpellbook(item.id)}
                            >
                                <View style={styles.spellbookContent}>
                                    <Text style={[styles.spellbookName, { color: currentTheme.text }]}>
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.spellbookDescription, { color: currentTheme.noticeText }]}>
                                        {item.description && `${item.description} • `}
                                        {(item.spellsIndex || []).length} spells
                                    </Text>
                                </View>
                                {currentSpellbookId === item.id && (
                                    <Ionicons name="checkmark-circle" size={20} color={currentTheme.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                        ListHeaderComponent={
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
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text style={[styles.emptyText, { color: currentTheme.noticeText }]}>
                                    No spellbooks available
                                </Text>
                            </View>
                        }
                    />

                    <TouchableOpacity
                        onPress={onCreateSpellbook}
                        style={[styles.createButton, { backgroundColor: currentTheme.primary }]}
                    >
                        <Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={[styles.createButtonText, { color: 'white' }]}>
                            Create New Spellbook
                        </Text>
                    </TouchableOpacity>
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
        maxHeight: '80%',
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
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        margin: 20,
        borderRadius: 8,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        marginVertical: 10,
    },
});
