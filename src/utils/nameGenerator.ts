// Character name randomiser.
//
// Combines two data sources:
//   • src/data/data/names.json          — bundled 5etools (XGE/MTF/GoS) name tables.
//   • src/data/data/names-phb-human.json — PHB human ethnicities WITH surnames (XGE humans have none).
//
// The 5etools website simply rolls each table in isolation; here we make it character-aware:
// map a race → its name entry, then draw a coherent first name (by gender / ethnicity / age)
// plus an optional surname (clan / family / virtue / surname), all from the same ethnicity.

import namesData from 'src/data/data/names.json';
import phbHuman from 'src/data/data/names-phb-human.json';

export type Gender = 'male' | 'female' | 'nonbinary';
export type Age = 'child' | 'adult';

export interface Option { key: string; label: string; }

export interface NameConfig {
    /** The matched name-entry key, e.g. "Elf". Empty when the race has no names. */
    raceKey: string;
    /** True when the race maps to a name entry (i.e. show the randomiser). */
    hasNames: boolean;
    /** True when the race distinguishes male/female first names. */
    gendered: boolean;
    /** Selectable ethnicities/lineages (Human → PHB ethnicities, Gith → Githyanki/Githzerai). [] if none. */
    ethnicities: Option[];
    /** Age steps that change the first-name table (Elf → child/adult). [] otherwise. */
    ages: Age[];
    /** Surname-type tables (Clan / Family / Virtue / Surname …). [] when the race has none. */
    surnames: Option[];
    /** Ethnicity the UI should preselect, inferred from the race name (e.g. "Githyanki"). null otherwise. */
    suggestedEthnicity: string | null;
}

export interface GenerateOptions {
    gender?: Gender;
    /** Ethnicity key, or null/undefined to pick one at random (kept coherent with the surname). */
    ethnicity?: string | null;
    /** Age step; defaults to a random applicable step. */
    age?: Age | null;
    /** Surname-option key to include, or null/undefined for no surname. */
    surname?: string | null;
}

export interface GeneratedName {
    first: string;
    surname: string | null;
    full: string;
}

// ---------------------------------------------------------------------------
// Normalised model
// ---------------------------------------------------------------------------

interface NormFirstTable { gender: Gender | 'neutral'; ethnicity?: string; age?: Age; results: string[]; }
interface NormSurnameTable { key: string; ethnicity?: string; results: string[]; }
interface NormSource { key: string; first: NormFirstTable[]; surnames: NormSurnameTable[]; }

// Table `option` labels that describe a surname rather than a given name.
const SURNAME_OPTIONS = new Set(['Clan', 'Family', 'Virtue', 'Duergar Clan']);
// Generic single-table labels that are not a real "ethnicity" choice.
const NON_ETHNICITY = new Set(['General', '']);

// Race-name keyword → name-entry key. Ordered: more specific first.
const RACE_KEYWORDS: [RegExp, string][] = [
    [/half[-\s]?orc/i, 'Half-Orc'],
    [/half[-\s]?elf/i, 'Elf'],           // half-elves take human or elven names; we offer elven
    [/dragonborn|draconic/i, 'Dragonborn'],
    [/duergar/i, 'Dwarf'],
    [/dwarf|dwarves/i, 'Dwarf'],
    [/drow|eladrin|\belf\b|elves|elven/i, 'Elf'],
    [/gnome/i, 'Gnome'],
    [/halfling/i, 'Halfling'],
    [/githyanki|githzerai|\bgith\b/i, 'Gith'],
    [/lizardfolk/i, 'Lizardfolk'],
    [/tiefling/i, 'Tiefling'],
    [/human/i, 'Human'],                  // last, so "Variant Human" still matches
];

const pickResults = (t: { table: { result: string }[] }) => t.table.map(r => r.result);

function parseXgeEntry(entry: any): NormSource {
    const first: NormFirstTable[] = [];
    const surnames: NormSurnameTable[] = [];
    for (const t of entry.tables || []) {
        const opt: string = t.option || '';
        const results = pickResults(t);
        if (SURNAME_OPTIONS.has(opt)) {
            surnames.push({ key: opt, results });
            continue;
        }
        let gender: Gender | 'neutral' = 'neutral';
        if (/female/i.test(opt)) gender = 'female';
        else if (/male/i.test(opt)) gender = 'male';
        const age: Age | undefined = /child/i.test(opt) ? 'child' : /adult/i.test(opt) ? 'adult' : undefined;
        // Ethnicity/lineage = whatever remains after stripping gender/age words.
        let ethnicity: string | undefined = opt
            .split(',')
            .map(p => p.replace(/\b(male|female|adult|child)\b/gi, '').trim())
            .filter(Boolean)
            .join(' ')
            .trim();
        if (NON_ETHNICITY.has(ethnicity)) ethnicity = undefined;
        first.push({ gender, ethnicity, age, results });
    }
    return { key: entry.name, first, surnames };
}

