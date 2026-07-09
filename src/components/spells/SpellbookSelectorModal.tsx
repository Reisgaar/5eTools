// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { getCommonStyles } from 'src/styles/commonStyles';
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
                <View style={[commonStyles.w_100, commonStyles.row_center_center, { gap: '4%' }]}>
                    <TouchableOpacity
                        onPress={handleDeleteSpellbook}
                        style={[styles.footerButton, commonStyles.w_33, { backgroundColor: '#dc2626' }]}
                    >
                        <Text style={[styles.footerButtonText, commonStyles.text_md]}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onCreateSpellbook}
                        style={[styles.footerButton, commonStyles.w_33, { backgroundColor: '#008000' }]}
                    >
                        <Text style={[styles.footerButtonText, commonStyles.text_md]}>Create New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.footerButton, commonStyles.w_33, { backgroundColor: currentTheme.primary }]}
                    >
                        <Text style={[styles.footerButtonText, commonStyles.text_md]}>Confirm</Text>
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
                            <Text style={[styles.spellbookName, commonStyles.text_primary]}>
                                All Spells
                            </Text>
                            <Text style={[styles.spellbookDescription, commonStyles.text_grey]}>
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
                                <Text style={[styles.spellbookName, commonStyles.text_primary]}>
                                    {spellbook.name}
                                </Text>
                                <Text style={[styles.spellbookDescription, commonStyles.text_grey]}>
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
                    <Text style={[styles.emptyText, commonStyles.text_grey]}>
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
        borderRadius: styleConstants.borderRadiusMD,
        paddingVertical: styleConstants.paddingMD,
        alignItems: 'center',
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeLG,
    },
    spellbookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingLG,
        paddingHorizontal: styleConstants.paddingXL,
        borderBottomWidth: styleConstants.borderXS,
        borderBottomColor: '#eee',
    },
    spellbookContent: {
        flex: 1,
    },
    spellbookName: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: '600',
        marginBottom: styleConstants.marginXS,
    },
    spellbookDescription: {
        fontSize: styleConstants.fontSizeMD,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: styleConstants.fontSizeLG,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        marginVertical: styleConstants.marginSM,
    },
});
