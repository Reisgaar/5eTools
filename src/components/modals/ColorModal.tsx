import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BaseModal } from '../ui';
import { createBaseModalStyles } from '../../styles/baseModalStyles';

interface ColorModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: (color: string | null) => void;
  currentColor?: string;
  creatureName?: string;
  combatantNumber?: number;
  theme: any;
}

const COLORS = [
    'rgba(255, 107, 107, 0.3)', // Light Red
    'rgba(255, 167, 38, 0.3)', // Light Orange
    'rgba(255, 235, 59, 0.3)', // Light Yellow
    'rgba(102, 187, 106, 0.3)', // Light Green
    'rgba(66, 165, 245, 0.3)', // Light Blue
    'rgba(171, 71, 188, 0.3)', // Light Purple
    'rgba(236, 64, 122, 0.3)', // Light Pink
    'rgba(141, 110, 99, 0.3)', // Light Brown
    'rgba(120, 144, 156, 0.3)', // Light Gray
    'rgba(255, 152, 0, 0.3)', // Light Dark Orange
];

const ColorModal: React.FC<ColorModalProps> = ({
  visible,
  onClose,
  onAccept,
  currentColor,
  creatureName = 'Creature',
  combatantNumber,
  theme
}) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(currentColor);
  const styles = createBaseModalStyles(theme);
  
  React.useEffect(() => {
    setSelectedColor(currentColor);
  }, [currentColor, visible]);

  const handleAccept = () => {
    onAccept(selectedColor || null);
    onClose();
  };



  const handleClear = () => {
    onAccept(null);
    onClose();
  };

  const modalTitle = "Creature Color";
  const modalSubtitle = combatantNumber ? `#${combatantNumber} ${creatureName}` : creatureName;

  return (
    <BaseModal 
      visible={visible} 
      onClose={onClose} 
      theme={theme} 
      title={modalTitle}
      subtitle={modalSubtitle}
    >
      {/* Color Selection Section */}
      <View style={styles.modalSection}>
        <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Select Color</Text>
        <Text style={[styles.modalNoticeText, { color: theme.noticeText }]}>
          Choose a color to highlight this creature in the combat tracker.
        </Text>
        
        {/* Color Grid */}
        <View style={styles.colorGrid}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={20} color={theme.text} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Selection */}
        {selectedColor && (
          <View style={styles.currentSelection}>
            <Text style={[styles.currentText, { color: theme.text }]}>Selected:</Text>
            <View style={[styles.currentColor, { backgroundColor: selectedColor }]} />
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.modalButton, { borderColor: theme.primary, borderWidth: 1 }]}
          onPress={handleClear}
        >
          <Text style={[styles.modalButtonText, { color: theme.primary }]}>Clear</Text>
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



export default ColorModal;
