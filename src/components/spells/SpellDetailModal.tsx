import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useModal } from '../../context/ModalContext';
import { useData } from '../../context/DataContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import { renderEntries, parseDiceExpression, rollDice } from '../../utils/replaceTags';
import { Separator } from '../ui';
import { createSpellStyles } from '../../styles/spellStyles';
import { 
  getFullSchool, 
  formatComponents, 
  formatRange, 
  formatTime, 
  formatDuration,
  formatClasses,
  formatSubclasses,
  formatRaces,
  formatBackgrounds,
  formatFeats
} from '../../utils/spellUtils';
import { normalizeString, equalsNormalized } from '../../utils/stringUtils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');




export function SpellDetailModal({
    visible,
    spell,
    onClose,
    schoolFullName,
    theme,
    onCreaturePress,
    onSpellPress,
}: {
    visible: boolean,
    spell: any,
    onClose: () => void,
    schoolFullName: string,
    theme: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
}) {
    const { openDiceModal, openAdvancedDiceModal, openBeastModal, openSpellModal } = useModal();
    const { simpleBeasts, simpleSpells } = useData();
    const { useAdvancedDiceRoll } = useAppSettings();
    const styles = createSpellStyles(theme);

    const handleCreaturePressLocal = (name: string, source: string) => {
      const beast = simpleBeasts.find((b: any) => equalsNormalized(b.name, name) && equalsNormalized(b.source, source));
      if (beast) {
        openBeastModal(beast, true);
      }
    };
    const handleSpellPressLocal = (name: string, source: string) => {
      const spell = simpleSpells.find((s: any) => equalsNormalized(s.name, name) && equalsNormalized(s.source, source));
      if (spell) {
        openSpellModal(spell, true);
      }
    };

    function handleDamagePress(expr: string) {
        if (useAdvancedDiceRoll) {
            openAdvancedDiceModal({
                damageConfig: {
                    expression: expr,
                    label: 'Damage',
                }
            });
        } else {
            // Use simple dice roll
            const parsed = parseDiceExpression(expr);
            if (!parsed) return;
            const { numDice, diceType, modifier } = parsed;
            const { result, breakdown } = rollDice(numDice, diceType, modifier);
            openDiceModal({
                expression: expr,
                result,
                breakdown,
                modifier: modifier !== 0 ? modifier : undefined,
                type: 'damage',
            });
        }
    }
    function handleHitPress(bonus: string) {
        const bonusNum = parseInt(bonus, 10) || 0;
        if (useAdvancedDiceRoll) {
            openAdvancedDiceModal({
                d20Config: {
                    bonus: bonusNum,
                    label: 'Attack',
                    type: 'hit',
                }
            });
        } else {
            // Use simple dice roll
            const roll = Math.floor(Math.random() * 20) + 1;
            openDiceModal({
                expression: `1d20 + ${bonusNum}`,
                result: roll + bonusNum,
                breakdown: [roll],
                modifier: bonusNum !== 0 ? bonusNum : undefined,
                type: 'hit',
            });
        }
    }

    if (!visible) return null;
    if (!spell) return (
        <View style={styles.spellDetailOverlay} pointerEvents="auto">
            <View style={styles.modalContentWrapper}>
                <View style={[styles.spellDetailContent, { alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </View>
        </View>
    );
    console.log(JSON.stringify(spell));
    return (
        <View style={styles.spellDetailOverlay} pointerEvents="auto">
            <View style={styles.modalContentWrapper}>
                <View style={[styles.spellDetailContent, { maxHeight: SCREEN_HEIGHT * 0.8 }]}>
                    {/* X Close Button */}
                    <TouchableOpacity onPress={onClose} style={styles.spellDetailCloseBtn}>
                        <Ionicons name="close" size={28} color={theme.text} />
                    </TouchableOpacity>
                    {/* Header */}
                    <Text style={styles.spellDetailTitle}>{spell.name}</Text>
                    <Text style={styles.spellDetailSubtitle}>Level {spell.level === 0 ? 'Cantrip' : spell.level} {getFullSchool(spell.school)}</Text>
                    <View style={styles.spellDetailGrid}>
                        <View style={styles.spellDetailGridItem}>
                            <Text style={styles.spellDetailGridLabel}>CastingTime:</Text>
                            <Text style={styles.spellDetailGridValue}>{formatTime(spell.time)}</Text>
                        </View>
                        <View style={styles.spellDetailGridItem}>
                            <Text style={styles.spellDetailGridLabel}>Range:</Text>
                            <Text style={styles.spellDetailGridValue}>{formatRange(spell.range)}</Text>
                        </View>
                        <View style={styles.spellDetailGridItem}>
                            <Text style={styles.spellDetailGridLabel}>Components:</Text>
                            <Text style={styles.spellDetailGridValue}>{formatComponents(spell.components)}</Text>
                        </View>
                        <View style={styles.spellDetailGridItemLast}>
                            <Text style={styles.spellDetailGridLabel}>Duration:</Text>
                            <Text style={styles.spellDetailGridValue}>{formatDuration(spell.duration)}</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.spellDetailScrollView}>
                        <View style={styles.spellDetailScrollContent}>
                            {/* Description */}
                            {spell.entries && (
                                <>
                                    <Separator title='Description' size='small' />
                                    {renderEntries(spell.entries, 0, theme, handleCreaturePressLocal, handleSpellPressLocal, {}, handleDamagePress, handleHitPress)}
                                </>
                            )}

                            {/* Higher Level */}
                            {spell.entriesHigherLevel && (
                                <>
                                    <Separator title='Higher Level' size='small' />
                                    {renderHigherLevel(spell.entriesHigherLevel, theme, handleCreaturePressLocal, handleSpellPressLocal)}
                                </>
                            )}

                            {/* Classes, Subclasses, Species, Backgrounds, Feats */}
                            {spell.classes && (
                                <>
                                    <Separator title='Classes' size='small' />
                                    {renderList('Classes', formatClasses(spell.classes), theme)}
                                </>
                            )}
                            {spell.subclasses && (
                                <>
                                    <Separator title='Subclasses' size='small' />
                                    {renderList('Subclasses', formatSubclasses(spell.subclasses), theme)}
                                </>
                            )}
                            {spell.races && (
                                <>
                                    <Separator title='Species' size='small' />
                                    {renderList('Species', formatRaces(spell.races), theme)}
                                </>
                            )}
                            {spell.backgrounds && (
                                <>
                                    <Separator title='Backgrounds' size='small' />
                                    {renderList('Backgrounds', formatBackgrounds(spell.backgrounds), theme)}
                                </>
                            )}
                            {spell.feats && (
                                <>
                                    <Separator title='Feats' size='small' />
                                    {renderList('Feats', formatFeats(spell.feats), theme)}
                                </>
                            )}

                            {/* SRD and Source Info */}
                            {spell.source && (
                                <>
                                    <Text style={styles.spellDetailSource}>Source: {spell.source}{spell.page ? `, page ${spell.page}` : ''}{spell.srd ? ' Available in the SRD and Basic Rules.' : ''}</Text>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}



function renderHigherLevel(entriesHigherLevel: any, theme: any, onCreaturePress?: (name: string, source: string) => void, onSpellPress?: (name: string, source: string) => void): React.ReactNode {
    if (!entriesHigherLevel) return null;
    if (Array.isArray(entriesHigherLevel)) {
        return entriesHigherLevel.map((e, idx) => (
            <View key={idx} style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: 'bold', color: theme.text, fontSize: 12, marginBottom: 6 }}>Using a Higher-Level Spell Slot.</Text>
                {renderEntries(e.entries, 10, theme, onCreaturePress, onSpellPress)}
            </View>
        ));
    }
    return null;
}

function renderList(label: string, arr: any, theme: any) {
    if (!arr || !arr.length) return null;
    return (
        <Text style={{ color: theme.text, fontSize: 12, marginBottom: 4 }}><Text style={{ fontWeight: 'bold' }}>{label}:</Text> {arr.join(', ')}</Text>
    );
}

 