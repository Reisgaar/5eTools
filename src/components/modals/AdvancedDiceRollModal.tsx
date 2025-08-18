// REACT
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, StyleSheet } from 'react-native';

// CONTEXT
import { useModal } from 'src/context/ModalContext';

// STYLES
import { getModalZIndex } from 'src/styles/baseModalStyles';
import { createBaseModalStyles } from 'src/styles/baseModalStyles';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// UTILS
import { rollDice, parseDiceExpression } from 'src/utils/replaceTags';

// INTERFACES
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

/**
 * AdvancedDiceRollModal component.
 */
export default function AdvancedDiceRollModal({
    visible,
    onClose,
    theme,
    d20Config,
    damageConfig
}: AdvancedDiceRollModalProps): JSX.Element {
    const { beastStackDepth, spellStackDepth } = useModal();
    const maxStackDepth = Math.max(beastStackDepth, spellStackDepth);
    const dynamicZIndex = getModalZIndex(maxStackDepth + 1); // Dice modals should be above other modals
    const unifiedStyles = createBaseModalStyles(theme);

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
                if (situationalBonus.startsWith('+'))
                    situationalBonusNum = parseInt(situationalBonus.slice(1)) || 0;
                else if (situationalBonus.startsWith('-'))
                    situationalBonusNum = -parseInt(situationalBonus.slice(1)) || 0;
                else
                    situationalBonusNum = parseInt(situationalBonus) || 0;
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

                if (advantageType === 'advantage')
                    finalRoll = Math.max(rolls[0], rolls[1]);
                else
                    finalRoll = Math.min(rolls[0], rolls[1]);
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
            if (isCritical)
                numDice *= 2;

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
        const totalBonus = d20Config!.bonus + situationalBonusNum;

        return (
            <View style={unifiedStyles.modalSection}>
                <Text style={[unifiedStyles.modalText, { fontSize: 16, fontWeight: 'bold', marginBottom: 16 }]}>
                    Roll Configuration
                </Text>

                {/* Advantage/Disadvantage Switch */}
                <View style={unifiedStyles.modalSection}>
                    <Text style={[unifiedStyles.modalText, { marginBottom: 12 }]}>Advantage/Disadvantage:</Text>
                    <View style={unifiedStyles.actionRow}>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'disadvantage' && unifiedStyles.modalButtonPrimary
                            ]}
                            onPress={() => setAdvantageType('disadvantage')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'disadvantage' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary
                            ]}>
                                Disadvantage
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'normal' && unifiedStyles.modalButtonPrimary
                            ]}
                            onPress={() => setAdvantageType('normal')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'normal' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary
                            ]}>
                                Normal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'advantage' && unifiedStyles.modalButtonPrimary
                            ]}
                            onPress={() => setAdvantageType('advantage')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'advantage' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary
                            ]}>
                                Advantage
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Situational Bonus */}
                <View style={unifiedStyles.modalSection}>
                    <Text style={[unifiedStyles.modalText, { marginBottom: 8 }]}>Situational Bonus:</Text>
                    <TextInput
                        style={unifiedStyles.modalInput}
                        value={situationalBonus}
                        onChangeText={(text) => {
                            // Allow +, -, and numbers
                            if (/^[+-]?\d*$/.test(text)) {
                                setSituationalBonus(text);
                            }
                        }}
                        placeholder="+2, -1, etc."
                        placeholderTextColor={theme.noticeText}
                        keyboardType="numeric"
                    />
                </View>

                {/* Base Bonus Display */}
                <View style={unifiedStyles.modalSection}>
                    <Text style={[unifiedStyles.modalText, { textAlign: 'center', fontStyle: 'italic' }]}>
                        Base Bonus: {d20Config!.bonus >= 0 ? '+' : ''}{d20Config!.bonus}
                    </Text>
                    {situationalBonus && (
                        <Text style={[unifiedStyles.modalText, { textAlign: 'center', fontStyle: 'italic', marginTop: 4 }]}>
                            Total Bonus: {totalBonus >= 0 ? '+' : ''}{totalBonus}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const renderDamageConfig = () => (
        <View style={unifiedStyles.modalSection}>
            <Text style={[unifiedStyles.modalText, { fontSize: 16, fontWeight: 'bold', marginBottom: 16 }]}>
                Damage Configuration
            </Text>

            {/* Critical Hit */}
            <View style={unifiedStyles.modalSection}>
                <Text style={[unifiedStyles.modalText, { marginBottom: 12 }]}>Critical Hit:</Text>
                <View style={unifiedStyles.actionRow}>
                    <TouchableOpacity
                        style={[
                            unifiedStyles.modalButton,
                            unifiedStyles.modalButtonSecondary,
                            isCritical && unifiedStyles.modalButtonPrimary
                        ]}
                        onPress={() => setIsCritical(!isCritical)}
                    >
                        <Text style={[
                            unifiedStyles.modalButtonText,
                            isCritical ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary
                        ]}>
                            {isCritical ? 'Critical ✓' : 'Normal'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Repeat 1s */}
            <View style={unifiedStyles.modalSection}>
                <Text style={[unifiedStyles.modalText, { marginBottom: 12 }]}>Repeat 1s:</Text>
                <View style={unifiedStyles.actionRow}>
                    <TouchableOpacity
                        style={[
                            unifiedStyles.modalButton,
                            unifiedStyles.modalButtonSecondary,
                            repeatOnes && unifiedStyles.modalButtonPrimary
                        ]}
                        onPress={() => setRepeatOnes(!repeatOnes)}
                    >
                        <Text style={[
                            unifiedStyles.modalButtonText,
                            repeatOnes ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary
                        ]}>
                            {repeatOnes ? 'Repeat 1s ✓' : 'Keep 1s'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Repeat 2s */}
            <View style={unifiedStyles.modalSection}>
                <Text style={[unifiedStyles.modalText, { marginBottom: 12 }]}>Repeat 2s:</Text>
                <View style={unifiedStyles.actionRow}>
                    <TouchableOpacity
                        style={[
                            unifiedStyles.modalButton,
                            unifiedStyles.modalButtonSecondary,
                            repeatTwos && unifiedStyles.modalButtonPrimary
                        ]}
                        onPress={() => setRepeatTwos(!repeatTwos)}
                    >
                        <Text style={[
                            unifiedStyles.modalButtonText,
                            repeatTwos ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary
                        ]}>
                            {repeatTwos ? 'Repeat 2s ✓' : 'Keep 2s'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Expression Display */}
            <View style={unifiedStyles.modalSection}>
                <Text style={[unifiedStyles.modalText, { textAlign: 'center', fontStyle: 'italic' }]}>
                    Expression: {damageConfig!.expression}
                </Text>
            </View>
        </View>
    );

    const renderResult = () => {
        if (!result) return null;

        return (
            <View style={[unifiedStyles.modalSection, {
                alignItems: 'center',
                padding: 16,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 8,
                backgroundColor: theme.card + '20'
            }]}>
                <Text style={[unifiedStyles.modalText, { fontSize: 16, fontWeight: 'bold', marginBottom: 8 }]}>
                    Roll Result
                </Text>
                <Text style={[unifiedStyles.modalText, {
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 8,
                    color: theme.success || '#4ade80'
                }]}>
                    Total: {result.total}
                </Text>
                <Text style={[unifiedStyles.modalText, { marginBottom: 4 }]}>
                    Rolls: {result.rolls.join(', ')}
                </Text>
                <Text style={[unifiedStyles.modalText, { fontSize: 12, fontStyle: 'italic' }]}>
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
            zIndex={dynamicZIndex}
        >
            <View style={unifiedStyles.modalBody}>
                {d20Config && renderD20Config()}
                {damageConfig && renderDamageConfig()}

                {renderResult()}

                <View style={unifiedStyles.actionRow}>
                    <TouchableOpacity
                        style={[unifiedStyles.modalButton, unifiedStyles.modalButtonPrimary]}
                        onPress={handleRoll}
                    >
                        <Text style={[unifiedStyles.modalButtonText, unifiedStyles.modalButtonTextPrimary]}>
                            Roll Dice
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BaseModal>
    );
}

