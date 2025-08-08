import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, StyleSheet } from 'react-native';
import BaseModal from '../ui/BaseModal';
import { rollDice, parseDiceExpression } from '../../utils/replaceTags';

interface AdvancedDiceRollModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    // Para tiradas de d20 (ataques, salvaciones, tiradas de característica)
    d20Config?: {
        bonus: number;
        label: string;
        type: 'hit' | 'save' | 'ability';
    };
    // Para tiradas de daño
    damageConfig?: {
        expression: string;
        label: string;
    };
}

type AdvantageType = 'normal' | 'advantage' | 'disadvantage';

export default function AdvancedDiceRollModal({ 
    visible, 
    onClose, 
    theme, 
    d20Config, 
    damageConfig 
}: AdvancedDiceRollModalProps) {
    const [advantageType, setAdvantageType] = useState<AdvantageType>('normal');
    const [situationalBonus, setSituationalBonus] = useState('');
    const [isCritical, setIsCritical] = useState(false);
    const [repeatOnes, setRepeatOnes] = useState(false);
    const [repeatTwos, setRepeatTwos] = useState(false);
    const [result, setResult] = useState<{ total: number; rolls: number[]; expression: string } | null>(null);

    const handleRoll = () => {
        if (d20Config) {
            // Tirada de d20
            let situationalBonusNum = 0;
            if (situationalBonus) {
                // Handle + and - prefixes
                if (situationalBonus.startsWith('+')) {
                    situationalBonusNum = parseInt(situationalBonus.slice(1)) || 0;
                } else if (situationalBonus.startsWith('-')) {
                    situationalBonusNum = -parseInt(situationalBonus.slice(1)) || 0;
                } else {
                    situationalBonusNum = parseInt(situationalBonus) || 0;
                }
            }
            const totalBonus = d20Config.bonus + situationalBonusNum;
            
            let rolls: number[];
            let finalRoll: number;
            
            if (advantageType === 'normal') {
                rolls = [Math.floor(Math.random() * 20) + 1];
                finalRoll = rolls[0];
            } else {
                // Ventaja o desventaja
                rolls = [
                    Math.floor(Math.random() * 20) + 1,
                    Math.floor(Math.random() * 20) + 1
                ];
                
                if (advantageType === 'advantage') {
                    finalRoll = Math.max(rolls[0], rolls[1]);
                } else {
                    finalRoll = Math.min(rolls[0], rolls[1]);
                }
            }
            
            const total = finalRoll + totalBonus;
            
            setResult({
                total,
                rolls,
                expression: `1d20${totalBonus >= 0 ? '+' : ''}${totalBonus}`
            });
        } else if (damageConfig) {
            // Tirada de daño
            const parsed = parseDiceExpression(damageConfig.expression);
            if (!parsed) return;
            
            let { numDice, diceType, modifier } = parsed;
            
            // Aplicar crítico
            if (isCritical) {
                numDice *= 2;
            }
            
            const { result: rollResult, breakdown } = rollDice(numDice, diceType, modifier);
            
            // Aplicar repetición de 1s y 2s
            let finalRolls = [...breakdown];
            let finalResult = rollResult;
            
            if (repeatOnes || repeatTwos) {
                let additionalRolls: number[] = [];
                
                breakdown.forEach(roll => {
                    if ((repeatOnes && roll === 1) || (repeatTwos && roll === 2)) {
                        const newRoll = Math.floor(Math.random() * diceType) + 1;
                        additionalRolls.push(newRoll);
                    }
                });
                
                if (additionalRolls.length > 0) {
                    finalRolls = [...finalRolls, ...additionalRolls];
                    finalResult += additionalRolls.reduce((a, b) => a + b, 0);
                }
            }
            
            setResult({
                total: finalResult,
                rolls: finalRolls,
                expression: damageConfig.expression
            });
        }
    };

    const resetForm = () => {
        setAdvantageType('normal');
        setSituationalBonus('');
        setIsCritical(false);
        setRepeatOnes(false);
        setRepeatTwos(false);
        setResult(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getTitle = () => {
        if (d20Config) {
            return `${d20Config.label} Roll`;
        } else if (damageConfig) {
            return `${damageConfig.label} Roll`;
        }
        return 'Dice Roll';
    };

    const renderD20Config = () => {
        // Calculate total bonus for display
        let situationalBonusNum = 0;
        if (situationalBonus) {
            if (situationalBonus.startsWith('+')) {
                situationalBonusNum = parseInt(situationalBonus.slice(1)) || 0;
            } else if (situationalBonus.startsWith('-')) {
                situationalBonusNum = -parseInt(situationalBonus.slice(1)) || 0;
            } else {
                situationalBonusNum = parseInt(situationalBonus) || 0;
            }
        }
        const totalBonus = d20Config.bonus + situationalBonusNum;

        return (
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Roll Configuration</Text>
                
                {/* Advantage/Disadvantage Switch */}
                <View style={styles.switchRow}>
                    <Text style={[styles.switchLabel, { color: theme.text }]}>Advantage/Disadvantage:</Text>
                    <View style={styles.switchContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.switchOption, 
                                advantageType === 'disadvantage' && { backgroundColor: theme.primary }
                            ]}
                            onPress={() => setAdvantageType('disadvantage')}
                        >
                            <Text style={[
                                styles.switchOptionText, 
                                { color: advantageType === 'disadvantage' ? theme.buttonText || 'white' : theme.text }
                            ]}>
                                Dis
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.switchOption, 
                                advantageType === 'normal' && { backgroundColor: theme.primary }
                            ]}
                            onPress={() => setAdvantageType('normal')}
                        >
                            <Text style={[
                                styles.switchOptionText, 
                                { color: advantageType === 'normal' ? theme.buttonText || 'white' : theme.text }
                            ]}>
                                Normal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.switchOption, 
                                advantageType === 'advantage' && { backgroundColor: theme.primary }
                            ]}
                            onPress={() => setAdvantageType('advantage')}
                        >
                            <Text style={[
                                styles.switchOptionText, 
                                { color: advantageType === 'advantage' ? theme.buttonText || 'white' : theme.text }
                            ]}>
                                Adv
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {/* Situational Bonus */}
                <View style={styles.inputRow}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>Situational Bonus:</Text>
                    <TextInput
                        style={[styles.textInput, { 
                            backgroundColor: theme.card, 
                            color: theme.text, 
                            borderColor: theme.primary 
                        }]}
                        value={situationalBonus}
                        onChangeText={(text) => {
                            // Allow +, -, and numbers
                            if (/^[+-]?\d*$/.test(text)) {
                                setSituationalBonus(text);
                            }
                        }}
                        placeholder="+2, -1, etc."
                        placeholderTextColor={theme.textSecondary || '#888'}
                        keyboardType="numeric"
                    />
                </View>
                
                {/* Base Bonus Display */}
                <View style={styles.bonusDisplay}>
                    <Text style={[styles.bonusText, { color: theme.text }]}>
                        Base Bonus: {d20Config.bonus >= 0 ? '+' : ''}{d20Config.bonus}
                    </Text>
                    {situationalBonus && (
                        <Text style={[styles.bonusText, { color: theme.text }]}>
                            Total Bonus: {totalBonus >= 0 ? '+' : ''}{totalBonus}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const renderDamageConfig = () => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Damage Configuration</Text>
            
            {/* Critical Hit */}
            <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: theme.text }]}>Critical Hit:</Text>
                <Switch
                    value={isCritical}
                    onValueChange={setIsCritical}
                    trackColor={{ false: theme.card, true: theme.primary }}
                    thumbColor={isCritical ? theme.buttonText || 'white' : theme.text}
                />
            </View>
            
            {/* Repeat 1s */}
            <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: theme.text }]}>Repeat 1s:</Text>
                <Switch
                    value={repeatOnes}
                    onValueChange={setRepeatOnes}
                    trackColor={{ false: theme.card, true: theme.primary }}
                    thumbColor={repeatOnes ? theme.buttonText || 'white' : theme.text}
                />
            </View>
            
            {/* Repeat 2s */}
            <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: theme.text }]}>Repeat 2s:</Text>
                <Switch
                    value={repeatTwos}
                    onValueChange={setRepeatTwos}
                    trackColor={{ false: theme.card, true: theme.primary }}
                    thumbColor={repeatTwos ? theme.buttonText || 'white' : theme.text}
                />
            </View>
            
            {/* Expression Display */}
            <View style={styles.expressionDisplay}>
                <Text style={[styles.expressionText, { color: theme.text }]}>
                    Expression: {damageConfig.expression}
                </Text>
            </View>
        </View>
    );

    const renderResult = () => {
        if (!result) return null;
        
        return (
            <View style={styles.resultSection}>
                <Text style={[styles.resultTitle, { color: theme.text }]}>Roll Result</Text>
                <Text style={[styles.resultTotal, { color: theme.success || '#4ade80' }]}>
                    Total: {result.total}
                </Text>
                <Text style={[styles.resultRolls, { color: theme.text }]}>
                    Rolls: {result.rolls.join(', ')}
                </Text>
                <Text style={[styles.resultExpression, { color: theme.text }]}>
                    {result.expression}
                </Text>
            </View>
        );
    };

    return (
        <BaseModal
            visible={visible}
            onClose={handleClose}
            theme={theme}
            title={getTitle()}
        >
            <View style={styles.container}>
                {d20Config && renderD20Config()}
                {damageConfig && renderDamageConfig()}
                
                {renderResult()}
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.rollButton, { backgroundColor: theme.primary }]}
                        onPress={handleRoll}
                    >
                        <Text style={[styles.rollButtonText, { color: theme.buttonText || 'white' }]}>
                            Roll Dice
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        minWidth: 300,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    switchLabel: {
        fontSize: 14,
        flex: 1,
    },
    switchContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
    },
    switchOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: 50,
        alignItems: 'center',
    },
    switchOptionText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        flex: 1,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 80,
        textAlign: 'center',
    },
    bonusDisplay: {
        alignItems: 'center',
        marginTop: 8,
    },
    bonusText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    expressionDisplay: {
        alignItems: 'center',
        marginTop: 8,
    },
    expressionText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    resultSection: {
        alignItems: 'center',
        marginTop: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    resultTotal: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    resultRolls: {
        fontSize: 14,
        marginBottom: 4,
    },
    resultExpression: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    rollButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    rollButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
