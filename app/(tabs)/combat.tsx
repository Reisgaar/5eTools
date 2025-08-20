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

/**
 * Combat screen.
 */
export default function CombatScreen() {
    const { currentTheme } = useAppSettingsStore();
    const { selectedCampaign } = useCampaignStore();
    const { currentCombatId, createCombat, selectCombat, getSortedCombats } = useCombat();

    const [createCombatModalVisible, setCreateCombatModalVisible] = useState(false);

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
        </View>
    );
}
