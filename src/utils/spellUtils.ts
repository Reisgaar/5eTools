/**
 * Utility functions for spell data manipulation and formatting
 */

import { normalizeString, equalsNormalized } from './stringUtils';

/**
 * School mapping for spells
 */
export const SCHOOL_MAP: Record<string, string> = {
    A: 'Abjuration',
    C: 'Conjuration',
    D: 'Divination',
    E: 'Enchantment',
    V: 'Evocation',
    I: 'Illusion',
    N: 'Necromancy',
    T: 'Transmutation',
};

/**
 * Gets the full school name from school abbreviation
 */
export function getFullSchool(school: string): string {
    if (!school) return '';
    const key = school.charAt(0).toUpperCase();
    return SCHOOL_MAP[key] || school;
}

/**
 * Formats spell components for display
 */
export function formatComponents(components: any): string {
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

/**
 * Formats spell range for display
 */
export function formatRange(range: any): string {
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

/**
 * Formats spell casting time for display
 */
export function formatTime(time: any): string {
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

/**
 * Formats spell duration for display
 */
export function formatDuration(duration: any): string {
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

/**
 * Formats spell level for display
 */
export function formatLevel(level: any): string {
    if (level === 0) return 'Cantrip';
    if (level === 1) return '1st';
    if (level === 2) return '2nd';
    if (level === 3) return '3rd';
    return `${level}th`;
}

/**
 * Extracts spell source from spell data
 */
export function extractSpellSource(spell: any): string {
    if (!spell) return '';
    
    if (typeof spell.source === 'string') {
        return normalizeString(spell.source);
    }
    
    return '';
}

/**
 * Extracts spell school from spell data
 */
export function extractSpellSchool(spell: any): string {
    if (!spell) return '';
    
    if (typeof spell.school === 'string') {
        return normalizeString(spell.school);
    }
    
    return '';
}

/**
 * Extracts spell level from spell data
 */
export function extractSpellLevel(spell: any): number {
    if (!spell) return 0;
    
    if (typeof spell.level === 'number') {
        return spell.level;
    }
    
    return 0;
}

/**
 * Checks if a spell matches given criteria (case-insensitive, trimmed)
 */
export function spellMatches(spell: any, name: string, source: string): boolean {
    if (!spell) return false;
    
    const spellName = normalizeString(spell.name);
    const spellSource = normalizeString(spell.source);
    const searchName = normalizeString(name);
    const searchSource = normalizeString(source);
    
    return equalsNormalized(spellName, searchName) && equalsNormalized(spellSource, searchSource);
}

/**
 * Formats spell classes for display
 */
export function formatClasses(classes: any): string[] {
    if (!classes) return [];
    if (Array.isArray(classes)) {
        return classes.map(c => {
            if (typeof c === 'string') return c;
            if (typeof c === 'object' && c.name) return c.name;
            return String(c);
        });
    }
    if (typeof classes === 'object' && classes.fromClassList) {
        return classes.fromClassList.map((c: any) => c.name || String(c));
    }
    return [];
}

/**
 * Formats spell subclasses for display
 */
export function formatSubclasses(subclasses: any): string[] {
    if (!subclasses) return [];
    if (Array.isArray(subclasses)) {
        return subclasses.map(s => {
            if (typeof s === 'string') return s;
            if (typeof s === 'object' && s.name) return s.name;
            return String(s);
        });
    }
    return [];
}

/**
 * Formats spell races/species for display
 */
export function formatRaces(races: any): string[] {
    if (!races) return [];
    if (Array.isArray(races)) {
        return races.map(r => {
            if (typeof r === 'string') return r;
            if (typeof r === 'object' && r.name) return r.name;
            return String(r);
        });
    }
    return [];
}

/**
 * Formats spell backgrounds for display
 */
export function formatBackgrounds(backgrounds: any): string[] {
    if (!backgrounds) return [];
    if (Array.isArray(backgrounds)) {
        return backgrounds.map(b => {
            if (typeof b === 'string') return b;
            if (typeof b === 'object' && b.name) return b.name;
            return String(b);
        });
    }
    return [];
}

/**
 * Formats spell feats for display
 */
export function formatFeats(feats: any): string[] {
    if (!feats) return [];
    if (Array.isArray(feats)) {
        return feats.map(f => {
            if (typeof f === 'string') return f;
            if (typeof f === 'object' && f.name) return f.name;
            return String(f);
        });
    }
    return [];
}

/**
 * Gets source initials for display
 */
export function getSourceInitials(source: string): string {
    if (!source) return '?';
    
    // Handle common source abbreviations
    const sourceMap: { [key: string]: string } = {
        'monster-manual': 'MM',
        'players-handbook': 'PHB',
        'dungeon-masters-guide': 'DMG',
        'xanathars-guide-to-everything': 'XGtE',
        'tashas-cauldron-of-everything': 'TCoE',
        'monsters-of-the-multiverse': 'MotM',
        'volos-guide-to-monsters': 'VGtM',
        'mordenkainens-tome-of-foes': 'MToF',
        'fizbans-treasury-of-dragons': 'FToD',
        'van-richtens-guide-to-ravenloft': 'VRGtR',
        'strixhaven-curriculum-of-chaos': 'SCoC',
        'candlekeep-mysteries': 'CM',
        'tales-from-the-yawning-portal': 'TftYP',
        'ghosts-of-saltmarsh': 'GoS',
        'storm-kings-thunder': 'SKT',
        'curse-of-strahd': 'CoS',
        'out-of-the-abyss': 'OotA',
        'princes-of-the-apocalypse': 'PotA',
        'rise-of-tiamat': 'RoT',
        'hoard-of-the-dragon-queen': 'HotDQ',
        'lost-mine-of-phandelver': 'LMoP',
        'dragon-of-icespire-peak': 'DoIP',
        'descent-into-avernus': 'DiA',
        'baldurs-gate-descent-into-avernus': 'BGDiA',
        'icewind-dale-rime-of-the-frostmaiden': 'IDRotF',
        'the-wild-beyond-the-witchlight': 'WBtW',
        'call-of-the-netherdeep': 'CotN',
        'journeys-through-the-radiant-citadel': 'JttRC',
        'spelljammer-adventures-in-space': 'SAiS',
        'dragonlance-shadow-of-the-dragon-queen': 'DSotDQ',
        'keys-from-the-golden-vault': 'KftGV',
        'planescape-adventures-in-the-multiverse': 'PAitM',
        'bigbys-presentation-of-giants': 'BPoG',
        'the-book-of-many-things': 'TBoMT',
        'eberron-rising-from-the-last-war': 'ERftLW',
        'explorers-guide-to-wildemount': 'EGtW',
        'acquisitions-incorporated': 'AI',
        'guildmasters-guide-to-ravnica': 'GGtR',
        'mythic-odysseys-of-theros': 'MOoT',
    };
    
    const lowerSource = source.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return sourceMap[lowerSource] || source.substring(0, 3).toUpperCase();
}
