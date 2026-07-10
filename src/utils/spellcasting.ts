// Derives a character's spellcasting: ability, save DC / attack, and spell slots per level.
// Single-class casters read their exact slot row from the class file; multiclass combines caster
// levels onto the standard full-caster table; Warlocks use the fixed Pact Magic table.

import { AbilityKey, spellAttackBonus, spellSaveDc, totalLevel } from 'src/utils/characterUtils';
import { Character } from 'src/models/interfaces/utils';

// Standard full-caster slots by class level (index 0 = level 1), 9 spell levels.
const FULL_CASTER: number[][] = [
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 2, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 2, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 1, 0, 0, 0, 0, 0],
    [4, 3, 3, 2, 0, 0, 0, 0, 0],
    [4, 3, 3, 3, 1, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

const pad9 = (row: number[]): number[] => { const r = [...(row || [])]; while (r.length < 9) r.push(0); return r.slice(0, 9); };
const warlockPactCount = (l: number) => (l >= 17 ? 4 : l >= 11 ? 3 : l >= 2 ? 2 : l >= 1 ? 1 : 0);
const warlockPactLevel = (l: number) => (l >= 9 ? 5 : l >= 7 ? 4 : l >= 5 ? 3 : l >= 3 ? 2 : l >= 1 ? 1 : 0);

export interface Spellcasting {
    isCaster: boolean;
    ability?: AbilityKey;
    saveDc?: number;
    attack?: number;
    slots: number[];                       // length 9, index 0 = 1st-level
    pact?: { count: number; level: number };
    note?: string;
}

export function getSpellcasting(character: Character, getClassFile: (name: string) => any): Spellcasting {
    const classes = character.classes && character.classes.length
        ? character.classes
        : (character.class ? [{ name: character.class, level: totalLevel(character) }] : []);

    const casters = classes
        .map(c => ({ level: c.level || 0, cls: getClassFile(c.name)?.class?.[0] }))
        .filter(x => x.cls?.spellcastingAbility && x.cls?.casterProgression);

    if (!casters.length) return { isCaster: false, slots: pad9([]) };

    const nonPact = casters.filter(x => x.cls.casterProgression !== 'pact');
    const warlocks = casters.filter(x => x.cls.casterProgression === 'pact');

    let slots = pad9([]);
    let note: string | undefined;
    if (nonPact.length === 1) {
        const only = nonPact[0];
        const grp = (only.cls.classTableGroups || []).find((g: any) => g.rowsSpellProgression);
        slots = pad9(grp?.rowsSpellProgression?.[only.level - 1] || []);
    } else if (nonPact.length > 1) {
        const combined = nonPact.reduce((s, x) => {
            const p = x.cls.casterProgression;
            return s + (p === 'full' ? x.level : p === '1/2' ? Math.floor(x.level / 2) : p === '1/3' ? Math.floor(x.level / 3) : 0);
        }, 0);
        slots = pad9(FULL_CASTER[combined - 1] || []);
        note = `Multiclass spell slots (combined caster level ${combined}).`;
    }

    let pact: { count: number; level: number } | undefined;
    if (warlocks.length) {
        const wl = warlocks.reduce((s, x) => s + x.level, 0);
        pact = { count: warlockPactCount(wl), level: warlockPactLevel(wl) };
    }

    const ability = casters[0].cls.spellcastingAbility as AbilityKey;
    return {
        isCaster: true,
        ability,
        saveDc: spellSaveDc(character, ability),
        attack: spellAttackBonus(character, ability),
        slots,
        pact,
        note,
    };
}
