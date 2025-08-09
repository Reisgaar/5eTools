import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createCombatStyles } from '../../styles/combat';
import { CombatControlsProps } from './types';

export default function CombatControls({
  started,
  round,
  onStopCombat,
  onNextTurn,
  onStartCombat,
  theme
}: CombatControlsProps) {
  const styles = createCombatStyles(theme);

  return (
    <View style={[styles.controls, { borderTopColor: theme.border }]}>
      {!started ? (
        // Start Combat Button
        <TouchableOpacity 
          onPress={onStartCombat} 
          style={[styles.controlsStartButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name='play' size={18} color="white" style={styles.controlsStartIcon} />
          <Text style={styles.controlsStartText}>Start Combat</Text>
        </TouchableOpacity>
      ) : (
        // Finish Combat Button
        <TouchableOpacity 
          onPress={onStopCombat} 
          style={styles.controlsFinishButton}
        >
          <Ionicons name='stop' size={18} color={'#c00'} style={styles.controlsFinishIcon} />
          <Text style={styles.controlsFinishText}>Finish</Text>
        </TouchableOpacity>
      )}
      
      {started && (
        <>
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
        </>
      )}
    </View>
  );
}
