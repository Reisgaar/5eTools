// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STYLES
import { createCombatStyles } from 'src/styles/combat';

// MODELS
import { CombatControlsProps } from 'src/models/interfaces/combat';

/**
 * CombatControls component.
 */
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
        <View style={[styles.controls, !started && { borderColor: theme.text }]}>
            {!started && (
                // Start Combat Button
                <TouchableOpacity
                    onPress={onStartCombat}
                    style={[styles.controlsStartButton]}
                >
                    <Ionicons name='play' size={18} color="white" style={styles.controlsStartIcon} />
                    <Text style={styles.controlsStartText}>Start</Text>
                </TouchableOpacity>
            )}

            {started && (
                <>
                    <TouchableOpacity
                        onPress={onStopCombat}
                        style={styles.controlsFinishButton}
                    >
                        <Ionicons name='stop' size={18} color={'#c00'} style={styles.controlsFinishIcon} />
                        <Text style={styles.controlsFinishText}>Finish</Text>
                    </TouchableOpacity>

                    <View style={styles.controlRoundButton}>
                        <Text style={styles.controlsRoundText}>Round</Text>
                        <Text style={styles.controlsRoundNumberText}>{round}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={onNextTurn}
                        style={styles.controlsNextButton}
                    >
                        <Ionicons name='refresh' size={16} color="white" style={styles.controlsNextIcon} />
                        <Text style={styles.controlsNextText}>
                            Next
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}
