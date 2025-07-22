import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { conditions as DEFAULT_CONDITIONS } from 'src/constants/conditions';

interface StatusPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (conditions: string[]) => void;
  currentConditions?: string[];
  theme: any;
}

const StatusPickerModal: React.FC<StatusPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentConditions = [],
  theme
}) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(currentConditions);
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
    onSelect(selectedConditions);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.card }]}> 
          <Text style={[styles.title, { color: theme.text }]}>Set Conditions</Text>
          <FlatList
            data={DEFAULT_CONDITIONS}
            keyExtractor={item => item}
            numColumns={2}
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.primary }]}> 
              <Text style={{ color: theme.text, textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAccept} style={[styles.btn, { backgroundColor: theme.primary }]}> 
              <Text style={{ color: theme.buttonText || 'white', textAlign: 'center', fontWeight: 'bold' }}>Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 340,
    maxWidth: '95%',
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  conditionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    flex: 1,
    minWidth: 0,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
});

export default StatusPickerModal; 