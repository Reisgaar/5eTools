// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { Button } from 'src/components/ui';
import SpellPickerModal from 'src/components/characters/SpellPickerModal';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// DATA / CONTEXT / UTILS
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';
import { formatMod } from 'src/utils/characterUtils';
import { getFullSchool, formatLevel } from 'src/utils/spellUtils';
import { getSpellcasting } from 'src/utils/spellcasting';

// TYPES
import { Character, CharacterSpell } from 'src/models/interfaces/utils';

const norm = (s?: string) => (s || '').trim().toLowerCase();

interface SpellsTabProps {
    character: Character;
    theme: any;
    onUpdate: (patch: Partial<Character>) => void;
}

export default function SpellsTab({ character, theme, onUpdate }: SpellsTabProps) {
    const { simpleSpells, getClassFile } = useData();
    const { openSpellModal } = useModal();
    const [pickerVisible, setPickerVisible] = React.useState(false);

    const sc = React.useMemo(() => getSpellcasting(character, getClassFile), [character, getClassFile]);
    const spells = character.spells || [];

    const setSpells = (next: CharacterSpell[]) => onUpdate({ spells: next });
    const addSpell = (s: any) => {
        if (spells.some(x => norm(x.name) === norm(s.name) && norm(x.source) === norm(s.source))) return;
        const cs: CharacterSpell = {
            name: s.name, source: s.source, level: s.level ?? 0, school: s.school || '',
            ritual: !!s.ritual, concentration: !!s.concentration, availableClasses: s.availableClasses || [], prepared: false,
        };
        setSpells([...spells, cs]);
    };
    const togglePrepared = (i: number) => setSpells(spells.map((sp, idx) => idx === i ? { ...sp, prepared: !sp.prepared } : sp));
    const removeSpell = (i: number) => setSpells(spells.filter((_, idx) => idx !== i));

    // Group by spell level, keeping the original index for edits.
    const withIndex = spells.map((sp, i) => ({ sp, i }));
    const levels = Array.from(new Set(spells.map(s => s.level))).sort((a, b) => a - b);
    const preparedCount = spells.filter(s => s.level > 0 && s.prepared).length;

    const slotParts = sc.slots
        .map((n, idx) => ({ n, lvl: idx + 1 }))
        .filter(x => x.n > 0)
        .map(x => `${formatLevel(x.lvl)}: ${x.n}`);

    return (
        <View>
            {/* Spellcasting summary */}
            {sc.isCaster ? (
                <>
                    <View style={styles.scRow}>
                        <View style={[styles.scTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Text style={[styles.scValue, { color: theme.text }]}>{sc.ability?.toUpperCase()}</Text>
                            <Text style={[styles.scLabel, { color: theme.noticeText }]}>Ability</Text>
                        </View>
                        <View style={[styles.scTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Text style={[styles.scValue, { color: theme.text }]}>{sc.saveDc}</Text>
                            <Text style={[styles.scLabel, { color: theme.noticeText }]}>Save DC</Text>
                        </View>
                        <View style={[styles.scTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Text style={[styles.scValue, { color: theme.text }]}>{formatMod(sc.attack || 0)}</Text>
                            <Text style={[styles.scLabel, { color: theme.noticeText }]}>Spell Atk</Text>
                        </View>
                    </View>
                    {slotParts.length > 0 && (
                        <Text style={[styles.slots, { color: theme.text }]}>Slots — {slotParts.join(' · ')}</Text>
                    )}
                    {sc.pact && (
                        <Text style={[styles.slots, { color: theme.text }]}>Pact Magic — {sc.pact.count} slot{sc.pact.count === 1 ? '' : 's'} at {formatLevel(sc.pact.level)} level</Text>
                    )}
                    {sc.note && <Text style={[styles.note, { color: theme.noticeText }]}>{sc.note}</Text>}
                </>
            ) : (
                <Text style={[styles.note, { color: theme.noticeText }]}>No spellcasting from this character&apos;s class. You can still add spells below (e.g. from a race or feat).</Text>
            )}

            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={[styles.header, { color: theme.text }]}>
                    Spells ({spells.length}){preparedCount > 0 ? <Text style={{ color: theme.noticeText }}>  ·  {preparedCount} prepared</Text> : null}
                </Text>
                <Button title="Add" icon="add" size="sm" onPress={() => setPickerVisible(true)} />
            </View>

            {spells.length === 0 ? (
                <Text style={{ color: theme.noticeText, textAlign: 'center', paddingVertical: styleConstants.paddingLG }}>
                    No spells yet. Tap “Add” to add spells from the compendium.
                </Text>
            ) : (
                levels.map(lvl => (
                    <View key={lvl}>
                        <Text style={[styles.levelHeader, { color: theme.noticeText, borderBottomColor: theme.border }]}>{formatLevel(lvl)}</Text>
                        {withIndex.filter(x => x.sp.level === lvl).map(({ sp, i }) => (
                            <View key={`${sp.name}|${sp.source}`} style={[styles.spellRow, { borderBottomColor: theme.border }]}>
                                {lvl > 0 ? (
                                    <TouchableOpacity onPress={() => togglePrepared(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                        <Ionicons name={sp.prepared ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={sp.prepared ? theme.primary : theme.noticeText} />
                                    </TouchableOpacity>
                                ) : (
                                    <Ionicons name="sparkles" size={18} color={theme.noticeText} />
                                )}
                                <TouchableOpacity style={{ flex: 1, marginLeft: styleConstants.marginSM }} onPress={() => openSpellModal({ name: sp.name, source: sp.source })}>
                                    <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeMD }}>{sp.name}</Text>
                                    <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>
                                        {[getFullSchool(sp.school), sp.concentration ? 'Concentration' : null, sp.ritual ? 'Ritual' : null].filter(Boolean).join(' · ')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeSpell(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ padding: styleConstants.paddingXS }}>
                                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ))
            )}

            <SpellPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} theme={theme} spells={simpleSpells} onSelect={addSpell} />
        </View>
    );
}

const styles = StyleSheet.create({
    scRow: { flexDirection: 'row', gap: styleConstants.gapSM },
    scTile: { flex: 1, alignItems: 'center', paddingVertical: styleConstants.paddingMD, borderRadius: styleConstants.borderRadiusLG, borderWidth: styleConstants.borderXS },
    scValue: { fontSize: styleConstants.fontSizeXL, fontWeight: '800' },
    scLabel: { fontSize: styleConstants.fontSizeXS, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: styleConstants.margin2XS },
    slots: { marginTop: styleConstants.marginSM, fontSize: styleConstants.fontSizeSM, fontWeight: '600' },
    note: { marginTop: styleConstants.marginSM, fontSize: styleConstants.fontSizeSM, fontStyle: 'italic' },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: styleConstants.marginLG, marginBottom: styleConstants.marginSM },
    header: { fontSize: styleConstants.fontSizeSM, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    levelHeader: { fontSize: styleConstants.fontSizeSM, fontWeight: '700', marginTop: styleConstants.marginMD, marginBottom: styleConstants.marginXS, paddingBottom: styleConstants.paddingXS, borderBottomWidth: styleConstants.borderXS },
    spellRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: styleConstants.paddingSM, borderBottomWidth: styleConstants.borderXS },
});
