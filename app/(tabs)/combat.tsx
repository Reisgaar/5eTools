// REACT
import React, { useState } from 'react';
import { View } from 'react-native';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';

// COMPONENTS
import { CombatContent, CombatList } from 'src/components/combat';
import { CombatFormModal } from 'src/components/combat/modals';
import ConfirmModal from 'src/components/modals/ConfirmModal';

/**
 * Combat screen.
 */
export default function CombatScreen() {
    const { currentTheme } = useAppSettingsStore();
    const { selectedCampaign } = useCampaignStore();
    const { currentCombatId, createCombat, selectCombat, getSortedCombats, deleteCombat, updateCombat } = useCombat();

    const [createCombatModalVisible, setCreateCombatModalVisible] = useState(false);
    const [editCombatModalVisible, setEditCombatModalVisible] = useState(false);
    const [editCombat, setEditCombat] = useState<any | null>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');

    /**
     * Opens modal to create a new combat.
     */
    const handleCreateCombat = () => {
        setCreateCombatModalVisible(true);
    };

    /**
     * Creates a new combat.
     */
    const handleCreateCombatWithName = (name: string, campaignId?: string, description?: string) => {
        createCombat(name, campaignId, description);
    };

    /**
     * Selects a combat.
     */
    const handleSelectCombat = (combatId: string) => {
        selectCombat(combatId);
    };

    /**
     * Opens modal to edit a combat.
     */
    const handleEditCombat = (combat: any) => {
        setEditCombat(combat);
        setEditCombatModalVisible(true);
    };

    /**
     * Handles saving combat edits.
     */
    const handleSaveCombatEdit = (name: string, campaignId?: string, description?: string) => {
        if (editCombat) {
            updateCombat(editCombat.id, {
                name,
                description,
                campaignId
            });
        }
        setEditCombatModalVisible(false);
        setEditCombat(null);
    };

    /**
     * Handles deleting a combat.
     */
    const handleDeleteCombat = (combatId: string) => {
        const combat = filteredCombats.find(c => c.id === combatId);
        setConfirmTitle('Delete Combat');
        setConfirmMessage(`Are you sure you want to delete the combat "${combat?.name}"?`);
        setConfirmAction(() => () => {
            deleteCombat(combatId);
            setConfirmModalVisible(false);
        });
        setConfirmModalVisible(true);
    };

    // Get combats filtered by selected campaign
    const filteredCombats = getSortedCombats(selectedCampaign?.id || null);

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={{ flex: 1, backgroundColor: currentTheme.background, padding: 0, paddingBottom: 0 }}>
                {/* Show Combat List or Combat Content */}
                {currentCombatId ? (
                    // Show combat content when a combat is selected
                    <CombatContent />
                ) : (
                    // Show combat list when no combat is selected
                    <CombatList
                        combats={filteredCombats}
                        currentCombatId={currentCombatId}
                        onSelectCombat={handleSelectCombat}
                        onCreateCombat={handleCreateCombat}
                        onEditCombat={handleEditCombat}
                        onDeleteCombat={handleDeleteCombat}
                        theme={currentTheme}
                    />
              )}
            </View>

            {/* Create Combat Modal */}
            <CombatFormModal
                visible={createCombatModalVisible}
                onClose={() => setCreateCombatModalVisible(false)}
                mode="create"
                onCreateCombat={handleCreateCombatWithName}
                theme={currentTheme}
            />

            {/* Edit Combat Modal */}
            <CombatFormModal
                visible={editCombatModalVisible}
                onClose={() => { setEditCombatModalVisible(false); setEditCombat(null); }}
                mode="edit"
                combatId={editCombat?.id}
                initialName={editCombat?.name || ''}
                initialDescription={editCombat?.description || ''}
                initialCampaignId={editCombat?.campaignId}
                onCreateCombat={handleSaveCombatEdit}
                theme={currentTheme}
            />

            {/* Confirmation Modal */}
            <ConfirmModal
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={() => {
                    if (confirmAction) {
                        confirmAction();
                    }
                }}
                title={confirmTitle}
                message={confirmMessage}
                theme={currentTheme}
            />
        </View>
    );
}
