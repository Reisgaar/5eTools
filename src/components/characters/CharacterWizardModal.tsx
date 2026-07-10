// REACT
import React from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { BaseModal, Button, ImagePicker, SegmentedControl, SelectField } from 'src/components/ui';
import { SelectOption } from 'src/components/ui/SelectField';
import CampaignSelector from 'src/components/ui/CampaignSelector';
import NameGeneratorModal from 'src/components/characters/NameGeneratorModal';
import AlignmentSelector from 'src/components/characters/AlignmentSelector';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// DATA / UTILS
import { useData } from 'src/context/DataContext';
import { raceHasNames, Gender } from 'src/utils/nameGenerator';
import {
    ABILITIES, ABILITY_LABELS, AbilityKey, SKILLS, SkillDef,
    abilityMod, autoArmorClass, autoInitiative, autoMaxHp, autoPassivePerception,
    formatMod, proficiencyBonus, skillBonus,
} from 'src/utils/characterUtils';
import { classSaves, extraHpPerLevel, findEntryByName, parseAbilityAsi, parseSkillProfs, subclassOptions } from 'src/utils/characterBuilder';

// TYPES
import { AbilityScores, Character, CharacterClass } from 'src/models/interfaces/utils';

interface CharacterWizardModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (character: Character) => void | Promise<void>;
    character?: Character | null;
    campaigns: { id: string; name: string }[];
    theme: any;
}

type AbilityMethod = 'pointbuy' | 'roll' | 'manual';

const STEP_TITLES = ['Race & Class', 'Name & Gender', 'Background & Alignment', 'Ability Scores', 'Proficiencies', 'Vitals', 'Campaign'];
const GENDER_OPTIONS: SelectOption[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Non-binary', value: 'Non-binary' },
];
const GENDER_FOR_GEN: Record<string, Gender> = { Male: 'male', Female: 'female', 'Non-binary': 'nonbinary' };
const POINT_BUY_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const POINT_BUY_BUDGET = 27;
const norm = (s: string) => (s || '').trim().toLowerCase();
const variantOf = (combined: string) => { const m = /\(([^)]+)\)/.exec(combined || ''); return m ? m[1] : combined; };
const isBasic = (source?: string) => ['phb', 'xphb'].includes((source || '').toLowerCase());
const roll4d6dropLowest = () => {
    const d = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6)).sort((a, b) => a - b);
    return d[1] + d[2] + d[3];
};

function toOptions(list: any[]): SelectOption[] {
    const byName = new Map<string, any>();
    for (const e of list || []) {
        if (!e?.name) continue;
        const key = e.name.toLowerCase();
        const existing = byName.get(key);
        if (!existing || (e.source || '').toLowerCase() === 'xphb') byName.set(key, e);
    }
    return Array.from(byName.values())
        .map(e => ({ label: e.name, value: e.name, sub: e.source }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

interface Draft {
    name: string;
    race: string;
    subrace: string;
    classes: CharacterClass[];
    gender: string;
    background: string;
    alignment: string;
    abilities: AbilityScores;
    skillProficiencies: string[];
    skillExpertise: string[];
    savingThrowProficiencies: string[];
    hpMode: 'auto' | 'manual';
    maxHp: string;
    ac: string;
    passivePerception: string;
    initiativeBonus: string;
    speed: string;
    tokenUrl: string;
    campaignId: string;
    notes: string;
    currentHp?: number;
    tempHp?: number;
}

function draftFromCharacter(c?: Character | null): Draft {
    const a = c?.abilities;
    const isNew = !c;
    const base = isNew ? 8 : 10;
    // Split a legacy combined race name ("Dwarf (Hill)") into base + subrace.
    const rawRace = c?.race || '';
    const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(rawRace);
    const race = m ? m[1].trim() : rawRace;
    const subrace = c?.subrace || (m ? m[2].trim() : '');
    return {
        name: c?.name || '',
        race,
        subrace,
        classes: c?.classes?.length ? c.classes.map(x => ({ ...x })) : [{ name: c?.class || '', level: c?.level || 1 }],
        gender: c?.gender || '',
        background: c?.background || '',
        alignment: c?.alignment || 'Neutral',
        abilities: { str: a?.str ?? base, dex: a?.dex ?? base, con: a?.con ?? base, int: a?.int ?? base, wis: a?.wis ?? base, cha: a?.cha ?? base },
        skillProficiencies: [...(c?.skillProficiencies || [])],
        skillExpertise: [...(c?.skillExpertise || [])],
        savingThrowProficiencies: [...(c?.savingThrowProficiencies || [])],
        hpMode: c?.maxHp ? 'manual' : 'auto',
        maxHp: c?.maxHp ? String(c.maxHp) : '',
        ac: c?.ac ? String(c.ac) : '',
        passivePerception: c?.passivePerception != null ? String(c.passivePerception) : '',
        initiativeBonus: c?.initiativeBonus != null ? String(c.initiativeBonus) : '',
        speed: c?.speed != null ? String(c.speed) : '',
        tokenUrl: c?.tokenUrl || '',
        campaignId: c?.campaignId || '',
        notes: c?.notes || '',
        currentHp: c?.currentHp,
        tempHp: c?.tempHp,
    };
}

// --- small building blocks -------------------------------------------------

function Label({ theme, children }: { theme: any; children: React.ReactNode }) {
    return <Text style={[styles.label, { color: theme.text }]}>{children}</Text>;
}

function NumberStepper({ value, onChange, min = 1, max = 20, theme }: { value: number; onChange: (v: number) => void; min?: number; max?: number; theme: any }) {
    return (
        <View style={styles.stepper}>
            <TouchableOpacity onPress={() => onChange(Math.max(min, value - 1))} style={[styles.stepBtn, { borderColor: theme.border }]}>
                <Ionicons name="remove" size={16} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.stepValue, { color: theme.text }]}>{value}</Text>
            <TouchableOpacity onPress={() => onChange(Math.min(max, value + 1))} style={[styles.stepBtn, { borderColor: theme.primary, backgroundColor: theme.primary }]}>
                <Ionicons name="add" size={16} color={theme.buttonText || '#fff'} />
            </TouchableOpacity>
        </View>
    );
}

// Compact +/- stepper sized to fit inside a 3-per-row ability tile.
function TileStepper({ value, onChange, theme }: { value: number; onChange: (v: number) => void; theme: any }) {
    return (
        <View style={styles.tileStepper}>
            <TouchableOpacity onPress={() => onChange(value - 1)} style={[styles.tileStepBtn, { borderColor: theme.border }]}>
                <Ionicons name="remove" size={14} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.tileStepVal, { color: theme.text }]}>{value}</Text>
            <TouchableOpacity onPress={() => onChange(value + 1)} style={[styles.tileStepBtn, { borderColor: theme.primary, backgroundColor: theme.primary }]}>
                <Ionicons name="add" size={14} color={theme.buttonText || '#fff'} />
            </TouchableOpacity>
        </View>
    );
}

