// REACT
import React, { useState } from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Switch } from 'react-native';

// STYLES
import { createBaseModalStyles } from 'src/styles/baseModalStyles';
import { getCommonStyles } from 'src/styles/commonStyles';

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
}: AdvancedDiceRollModalProps): React.JSX.Element {
    const unifiedStyles = createBaseModalStyles(theme);
    const commonStyles = getCommonStyles(theme);

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
                <Text style={[unifiedStyles.modalText, { fontSize: styleConstants.fontSizeLG, fontWeight: 'bold' }]}>
                    Roll Configuration
                </Text>

                {/* Advantage/Disadvantage Switch */}
                <View style={unifiedStyles.modalSection}>
                    <View style={[unifiedStyles.actionRow, commonStyles.mt_xs]}>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'disadvantage' && unifiedStyles.modalButtonPrimary,
                                { width: '30%', paddingHorizontal: styleConstants.padding2XS, paddingVertical: styleConstants.paddingXS }
                            ]}
                            onPress={() => setAdvantageType('disadvantage')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'disadvantage' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary,
                                { fontSize: styleConstants.fontSizeSM }
                            ]}>
                                Disadv.
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'normal' && unifiedStyles.modalButtonPrimary,
                                { width: '30%', paddingHorizontal: styleConstants.padding2XS, paddingVertical: styleConstants.paddingXS }
                            ]}
                            onPress={() => setAdvantageType('normal')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'normal' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary,
                                { fontSize: styleConstants.fontSizeSM }
                            ]}>
                                Normal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                unifiedStyles.modalButton,
                                unifiedStyles.modalButtonSecondary,
                                advantageType === 'advantage' && unifiedStyles.modalButtonPrimary,
                                { width: '30%', paddingHorizontal: styleConstants.padding2XS, paddingVertical: styleConstants.paddingXS }
                            ]}
                            onPress={() => setAdvantageType('advantage')}
                        >
                            <Text style={[
                                unifiedStyles.modalButtonText,
                                advantageType === 'advantage' ? unifiedStyles.modalButtonTextPrimary : unifiedStyles.modalButtonTextSecondary,
                                { fontSize: styleConstants.fontSizeSM }
                            ]}>
                                Adv.
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Situational Bonus */}
                <View style={[unifiedStyles.modalSection, commonStyles.row_between_center]}>
                    <Text style={[unifiedStyles.modalText, { fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', marginBottom: 0, marginRight: styleConstants.marginSM }]}>
                        Situational Bonus:
                    </Text>
                    <View style={[commonStyles.row_between_center, { flex: 1 }]}>
                        <TouchableOpacity
                            style={{ backgroundColor: theme.primary, height: 30, width: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                const currentValue = parseInt(situationalBonus) || 0;
                                setSituationalBonus(String(currentValue - 1));
                            }}
                        >
                            <Text style={{ fontSize: styleConstants.fontSizeXL, fontWeight: 'bold', color: 'white' }}>
                                -
                            </Text>
                        </TouchableOpacity>
                        
                        <View style={[
                            { 
                                paddingVertical: styleConstants.paddingSM,
                                paddingHorizontal: styleConstants.padding2XS,
                                borderRadius: styleConstants.borderRadiusMD,
                                flex: 1, 
                                marginHorizontal: styleConstants.marginSM, 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                backgroundColor: theme.background
                            }
                        ]}>
                            <Text style={[unifiedStyles.modalText, { fontSize: styleConstants.fontSizeLG, fontWeight: 'bold' }]}>
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
                            <Text style={{ fontSize: styleConstants.fontSizeXL, fontWeight: 'bold', color: 'white' }}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Base Bonus Display */}
                <View style={[unifiedStyles.modalSection, { marginBottom: 0 }]}>
                    <Text style={[unifiedStyles.modalText, { fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', marginBottom: 0, marginRight: styleConstants.marginSM }]}>
                        Resume:
                    </Text>
                    <View style={commonStyles.row_around_center}>
                        <Text style={[unifiedStyles.modalText, { textAlign: 'center', fontStyle: 'italic' }]}>
                            Base Bonus: {d20Config!.bonus >= 0 ? '+' : ''}{d20Config!.bonus}
                        </Text>
                        {situationalBonus && (
                            <Text style={[unifiedStyles.modalText, { textAlign: 'center', fontStyle: 'italic', marginTop: styleConstants.marginXS }]}>
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
            <Text style={[unifiedStyles.modalText, { fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', marginBottom: styleConstants.marginLG }]}>
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
            <View style={{ borderWidth: styleConstants.borderXS, borderColor: theme.border, borderRadius: styleConstants.borderRadiusMD, paddingHorizontal: styleConstants.paddingSM, paddingVertical: styleConstants.paddingSM }}>
                <View style={[unifiedStyles.modalSection, {
                    alignItems: 'center',
                    backgroundColor: theme.card + '20'
                }]}>
                    <Text style={[unifiedStyles.modalText, {
                        lineHeight: 24,
                        fontSize: styleConstants.fontSize2XL,
                        fontWeight: 'bold',
                        marginBottom: styleConstants.marginSM,
                        color: theme.success || '#4ade80'
                    }]}>
                        Total: {result.total}
                    </Text>
                    <Text style={[unifiedStyles.modalText, commonStyles.mb_xs]}>
                        Dice roll: {result.rolls.join(', ')}
                    </Text>
                    <Text style={[unifiedStyles.modalText, { fontSize: styleConstants.fontSizeSM, fontStyle: 'italic' }]}>
                        {result.expression}
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
                    { marginTop: styleConstants.marginXS, marginBottom: styleConstants.marginMD },
                    result && { marginTop: 0, marginBottom: 0 }
                ]}
            >
                <TouchableOpacity
                    style={[unifiedStyles.modalButton, unifiedStyles.modalButtonPrimary]}
                    onPress={handleRoll}
                >
                    <Text style={[unifiedStyles.modalButtonText, unifiedStyles.modalButtonTextPrimary]}>
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
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={unifiedStyles.modalBody}>
                    {d20Config && renderD20Config()}
                    
                    {damageConfig && renderDamageConfig()}

                    {renderResult()}
                </View>
            </TouchableWithoutFeedback>
        </BaseModal>
    );
}

