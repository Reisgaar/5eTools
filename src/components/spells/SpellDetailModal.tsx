import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useModal } from '../../context/ModalContext';
import { useData } from '../../context/DataContext';
import { parseDiceExpression, renderEntries, rollDice } from '../../utils/replaceTags';
import { Separator } from '../ui';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SCHOOL_MAP: Record<string, string> = {
    A: 'Abjuration',
    C: 'Conjuration',
    D: 'Divination',
    E: 'Enchantment',
    V: 'Evocation',
    I: 'Illusion',
    N: 'Necromancy',
    T: 'Transmutation',
};

function getFullSchool(school: string) {
    if (!school) return '';
    const key = school.charAt(0).toUpperCase();
    return SCHOOL_MAP[key] || school;
}

function formatComponents(components: any) {
    if (!components) return '';
    if (Array.isArray(components)) return components.join(', ');
    if (typeof components === 'object') {
        let arr = [];
        if (components.v) arr.push('V');
        if (components.s) arr.push('S');
        if (components.m) arr.push(`M (${components.m.text})`);
        return arr.join(', ');
    }
    return String(components);
}

function formatRange(range: any): string {
    if (!range) return '';
    if (typeof range === 'string') return range;
    if (typeof range === 'object') {
        if (range.distance) {
            if (typeof range.distance === 'object') {
                if (range.distance.amount && range.distance.type) {
                    return `${range.distance.amount} ${range.distance.type}`;
                }
                if (range.distance.type) {
                    return range.distance.type;
                }
            } else {
                return String(range.distance);
            }
        }
        if (range.type) return range.type;
        return JSON.stringify(range);
    }
    return String(range);
}

function formatTime(time: any): string {
    if (!time) return '';
    if (typeof time === 'string') return time;
    if (Array.isArray(time)) {
        return time.map(t => {
            if (typeof t === 'string') return t;
            let s = '';
            if (t.number && t.unit) s += `${t.number} ${t.unit}`;
            if (t.condition) s += ` (${t.condition})`;
            return s.trim();
        }).join(', ');
    }
    if (typeof time === 'object') {
        let s = '';
        if (time.number && time.unit) s += `${time.number} ${time.unit}`;
        if (time.condition) s += ` (${time.condition})`;
        return s.trim();
    }
    return String(time);
}