function numInput(theme: any, value: string, onChangeText: (t: string) => void, extraStyle?: any) {
    return (
        <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }, extraStyle]}
            keyboardType="numeric"
            value={value}
            onChangeText={onChangeText}
        />
    );
}

// One skill row: proficiency dot/toggle, name, live total, and an expertise toggle.
function SkillRow({ theme, skill, proficient, locked, expertise, value, onToggleProf, onToggleExp, disabledAdd }:
    { theme: any; skill: SkillDef; proficient: boolean; locked: boolean; expertise: boolean; value: number; onToggleProf: () => void; onToggleExp: () => void; disabledAdd: boolean }) {
    return (
        <View style={[styles.skillRow, { borderBottomColor: theme.border }]}>
            <TouchableOpacity
                onPress={locked ? undefined : onToggleProf}
                disabled={locked || (!proficient && disabledAdd)}
                style={[styles.pe, { borderColor: theme.border, backgroundColor: proficient ? theme.primary : 'transparent', opacity: (!proficient && disabledAdd) ? 0.4 : 1 }]}
            >
                <Text style={{ color: proficient ? theme.buttonText : theme.noticeText, fontWeight: '700', fontSize: styleConstants.fontSizeSM }}>P</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={proficient ? onToggleExp : undefined}
                disabled={!proficient}
                style={[styles.pe, { borderColor: theme.border, backgroundColor: expertise ? theme.primary : 'transparent', opacity: proficient ? 1 : 0.35 }]}
            >
                <Text style={{ color: expertise ? theme.buttonText : theme.noticeText, fontWeight: '700', fontSize: styleConstants.fontSizeSM }}>E</Text>
            </TouchableOpacity>
            <Text style={{ flex: 1, color: theme.text, fontSize: styleConstants.fontSizeMD, marginLeft: styleConstants.marginSM }}>
                {skill.label} <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeXS }}>{skill.ability.toUpperCase()}</Text>
                {locked ? <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeXS }}>  · granted</Text> : null}
            </Text>
            <Text style={{ color: theme.text, fontWeight: '700', minWidth: 34, textAlign: 'right' }}>{formatMod(value)}</Text>
        </View>
    );
}

