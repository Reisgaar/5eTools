// REACT
import React from 'react';
import { getCommonStyles } from 'src/styles/commonStyles';
import { Text, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// UTILS
import { renderEntries } from 'src/utils/replaceTags';
import { SIZES } from 'src/data/helpers';

interface RaceDetailModalProps {
    visible: boolean;
    race: any | null;
    onClose: () => void;
    onBack?: () => void;
    theme: any;
}

const ABBR: Record<string, string> = { str: 'Str', dex: 'Dex', con: 'Con', int: 'Int', wis: 'Wis', cha: 'Cha' };

function formatAbility(ability: any): string | undefined {
    if (!Array.isArray(ability) || ability.length === 0) return undefined;
    const parts = ability.map((set: any) => {
        const bits: string[] = [];
        for (const k of Object.keys(ABBR)) if (typeof set[k] === 'number') bits.push(`${ABBR[k]} +${set[k]}`);
        if (set.choose) {
            const from = Array.isArray(set.choose.from) ? set.choose.from.map((f: string) => ABBR[f] || f).join('/') : 'any';
            bits.push(`choose ${set.choose.count || 1} (+${set.choose.amount || 1}) from ${from}`);
        }
        return bits.join(', ');
    }).filter(Boolean);
    return parts.join('; ') || undefined;
}

function formatSize(size: any): string | undefined {
    if (!size) return undefined;
    const arr = Array.isArray(size) ? size : [size];
    return arr.map((s: string) => SIZES[s as keyof typeof SIZES] || s).join(' or ') || undefined;
}

function formatSpeed(speed: any): string | undefined {
    if (typeof speed === 'number') return `${speed} ft.`;
    if (speed && typeof speed === 'object') {
        return Object.entries(speed)
            .map(([k, v]) => (k === 'walk' ? `${v} ft.` : `${k} ${typeof v === 'number' ? v : ''} ft.`))
            .join(', ');
    }
    return undefined;
}

/**
 * Detail modal for a race/subrace: an ability/size/speed header followed by trait entries.
 */
export default function RaceDetailModal({ visible, race, onClose, onBack, theme }: RaceDetailModalProps) {
    const { openEntryModal } = useModal();
    const commonStyles = getCommonStyles(theme);

    if (!race) return null;

    const rows: { label: string; value: string }[] = [];
    const push = (label: string, value?: string) => { if (value) rows.push({ label, value }); };
    push('Ability Scores', formatAbility(race.ability));
    push('Size', formatSize(race.size));
    push('Speed', formatSpeed(race.speed));

    return (
        <BaseModal visible={visible} onClose={onClose} onBack={onBack} theme={theme} title={race.name} subtitle={race.source}>
            <View style={{ marginBottom: rows.length ? 10 : 0 }}>
                {rows.map(row => (
                    <View key={row.label} style={[commonStyles.mb_2xs, { flexDirection: 'row' }]}>
                        <Text style={[commonStyles.text_bold, commonStyles.text_primary, commonStyles.text_sm, { width: 110 }]}>{row.label}</Text>
                        <Text style={[commonStyles.text_primary, commonStyles.text_sm, { flex: 1 }]}>{row.value}</Text>
                    </View>
                ))}
            </View>

            {Array.isArray(race.entries) && race.entries.length > 0
                ? renderEntries(race.entries, 0, theme, undefined, undefined, {}, undefined, undefined,
                    (cat, name, source) => openEntryModal(cat, name, source))
                : renderEntries('No trait details available.', 0, theme)}
        </BaseModal>
    );
}