function formatDuration(duration: any): string {
    if (!duration) return '';
    if (typeof duration === 'string') return duration;
    if (Array.isArray(duration)) {
        return duration.map(d => {
            if (typeof d === 'string') return d;
            if (d.type && d.duration) {
                if (typeof d.duration === 'object' && d.duration.amount && d.duration.type) {
                    return `${d.duration.amount} ${d.duration.type} (${d.type})`;
                }
                return `${d.duration} (${d.type})`;
            }
            if (d.type) return d.type;
            return JSON.stringify(d);
        }).join(', ');
    }
    if (typeof duration === 'object') {
        if (duration.type && duration.duration) {
            if (typeof duration.duration === 'object' && duration.duration.amount && duration.duration.type) {
                return `${duration.duration.amount} ${duration.duration.type} (${duration.type})`;
            }
            return `${duration.duration} (${duration.type})`;
        }
        if (duration.type) return duration.type;
        return JSON.stringify(duration);
    }
    return String(duration);
}

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
    const { openDiceModal, openBeastModal, openSpellModal } = useModal();
    const { simpleBeasts, simpleSpells } = useData();

    const handleCreaturePressLocal = (name: string, source: string) => {
      const beast = simpleBeasts.find((b: any) => b.name.trim().toLowerCase() === name.trim().toLowerCase() && b.source.trim().toLowerCase() === source.trim().toLowerCase());
      if (beast) {
        openBeastModal(beast, true);
      }
    };
    const handleSpellPressLocal = (name: string, source: string) => {
      const spell = simpleSpells.find((s: any) => s.name.trim().toLowerCase() === name.trim().toLowerCase() && s.source.trim().toLowerCase() === source.trim().toLowerCase());
      if (spell) {
        openSpellModal(spell, true);
      }
    };

    function handleDamagePress(expr: string) {
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
    function handleHitPress(bonus: string) {
        const bonusNum = parseInt(bonus, 10) || 0;
        const roll = Math.floor(Math.random() * 20) + 1;
        openDiceModal({
          expression: `1d20 + ${bonusNum}`,
          result: roll + bonusNum,
          breakdown: [roll],
          modifier: bonusNum !== 0 ? bonusNum : undefined,
          type: 'hit',
        });
    }

    if (!visible) return null;
    if (!spell) return (
        <View style={styles.overlay} pointerEvents="auto">
            <View style={[styles.modalContentWrapper]}>
                <View style={[styles.modalContent, { backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </View>
        </View>
    );
    console.log(JSON.stringify(spell));
    return (
        <View style={styles.overlay} pointerEvents="auto">
            <View style={styles.modalContentWrapper}>
                <View style={[styles.modalContent, { backgroundColor: theme.card, maxHeight: SCREEN_HEIGHT * 0.8 }]}>
                    {/* X Close Button */}
                    <TouchableOpacity onPress={onClose} style={[styles.closeIconBtn, { backgroundColor: 'transparent' }]}>
                        <Ionicons name="close" size={28} color={theme.text} />
                    </TouchableOpacity>
                    {/* Header */}
                    <Text style={[styles.modalTitle, { color: theme.text }]}>{spell.name}</Text>
                    <Text style={[styles.modalSubtitle, { color: theme.text }]}>Level {spell.level === 0 ? 'Cantrip' : spell.level} {getFullSchool(spell.school)}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', borderWidth: 1, borderColor: theme.text, borderRadius: 8, marginBottom: 10 }}>
                        <View style={{ width: '50%', borderWidth: 1, borderLeftColor: 'transparent', borderTopColor: 'transparent', borderRightColor: theme.text, borderBottomColor: theme.text }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: theme.text, fontSize: 12 }}>CastingTime:</Text>
                            <Text style={[styles.modalField, { color: theme.text, textAlign: 'center' }]}>{formatTime(spell.time)}</Text>
                        </View>
                        <View style={{ width: '50%', borderWidth: 1, borderLeftColor: 'transparent', borderTopColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: theme.text }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: theme.text, fontSize: 12 }}>Range:</Text>
                            <Text style={[styles.modalField, { color: theme.text, textAlign: 'center' }]}>{formatRange(spell.range)}</Text>
                        </View>
                        <View style={{ width: '50%', borderWidth: 1, borderLeftColor: 'transparent', borderTopColor: 'transparent', borderRightColor: theme.text, borderBottomColor: 'transparent' }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: theme.text, fontSize: 12 }}>Components:</Text>
                            <Text style={[styles.modalField, { color: theme.text, textAlign: 'center' }]}>{formatComponents(spell.components)}</Text>
                        </View>
                        <View style={{ width: '50%', borderWidth: 1, borderColor: 'transparent' }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: theme.text, fontSize: 12 }}>Duration:</Text>
                            <Text style={[styles.modalField, { color: theme.text, textAlign: 'center' }]}>{formatDuration(spell.duration)}</Text>
                        </View>
                    </View>

                    <ScrollView style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.text, borderRadius: 8, marginTop: 5 }}>
                        <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
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
                                    {renderList('Classes', spell.classes?.fromClassList?.map((c: any) => c.name), theme)}
                                </>
                            )}
                            {spell.subclasses && (
                                <>
                                    <Separator title='Subclasses' size='small' />
                                    {renderList('Subclasses', spell.subclasses?.map((s: any) => s.name), theme)}
                                </>
                            )}
                            {spell.races && (
                                <>
                                    <Separator title='Species' size='small' />
                                    {renderList('Species', spell.races?.map((r: any) => r.name), theme)}
                                </>
                            )}
                            {spell.backgrounds && (
                                <>
                                    <Separator title='Backgrounds' size='small' />
                                    {renderList('Backgrounds', spell.backgrounds?.map((b: any) => b.name), theme)}
                                </>
                            )}
                            {spell.feats && (
                                <>
                                    <Separator title='Feats' size='small' />
                                    {renderList('Feats', spell.feats?.map((f: any) => f.name), theme)}
                                </>
                            )}

                            {/* SRD and Source Info */}
                            {spell.source && (
                                <>
                                    <Text style={[styles.modalField, { marginTop: 25, textAlign: 'right', fontSize: 10, fontStyle: 'italic', color: theme.noticeText }]}>Source: {spell.source}{spell.page ? `, page ${spell.page}` : ''}{spell.srd ? '. Available in the SRD and Basic Rules.' : ''}</Text>
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
                <Text style={[styles.modalEntry, { fontWeight: 'bold', color: theme.text }]}>Using a Higher-Level Spell Slot.</Text>
                {renderEntries(e.entries, 10, theme, onCreaturePress, onSpellPress)}
            </View>
        ));
    }
    return null;
}

function renderList(label: string, arr: any, theme: any) {
    if (!arr || !arr.length) return null;
    return (
        <Text style={[styles.modalField, { color: theme.text }]}><Text style={{ fontWeight: 'bold' }}>{label}:</Text> {arr.join(', ')}</Text>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentWrapper: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: 16,
        overflow: 'hidden',
    },
    modalContent: {
        borderRadius: 16,
        padding: 20,
        alignItems: 'stretch',
        elevation: 6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 0,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    modalField: {
        fontSize: 12,
        marginBottom: 4,
    },
    modalEntry: {
        color: '#eee',
        fontSize: 12,
        marginBottom: 6,
    },
    closeBtn: {
        marginTop: 18,
        backgroundColor: '#4a90e2',
        borderRadius: 8,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    closeIconBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 4,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
}); 