// D&D 5e character maths — derives sheet values from ability scores, level and proficiencies.
// Everything is defensive about missing data so a half-filled character still renders.

import { AbilityScores, Character } from 'src/models/interfaces/utils';

export const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
export type AbilityKey = (typeof ABILITIES)[number];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
};

export interface SkillDef { key: string; label: string; ability: AbilityKey; }

// The 18 PHB skills, each tied to its governing ability.
export const SKILLS: SkillDef[] = [
    { key: 'acrobatics', label: 'Acrobatics', ability: 'dex' },
    { key: 'animal handling', label: 'Animal Handling', ability: 'wis' },
    { key: 'arcana', label: 'Arcana', ability: 'int' },
    { key: 'athletics', label: 'Athletics', ability: 'str' },
    { key: 'deception', label: 'Deception', ability: 'cha' },
    { key: 'history', label: 'History', ability: 'int' },
    { key: 'insight', label: 'Insight', ability: 'wis' },
    { key: 'intimidation', label: 'Intimidation', ability: 'cha' },
    { key: 'investigation', label: 'Investigation', ability: 'int' },
    { key: 'medicine', label: 'Medicine', ability: 'wis' },
    { key: 'nature', label: 'Nature', ability: 'int' },
    { key: 'perception', label: 'Perception', ability: 'wis' },
    { key: 'performance', label: 'Performance', ability: 'cha' },
    { key: 'persuasion', label: 'Persuasion', ability: 'cha' },
    { key: 'religion', label: 'Religion', ability: 'int' },
    { key: 'sleight of hand', label: 'Sleight of Hand', ability: 'dex' },
    { key: 'stealth', label: 'Stealth', ability: 'dex' },
    { key: 'survival', label: 'Survival', ability: 'wis' },
];

export const DEFAULT_ABILITIES: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

/** Ability modifier for a raw score (defaults to 10 → +0). */
export function abilityMod(score?: number): number {
    return Math.floor(((score ?? 10) - 10) / 2);
}

/** Signed display, e.g. +3 / -1. */
export function formatMod(n: number): string {
    return n >= 0 ? `+${n}` : `${n}`;
}

export function getAbilities(c: Character): AbilityScores {
    return { ...DEFAULT_ABILITIES, ...(c.abilities || {}) };
}

/** Total character level — sum of class levels, else the flat `level`, else 1. */
export function totalLevel(c: Character): number {
    if (c.classes && c.classes.length) {
        return c.classes.reduce((sum, cl) => sum + (cl.level || 0), 0) || 1;
    }
    return c.level ?? 1;
}

/** Proficiency bonus by level: +2 (1–4), +3 (5–8), +4 (9–12), +5 (13–16), +6 (17–20). */
export function proficiencyBonus(level: number): number {
    return Math.floor((Math.max(1, level) - 1) / 4) + 2;
}

/** A one-line "Fighter 3 / Wizard 2" summary (falls back to the free-text `class`). */
export function classSummary(c: Character): string {
    if (c.classes && c.classes.length) {
        return c.classes
            .map(cl => `${cl.name}${cl.subclass ? ` (${cl.subclass})` : ''} ${cl.level}`)
            .join(' / ');
    }
    const lvl = c.level ? ` ${c.level}` : '';
    return c.class ? `${c.class}${lvl}` : lvl.trim();
}

export function saveBonus(c: Character, ability: AbilityKey): number {
    const mod = abilityMod(getAbilities(c)[ability]);
    const proficient = (c.savingThrowProficiencies || []).includes(ability);
    return mod + (proficient ? proficiencyBonus(totalLevel(c)) : 0);
}

export function isSaveProficient(c: Character, ability: AbilityKey): boolean {
    return (c.savingThrowProficiencies || []).includes(ability);
}

export type SkillProficiency = 'none' | 'proficient' | 'expertise';

export function skillProficiency(c: Character, skillKey: string): SkillProficiency {
    if ((c.skillExpertise || []).includes(skillKey)) return 'expertise';
    if ((c.skillProficiencies || []).includes(skillKey)) return 'proficient';
    return 'none';
}

export function skillBonus(c: Character, skill: SkillDef): number {
    const mod = abilityMod(getAbilities(c)[skill.ability]);
    const pb = proficiencyBonus(totalLevel(c));
    switch (skillProficiency(c, skill.key)) {
        case 'expertise': return mod + pb * 2;
        case 'proficient': return mod + pb;
        default: return mod;
    }
}

/** Auto-computed passive perception: 10 + Perception skill bonus. */
export function autoPassivePerception(c: Character): number {
    const perception = SKILLS.find(s => s.key === 'perception')!;
    return 10 + skillBonus(c, perception);
}

/** Stored (editable) passive perception, falling back to the auto value. */
export function passivePerception(c: Character): number {
    return c.passivePerception ?? autoPassivePerception(c);
}

/** Auto-computed initiative: the Dexterity modifier. */
export function autoInitiative(c: Character): number {
    return abilityMod(getAbilities(c).dex);
}

/** Stored (editable) initiative modifier, falling back to the Dex modifier. */
export function initiative(c: Character): number {
    return c.initiativeBonus ?? autoInitiative(c);
}

/** Auto-computed unarmored AC: 10 + Dexterity modifier. */
export function autoArmorClass(c: Character): number {
    return 10 + abilityMod(getAbilities(c).dex);
}

/**
 * Auto-computed max HP across (multi)class levels: max hit-die at the very first level, the fixed
 * average per level thereafter, all plus the Con modifier per level. `hitDieByClass` maps a class
 * name to its die faces (e.g. Fighter → 10); unknown classes fall back to d8.
 */
export function autoMaxHp(c: Character, hitDieByClass: (className: string) => number): number {
    const conMod = abilityMod(getAbilities(c).con);
    const classes = c.classes && c.classes.length ? c.classes : [{ name: c.class || '', level: totalLevel(c) }];
    let hp = 0;
    let first = true;
    for (const cl of classes) {
        const faces = hitDieByClass(cl.name) || 8;
        const avg = Math.floor(faces / 2) + 1;
        for (let i = 0; i < (cl.level || 0); i++) {
            hp += (first ? faces : avg) + conMod;
            first = false;
        }
    }
    return Math.max(1, hp);
}

export function spellSaveDc(c: Character, ability: AbilityKey): number {
    return 8 + proficiencyBonus(totalLevel(c)) + abilityMod(getAbilities(c)[ability]);
}

export function spellAttackBonus(c: Character, ability: AbilityKey): number {
    return proficiencyBonus(totalLevel(c)) + abilityMod(getAbilities(c)[ability]);
}

/**
 * Suggested max HP from a class hit die: max at level 1, then the fixed average per level,
 * all plus Con modifier per level. `hitDieFaces` e.g. 10 for a d10 class.
 */
export function suggestMaxHp(c: Character, hitDieFaces: number): number {
    const level = totalLevel(c);
    const conMod = abilityMod(getAbilities(c).con);
    const avgPerLevel = Math.floor(hitDieFaces / 2) + 1;
    const first = hitDieFaces + conMod;
    const rest = (level - 1) * (avgPerLevel + conMod);
    return Math.max(1, first + rest);
}
