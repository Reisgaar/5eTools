// REACT
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Switch } from 'react-native';

// STYLES
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
            if (situationalBonus.startsWith('+'))
                situationalBonusNum = parseInt(situationalBonus.slice(1)) || 0;
            else if (situationalBonus.startsWith('-'))
                situationalBonusNum = -parseInt(situationalBonus.slice(1)) || 0;
            else
                situationalBonusNum = parseInt(situationalBonus) || 0;
        }
        const totalBonus = d20Config!.bonus + situationalBonusNum;

        return (
            <View style={unifiedStyles.modalSection}>
                <Text style={[unifiedStyles.modalText, { fontSize: 16, fontWeight: 'bold' }]}>
                    Roll Configuration
                </Text>

                {/* Advantage/Disadvantage Switch */}
                <View style={unifiedStyles.modalSection}>
                    <View style={[unifiedStyles.actionRow, { marginTop: 6 }]}>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'disadvantage' && unifiedStyles.modalButtonPrimary,
                                { width: '30%', paddingHorizontal: 1, paddingVertical: 4 }
                            ]}
                            onPress={() => setAdvantageType('disadvantage')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'disadvantage' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary,
                                advantageType === 'disadvantage' && { color: 'white' },
                                { fontSize: 12 }
                            ]}>
                                Disadv.
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'normal' && unifiedStyles.modalButtonPrimary,
                                { width: '30%', paddingHorizontal: 1, paddingVertical: 4 }
                            ]}
                            onPress={() => setAdvantageType('normal')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'normal' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary,
                                advantageType === 'normal' && { color: 'white' },
                                { fontSize: 12 }
                            ]}>
                                Normal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'advantage' && unifiedStyles.modalButtonPrimary,
                                { width: '30%', paddingHorizontal: 1, paddingVertical: 4 }
                            ]}
                            onPress={() => setAdvantageType('advantage')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'advantage' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary,
                                advantageType === 'advantage' && { color: 'white' },
                                { fontSize: 12 }
                            ]}>
                                Adv.
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Situational Bonus */}
                <View style={[unifiedStyles.modalSection, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={[unifiedStyles.modalText, { fontSize: 16, fontWeight: 'bold', marginBottom: 0, marginRight: 8 }]}>
                        Situational Bonus:
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.primary, height: 30, width: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                const currentValue = parseInt(situationalBonus) || 0;
                                setSituationalBonus(String(currentValue - 1));
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                -
                            </Text>
                        </TouchableOpacity>
                        
                        <View style={[
                            { 
                                paddingVertical: 8,
                                paddingHorizontal: 2,
                                borderRadius: 8,
                                flex: 1, 
                                marginHorizontal: 8, 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                backgroundColor: theme.background
                            }
                        ]}>
                            <Text style={[unifiedStyles.modalText, { fontSize: 16, fontWeight: 'bold' }]}>
                                {situationalBonus ? (parseInt(situationalBonus) > 0 ? '+' : '') + situationalBonus : '0'}
                            </Text>
                        </View>
                        
                        <TouchableOpacity
                            style={{ backgroundColor: theme.primary, height: 30, width: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                const currentValue = parseInt(situationalBonus) || 0;
                                setSituationalBonus(String(currentValue + 1));
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Base Bonus Display */}
                <View style={[unifiedStyles.modalSection, { marginBottom: 0 }]}>
                    <Text style={[unifiedStyles.modalText, { fontSize: 16, fontWeight: 'bold', marginBottom: 0, marginRight: 8 }]}>
                        Resume:
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
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
                <View style={[unifiedStyles.actionRow, { alignItems: 'center', marginTop: 0 }]}>
                    <Text style={unifiedStyles.modalText}>Critical hit?</Text>
                    <Switch value={isCritical} onValueChange={() => setIsCritical(!isCritical)} />
                </View>
            </View>

            {/* Repeat 1s */}
            <View style={unifiedStyles.modalSection}>
                <View style={[unifiedStyles.actionRow, { alignItems: 'center', marginTop: 0 }]}>
                    <Text style={unifiedStyles.modalText}>Repeat 1s?</Text>
                    <Switch value={repeatOnes} onValueChange={() => setRepeatOnes(!repeatOnes)} />
                </View>
            </View>

            {/* Repeat 2s */}
            <View style={unifiedStyles.modalSection}>
                <View style={[unifiedStyles.actionRow, { alignItems: 'center', marginTop: 0 }]}>
                    <Text style={unifiedStyles.modalText}>Repeat 2s?</Text>
                    <Switch value={repeatTwos} onValueChange={() => setRepeatTwos(!repeatTwos)} />
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
        if (!result) return renderRollButton();

        return (
            <View style={{ width: '100%' }}>
                <View style={[unifiedStyles.modalSection, {
                    alignItems: 'center',
                }]}>
                    <Text style={[unifiedStyles.modalText, {
                        lineHeight: 24,
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: theme.primary
                    }]}>
                        Total: {result.total}
                    </Text>
                    <Text style={[unifiedStyles.modalText, { marginBottom: 0, fontStyle: 'italic' }]}>
                        Dice roll: {result.rolls.join(', ')} ({result.expression})
                    </Text>
                </View>
                {renderRollButton()}
            </View>
        );
    };

    const renderRollButton = () => {
        return (
            <View
                style={[
                    unifiedStyles.actionRow,
                    { marginTop: 6, marginBottom: 12 },
                    result && { marginTop: 0, marginBottom: 0 }
                ]}
            >
                <TouchableOpacity
                    style={[unifiedStyles.modalButton, unifiedStyles.modalButtonPrimary]}
                    onPress={handleRoll}
                >
                    <Text style={[unifiedStyles.modalButtonText, unifiedStyles.modalButtonTextPrimary, { color: 'white' }]}>
                        {result ? 'Re-roll' : 'Roll Dice'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <BaseModal
            visible={visible}
            onClose={handleClose}
            theme={theme}
            title={getTitle()}
            footerContent={renderResult()}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={unifiedStyles.modalBody}>
                    {d20Config && renderD20Config()}
                    
                    {damageConfig && renderDamageConfig()}
                </View>
            </TouchableWithoutFeedback>
        </BaseModal>
    );
}

