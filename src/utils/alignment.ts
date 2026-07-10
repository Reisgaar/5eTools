// D&D 5e alignment helpers — a two-axis (ethical × moral) model plus the PHB descriptions.

export type Ethic = 'Lawful' | 'Neutral' | 'Chaotic';
export type Moral = 'Good' | 'Neutral' | 'Evil';

export const ETHICS: Ethic[] = ['Lawful', 'Neutral', 'Chaotic'];
export const MORALS: Moral[] = ['Good', 'Neutral', 'Evil'];

/** Combine the two axes into a canonical label ("Neutral" for true neutral). */
export function buildAlignment(ethic: Ethic, moral: Moral): string {
    if (ethic === 'Neutral' && moral === 'Neutral') return 'Neutral';
    return `${ethic} ${moral}`;
}

/** Parse a stored label back into its two axes (for pre-filling the selector). */
export function splitAlignment(label?: string): { ethic: Ethic | null; moral: Moral | null } {
    if (!label) return { ethic: null, moral: null };
    if (label === 'Neutral' || label === 'True Neutral') return { ethic: 'Neutral', moral: 'Neutral' };
    const parts = label.split(/\s+/);
    if (parts.length === 2) {
        const ethic = ETHICS.includes(parts[0] as Ethic) ? (parts[0] as Ethic) : null;
        const moral = MORALS.includes(parts[1] as Moral) ? (parts[1] as Moral) : null;
        return { ethic, moral };
    }
    return { ethic: null, moral: null };
}

// Brief PHB (p.122) descriptions, keyed by canonical label.
export const ALIGNMENT_DESCRIPTIONS: Record<string, string> = {
    'Lawful Good': 'Crusader — acts with compassion and honor, doing what is right as society expects.',
    'Neutral Good': 'Benefactor — does the best they can to help others according to their needs.',
    'Chaotic Good': 'Rebel — acts as their conscience directs, with little regard for what others expect.',
    'Lawful Neutral': 'Judge — acts in accordance with law, tradition, or a personal code.',
    'Neutral': 'Undecided — does what seems best, steering clear of taking sides in moral questions.',
    'Chaotic Neutral': 'Free Spirit — follows their whims, prizing personal freedom above all else.',
    'Lawful Evil': 'Dominator — takes what they want within a code of tradition, loyalty, or order.',
    'Neutral Evil': 'Malefactor — does whatever they can get away with, without compassion or qualms.',
    'Chaotic Evil': 'Destroyer — acts with arbitrary violence, spurred by greed, hatred, or bloodlust.',
};