// PHB human ethnicities (with surnames) — replaces the surname-less XGE human tables.
function buildHumanSource(): NormSource {
    const byName: Record<string, any> = {};
    for (const e of phbHuman.ethnicities as any[]) byName[e.name] = e;

    const first: NormFirstTable[] = [];
    const surnames: NormSurnameTable[] = [];
    for (const e of phbHuman.ethnicities as any[]) {
        const src = e.sameAs ? byName[e.sameAs] : e;
        if (!src) continue;
        first.push({ gender: 'male', ethnicity: e.name, results: src.male });
        first.push({ gender: 'female', ethnicity: e.name, results: src.female });
        surnames.push({ key: 'Surname', ethnicity: e.name, results: src.surname });
    }
    return { key: 'Human', first, surnames };
}

// Build & cache the normalised sources once.
let SOURCES: Record<string, NormSource> | null = null;
function getSources(): Record<string, NormSource> {
    if (SOURCES) return SOURCES;
    const map: Record<string, NormSource> = {};
    for (const entry of (namesData as any).name || []) {
        map[entry.name] = parseXgeEntry(entry);
    }
    map['Human'] = buildHumanSource(); // override the surname-less XGE human tables
    SOURCES = map;
    return map;
}

function matchRaceKey(raceName: string): string | null {
    if (!raceName) return null;
    for (const [re, key] of RACE_KEYWORDS) if (re.test(raceName)) return key;
    return null;
}

function getSource(raceName: string): NormSource | null {
    const key = matchRaceKey(raceName);
    if (!key) return null;
    return getSources()[key] || null;
}

const distinct = <T>(xs: T[]): T[] => Array.from(new Set(xs));
const randomPick = <T>(xs: T[]): T | null => (xs.length ? xs[Math.floor(Math.random() * xs.length)] : null);
// Some source tables append a meaning, e.g. Lizardfolk "Korth (danger)" — keep just the name.
const cleanName = (s: string): string => s.replace(/\s*\([^)]*\)\s*$/, '').trim();

// If the race name itself names one of the source's ethnicities/lineages, preselect it.
function suggestedEthnicity(raceName: string, ethnicities: string[]): string | null {
    return ethnicities.find(e => new RegExp(`\\b${e}\\b`, 'i').test(raceName)) || null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Whether to show the randomise affordance for a given (possibly free-text) race name. */
export function raceHasNames(raceName: string): boolean {
    return getSource(raceName) != null;
}

/** Describe the choices available for a race so the UI can render the right selectors. */
export function getNameConfig(raceName: string): NameConfig {
    const src = getSource(raceName);
    if (!src) return { raceKey: '', hasNames: false, gendered: false, ethnicities: [], ages: [], surnames: [], suggestedEthnicity: null };

    const ethnicities = distinct(src.first.map(t => t.ethnicity).filter((e): e is string => !!e))
        .map(e => ({ key: e, label: e }));
    const ages = distinct(src.first.map(t => t.age).filter((a): a is Age => !!a));
    const surnames = distinct(src.surnames.map(s => s.key)).map(k => ({ key: k, label: k }));

    return {
        raceKey: src.key,
        hasNames: true,
        gendered: src.first.some(t => t.gender !== 'neutral'),
        ethnicities,
        ages,
        surnames,
        suggestedEthnicity: suggestedEthnicity(raceName, ethnicities.map(e => e.key)),
    };
}

/** Generate a name for a race. Returns null if the race has no name tables. */
export function generateName(raceName: string, opts: GenerateOptions = {}): GeneratedName | null {
    const src = getSource(raceName);
    if (!src) return null;

    const gender: Gender = opts.gender || 'nonbinary';

    // Pick a coherent ethnicity (explicit, else random over available) so first + surname match.
    const ethnicities = distinct(src.first.map(t => t.ethnicity).filter((e): e is string => !!e));
    const ethnicity = opts.ethnicity ?? (ethnicities.length ? randomPick(ethnicities) : null);

    // Pick an age step if the race distinguishes them (Elf). Default to adult when unspecified.
    const ages = distinct(src.first.map(t => t.age).filter((a): a is Age => !!a));
    const age = opts.age ?? (ages.includes('adult') ? 'adult' : ages.length ? randomPick(ages) : null);

    const firstTables = src.first.filter(t => {
        if (ethnicity && t.ethnicity && t.ethnicity !== ethnicity) return false;
        if (ages.length && t.age !== age) return false;          // age-typed race: match the step
        if (age === 'child') return true;                         // child names are unisex
        if (t.gender === 'neutral') return true;
        if (gender === 'nonbinary') return true;
        return t.gender === gender;
    });

    const firstRaw = randomPick(firstTables.flatMap(t => t.results));
    if (firstRaw == null) return null;
    const first = cleanName(firstRaw);

    let surname: string | null = null;
    if (opts.surname) {
        const pool = src.surnames
            .filter(s => s.key === opts.surname && (!ethnicity || !s.ethnicity || s.ethnicity === ethnicity))
            .flatMap(s => s.results);
        const picked = randomPick(pool);
        if (picked != null) surname = cleanName(picked);
    }

    return { first, surname, full: surname ? `${first} ${surname}` : first };
}
