/**
 * Utility functions for beast/monster data processing
 */

import { normalizeString } from './stringUtils';

/**
 * Calculates passive perception from beast data
 * @param beast - Beast object with skills or passive perception
 * @returns Passive perception value (default 10 if not found)
 */
export function calculatePassivePerception(beast: any): number {
    // First, check if beast has explicit passive perception in senses
    if (beast.senses && typeof beast.senses === 'string') {
        const sensesText = beast.senses.toLowerCase();
        const passivePerceptionMatch = sensesText.match(/passive perception (\d+)/i);
        if (passivePerceptionMatch) {
            return parseInt(passivePerceptionMatch[1], 10);
        }
    }

    // Check if beast has explicit passive perception property
    if (beast.passivePerception !== undefined && beast.passivePerception !== null) {
        return beast.passivePerception;
    }

    // Second, check if beast has perception in skills
    if (beast.skill && typeof beast.skill === 'object') {
        // Look for perception in skills
        for (const [skillName, value] of Object.entries(beast.skill)) {
            if (skillName.toLowerCase().includes('perception')) {
                // Extract the bonus value and add 10
                const bonus = extractBonusFromSkill(value);
                return 10 + bonus;
            }
        }
    }

    // Check if beast has skills as an array
    if (Array.isArray(beast.skill)) {
        for (const skill of beast.skill) {
            if (typeof skill === 'object' && skill.perception) {
                const bonus = extractBonusFromSkill(skill.perception);
                return 10 + bonus;
            }
        }
    }

    // Third, if no perception skill found, use Wisdom modifier
    if (beast.wis && typeof beast.wis === 'number') {
        const wisdomModifier = Math.floor((beast.wis - 10) / 2);
        return 10 + wisdomModifier;
    }

    // Check if wisdom is in a different format (e.g., object with value)
    if (beast.wis && typeof beast.wis === 'object' && beast.wis.value) {
        const wisdomModifier = Math.floor((beast.wis.value - 10) / 2);
        return 10 + wisdomModifier;
    }

    // Default passive perception
    return 10;
}

/**
 * Extracts bonus value from skill description
 * @param skillValue - Skill value (can be string like "perception +5" or number)
 * @returns Bonus value as number
 */
function extractBonusFromSkill(skillValue: any): number {
    if (typeof skillValue === 'number') {
        return skillValue;
    }
    
    if (typeof skillValue === 'string') {
        // Look for patterns like "perception +5", "+5", "5"
        const match = skillValue.match(/\+?\s*(\d+)/);
        if (match) {
            return parseInt(match[1], 10);
        }
    }
    
    return 0;
}

/**
 * Gets beast type from various data structures
 * @param beast - Beast object
 * @returns Normalized beast type string
 */
export function getBeastType(beast: any): string {
    if (!beast) return '';
    
    if (typeof beast.type === 'string') {
        return beast.type.toLowerCase();
    }
    
    if (typeof beast.type === 'object' && typeof beast.type.type === 'string') {
        return beast.type.type.toLowerCase();
    }
    
    return '';
}

/**
 * Gets beast source from beast data
 * @param beast - Beast object
 * @returns Normalized source string
 */
export function getBeastSource(beast: any): string {
    if (!beast) return '';
    
    if (typeof beast.source === 'string') {
        return beast.source.toLowerCase();
    }
    
    return '';
}

/**
 * Calculates initiative bonus (dexterity modifier) from beast data
 * @param beast - Beast object with dexterity stat
 * @returns Initiative bonus value (default 0 if not found)
 */
export function calculateInitiativeBonus(beast: any): number {
    // Check if beast has dexterity stat
    if (beast.dex && typeof beast.dex === 'number') {
        return Math.floor((beast.dex - 10) / 2);
    }
    
    // Check if dexterity is in a different format (e.g., object with value)
    if (beast.dex && typeof beast.dex === 'object' && beast.dex.value) {
        return Math.floor((beast.dex.value - 10) / 2);
    }
    
    // Default initiative bonus (0 for creatures without dexterity)
    return 0;
}

/**
 * Extracts and formats speed from beast data
 * @param beast - Beast object with speed data
 * @returns Formatted speed string (empty string if not found)
 */
export function extractSpeed(beast: any): string {
    if (!beast.speed) return '';
    
    if (typeof beast.speed === 'object') {
        return Object.entries(beast.speed).map(([k, v]) => {
            if (typeof v === 'object' && v !== null) {
                let str = '';
                if ('number' in v) str += v.number;
                if ('condition' in v) str += ` (${v.condition})`;
                return `${k[0].toUpperCase() + k.slice(1)} ${str} ft.`;
            }
            return `${k[0].toUpperCase() + k.slice(1)} ${v} ft.`;
        }).join(', ');
    }
    
    return String(beast.speed);
}

/**
 * Extracts and formats senses from beast data
 * @param beast - Beast object with senses data
 * @returns Formatted senses string (empty string if not found)
 */
export function extractSenses(beast: any): string {
    if (!beast.senses) return '';
    
    let senses = Array.isArray(beast.senses) ? beast.senses.join(', ') : beast.senses;
    
    // Add passive perception if available
    if (beast.passive) {
        senses += (senses ? ', ' : '') + `Passive Perception ${beast.passive}`;
    }
    
    return senses;
}

// Helper function to extract AC value for combat
export function extractACValue(ac: any): number {
    if (!ac) return 0;
    
    // Handle array of AC objects
    if (Array.isArray(ac)) {
        const firstAC = ac[0];
        if (typeof firstAC === 'object' && firstAC !== null) {
            return Number(firstAC.ac || firstAC.value || firstAC.armor || 0);
        }
        return Number(firstAC || 0);
    }
    
    // Handle single AC object
    if (typeof ac === 'object' && ac !== null) {
        return Number(ac.ac || ac.value || ac.armor || 0);
    }
    
    // Handle simple number or string
    return Number(ac || 0);
}
