// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polygon } from 'react-native-svg';

// STORES
import { useAppSettingsStore } from 'src/stores';

// COMPONENTS
import { Button, BaseModal, SegmentedControl } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// HOOKS
import { useTabBarInset } from 'src/hooks/useTabBarInset';

const DICE = [4, 6, 8, 10, 12, 20, 100];

// Polygon side-count per die. d100 = decagon; d8 = pentagon (number inside distinguishes them).
const SHAPE_SIDES: Record<number, number> = { 4: 3, 6: 4, 8: 5, 10: 6, 12: 7, 20: 8, 100: 10 };

const GREEN = '#22c55e';
const RED = '#dc2626';

// Per-die colour palette (readable on both themes).
const PALETTE = ['#3B6FE0', '#dc2626', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6', '#94a3b8'];

type Mode = 'normal' | 'advantage' | 'disadvantage';

interface DieEntry { id: string; sides: number; mode: Mode; modifier: number; color: string; }
interface DieRoll { entry: DieEntry; a: number; b?: number; hi?: number; lo?: number; kept: number; value: number; }
interface RollResult { rolls: DieRoll[]; total: number; }

const roll1 = (sides: number) => 1 + Math.floor(Math.random() * sides);

// Regular polygon inscribed in radius r (= previous, proportional sizing), then translated so
// its bounding box is centered in the box. Also returns the offset from the box centre to the
// polygon's centroid, so the number can sit at the shape's true visual centre.
function shapeGeometry(n: number, size: number, pad: number, align: 'center' | 'bottom'): { points: string; labelDx: number; labelDy: number } {
    const start = n % 2 === 0 ? -90 + 180 / n : -90;
    const r = size / 2 - pad;
    const raw: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        const a = ((start + (i * 360) / n) * Math.PI) / 180;
        raw.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    const xs = raw.map(p => p[0]);
    const ys = raw.map(p => p[1]);
    const bcx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const bcy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const maxY = Math.max(...ys);
    const half = size / 2;
    // Horizontal: centre by bounding box. Vertical: centre the bbox, or rest it on the bottom.
    const ty = align === 'bottom' ? (size - pad) - maxY : half - bcy;
    const points = raw.map(([x, y]) => `${(x - bcx + half).toFixed(2)},${(y + ty).toFixed(2)}`).join(' ');
    // Number sits at the polygon centroid (origin), which maps to (half - bcx, ty).
    return { points, labelDx: -bcx, labelDy: ty - half };
}

function DieShape({ sides, size, fill, stroke, textColor, labelSize, align = 'center' }: { sides: number; size: number; fill: string; stroke: string; textColor: string; labelSize: number; align?: 'center' | 'bottom' }) {
    const sw = 2;
    const { points, labelDx, labelDy } = shapeGeometry(SHAPE_SIDES[sides], size, sw + 1, align);
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
                <Polygon points={points} fill={fill} stroke={stroke} strokeWidth={sw} />
            </Svg>
            <Text style={{ color: textColor, fontWeight: '800', fontSize: labelSize, transform: [{ translateX: labelDx }, { translateY: labelDy }] }}>{sides}</Text>
        </View>
    );
}

const hit = { top: 6, bottom: 6, left: 6, right: 6 };

