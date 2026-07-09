// Shared source-based filtering applied to every content list: hides books the user has
// blocklisted, and dedupes cross-edition core duplicates (2014 PHB/MM/DMG vs 2024
// XPHB/XMM/XDMG) per the user's preferred edition.
import { normalizeString } from 'src/utils/stringUtils';

// The three core rulebooks per edition. Deduping is intentionally limited to these pairs so we
// only collapse genuine reprints (e.g. Fireball PHB↔XPHB, Goblin MM↔XMM) and never hide
// same-named-but-distinct content from other books.
const CORE_2024 = new Set(['xphb', 'xmm', 'xdmg']);
const CORE_2014 = new Set(['phb', 'mm', 'dmg']);

// The edition-controlled core books (both editions). These are governed by the Rules Edition
// setting, so they're excluded from the ignore-books blocklist.
export const EDITION_CORE_SOURCES = new Set([...CORE_2024, ...CORE_2014]);

export type Edition = '2014' | '2024' | 'both';

export interface SourceFilterOptions {
    preferredEdition: Edition;
    ignoredSources: Set<string>;   // normalized (lowercased) source codes to hide
}

/**
 * Filter a content list: drop blocklisted sources, then dedupe cross-edition core duplicates.
 * Works on both the slim index rows (name/source) and full objects, since it only reads
 * `name` and `source`.
 */
export function applySourceFilters<T extends { name?: string; source?: string }>(
    list: T[],
    opts: SourceFilterOptions,
): T[] {
    if (!Array.isArray(list) || list.length === 0) return list;

    // 1) Ignore blocklisted books.
    let out = opts.ignoredSources.size > 0
        ? list.filter(e => !opts.ignoredSources.has(normalizeString(e.source)))
        : list;

    // 'both' keeps every edition's version — no dedupe.
    if (opts.preferredEdition === 'both') return out;

    // 2) Edition dedupe — only when a name has BOTH a 2014-core and a 2024-core entry.
    const flags = new Map<string, { c14: boolean; c24: boolean }>();
    for (const e of out) {
        const nm = normalizeString(e.name);
        const src = normalizeString(e.source);
        let f = flags.get(nm);
        if (!f) { f = { c14: false, c24: false }; flags.set(nm, f); }
        if (CORE_2014.has(src)) f.c14 = true;
        if (CORE_2024.has(src)) f.c24 = true;
    }

    const hasAnyCrossEdition = Array.from(flags.values()).some(f => f.c14 && f.c24);
    if (!hasAnyCrossEdition) return out;

    out = out.filter(e => {
        const f = flags.get(normalizeString(e.name));
        if (!f || !(f.c14 && f.c24)) return true; // no cross-edition core pair for this name
        const src = normalizeString(e.source);
        if (opts.preferredEdition === '2024' && CORE_2014.has(src)) return false;
        if (opts.preferredEdition === '2014' && CORE_2024.has(src)) return false;
        return true;
    });
    return out;
}
