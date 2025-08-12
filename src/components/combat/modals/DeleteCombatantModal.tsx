import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../../ui';
import { createBaseModalStyles } from '../../../styles/baseModalStyles';

interface DeleteCombatantModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  creatureName?: string;
  combatantNumber?: number;
  theme: any;
}

const DeleteCombatantModal: React.FC<DeleteCombatantModalProps> = ({
  visible,
  onClose,
  onConfirm,
  creatureName = 'Creature',
  combatantNumber,
  theme
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const styles = createBaseModalStyles(theme);
  
  React.useEffect(() => {
    setShowConfirmation(false);
  }, [visible]);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onConfirm();
    setShowConfirmation(false);
    onClose();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    onClose();
  };

  const modalTitle = "Remove from Combat";
  const modalSubtitle = combatantNumber ? `#${combatantNumber} ${creatureName}` : creatureName;

  return (
    <BaseModal 
      visible={visible} 
      onClose={handleCancel} 
      theme={theme} 
      title={modalTitle}
      subtitle={modalSubtitle}
    >
      {/* Delete Section */}
      <View style={styles.modalSection}>
        <Text style={[styles.modalSectionTitle, { color: theme.danger || '#f44336' }]}>Combat Management</Text>
        <Text style={[styles.modalNoticeText, { color: theme.noticeText }]}>
          Remove this creature from the combat tracker permanently.
        </Text>
        
        {!showConfirmation ? (
          <TouchableOpacity 
            onPress={handleDeleteClick} 
            style={[styles.deleteBtn, { backgroundColor: theme.danger || '#f44336' }]}
          > 
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Remove from Combat
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmationContainer}>
            <Text style={[styles.confirmationText, { color: theme.text }]}>
              Are you sure you want to remove "{creatureName}" from combat?
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                onPress={handleCancel} 
                style={[styles.confirmationBtn, { backgroundColor: theme.card, borderColor: theme.primary, borderWidth: 1 }]}
              > 
                <Text style={{ color: theme.text, textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleConfirm} 
                style={[styles.confirmationBtn, { backgroundColor: theme.danger || '#f44336' }]}
              > 
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Confirm Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </BaseModal>
  );
};



export default DeleteCombatantModal;