export default function DiceRollerScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const accent = currentTheme.primary;

    const [dice, setDice] = React.useState<DieEntry[]>([]);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<RollResult | null>(null);
    const idRef = React.useRef(0);

    const addDie = (sides: number) =>
        setDice(d => [...d, { id: `die-${idRef.current++}`, sides, mode: 'normal', modifier: 0, color: PALETTE[0] }]);
    const updateDie = (id: string, patch: Partial<DieEntry>) =>
        setDice(d => d.map(e => (e.id === id ? { ...e, ...patch } : e)));
    const removeDie = (id: string) => setDice(d => d.filter(e => e.id !== id));
    const clearAll = () => { setDice([]); setEditingId(null); };

    const editing = dice.find(d => d.id === editingId) || null;

    // Dice ordered by type (smaller → higher) for both the list and the roll.
    const sortedDice = React.useMemo(() => [...dice].sort((a, b) => a.sides - b.sides), [dice]);

    const doRoll = React.useCallback(() => {
        if (!sortedDice.length) return;
        const rolls: DieRoll[] = sortedDice.map(entry => {
            const a = roll1(entry.sides);
            if (entry.mode === 'normal') return { entry, a, kept: a, value: a + entry.modifier };
            const b = roll1(entry.sides);
            const hi = Math.max(a, b), lo = Math.min(a, b);
            const kept = entry.mode === 'advantage' ? hi : lo;
            return { entry, a, b, hi, lo, kept, value: kept + entry.modifier };
        });
        setResult({ rolls, total: rolls.reduce((n, r) => n + r.value, 0) });
    }, [sortedDice]);

    // ---------- RESULT VIEW ----------
    if (result) {
        return (
            <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: styleConstants.paddingLG }]}>
                <View style={[styles.totalBanner, { backgroundColor: accent + '18', borderColor: currentTheme.border }]}>
                    <Text style={[styles.totalLabel, { color: currentTheme.noticeText }]}>TOTAL</Text>
                    <Text style={[styles.totalValue, { color: accent }]}>{result.total}</Text>
                </View>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: styleConstants.paddingSM }} showsVerticalScrollIndicator={false}>
                    {result.rolls.map(r => (
                        <View key={r.entry.id} style={[styles.resultRow, { borderColor: currentTheme.border, backgroundColor: currentTheme.card }]}>
                            <DieShape sides={r.entry.sides} size={32} fill={r.entry.color + '22'} stroke={r.entry.color} textColor={r.entry.color} labelSize={12} />
                            <View style={styles.resultMid}>
                                {r.b === undefined ? (
                                    <View style={[styles.rollChip, { backgroundColor: currentTheme.innerBackground, borderColor: currentTheme.border }]}>
                                        <Text style={[styles.rollChipText, { color: currentTheme.text }]}>{r.a}</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.pairChip, { backgroundColor: currentTheme.innerBackground, borderColor: currentTheme.border }]}>
                                        <Text style={[styles.pairNum, { color: GREEN }, r.kept === r.hi ? styles.keptNum : styles.discardNum]}>{r.hi}</Text>
                                        <Text style={[styles.pairSep, { color: currentTheme.noticeText }]}>/</Text>
                                        <Text style={[styles.pairNum, { color: RED }, r.kept === r.lo ? styles.keptNum : styles.discardNum]}>{r.lo}</Text>
                                    </View>
                                )}
                                {r.entry.modifier !== 0 && (
                                    <Text style={[styles.modText, { color: currentTheme.noticeText }]}>{r.entry.modifier > 0 ? `+${r.entry.modifier}` : r.entry.modifier}</Text>
                                )}
                            </View>
                            <Text style={[styles.subtotal, { color: currentTheme.text }]}>{r.value}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={[styles.footer, { paddingBottom: tabInset }]}>
                    <View style={{ flex: 1 }}>
                        <Button title="Return" variant="secondary" icon="arrow-back" onPress={() => setResult(null)} fullWidth />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title="Reroll" icon="refresh" onPress={doRoll} fullWidth />
                    </View>
                </View>
            </View>
        );
    }

    // ---------- CONFIG VIEW ----------
    return (
        <View style={[commonStyles.container, { flex: 1, backgroundColor: currentTheme.background, padding: styleConstants.paddingLG }]}>
            {/* Fixed: dice picker (one line) */}
            <Text style={[styles.sectionLabel, { color: currentTheme.noticeText }]}>Tap a die to add it</Text>
            <View style={styles.iconRow}>
                {DICE.map(sides => (
                    <TouchableOpacity key={sides} activeOpacity={0.8} onPress={() => addDie(sides)}>
                        <DieShape sides={sides} size={42} fill={currentTheme.card} stroke={currentTheme.border} textColor={currentTheme.text} labelSize={styleConstants.fontSizeMD} align="bottom" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Scrollable: added dice as square tiles, on a felt-style "mat" */}
            <View style={[styles.mat, { backgroundColor: currentTheme.innerBackground, borderColor: currentTheme.border }]}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.tileGrid} showsVerticalScrollIndicator={false}>
                {dice.length === 0 ? (
                    <Text style={[styles.empty, { color: currentTheme.noticeText }]}>No dice yet — tap a die above to add it.</Text>
                ) : (
                    sortedDice.map(entry => (
                        <TouchableOpacity
                            key={entry.id}
                            activeOpacity={0.8}
                            onPress={() => setEditingId(entry.id)}
                            style={styles.cell}
                        >
                            <View style={[styles.tile, styleConstants.shadowSM]}>
                                <DieShape sides={entry.sides} size={64} fill={'#fff'} stroke={entry.color} textColor={entry.color} labelSize={styleConstants.fontSizeLG} align="bottom" />
                                {entry.mode !== 'normal' && (
                                    <View style={[styles.badgeLeft, { backgroundColor: entry.mode === 'advantage' ? GREEN : RED }]}>
                                        <Ionicons name={entry.mode === 'advantage' ? 'arrow-up' : 'arrow-down'} size={11} color="#fff" />
                                    </View>
                                )}
                                {entry.modifier !== 0 && (
                                    <View style={[styles.badgeRight, { backgroundColor: currentTheme.innerBackground, borderColor: currentTheme.border }]}>
                                        <Text style={[styles.badgeRightText, { color: currentTheme.text }]}>{entry.modifier > 0 ? `+${entry.modifier}` : entry.modifier}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
            </View>

            {/* Fixed: actions */}
            <View style={[styles.footer, { paddingBottom: tabInset }]}>
                <Button title="Clear" variant="secondary" onPress={clearAll} disabled={dice.length === 0} />
                <View style={{ flex: 1 }}>
                    <Button title={dice.length > 0 ? `Roll ${dice.length}` : 'Roll'} icon="dice" onPress={doRoll} disabled={dice.length === 0} fullWidth />
                </View>
            </View>

            {/* Per-die config modal */}
            {editing && (
                <BaseModal
                    visible={!!editing}
                    onClose={() => setEditingId(null)}
                    theme={currentTheme}
                    title={`d${editing.sides}`}
                    footerContent={
                        <View style={[commonStyles.w_100, commonStyles.row_center_center, commonStyles.gap_sm]}>
                            <View style={{ flex: 1 }}>
                                <Button title="Remove" variant="danger" icon="trash-outline" onPress={() => { removeDie(editing.id); setEditingId(null); }} fullWidth />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Button title="Done" variant="primary" onPress={() => setEditingId(null)} fullWidth />
                            </View>
                        </View>
                    }
                >
                    <Text style={[styles.optLabel, { color: currentTheme.noticeText, marginTop: styleConstants.marginSM }]}>Roll type</Text>
                    <View style={{ marginBottom: styleConstants.marginXL }}>
                        <SegmentedControl
                            options={[
                                { key: 'normal', label: 'Regular' },
                                { key: 'advantage', label: 'Advantage' },
                                { key: 'disadvantage', label: 'Disadvantage' },
                            ]}
                            value={editing.mode}
                            onChange={k => updateDie(editing.id, { mode: k as Mode })}
                        />
                    </View>

                    <Text style={[styles.optLabel, { color: currentTheme.noticeText }]}>Modifier</Text>
                    <View style={[styles.optRow, { marginBottom: styleConstants.marginXL, justifyContent: 'center' }]}>
                        <TouchableOpacity onPress={() => updateDie(editing.id, { modifier: editing.modifier - 1 })} hitSlop={hit} style={[styles.stepBtn, { borderColor: currentTheme.border }]}>
                            <Ionicons name="remove" size={18} color={currentTheme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.modValue, { color: currentTheme.text }]}>{editing.modifier >= 0 ? `+${editing.modifier}` : editing.modifier}</Text>
                        <TouchableOpacity onPress={() => updateDie(editing.id, { modifier: editing.modifier + 1 })} hitSlop={hit} style={[styles.stepBtn, { borderColor: accent, backgroundColor: accent }]}>
                            <Ionicons name="add" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.optLabel, { color: currentTheme.noticeText }]}>Color</Text>
                    <View style={[styles.swatchRow, { marginBottom: styleConstants.marginLG }]}>
                        {PALETTE.map(c => (
                            <TouchableOpacity
                                key={c}
                                onPress={() => updateDie(editing.id, { color: c })}
                                style={[styles.swatch, { backgroundColor: c }, editing.color === c && { borderWidth: 3, borderColor: currentTheme.text }]}
                            />
                        ))}
                    </View>
                </BaseModal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionLabel: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: styleConstants.marginSM,
        marginLeft: styleConstants.marginXS,
    },
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    empty: { width: '100%', textAlign: 'center', fontStyle: 'italic', marginTop: styleConstants.marginXL },

    mat: {
        flex: 1,
        marginTop: styleConstants.marginMD,
        borderRadius: styleConstants.borderRadius2XL,
        borderWidth: styleConstants.borderXS,
        paddingHorizontal: styleConstants.paddingMD,
        overflow: 'hidden',
    },
    tileGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingVertical: styleConstants.paddingXS,
    },
    cell: {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: styleConstants.paddingSM,
    },
    tile: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeLeft: {
        position: 'absolute',
        top: styleConstants.paddingXS,
        left: styleConstants.paddingXS,
        width: 18, height: 18,
        borderRadius: styleConstants.borderRadiusCircle,
        alignItems: 'center', justifyContent: 'center',
    },
    badgeRight: {
        position: 'absolute',
        top: styleConstants.paddingXS,
        right: styleConstants.paddingXS,
        minWidth: 18, height: 18,
        paddingHorizontal: 4,
        borderRadius: styleConstants.borderRadiusSM,
        borderWidth: styleConstants.borderXS,
        alignItems: 'center', justifyContent: 'center',
    },
    badgeRightText: { fontSize: styleConstants.fontSizeXS, fontWeight: '800' },

    footer: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM, paddingTop: styleConstants.paddingSM },

    // modal options
    optLabel: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: styleConstants.marginSM,
    },
    optRow: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM },
    stepBtn: {
        width: 40, height: 40,
        borderRadius: styleConstants.borderRadiusCircle,
        borderWidth: styleConstants.borderXS,
        alignItems: 'center', justifyContent: 'center',
    },
    modValue: { fontSize: styleConstants.fontSizeXL, fontWeight: '800', minWidth: 56, textAlign: 'center' },
    swatchRow: { flexDirection: 'row', justifyContent: 'space-between' },
    swatch: { width: 30, height: 30, borderRadius: styleConstants.borderRadiusCircle },

    // results
    totalBanner: {
        alignItems: 'center',
        paddingVertical: styleConstants.paddingLG,
        borderRadius: styleConstants.borderRadius2XL,
        borderWidth: styleConstants.borderXS,
    },
    totalLabel: { fontSize: styleConstants.fontSizeSM, fontWeight: '700', letterSpacing: 2 },
    totalValue: { fontSize: 48, fontWeight: '800', lineHeight: 54 },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: styleConstants.gapSM,
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingLG,
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusLG,
        marginBottom: styleConstants.marginSM,
    },
    resultMid: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM, flexWrap: 'wrap' },
    rollChip: {
        minWidth: 30,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.padding2XS,
        borderRadius: styleConstants.borderRadiusMD,
        borderWidth: styleConstants.borderXS,
        alignItems: 'center',
    },
    rollChipText: { fontSize: styleConstants.fontSizeMD, fontWeight: '700' },
    pairChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.padding2XS,
        borderRadius: styleConstants.borderRadiusMD,
        borderWidth: styleConstants.borderXS,
    },
    pairNum: { fontSize: styleConstants.fontSizeMD },
    keptNum: { fontWeight: '800' },
    discardNum: { fontWeight: '500', opacity: 0.5, textDecorationLine: 'line-through' },
    pairSep: { fontSize: styleConstants.fontSizeMD },
    modText: { fontSize: styleConstants.fontSizeSM, fontWeight: '700' },
    subtotal: { fontSize: styleConstants.fontSizeXL, fontWeight: '800', minWidth: 34, textAlign: 'right' },
});
