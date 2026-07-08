// Item formatting helpers. Abbreviation → name maps are built from the bundled items-base
// tables (itemType / itemProperty) so they stay in sync with the data.
import { ITEMS_BASE } from 'src/data/bundledData';

const base: any = (() => {
    try { return ITEMS_BASE() || {}; } catch { return {}; }
})();

// Strip a trailing |source from an abbreviation like "AF|DMG".
const bare = (abbr: any): string => String(abbr ?? '').split('|')[0];

const TYPE_NAME = new Map<string, string>();
for (const t of base.itemType || []) {
    if (t.abbreviation && t.name) TYPE_NAME.set(t.abbreviation, t.name);
}

const PROP_NAME = new Map<string, string>();
for (const p of base.itemProperty || []) {
    // The human name lives in the first nested entry (e.g. entries[0].name === "Two-Handed").
    const name = p?.entries?.[0]?.name;
    if (p.abbreviation) PROP_NAME.set(p.abbreviation, name || p.abbreviation);
}

const DMG_TYPES: Record<string, string> = {
    A: 'acid', B: 'bludgeoning', C: 'cold', F: 'fire', O: 'force', L: 'lightning',
    N: 'necrotic', P: 'piercing', I: 'poison', Y: 'psychic', R: 'radiant', S: 'slashing', T: 'thunder',
};

export function formatItemType(item: any): string {
    if (item.wondrous) return 'Wondrous Item';
    const t = TYPE_NAME.get(bare(item.type));
    return t || bare(item.type) || 'Item';
}

export function formatRarity(rarity: any): string | undefined {
    if (!rarity || rarity === 'none' || rarity === 'unknown' || rarity === 'unknown (magic)') return undefined;
    return String(rarity).charAt(0).toUpperCase() + String(rarity).slice(1);
}

export function formatAttunement(item: any): string | undefined {
    if (!item.reqAttune) return undefined;
    if (item.reqAttune === true) return 'Requires attunement';
    return `Requires attunement ${item.reqAttune}`;
}

// Item value is stored in copper pieces; show the largest sensible coin.
export function formatValue(value: any): string | undefined {
    if (typeof value !== 'number' || value <= 0) return undefined;
    if (value % 100 === 0) return `${value / 100} gp`;
    if (value % 10 === 0) return `${value / 10} sp`;
    return `${value} cp`;
}

export function formatWeight(weight: any): string | undefined {
    if (typeof weight !== 'number' || weight <= 0) return undefined;
    return `${weight} lb.${weight === 1 ? '' : ''}`;
}

export function formatDamage(item: any): string | undefined {
    if (!item.dmg1) return undefined;
    const type = DMG_TYPES[item.dmgType] || '';
    let out = `${item.dmg1}${type ? ` ${type}` : ''}`;
    if (item.dmg2) out += ` (versatile ${item.dmg2})`;
    return out;
}

export function formatProperties(property: any): string | undefined {
    if (!Array.isArray(property) || property.length === 0) return undefined;
    return property.map(p => PROP_NAME.get(bare(p)) || bare(p)).join(', ');
}

// Build the compact stat rows shown at the top of the item detail modal (present fields only).
export function getItemStatRows(item: any): { label: string; value: string }[] {
    const rows: { label: string; value: string }[] = [];
    const push = (label: string, value?: string) => { if (value) rows.push({ label, value }); };

    push('Type', formatItemType(item));
    push('Rarity', formatRarity(item.rarity));
    push('Attunement', formatAttunement(item));
    push('Damage', formatDamage(item));
    if (typeof item.ac === 'number') push('Armor Class', String(item.ac));
    push('Properties', formatProperties(item.property));
    if (item.range) push('Range', `${item.range} ft.`);
    push('Weight', formatWeight(item.weight));
    push('Value', formatValue(item.value));
    return rows;
}
