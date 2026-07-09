// Extracts a compact "stat block" of key structured fields for entries-based content types
// that carry data beyond prose (deities, languages, objects, vehicles, …). Only whitelisted
// fields are shown — notably `credit` and other bookkeeping fields are never surfaced.
import { SIZES, ALIGNMENTS } from 'src/data/helpers';

const ABILITY_FULL: Record<string, string> = {
    str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
};

// Generic scalar/array formatter (skips complex nested objects rather than dumping JSON).
function fmt(v: any): string | undefined {
    if (v === null || v === undefined) return undefined;
    if (Array.isArray(v)) {
        const parts = v.map(x => (typeof x === 'string' || typeof x === 'number') ? String(x) : (x?.name ?? '')).filter(Boolean);
        return parts.length ? parts.join(', ') : undefined;
    }
    if (typeof v === 'object') return undefined;
    return String(v);
}

const fmtSize = (v: any): string | undefined => {
    const arr = Array.isArray(v) ? v : v != null ? [v] : [];
    const out = arr.map((s: string) => SIZES[s as keyof typeof SIZES] || s).filter(Boolean).join(' or ');
    return out || undefined;
};

const fmtAlignment = (v: any): string | undefined => {
    if (Array.isArray(v)) {
        const out = v.map((a: string) => ALIGNMENTS[a as keyof typeof ALIGNMENTS] || a).join(' ');
        return out || undefined;
    }
    return fmt(v);
};

const fmtAbility = (v: any): string | undefined => (typeof v === 'string' ? (ABILITY_FULL[v] || v) : fmt(v));

// 5etools vehicleType codes → full labels (mirrors Parser.VEHICLE_TYPE_TO_FULL).
const VEHICLE_TYPE_FULL: Record<string, string> = {
    SHIP: 'Ship',
    SPELLJAMMER: 'Spelljammer',
    INFWAR: 'Infernal War Machine',
    CREATURE: 'Creature',
    OBJECT: 'Object',
    ELEMENTAL_AIRSHIP: 'Elemental Airship',
};
const fmtVehicleType = (v: any): string | undefined => (typeof v === 'string' ? (VEHICLE_TYPE_FULL[v] || v) : fmt(v));

// Terrain is an array of lowercase codes (sea, air, land…) — title-case them.
const fmtTerrain = (v: any): string | undefined => {
    const arr = Array.isArray(v) ? v : v != null ? [v] : [];
    const out = arr.map((t: string) => (typeof t === 'string' && t ? t.charAt(0).toUpperCase() + t.slice(1) : '')).filter(Boolean).join(', ');
    return out || undefined;
};

interface FieldSpec { key: string; label: string; fmt?: (v: any) => string | undefined; }

// Whitelisted display fields per content category.
const FIELDS: Record<string, FieldSpec[]> = {
    deity: [
        { key: 'pantheon', label: 'Pantheon' },
        { key: 'category', label: 'Category' },
        { key: 'alignment', label: 'Alignment', fmt: fmtAlignment },
        { key: 'domains', label: 'Domains' },
        { key: 'province', label: 'Province' },
        { key: 'symbol', label: 'Symbol' },
    ],
    language: [
        { key: 'type', label: 'Type' },
        { key: 'script', label: 'Script' },
        { key: 'typicalSpeakers', label: 'Typical Speakers' },
    ],
    skill: [{ key: 'ability', label: 'Ability', fmt: fmtAbility }],
    optfeature: [{ key: 'featureType', label: 'Type' }],
    charoption: [{ key: 'optionType', label: 'Type' }],
    reward: [{ key: 'type', label: 'Type' }],
    cult: [{ key: 'type', label: 'Type' }],
    boon: [{ key: 'type', label: 'Type' }],
    trap: [{ key: 'trapHazType', label: 'Category' }],
    hazard: [{ key: 'trapHazType', label: 'Category' }],
    facility: [
        { key: 'facilityType', label: 'Type' },
        { key: 'level', label: 'Level' },
        { key: 'space', label: 'Space' },
    ],
    object: [
        { key: 'objectType', label: 'Type' },
        { key: 'size', label: 'Size', fmt: fmtSize },
        { key: 'ac', label: 'AC' },
        { key: 'hp', label: 'HP' },
    ],
    vehicle: [
        { key: 'vehicleType', label: 'Type', fmt: fmtVehicleType },
        { key: 'size', label: 'Size', fmt: fmtSize },
        { key: 'terrain', label: 'Terrain', fmt: fmtTerrain },
        { key: 'capCrew', label: 'Crew' },
        { key: 'capPassenger', label: 'Passengers' },
        { key: 'pace', label: 'Pace' },
    ],
};

export function getEntryStatRows(category: string | null | undefined, entry: any): { label: string; value: string }[] {
    if (!category || !entry) return [];
    const specs = FIELDS[category];
    if (!specs) return [];
    const rows: { label: string; value: string }[] = [];
    for (const spec of specs) {
        const value = (spec.fmt || fmt)(entry[spec.key]);
        if (value) rows.push({ label: spec.label, value });
    }
    return rows;
}
