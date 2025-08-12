import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCampaign } from '../../../context/CampaignContext';
import { useCombat } from '../../../context/CombatContext';
import { useModal } from '../../../context/ModalContext';
import { modalStyles } from '../../../styles/modalStyles';
import { getModalZIndex } from '../../../styles/modals';
import CampaignSelector from '../../ui/CampaignSelector';
import ConfirmModal from '../../modals/ConfirmModal';

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
  const { campaigns } = useCampaign();
  const { updateCombat, deleteCombat } = useCombat();
  const { beastStackDepth, spellStackDepth } = useModal();
  
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(initialCampaignId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const maxStackDepth = Math.max(beastStackDepth, spellStackDepth);
  const dynamicZIndex = getModalZIndex(maxStackDepth + 1);

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setDescription(initialDescription);
      setSelectedCampaignId(initialCampaignId);
    }
  }, [visible, initialName, initialDescription, initialCampaignId]);

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



  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Combat' : 'Create New Combat';
  const saveButtonText = isEditMode ? 'Save' : 'Create';

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <TouchableOpacity 
          style={[modalStyles.modalOverlay, { zIndex: dynamicZIndex }]} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <TouchableOpacity 
            style={[modalStyles.modalContent, { backgroundColor: theme.card, zIndex: dynamicZIndex }]} 
            activeOpacity={1} 
            onPress={() => {}}
          >
            <View style={modalStyles.modalHeader}>
              <Text style={[modalStyles.modalTitle, { color: theme.text }]}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={[modalStyles.separator, { backgroundColor: theme.border }]} />
            
            <ScrollView style={modalStyles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Name Input */}
              <Text style={[modalStyles.fieldLabel, { color: theme.text }]}>Combat Name *</Text>
              <TextInput
                style={[
                  modalStyles.input,
                  { 
                    backgroundColor: theme.innerBackground,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Combat name"
                placeholderTextColor={theme.textSecondary}
                autoFocus={!isEditMode}
              />

              {/* Description Input */}
              <Text style={[modalStyles.fieldLabel, { color: theme.text }]}>Description (optional)</Text>
              <TextInput
                style={[
                  modalStyles.input,
                  { 
                    backgroundColor: theme.innerBackground,
                    color: theme.text,
                    borderColor: theme.border,
                    height: 80,
                    textAlignVertical: 'top'
                  }
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Optional description"
                placeholderTextColor={theme.textSecondary}
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
            </ScrollView>

            {/* Action Buttons */}
            <View style={modalStyles.modalButtons}>
              {isEditMode && (
                <TouchableOpacity 
                  onPress={handleDelete} 
                  style={[modalStyles.modalButtonDanger, { marginRight: 8 }]}
                >
                  <Text style={[modalStyles.modalButtonText, { color: 'white' }]}>
                    Delete Combat
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={handleSave} 
                style={[modalStyles.modalButton, { backgroundColor: theme.primary }]}
                disabled={!name.trim()}
              >
                <Text style={[modalStyles.modalButtonText, { color: 'white' }]}>
                  {saveButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
