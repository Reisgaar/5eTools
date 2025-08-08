import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createCombatStyles } from '../../styles/combat';

interface CombatControlsProps {
  started: boolean;
  round: number;
  onStopCombat: () => void;
  onNextTurn: () => void;
  theme: any;
}

export default function CombatControls({
  started,
  round,
  onStopCombat,
  onNextTurn,
  theme
}: CombatControlsProps) {
  const styles = createCombatStyles(theme);
  
  if (!started) return null;

  return (
    <View style={[styles.controls, { borderTopColor: theme.border }]}>
      <TouchableOpacity 
        onPress={onStopCombat} 
        style={styles.controlsFinishButton}
      >
        <Ionicons name='stop' size={18} color={'#c00'} style={styles.controlsFinishIcon} />
        <Text style={styles.controlsFinishText}>Finish</Text>
      </TouchableOpacity>
      
      <Text style={[styles.controlsRoundText, { color: theme.text }]}>
        Round {round}
      </Text>
      
      <TouchableOpacity 
        onPress={onNextTurn} 
        style={styles.controlsNextButton}
      >
        <Text style={styles.controlsNextText}>
          Next Turn
        </Text>
      </TouchableOpacity>
    </View>
  );
}
