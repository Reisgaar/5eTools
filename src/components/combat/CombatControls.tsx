import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CombatControlsProps {
  started: boolean;
  round: number;
  onClearCombat: () => void;
  onNextTurn: () => void;
  theme: any;
}

export default function CombatControls({
  started,
  round,
  onClearCombat,
  onNextTurn,
  theme
}: CombatControlsProps) {
  if (!started) return null;

  return (
    <View style={{ 
      backgroundColor: theme.card, 
      borderTopWidth: 1, 
      borderTopColor: theme.border, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-around', 
      paddingVertical: 4, 
      paddingHorizontal: 16 
    }}>
      <TouchableOpacity 
        onPress={onClearCombat} 
        style={{ 
          backgroundColor: '#eee', 
          borderRadius: 8, 
          paddingHorizontal: 12, 
          paddingVertical: 4, 
          marginRight: 16, 
          flexDirection: 'row', 
          alignItems: 'center' 
        }}
      >
        <Ionicons name='stop' size={18} color={'#c00'} style={{ marginRight: 4 }} />
        <Text style={{ color: '#c00', fontWeight: 'bold', fontSize: 12 }}>Finish</Text>
      </TouchableOpacity>
      
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.text, marginRight: 16 }}>
        Round {round}
      </Text>
      
      <TouchableOpacity 
        onPress={onNextTurn} 
        style={{ 
          backgroundColor: theme.primary, 
          borderRadius: 8, 
          paddingHorizontal: 16, 
          paddingVertical: 4, 
          marginLeft: 8 
        }}
      >
        <Text style={{ color: theme.buttonText || 'white', fontWeight: 'bold', fontSize: 12 }}>
          Next Turn
        </Text>
      </TouchableOpacity>
    </View>
  );
}
