import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

// STORES
import { useCampaignStore } from 'src/stores';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';
import { useModal } from 'src/context/ModalContext';

// STYLES
import { createBaseModalStyles, getModalZIndex } from 'src/styles/baseModalStyles';

// COMPONENTS
import { BaseModal } from 'src/components/ui';
import CampaignSelector from 'src/components/ui/CampaignSelector';
import ConfirmModal from 'src/components/modals/ConfirmModal';

// INTERFACES
interface CombatFormModalProps {
    visible: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    combatId?: string;
    initialName?: string;
    initialDescription?: string;
    initialCampaignId?: string;
    onCreateCombat?: (name: string, campaignId?: string, description?: string) => void;
    theme: any;
}

/**
 * Modal for creating or editing a combat.
 */
const CombatFormModal: React.FC<CombatFormModalProps> = ({
    visible,
    onClose,
    mode,
    combatId,
    initialName = '',
    initialDescription = '',
    initialCampaignId,
    onCreateCombat,
    theme
}) => {
    const { campaigns, selectedCampaignId: contextSelectedCampaignId } = useCampaignStore();
    const { updateCombat, deleteCombat } = useCombat();
    const { beastStackDepth, spellStackDepth } = useModal();
    
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(initialCampaignId);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const maxStackDepth = Math.max(beastStackDepth, spellStackDepth);
    const dynamicZIndex = getModalZIndex(maxStackDepth + 1);
    const styles = createBaseModalStyles(theme);

    const isEditMode = mode === 'edit';
    const title = isEditMode ? 'Edit Combat' : 'Create New Combat';
    const saveButtonText = isEditMode ? 'Save' : 'Create';

    useEffect(() => {
        if (visible) {
            setName(initialName);
            setDescription(initialDescription);
            
            // For new combats, use the context's selected campaign if no initial campaign is provided
            if (mode === 'create' && !initialCampaignId && contextSelectedCampaignId)
                setSelectedCampaignId(contextSelectedCampaignId);
            else
                setSelectedCampaignId(initialCampaignId);
        }
    }, [visible, initialName, initialDescription, initialCampaignId, mode, contextSelectedCampaignId]);

    const handleSave = () => {
        if (!name.trim()) return;

        if (mode === 'create' && onCreateCombat) {
            onCreateCombat(name.trim(), selectedCampaignId, description.trim() || undefined);
        } else if (mode === 'edit' && combatId) {
            updateCombat(combatId, {
                name: name.trim(),
                description: description.trim() || undefined,
                campaignId: selectedCampaignId
            });
        }
        onClose();
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (combatId) {
        deleteCombat(combatId);
        }
        setShowDeleteConfirm(false);
        onClose();
    };

    return (
        <>
            <BaseModal 
                visible={visible} 
                onClose={onClose} 
                theme={theme} 
                title={title}
                scrollable={true}
                zIndex={dynamicZIndex}
            >
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Combat Details</Text>
                    
                    {/* Name Input */}
                    <Text style={[styles.modalText, { marginBottom: 8 }]}>Combat Name *</Text>
                    <TextInput
                        style={styles.modalInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Combat name"
                        placeholderTextColor={theme.noticeText}
                        autoFocus={!isEditMode}
                    />

                    {/* Description Input */}
                    <Text style={[styles.modalText, { marginBottom: 8 }]}>Description (optional)</Text>
                    <TextInput
                        style={[styles.modalInput, { minHeight: 80, textAlignVertical: 'top' }]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Optional description"
                        placeholderTextColor={theme.noticeText}
                        multiline
                        numberOfLines={3}
                    />

                    {/* Campaign Selection */}
                    <CampaignSelector
                        selectedCampaignId={selectedCampaignId}
                        onCampaignChange={setSelectedCampaignId}
                        theme={theme}
                        label="Campaign (optional)"
                    />
                    
                    {/* Show info when campaign is auto-selected */}
                    {mode === 'create' && selectedCampaignId === contextSelectedCampaignId && contextSelectedCampaignId && (
                        <Text style={[styles.modalText, { 
                            fontSize: 12, 
                            color: theme.noticeText, 
                            fontStyle: 'italic',
                            marginTop: 4 
                            }]}
                        >
                            Campaign automatically selected from current context
                        </Text>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.modalSection}>
                    <View style={styles.actionRow}>
                        {isEditMode && (
                            <TouchableOpacity 
                                onPress={handleDelete} 
                                style={[styles.modalButton, { backgroundColor: theme.danger || '#f44336' }]}
                            >
                                <Text style={[styles.modalButtonText, { color: 'white' }]}>
                                    Delete Combat
                                </Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity 
                            onPress={handleSave} 
                            style={[styles.modalButton, styles.modalButtonPrimary]}
                            disabled={!name.trim()}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                                {saveButtonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BaseModal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Combat"
                message="Are you sure you want to delete this combat? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                theme={theme}
            />
        </>
    );
};

export default CombatFormModal;
