/**
 * Utility functions for string manipulation and comparison
 */

/**
 * Normalizes a string for comparison by trimming whitespace and converting to lowercase
 * @param str - The string to normalize
 * @returns Normalized string or empty string if input is not a string
 */
export function normalizeString(str: any): string {
    if (typeof str !== 'string') return '';
    return str.trim().toLowerCase();
}

/**
 * Checks if a string contains another string (case-insensitive, trimmed)
 * @param haystack - The string to search in
 * @param needle - The string to search for
 * @returns True if haystack contains needle
 */
export function containsNormalized(haystack: any, needle: any): boolean {
    const normalizedHaystack = normalizeString(haystack);
    const normalizedNeedle = normalizeString(needle);
    return normalizedHaystack.includes(normalizedNeedle);
}

/**
 * Compares two strings for equality (case-insensitive, trimmed)
 * @param str1 - First string
 * @param str2 - Second string
 * @returns True if strings are equal after normalization
 */
export function equalsNormalized(str1: any, str2: any): boolean {
    return normalizeString(str1) === normalizeString(str2);
}

/**
 * Safely converts any value to a string
 * @param value - The value to convert
 * @returns String representation or empty string
 */
export function safeToString(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
}

/**
 * Extracts beast type from various data structures
 * @param beast - Beast object or data
 * @returns Normalized beast type string
 */
export function extractBeastType(beast: any): string {
    if (!beast) return '';

    if (typeof beast.type === 'string') {
        return normalizeString(beast.type);
    }

    if (typeof beast.type === 'object' && typeof beast.type.type === 'string') {
        return normalizeString(beast.type.type);
    }

    return '';
}

/**
 * Extracts source from beast data
 * @param beast - Beast object or data
 * @returns Normalized source string
 */
export function extractBeastSource(beast: any): string {
    if (!beast) return '';

    if (typeof beast.source === 'string') {
        return normalizeString(beast.source);
    }

    return '';
}

/**
 * Normalizes an array of strings
 * @param strings - Array of strings to normalize
 * @returns Array of normalized strings
 */
export function normalizeStrings(strings: any[]): string[] {
    return strings.map(normalizeString).filter(Boolean);
}

/**
 * Checks if a value is included in an array (case-insensitive, trimmed)
 * @param value - Value to check
 * @param array - Array to search in
 * @returns True if value is found in array
 */
export function includesNormalized(value: any, array: any[]): boolean {
    const normalizedValue = normalizeString(value);
    const normalizedArray = normalizeStrings(array);
    return normalizedArray.includes(normalizedValue);
}

// 2024 Source Logic
export const SOURCES_2024: string[] = ['xdmg', 'xmm', 'xphb'];

/**
 * Checks if a source is a 2024 source
 * @param source - Source to check
 * @returns True if source is 2024
 */
export function is2024Source(source: any): boolean {
    return includesNormalized(source, SOURCES_2024);
}

/**
 * Gets the spell source for a beast based on 2024 logic
 * @param beastSource - Source of the beast
 * @returns Spell source to search in
 */
export function getSpellSourceForBeast(beastSource: any): string {
    if (is2024Source(beastSource)) {
        return 'xphb'; // 2024 sources use xphb spells
    }
    return beastSource; // Non-2024 sources use their own spells
}

/**
 * Gets the creature source for a beast based on 2024 logic
 * @param beastSource - Source of the beast
 * @returns Creature source to search in
 */
export function getCreatureSourceForBeast(beastSource: any): string {
    if (is2024Source(beastSource)) {
        return beastSource; // 2024 sources use their own creatures
    }
    return beastSource; // Non-2024 sources use their own creatures
}

/**
 * Gets excluded spell sources for a beast
 * @param beastSource - Source of the beast
 * @returns Array of excluded spell sources
 */
export function getExcludedSpellSources(beastSource: any): string[] {
    if (is2024Source(beastSource)) {
        return SOURCES_2024; // 2024 sources only search in 2024 sources
    }
    return SOURCES_2024; // Non-2024 sources exclude 2024 sources
}

/**
 * Gets excluded creature sources for a beast
 * @param beastSource - Source of the beast
 * @returns Array of excluded creature sources
 */
export function getExcludedCreatureSources(beastSource: any): string[] {
    if (is2024Source(beastSource)) {
        return SOURCES_2024; // 2024 sources only search in 2024 sources
    }
    return SOURCES_2024; // Non-2024 sources exclude 2024 sources
}