function VitalRow({ theme, label, value, auto, hint, onChange, onAuto, signed }: { theme: any; label: string; value: string; auto: number; hint: string; onChange: (t: string) => void; onAuto: () => void; signed?: boolean }) {
    const shown = value !== '' ? value : (signed ? formatMod(auto) : String(auto));
    return (
        <View style={styles.vital}>
            <View style={styles.vitalTop}>
                <Text style={{ flex: 1, color: theme.text, fontSize: styleConstants.fontSizeMD }}>{label}</Text>
                <TextInput
                    style={[styles.input, { width: 72, textAlign: 'center', marginBottom: 0, backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                    keyboardType="numeric"
                    value={shown}
                    onChangeText={onChange}
                />
                <TouchableOpacity onPress={onAuto} style={[styles.autoBtn, { borderColor: theme.border }]} accessibilityLabel={`Reset ${label} to auto`}>
                    <Ionicons name="refresh" size={16} color={theme.noticeText} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.calcHint, { color: theme.noticeText }]}>{hint}</Text>
        </View>
    );
}

export default function CharacterWizardModal({ visible, onClose, onSave, character, campaigns, theme }: CharacterWizardModalProps) {
    const commonStyles = getCommonStyles(theme);
    const { races, classes, backgrounds, getClassFile } = useData();

    const baseRaceOptions = React.useMemo(() => toOptions((races || []).filter((r: any) => !r.__isSubrace)), [races]);
    const classOptions = React.useMemo(() => toOptions(classes), [classes]);
    const backgroundOptions = React.useMemo(() => toOptions(backgrounds), [backgrounds]);
    const hdByClass = React.useCallback((name: string) => {
        const c = (classes || []).find((x: any) => norm(x.name) === norm(name));
        return c?.hd?.faces ?? 8;
    }, [classes]);

    const [step, setStep] = React.useState(0);
    const [draft, setDraft] = React.useState<Draft>(() => draftFromCharacter(character));
    const [selectedImageUri, setSelectedImageUri] = React.useState<string | null>(null);
    const [nameGenVisible, setNameGenVisible] = React.useState(false);
    const [phbRace, setPhbRace] = React.useState(true);
    const [phbBg, setPhbBg] = React.useState(true);

    const [abilityMethod, setAbilityMethod] = React.useState<AbilityMethod>('pointbuy');
    const [pool, setPool] = React.useState<number[]>([]);
    const emptyAssign = { str: null, dex: null, con: null, int: null, wis: null, cha: null } as Record<AbilityKey, number | null>;
    const [assign, setAssign] = React.useState<Record<AbilityKey, number | null>>(emptyAssign);
    // Allocation of "choose" ASI slots: groupId → array (one entry per slot) of the chosen ability.
    const [asiAlloc, setAsiAlloc] = React.useState<Record<string, (AbilityKey | null)[]>>({});
    const [rollPickerFor, setRollPickerFor] = React.useState<AbilityKey | null>(null);

    React.useEffect(() => {
        if (!visible) return;
        setStep(0);
        setDraft(draftFromCharacter(character));
        setSelectedImageUri(null);
        setAbilityMethod(character?.abilities ? 'manual' : 'pointbuy');
        setPool([]);
        setAssign(emptyAssign);
        setAsiAlloc({});
        setRollPickerFor(null);
        setPhbRace(true);
        setPhbBg(true);
    }, [visible, character]); // eslint-disable-line react-hooks/exhaustive-deps

    const update = (patch: Partial<Draft>) => setDraft(d => ({ ...d, ...patch }));
    const totalLevel = draft.classes.reduce((s, c) => s + (c.level || 0), 0) || 1;

    // Selected compendium entries (for grants + auto values).
    const primaryClassSummary = findEntryByName(classes, draft.classes[0]?.name);
    const bgEntry = findEntryByName(backgrounds, draft.background);
    const raceEntry = findEntryByName((races || []).filter((r: any) => !r.__isSubrace), draft.race);
    const subraceEntry = (races || []).find((r: any) => r.__isSubrace && r.raceName === draft.race && variantOf(r.name) === draft.subrace) || null;
    // Informational only — which skills each source grants (the user still selects freely).
    const labelOf = (k: string) => SKILLS.find(s => s.key === k)?.label || k;
    const skillInfoLines: string[] = [];
    {
        const cg = parseSkillProfs(primaryClassSummary?.startingProficiencies?.skills, 'Class');
        cg.groups.forEach(g => skillInfoLines.push(`Class — choose ${g.count}: ${g.from.map(labelOf).join(', ')}`));
        if (cg.fixed.length) skillInfoLines.push(`Class — ${cg.fixed.map(labelOf).join(', ')}`);
        const bg = parseSkillProfs(bgEntry?.skillProficiencies, 'Background');
        if (bg.fixed.length) skillInfoLines.push(`Background — ${bg.fixed.map(labelOf).join(', ')}`);
        bg.groups.forEach(g => skillInfoLines.push(`Background — choose ${g.count}: ${g.from.map(labelOf).join(', ')}`));
        const rf = Array.from(new Set([...parseSkillProfs(raceEntry?.skillProficiencies, 'Race').fixed, ...parseSkillProfs(subraceEntry?.skillProficiencies, 'Race').fixed]));
        if (rf.length) skillInfoLines.push(`Race — ${rf.map(labelOf).join(', ')}`);
    }

    // Ability-score increases from race/subrace/background (applied for base-score methods only).
    const raceAsi = parseAbilityAsi(raceEntry?.ability);
    const subAsi = parseAbilityAsi(subraceEntry?.ability);
    const bgAsi = parseAbilityAsi(bgEntry?.ability);
    const asiFixed: Partial<Record<AbilityKey, number>> = {};
    for (const src of [raceAsi.fixed, subAsi.fixed, bgAsi.fixed]) {
        for (const [k, v] of Object.entries(src)) asiFixed[k as AbilityKey] = (asiFixed[k as AbilityKey] || 0) + (v || 0);
    }
    const asiGroups = [
        ...raceAsi.groups.map((g, i) => ({ id: `race-${i}`, source: 'Race', ...g })),
        ...subAsi.groups.map((g, i) => ({ id: `sub-${i}`, source: 'Subrace', ...g })),
        ...bgAsi.groups.map((g, i) => ({ id: `bg-${i}`, source: 'Background', ...g })),
    ];
    const applyASI = totalLevel === 1 && (abilityMethod === 'pointbuy' || abilityMethod === 'roll');
    const finalAbilities: AbilityScores = { ...draft.abilities };
    if (applyASI) {
        for (const [k, v] of Object.entries(asiFixed)) finalAbilities[k as AbilityKey] += v || 0;
        for (const g of asiGroups) {
            const alloc = asiAlloc[g.id] || [];
            g.slots.forEach((amt, i) => { const ab = alloc[i]; if (ab) finalAbilities[ab] += amt; });
        }
    }
    const hpBonusPerLevel = extraHpPerLevel(raceEntry, subraceEntry);
    const setAlloc = (id: string, slot: number, ability: AbilityKey | null) =>
        setAsiAlloc(a => { const arr = [...(a[id] || [])]; arr[slot] = ability; return { ...a, [id]: arr }; });

    const asCharacter = { ...draft, class: draft.classes[0]?.name || '', maxHp: 0, ac: 0, abilities: finalAbilities } as unknown as Character;

    // Subrace options for the chosen base race.
    const subraceOptions = React.useMemo(() => {
        if (!draft.race) return [] as SelectOption[];
        const subs = (races || []).filter((r: any) => r.__isSubrace && r.raceName === draft.race);
        const byLabel = new Map<string, SelectOption>();
        for (const s of subs) {
            const label = variantOf(s.name);
            const key = label.toLowerCase();
            const ex = byLabel.get(key);
            if (!ex || norm(s.source) === 'xphb') byLabel.set(key, { label, value: label, sub: s.source });
        }
        return Array.from(byLabel.values()).sort((a, b) => a.label.localeCompare(b.label));
    }, [races, draft.race]);

    const basic = (opts: SelectOption[], on: boolean) => on ? opts.filter(o => isBasic(o.sub)) : opts;

    // ---- ability helpers ----
    const setMethod = (m: AbilityMethod) => {
        setAbilityMethod(m);
        setAssign(emptyAssign);
        setPool([]);
        if (m === 'pointbuy') update({ abilities: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 } });
    };
    // Roll six scores and auto-assign them in order (str…cha) so they're visible immediately.
    const applyAssign = (next: Record<AbilityKey, number | null>, p: number[]) => {
        setAssign(next);
        const abilities = { ...draft.abilities };
        (ABILITIES as readonly AbilityKey[]).forEach(a => { const ai = next[a]; abilities[a] = (ai != null && p[ai] != null) ? p[ai] : (draft.abilities[a] ?? 8); });
        update({ abilities });
    };
    const doRoll = () => {
        const p = Array.from({ length: 6 }, () => roll4d6dropLowest());
        setPool(p);
        const next = { ...emptyAssign };
        (ABILITIES as readonly AbilityKey[]).forEach((a, i) => { next[a] = i; });
        applyAssign(next, p);
    };
    // Assign pool[idx] to `key`, swapping with whichever ability currently holds it.
    const assignSwap = (key: AbilityKey, idx: number) => {
        const prev = assign[key];
        const other = (ABILITIES as readonly AbilityKey[]).find(o => o !== key && assign[o] === idx) || null;
        const next = { ...assign, [key]: idx };
        if (other) next[other] = prev;
        applyAssign(next, pool);
    };
    const pointBuyRemaining = POINT_BUY_BUDGET - ABILITIES.reduce((s, k) => s + (POINT_BUY_COST[draft.abilities[k]] ?? 0), 0);
    const changePointBuy = (key: AbilityKey, next: number) => {
        const cur = draft.abilities[key];
        const clamped = Math.max(8, Math.min(15, next));
        if (clamped === cur) return;
        const costDelta = (POINT_BUY_COST[clamped] ?? 0) - (POINT_BUY_COST[cur] ?? 0);
        if (costDelta > pointBuyRemaining) return;
        update({ abilities: { ...draft.abilities, [key]: clamped } });
    };

    // ---- proficiency helpers ----
    const toggleSave = (k: AbilityKey) => {
        const has = draft.savingThrowProficiencies.includes(k);
        update({ savingThrowProficiencies: has ? draft.savingThrowProficiencies.filter(x => x !== k) : [...draft.savingThrowProficiencies, k] });
    };
    const toggleSkill = (key: string) => {
        const has = draft.skillProficiencies.includes(key);
        update({
            skillProficiencies: has ? draft.skillProficiencies.filter(x => x !== key) : [...draft.skillProficiencies, key],
            skillExpertise: has ? draft.skillExpertise.filter(x => x !== key) : draft.skillExpertise,
        });
    };
    const toggleExp = (key: string) => {
        const has = draft.skillExpertise.includes(key);
        update({ skillExpertise: has ? draft.skillExpertise.filter(x => x !== key) : [...draft.skillExpertise, key] });
    };

    // ---- vitals computed fallbacks ----
    const autoHp = autoMaxHp(asCharacter, hdByClass) + hpBonusPerLevel * totalLevel;
    const autoAc = autoArmorClass(asCharacter);
    const autoPP = autoPassivePerception(asCharacter);
    const autoInit = autoInitiative(asCharacter);

    // ---- validation / gating ----
    const stepValid = (s: number): boolean => {
        switch (s) {
            case 0: return !!draft.race && !!draft.classes[0]?.name;
            case 1: return !!draft.gender && draft.name.trim().length > 0;
            case 2: return !!draft.background && !!draft.alignment;
            case 3: return abilityMethod !== 'pointbuy' || pointBuyRemaining >= 0;
            default: return true;
        }
    };
    const canCreate = !!draft.race && !!draft.classes[0]?.name && !!draft.gender && draft.name.trim().length > 0 && !!draft.background && !!draft.alignment;
    const isLast = step === STEP_TITLES.length - 1;

    const handleSave = () => {
        const classesClean = draft.classes.filter(c => c.name).map(c => ({ ...c, level: c.level || 1 }));
        const built: Character = {
            ...(character || {} as Character),
            name: draft.name.trim(),
            race: draft.race,
            subrace: draft.subrace || undefined,
            class: classesClean[0]?.name || draft.classes[0]?.name || '',
            classes: classesClean.length ? classesClean : undefined,
            level: totalLevel,
            gender: draft.gender || undefined,
            background: draft.background || undefined,
            alignment: draft.alignment || undefined,
            notes: draft.notes || undefined,
            abilities: finalAbilities,
            savingThrowProficiencies: draft.savingThrowProficiencies,
            skillProficiencies: draft.skillProficiencies,
            skillExpertise: draft.skillExpertise,
            speed: parseInt(draft.speed, 10) || 30,
            maxHp: draft.hpMode === 'auto' ? autoHp : (parseInt(draft.maxHp, 10) || autoHp),
            ac: parseInt(draft.ac, 10) || autoAc,
            passivePerception: draft.passivePerception !== '' ? parseInt(draft.passivePerception, 10) : autoPP,
            initiativeBonus: draft.initiativeBonus !== '' ? parseInt(draft.initiativeBonus, 10) : autoInit,
            currentHp: draft.currentHp,
            tempHp: draft.tempHp,
            tokenUrl: selectedImageUri || draft.tokenUrl || '',
            campaignId: draft.campaignId || undefined,
        };
        onSave(built);
        onClose();
    };

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            scrollResetKey={step}
            title={character ? 'Edit Character' : 'New Character'}
            subtitle={`Step ${step + 1} of ${STEP_TITLES.length} · ${STEP_TITLES[step]}`}
            footerContent={(
                <View style={[commonStyles.w_100, commonStyles.row_center_center, commonStyles.gap_sm]}>
                    <View style={{ flex: 1 }}>
                        <Button title="Back" variant="secondary" icon="arrow-back" onPress={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} fullWidth />
                    </View>
                    <View style={{ flex: 1 }}>
                        {isLast
                            ? <Button title={character ? 'Save' : 'Create'} icon="checkmark" onPress={handleSave} disabled={!canCreate} fullWidth />
                            : <Button title="Next" icon="arrow-forward" iconPosition="right" onPress={() => setStep(s => Math.min(STEP_TITLES.length - 1, s + 1))} disabled={!stepValid(step)} fullWidth />}
                    </View>
                </View>
            )}
        >
            {/* STEP 1 — Race, Subrace, Class(es), Level, Subclass */}
            {step === 0 && (
                <View>
                    <View style={styles.rowBetween}>
                        <Label theme={theme}>Race</Label>
                        <View style={styles.switchWrap}>
                            <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM, marginRight: 6 }}>PHB only</Text>
                            <Switch value={phbRace} onValueChange={setPhbRace} />
                        </View>
                    </View>
                    <SelectField label="" theme={theme} value={draft.race} options={basic(baseRaceOptions, phbRace)} onChange={v => { update({ race: v, subrace: '' }); setAsiAlloc({}); }} placeholder="Select a race" allowClear />
                    {subraceOptions.length > 0 && (
                        <View style={{ marginTop: styleConstants.marginMD }}>
                            <SelectField label="Subrace" theme={theme} value={draft.subrace} options={basic(subraceOptions, phbRace)} onChange={v => { update({ subrace: v }); setAsiAlloc({}); }} placeholder="Select a subrace" allowClear />
                        </View>
                    )}

                    <View style={{ height: styleConstants.marginLG }} />
                    <Label theme={theme}>Class</Label>
                    {draft.classes.map((cl, idx) => {
                        const cf = cl.name ? getClassFile(cl.name) : null;
                        const subs = cf ? subclassOptions(cf) : [];
                        return (
                            <View key={idx} style={[styles.classCard, { borderColor: theme.border }]}>
                                <View style={styles.classLine}>
                                    <View style={{ flex: 1 }}>
                                        <SelectField
                                            label=""
                                            theme={theme}
                                            value={cl.name}
                                            options={classOptions}
                                            placeholder={idx === 0 ? 'Select a class' : `Class ${idx + 1}`}
                                            onChange={v => {
                                                const next = draft.classes.map((c, i) => i === idx ? { ...c, name: v, subclass: undefined } : c);
                                                const patch: Partial<Draft> = { classes: next };
                                                if (idx === 0) patch.savingThrowProficiencies = classSaves(findEntryByName(classes, v));
                                                update(patch);
                                            }}
                                        />
                                    </View>
                                    <Text style={{ color: theme.noticeText, marginHorizontal: 6, fontSize: styleConstants.fontSizeSM }}>Lv</Text>
                                    <NumberStepper value={cl.level} min={1} max={20} theme={theme}
                                        onChange={v => update({ classes: draft.classes.map((c, i) => i === idx ? { ...c, level: v } : c) })} />
                                </View>
                                {subs.length > 0 && (
                                    <View style={{ marginTop: styleConstants.marginSM }}>
                                        <SelectField label="" theme={theme} value={cl.subclass || ''} options={subs} placeholder={`${cf?.class?.[0]?.subclassTitle || 'Subclass'} (optional)`}
                                            onChange={v => update({ classes: draft.classes.map((c, i) => i === idx ? { ...c, subclass: v } : c) })} allowClear />
                                    </View>
                                )}
                                {idx > 0 && (
                                    <TouchableOpacity onPress={() => update({ classes: draft.classes.filter((_, i) => i !== idx) })} style={styles.removeBtn}>
                                        <Ionicons name="trash-outline" size={18} color="#dc2626" />
                                        <Text style={{ color: '#dc2626', marginLeft: 4 }}>Remove class</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                    <Button title="Add class (multiclass)" icon="add" variant="secondary" onPress={() => update({ classes: [...draft.classes, { name: '', level: 1 }] })} />
                    <Text style={[styles.hint, { color: theme.noticeText }]}>Total level: {totalLevel}</Text>
                </View>
            )}

            {/* STEP 2 — Gender & Name */}
            {step === 1 && (
                <View>
                    <SelectField label="Gender" theme={theme} value={draft.gender} options={GENDER_OPTIONS} onChange={v => update({ gender: v })} placeholder="Select" allowClear />
                    <View style={{ height: styleConstants.marginLG }} />
                    <Label theme={theme}>Name</Label>
                    <View style={styles.nameRow}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                            placeholder="Enter character name"
                            placeholderTextColor={theme.noticeText}
                            value={draft.name}
                            onChangeText={t => update({ name: t })}
                        />
                        {raceHasNames(draft.race) && (
                            <TouchableOpacity onPress={() => setNameGenVisible(true)} style={[styles.diceBtn, { backgroundColor: theme.primary }]} accessibilityLabel="Generate a random name">
                                <Ionicons name="dice" size={22} color={theme.buttonText || '#fff'} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ height: styleConstants.marginLG }} />
                    <ImagePicker currentImageUri={selectedImageUri || draft.tokenUrl} onImageSelected={setSelectedImageUri} theme={theme} />
                </View>
            )}

            {/* STEP 3 — Background & Alignment */}
            {step === 2 && (
                <View>
                    <View style={styles.rowBetween}>
                        <Label theme={theme}>Background</Label>
                        <View style={styles.switchWrap}>
                            <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM, marginRight: 6 }}>PHB only</Text>
                            <Switch value={phbBg} onValueChange={setPhbBg} />
                        </View>
                    </View>
                    <SelectField label="" theme={theme} value={draft.background} options={basic(backgroundOptions, phbBg)} onChange={v => { update({ background: v }); setAsiAlloc({}); }} placeholder="Select a background" allowClear />
                    <View style={{ height: styleConstants.marginLG }} />
                    <Label theme={theme}>Alignment</Label>
                    <AlignmentSelector value={draft.alignment} onChange={v => update({ alignment: v })} theme={theme} />
                </View>
            )}

            {/* STEP 4 — Ability Scores */}
            {step === 3 && (
                <View>
                    {totalLevel === 1 && (
                        <View style={{ marginBottom: styleConstants.marginLG }}>
                            <SegmentedControl
                                options={[{ key: 'pointbuy', label: 'Point Buy' }, { key: 'roll', label: 'Roll' }, { key: 'manual', label: 'Manual' }]}
                                value={abilityMethod}
                                onChange={k => setMethod(k as AbilityMethod)}
                            />
                        </View>
                    )}

                    {totalLevel === 1 && abilityMethod === 'pointbuy' && (
                        <Text style={[styles.hint, { color: pointBuyRemaining < 0 ? '#dc2626' : theme.noticeText, marginTop: 0 }]}>Points remaining: {pointBuyRemaining} / {POINT_BUY_BUDGET} · scores 8–15</Text>
                    )}
                    {totalLevel === 1 && abilityMethod === 'roll' && (
                        <>
                            <Button title={pool.length ? 'Reroll' : 'Roll 4d6 (drop lowest) ×6'} icon="dice" variant="secondary" onPress={doRoll} />
                            {pool.length > 0 && <Text style={[styles.hint, { color: theme.noticeText }]}>Pool: {pool.join(', ')} — assign each to an ability.</Text>}
                        </>
                    )}
                    {totalLevel > 1 && <Text style={[styles.hint, { color: theme.noticeText, marginTop: 0 }]}>Enter this character&apos;s ability scores.</Text>}

                    {(totalLevel === 1 && abilityMethod === 'roll' && pool.length === 0) ? (
                        <Text style={[styles.hint, { color: theme.noticeText }]}>Tap Roll to generate six scores.</Text>
                    ) : (
                        <View style={styles.abilityGrid}>
                            {ABILITIES.map(k => {
                                const isRoll = totalLevel === 1 && abilityMethod === 'roll';
                                const isPointBuy = totalLevel === 1 && abilityMethod === 'pointbuy';
                                const hasVal = !isRoll || assign[k] != null;
                                let control: React.ReactNode;
                                if (isPointBuy) {
                                    control = <TileStepper value={draft.abilities[k]} theme={theme} onChange={v => changePointBuy(k, v)} />;
                                } else if (isRoll) {
                                    control = (
                                        <TouchableOpacity onPress={() => setRollPickerFor(k)} style={[styles.rollCell, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}>
                                            <Text style={{ color: assign[k] != null ? theme.text : theme.noticeText, fontWeight: '800', fontSize: styleConstants.fontSizeXL }}>
                                                {assign[k] != null ? pool[assign[k] as number] : 'Tap'}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                } else {
                                    control = numInput(theme, String(draft.abilities[k]), t => update({ abilities: { ...draft.abilities, [k]: parseInt(t, 10) || 0 } }), { textAlign: 'center', marginBottom: 0, width: '100%' });
                                }
                                return (
                                    <View key={k} style={styles.abilityTile}>
                                        <Text style={[styles.abilityAbbr, { color: theme.noticeText }]}>{k.toUpperCase()}</Text>
                                        <View style={{ width: '100%' }}>{control}</View>
                                        <Text style={[styles.abilityMod, { color: theme.noticeText, marginTop: styleConstants.marginXS }]}>
                                            {!hasVal ? '—' : applyASI ? `${finalAbilities[k]} (${formatMod(abilityMod(finalAbilities[k]))})` : formatMod(abilityMod(draft.abilities[k]))}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {applyASI && (asiGroups.length > 0 || Object.keys(asiFixed).length > 0) && (
                        <View style={[styles.infoCard, { backgroundColor: theme.primary + '12', borderColor: theme.border, marginTop: styleConstants.marginMD }]}>
                            <Text style={{ color: theme.text, fontWeight: '700', marginBottom: styleConstants.marginXS }}>Racial / background bonuses</Text>
                            {Object.keys(asiFixed).length > 0 && (
                                <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>
                                    Applied: {Object.entries(asiFixed).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(', ')}
                                </Text>
                            )}
                            {asiGroups.map(g => (
                                <View key={g.id} style={{ marginTop: styleConstants.marginSM }}>
                                    <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM, marginBottom: styleConstants.marginXS }}>{g.source} — assign:</Text>
                                    {g.slots.map((amt, i) => {
                                        const usedElsewhere = (ab: string) => g.slots.some((_, j) => j !== i && (asiAlloc[g.id] || [])[j] === ab);
                                        const options = g.from.filter(ab => !usedElsewhere(ab)).map(ab => ({ label: ABILITY_LABELS[ab], value: ab }));
                                        return (
                                            <View key={i} style={{ marginBottom: styleConstants.marginXS }}>
                                                <SelectField label={`+${amt} to`} theme={theme} value={(asiAlloc[g.id] || [])[i] || ''} options={options} onChange={v => setAlloc(g.id, i, (v || null) as AbilityKey | null)} placeholder="Choose ability" allowClear />
                                            </View>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    )}
                    {!applyASI && Object.keys(asiFixed).length > 0 && (
                        <Text style={[styles.hint, { color: theme.noticeText }]}>Race/background grant {Object.entries(asiFixed).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(', ')}{asiGroups.length ? ' + choices' : ''} — add to your scores if these are base values.</Text>
                    )}
                </View>
            )}

            {/* STEP 5 — Proficiencies */}
            {step === 4 && (
                <View>
                    <View style={[styles.profBanner, { backgroundColor: theme.primary + '18', borderColor: theme.border }]}>
                        <Text style={{ color: theme.text, fontWeight: '700' }}>Proficiency bonus</Text>
                        <Text style={{ color: theme.primary, fontWeight: '800', fontSize: styleConstants.fontSizeLG }}>{formatMod(proficiencyBonus(totalLevel))}</Text>
                    </View>
                    <Text style={[styles.hint, { color: theme.noticeText, marginTop: 0, marginBottom: styleConstants.marginSM }]}>At level {totalLevel}. Added to proficient saves & skills.</Text>

                    <Label theme={theme}>Saving Throws</Label>
                    <Text style={[styles.hint, { color: theme.noticeText, marginTop: 0 }]}>Set from your class — editable.</Text>
                    <View style={styles.chipWrap}>
                        {ABILITIES.map(k => {
                            const active = draft.savingThrowProficiencies.includes(k);
                            return (
                                <TouchableOpacity key={k} onPress={() => toggleSave(k)} style={[styles.chip, { borderColor: theme.border, backgroundColor: active ? theme.primary : theme.innerBackground }]}>
                                    <Text style={{ color: active ? theme.buttonText : theme.text, fontWeight: '600', fontSize: styleConstants.fontSizeSM }}>{k.toUpperCase()}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={{ height: styleConstants.marginLG }} />
                    <Label theme={theme}>Skills</Label>
                    {skillInfoLines.length > 0 && (
                        <View style={[styles.infoCard, { backgroundColor: theme.primary + '12', borderColor: theme.border }]}>
                            <Text style={{ color: theme.text, fontWeight: '700', fontSize: styleConstants.fontSizeSM, marginBottom: styleConstants.marginXS }}>Your sources grant:</Text>
                            {skillInfoLines.map((line, i) => (
                                <Text key={i} style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM, lineHeight: 18 }}>• {line}</Text>
                            ))}
                        </View>
                    )}
                    <Text style={[styles.hint, { color: theme.noticeText, marginTop: 0 }]}>Select any skills — P = proficient · E = expertise (double bonus).</Text>
                    {SKILLS.map(skill => (
                        <SkillRow
                            key={skill.key}
                            theme={theme}
                            skill={skill}
                            proficient={draft.skillProficiencies.includes(skill.key)}
                            locked={false}
                            expertise={draft.skillExpertise.includes(skill.key)}
                            value={skillBonus(asCharacter, skill)}
                            onToggleProf={() => toggleSkill(skill.key)}
                            onToggleExp={() => toggleExp(skill.key)}
                            disabledAdd={false}
                        />
                    ))}
                </View>
            )}

            {/* STEP 6 — Vitals */}
            {step === 5 && (
                <View>
                    <Label theme={theme}>Hit Points</Label>
                    <SegmentedControl
                        options={[{ key: 'auto', label: `Auto (${autoHp})` }, { key: 'manual', label: 'Manual' }]}
                        value={draft.hpMode}
                        onChange={k => update({ hpMode: k as 'auto' | 'manual' })}
                    />
                    {draft.hpMode === 'manual' && <View style={{ marginTop: styleConstants.marginSM }}>{numInput(theme, draft.maxHp, t => update({ maxHp: t }))}</View>}
                    <Text style={[styles.calcHint, { color: theme.noticeText }]}>Auto = max hit die at level 1, then the average per level, + CON modifier each level.</Text>

                    <View style={{ height: styleConstants.marginMD }} />
                    <VitalRow theme={theme} label="Armor Class" value={draft.ac} auto={autoAc} hint="10 + DEX modifier (unarmored). Edit if wearing armor." onChange={t => update({ ac: t })} onAuto={() => update({ ac: String(autoAc) })} />
                    <VitalRow theme={theme} label="Passive Perception" value={draft.passivePerception} auto={autoPP} hint="10 + Perception (WIS modifier + proficiency if any)." onChange={t => update({ passivePerception: t })} onAuto={() => update({ passivePerception: String(autoPP) })} />
                    <VitalRow theme={theme} label="Initiative Bonus" value={draft.initiativeBonus} auto={autoInit} hint="DEX modifier." onChange={t => update({ initiativeBonus: t })} onAuto={() => update({ initiativeBonus: String(autoInit) })} signed />
                    <VitalRow theme={theme} label="Speed (ft)" value={draft.speed} auto={30} hint="From your race — most are 30 ft (Dwarves 25 ft)." onChange={t => update({ speed: t })} onAuto={() => update({ speed: '30' })} />
                </View>
            )}

            {/* STEP 7 — Campaign */}
            {step === 6 && (
                <View>
                    <CampaignSelector selectedCampaignId={draft.campaignId || undefined} onCampaignChange={id => update({ campaignId: id || '' })} theme={theme} label="Campaign (optional)" />
                    <Text style={[styles.hint, { color: theme.noticeText }]}>Link this character to a campaign, or leave unset. Tap “{character ? 'Save' : 'Create'}” to finish.</Text>
                </View>
            )}

            <NameGeneratorModal
                visible={nameGenVisible}
                onClose={() => setNameGenVisible(false)}
                theme={theme}
                raceName={draft.race}
                initialGender={GENDER_FOR_GEN[draft.gender]}
                onApply={name => update({ name })}
            />

            {/* Roll assignment chooser (swaps values between abilities). */}
            <BaseModal visible={rollPickerFor != null} onClose={() => setRollPickerFor(null)} theme={theme} title={`Assign to ${rollPickerFor ? rollPickerFor.toUpperCase() : ''}`}>
                {pool.map((v, idx) => {
                    const holder = (ABILITIES as readonly AbilityKey[]).find(o => assign[o] === idx);
                    const active = rollPickerFor != null && assign[rollPickerFor] === idx;
                    return (
                        <TouchableOpacity
                            key={idx}
                            activeOpacity={0.7}
                            onPress={() => { if (rollPickerFor) assignSwap(rollPickerFor, idx); setRollPickerFor(null); }}
                            style={[styles.pickRow, { borderBottomColor: theme.border }, active && { backgroundColor: theme.primary + '20' }]}
                        >
                            <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeXL, fontWeight: '800', minWidth: 34 }}>{v}</Text>
                            {holder ? <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>currently {holder.toUpperCase()}</Text> : null}
                        </TouchableOpacity>
                    );
                })}
            </BaseModal>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', marginBottom: styleConstants.marginMD },
    hint: { fontSize: styleConstants.fontSizeSM, marginTop: styleConstants.marginSM },
    calcHint: { fontSize: styleConstants.fontSizeXS, marginTop: styleConstants.marginXS, fontStyle: 'italic' },
    input: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusLG,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM + 2,
        fontSize: styleConstants.fontSizeLG,
    },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    switchWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: styleConstants.marginMD },
    classCard: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusLG,
        padding: styleConstants.paddingMD,
        marginBottom: styleConstants.marginMD,
    },
    classLine: { flexDirection: 'row', alignItems: 'center' },
    removeBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: styleConstants.paddingSM, marginTop: styleConstants.marginXS },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapXS },
    stepBtn: { width: 34, height: 34, borderRadius: styleConstants.borderRadiusCircle, borderWidth: styleConstants.borderXS, alignItems: 'center', justifyContent: 'center' },
    stepValue: { fontSize: styleConstants.fontSizeLG, fontWeight: '800', minWidth: 28, textAlign: 'center' },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM },
    diceBtn: { width: 46, height: 46, borderRadius: styleConstants.borderRadiusLG, alignItems: 'center', justifyContent: 'center' },
    abilityMod: { fontSize: styleConstants.fontSizeMD, fontWeight: '700' },
    abilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: styleConstants.gapSM, marginTop: styleConstants.marginSM, justifyContent: 'space-between' },
    abilityTile: { width: '31%', alignItems: 'center', marginBottom: styleConstants.marginSM },
    tileStepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
    tileStepBtn: { width: 26, height: 26, borderRadius: styleConstants.borderRadiusCircle, borderWidth: styleConstants.borderXS, alignItems: 'center', justifyContent: 'center' },
    tileStepVal: { fontSize: styleConstants.fontSizeLG, fontWeight: '800', minWidth: 22, textAlign: 'center' },
    rollCell: { width: '100%', minHeight: 44, borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusLG, alignItems: 'center', justifyContent: 'center' },
    pickRow: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM, paddingVertical: styleConstants.paddingMD, paddingHorizontal: styleConstants.paddingSM, borderBottomWidth: styleConstants.borderXS },
    profBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: styleConstants.paddingMD, borderRadius: styleConstants.borderRadiusLG, borderWidth: styleConstants.borderXS },
    abilityAbbr: { fontSize: styleConstants.fontSizeXS, fontWeight: '700', letterSpacing: 1, marginBottom: styleConstants.marginXS },
    infoCard: { borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusLG, padding: styleConstants.paddingMD, marginBottom: styleConstants.marginSM },
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: styleConstants.gapSM },
    chip: { paddingHorizontal: styleConstants.paddingMD, paddingVertical: styleConstants.paddingSM, borderRadius: styleConstants.borderRadiusLG, borderWidth: styleConstants.borderXS },
    skillRow: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapXS, paddingVertical: styleConstants.paddingSM, borderBottomWidth: styleConstants.borderXS },
    pe: { width: 32, height: 32, borderRadius: styleConstants.borderRadiusMD, borderWidth: styleConstants.borderXS, alignItems: 'center', justifyContent: 'center' },
    vital: { marginBottom: styleConstants.marginMD },
    vitalTop: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM },
    autoBtn: { width: 38, height: 38, borderRadius: styleConstants.borderRadiusMD, borderWidth: styleConstants.borderXS, alignItems: 'center', justifyContent: 'center' },
});
