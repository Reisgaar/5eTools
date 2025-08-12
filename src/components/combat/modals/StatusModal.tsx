import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { conditions as DEFAULT_CONDITIONS } from 'src/constants/conditions';
import { BaseModal } from '../../ui';
import { createBaseModalStyles } from '../../../styles/baseModalStyles';

interface StatusModalProps {  
  visible: boolean;
  onClose: () => void;
  onAccept: (conditions: string[]) => void;
  currentConditions?: string[];
  creatureName?: string;
  combatantNumber?: number;
  theme: any;
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  onClose,
  onAccept,
  currentConditions = [],
  creatureName = 'Creature',
  combatantNumber,
  theme
}) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(currentConditions);
  const styles = createBaseModalStyles(theme);
  
  React.useEffect(() => {
    setSelectedConditions(currentConditions);
  }, [currentConditions, visible]);

  const handleToggleCondition = (cond: string) => {
    setSelectedConditions(prev => 
      prev.includes(cond) 
        ? prev.filter(c => c !== cond)
        : [...prev, cond]
    );
  };

  const handleAccept = () => {
    onAccept(selectedConditions);
    onClose();
  };

  const handleCancel = () => {
    setSelectedConditions(currentConditions);
    onClose();
  };

  const modalTitle = "Status Conditions";
  const modalSubtitle = combatantNumber ? `#${combatantNumber} ${creatureName}` : creatureName;

  return (
    <BaseModal 
      visible={visible} 
      onClose={handleCancel} 
      theme={theme} 
      title={modalTitle}
      subtitle={modalSubtitle}
      scrollable={true}
    >
      {/* Status Conditions Section */}
      <View style={styles.modalSection}>
        <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Select Conditions</Text>
        <View style={styles.conditionsGrid}>
          {DEFAULT_CONDITIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.conditionBtn}
              onPress={() => handleToggleCondition(item)}
            >
              <Ionicons
                name={selectedConditions.includes(item) ? 'checkbox' : 'square-outline'}
                size={18}
                color={theme.text}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: theme.text, fontSize: 12 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalButtonSecondary]}
          onPress={handleCancel}
        >
          <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.modalButtonPrimary]}
          onPress={handleAccept}
        >
          <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Save</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};



export default StatusModal;
