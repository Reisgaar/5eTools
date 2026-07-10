// Pure helpers that read 5etools race/class/background entries and extract the pieces the
// creation wizard needs (saving throws, skill grants/choices, subclasses). Kept side-effect free
// so they're easy to test and reuse.

import { AbilityKey, ABILITIES, SKILLS } from 'src/utils/characterUtils';

const SKILL_KEYS = new Set(SKILLS.map(s => s.key));
const ABILITY_SET = new Set<string>(ABILITIES as readonly string[]);
const distinct = <T>(xs: T[]) => Array.from(new Set(xs));
const norm = (s: string) => (s || '').trim().toLowerCase();

export interface ChooseGroup { source: string; from: string[]; count: number; }
export interface SkillGrants { fixed: string[]; groups: ChooseGroup[]; }

/** Parse a 5etools `skillProficiencies`/`startingProficiencies.skills` array. */
export function parseSkillProfs(arr: any[], sourceLabel: string): SkillGrants {
    const fixed: string[] = [];
    const groups: ChooseGroup[] = [];
    for (const obj of arr || []) {
        if (!obj || typeof obj !== 'object') continue;
        if (obj.choose && Array.isArray(obj.choose.from)) {
            const from = obj.choose.from.filter((x: any) => typeof x === 'string' && SKILL_KEYS.has(x));
            if (from.length) groups.push({ source: sourceLabel, from, count: obj.choose.count || 1 });
            continue;
        }
        for (const [k, v] of Object.entries(obj)) {
            if (v === true && SKILL_KEYS.has(k)) fixed.push(k);
        }
    }
    return { fixed: distinct(fixed), groups };
}

/** Class saving-throw proficiencies (ability keys). */
export function classSaves(classSummary: any): AbilityKey[] {
    const arr = classSummary?.proficiency;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x: any) => ABILITY_SET.has(x)) as AbilityKey[];
}

/** Merge skill grants from the (first) class, background and race/subrace into one structure. */
export function collectSkillGrants(opts: {
    classSummary?: any;
    background?: any;
    race?: any;
    subrace?: any;
}): SkillGrants {
    const parts: SkillGrants[] = [];
    if (opts.classSummary) parts.push(parseSkillProfs(opts.classSummary?.startingProficiencies?.skills, 'Class'));
    if (opts.background) parts.push(parseSkillProfs(opts.background?.skillProficiencies, 'Background'));
    if (opts.race) parts.push(parseSkillProfs(opts.race?.skillProficiencies, 'Race'));
    if (opts.subrace) parts.push(parseSkillProfs(opts.subrace?.skillProficiencies, 'Race'));
    return {
        fixed: distinct(parts.flatMap(p => p.fixed)),
        groups: parts.flatMap(p => p.groups),
    };
}

/** Deduped subclass options for a parsed class file (name + source), 2024/XPHB preferred. */
export function subclassOptions(classFile: any): { label: string; value: string; sub?: string }[] {
    const byName = new Map<string, any>();
    for (const sc of classFile?.subclass || []) {
        if (!sc?.name) continue;
        const key = norm(sc.name);
        const existing = byName.get(key);
        if (!existing || norm(sc.source) === 'xphb') byName.set(key, sc);
    }
    return Array.from(byName.values())
        .map(sc => ({ label: sc.name, value: sc.name, sub: sc.source }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

export interface AsiGroup { from: AbilityKey[]; slots: number[]; } // slots = amounts to assign to distinct abilities
export interface AbilityAsi { fixed: Partial<Record<AbilityKey, number>>; groups: AsiGroup[]; }

/**
 * Parse a race/background `ability` array into fixed bonuses + "choose" groups.
 *  - `{con:2}`                              → fixed CON +2
 *  - `{cha:2, choose:{from:[…],count:2}}`   → fixed CHA +2, group of two +1 slots (Half-Elf)
 *  - `{choose:{weighted:{from,weights:[2,1]}}}` → group with a +2 and a +1 slot (2024)
 * When several objects are all pure alternatives (2024 backgrounds offer 2+1 OR 1+1+1) only the
 * first is used so bonuses aren't double-counted.
 */
export function parseAbilityAsi(arr: any[]): AbilityAsi {
    const fixed: Partial<Record<AbilityKey, number>> = {};
    const groups: AsiGroup[] = [];
    const objs = Array.isArray(arr) ? arr : [];
    const hasFixed = (o: any) => Object.keys(o || {}).some(k => ABILITY_SET.has(k));
    const list = objs.length > 1 && objs.every(o => o && o.choose && !hasFixed(o)) ? [objs[0]] : objs;
    for (const o of list) {
        if (!o || typeof o !== 'object') continue;
        for (const [k, v] of Object.entries(o)) {
            if (k === 'choose') {
                const c: any = v;
                if (c?.weighted && Array.isArray(c.weighted.weights)) {
                    const from = (c.weighted.from || []).filter((x: any) => ABILITY_SET.has(x)) as AbilityKey[];
                    if (from.length) groups.push({ from, slots: c.weighted.weights.map((w: any) => Number(w) || 1) });
                } else if (Array.isArray(c?.from)) {
                    const from = c.from.filter((x: any) => ABILITY_SET.has(x)) as AbilityKey[];
                    if (from.length) groups.push({ from, slots: Array(c.count || 1).fill(c.amount || 1) });
                }
            } else if (ABILITY_SET.has(k) && typeof v === 'number') {
                fixed[k as AbilityKey] = (fixed[k as AbilityKey] || 0) + v;
            }
        }
    }
    return { fixed, groups };
}

/** Detect a "+1 HP per level" racial trait (e.g. Hill Dwarf's Dwarven Toughness). */
export function extraHpPerLevel(...entries: any[]): number {
    for (const e of entries) {
        for (const en of (e?.entries || [])) {
            const name = String(en?.name || '').toLowerCase();
            if (name.includes('dwarven toughness')) return 1;
            const blob = JSON.stringify(en?.entries ?? en ?? '').toLowerCase();
            if (blob.includes('hit point maximum increases by 1') && blob.includes('every')) return 1;
        }
    }
    return 0;
}

/** Find the preferred entry (2024/XPHB else first) for a display name in a compendium list. */
export function findEntryByName(list: any[], name: string): any | null {
    if (!name) return null;
    let match: any = null;
    for (const e of list || []) {
        if (norm(e.name) !== norm(name)) continue;
        if (!match || norm(e.source) === 'xphb') match = e;
    }
    return match;
}
