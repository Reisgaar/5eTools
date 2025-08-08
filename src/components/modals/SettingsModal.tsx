import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';
import { conditions as DEFAULT_CONDITIONS } from 'src/constants/conditions';
import { BaseModal } from '../ui';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (conditions: string[]) => void;
  onColorSelect?: (color: string | null) => void;
  onDelete?: () => void;
  onNoteUpdate?: (note: string) => void;
  currentConditions?: string[];
  currentColor?: string;
  currentNote?: string;
  creatureName?: string;
  combatantNumber?: number;
  theme: any;
}

type TabType = 'status' | 'color' | 'notes' | 'delete';

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

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onSelect,
  onColorSelect,
  onDelete,
  onNoteUpdate,
  currentConditions = [],
  currentColor,
  currentNote = '',
  creatureName = 'Creature',
  theme
}) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(currentConditions);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(currentColor);
  const [noteText, setNoteText] = useState(currentNote);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('status');
  
  React.useEffect(() => {
    setSelectedConditions(currentConditions);
    setSelectedColor(currentColor);
    setNoteText(currentNote);
    setShowDeleteConfirmation(false);
    setActiveTab('status');
  }, [currentConditions, currentColor, currentNote, visible]);

    const handleToggleCondition = (cond: string) => {
    setSelectedConditions(prev => 
      prev.includes(cond) 
        ? prev.filter(c => c !== cond)
        : [...prev, cond]
    );
  };

  const handleAccept = () => {
    onSelect(selectedConditions);
    onClose();
  };

  const handleColorAccept = () => {
    if (onColorSelect) {
      onColorSelect(selectedColor || null);
    }
    onClose();
  };

  const handleColorClear = () => {
    if (onColorSelect) {
      onColorSelect(null);
    }
    onClose();
  };

  const handleNoteAccept = () => {
    if (onNoteUpdate) {
      onNoteUpdate(noteText);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirmation(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const renderStatusTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.subtitle, { color: theme.text }]}>{creatureName}</Text>
      
      {/* Status Conditions Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Status Conditions</Text>
        <FlatList
          data={DEFAULT_CONDITIONS}
          keyExtractor={item => item}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[ styles.conditionBtn ]}
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
          )}
          style={{ marginBottom: 16 }}
        />
        
        {/* Save Button */}
        <TouchableOpacity onPress={handleAccept} style={[styles.saveBtn, { backgroundColor: theme.primary }]}> 
          <Text style={{ color: theme.buttonText || 'white', textAlign: 'center', fontWeight: 'bold' }}>Save Conditions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderColorTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.subtitle, { color: theme.text }]}>{creatureName}</Text>
      
      {/* Color Selection Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Creature Color</Text>
        <Text style={[styles.sectionDescription, { color: theme.noticeText }]}>
          Select a color to highlight this creature in the combat tracker.
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
                <Ionicons name="checkmark" size={20} color="#000" />
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

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: theme.primary }]}
            onPress={handleColorClear}
          >
            <Text style={[styles.actionButtonText, { color: theme.primary }]}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={handleColorAccept}
          >
            <Text style={[styles.actionButtonText, { color: 'white' }]}>Save Color</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderNotesTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.subtitle, { color: theme.text }]}>{creatureName}</Text>
      
      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes</Text>
        <TextInput
          style={[styles.noteInput, { 
            backgroundColor: theme.inputBackground, 
            color: theme.text, 
            borderColor: theme.border 
          }]}
          placeholder="Add notes about this creature..."
          placeholderTextColor={theme.noticeText}
          value={noteText}
          onChangeText={setNoteText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        {/* Save Button */}
        <TouchableOpacity onPress={handleNoteAccept} style={[styles.saveBtn, { backgroundColor: theme.primary }]}> 
          <Text style={{ color: theme.buttonText || 'white', textAlign: 'center', fontWeight: 'bold' }}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDeleteTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.subtitle, { color: theme.text }]}>{creatureName}</Text>
      
      {/* Combat Management Section */}
      <View style={[styles.section, styles.dangerSection]}>
        <Text style={[styles.sectionTitle, { color: '#f44336' }]}>Combat Management</Text>
        <Text style={[styles.dangerText, { color: theme.noticeText }]}>
          Remove this creature from the combat tracker permanently.
        </Text>
        
        {!showDeleteConfirmation ? (
          <TouchableOpacity onPress={handleDeleteClick} style={[styles.deleteBtn, { backgroundColor: '#f44336' }]}> 
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Remove from Combat</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmationContainer}>
            <Text style={[styles.confirmationText, { color: theme.text }]}>
              Are you sure you want to remove "{creatureName}" from combat?
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity onPress={handleCancelDelete} style={[styles.confirmationBtn, { backgroundColor: theme.card, borderColor: theme.primary }]}> 
                <Text style={{ color: theme.text, textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[styles.confirmationBtn, { backgroundColor: '#f44336' }]}> 
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Confirm Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <BaseModal visible={visible} onClose={onClose} theme={theme} title="Creature Settings">
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'status' && { backgroundColor: theme.primary }
          ]}
          onPress={() => setActiveTab('status')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'status' ? 'white' : theme.text }
          ]}>
            Status
          </Text>
        </TouchableOpacity>
        
        {onColorSelect ? (
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'color' && { backgroundColor: theme.primary }
            ]}
            onPress={() => setActiveTab('color')}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'color' ? 'white' : theme.text }
            ]}>
              Color
            </Text>
          </TouchableOpacity>
        ) : null}
        
        {onNoteUpdate ? (
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'notes' && { backgroundColor: theme.primary }
            ]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'notes' ? 'white' : theme.text }
            ]}>
              Notes
            </Text>
          </TouchableOpacity>
        ) : null}
        
        {onDelete ? (
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'delete' && { backgroundColor: '#f44336' }
            ]}
            onPress={() => setActiveTab('delete')}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === 'delete' ? 'white' : theme.text }
            ]}>
              Delete
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Tab Content */}
      {activeTab === 'status' ? renderStatusTab() : null}
      {activeTab === 'color' ? renderColorTab() : null}
      {activeTab === 'notes' ? renderNotesTab() : null}
      {activeTab === 'delete' ? renderDeleteTab() : null}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    maxHeight: 400,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dangerSection: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dangerText: {
    fontSize: 12,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  conditionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    flex: 1,
    minWidth: 0,
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmationContainer: {
    marginTop: 8,
  },
  confirmationText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmationBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  noteInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: 'black',
  },
  currentSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  currentText: {
    fontSize: 14,
    marginRight: 8,
  },
  currentColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SettingsModal; 