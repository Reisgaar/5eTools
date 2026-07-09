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
import { getEntryStatRows } from 'src/utils/entryFields';

interface EntryDetailModalProps {
    visible: boolean;
    entry: any | null;
    category: string | null;
    onClose: () => void;
    onBack?: () => void;
    theme: any;
}

const CATEGORY_LABEL: Record<string, string> = {
    condition: 'Condition',
    disease: 'Disease',
    status: 'Status',
    action: 'Action',
    feat: 'Feat',
    background: 'Background',
    variantrule: 'Rule',
    deity: 'Deity',
    cult: 'Cult',
    boon: 'Boon',
    reward: 'Reward',
    trap: 'Trap',
    hazard: 'Hazard',
    facility: 'Bastion Facility',
    language: 'Language',
    object: 'Object',
    optfeature: 'Optional Feature',
    charoption: 'Character Option',
    sense: 'Sense',
    skill: 'Skill',
    psionic: 'Psionic',
    vehicle: 'Vehicle',
};

/**
 * Generic detail modal for entries-based reference content (conditions, diseases, statuses,
 * actions, feats, backgrounds, …). Renders the `entries` tree via the shared renderer, with
 * nested tappable tags routed back through openEntryModal so cross-links work.
 */
export default function EntryDetailModal({ visible, entry, category, onClose, onBack, theme }: EntryDetailModalProps) {
    const { openEntryModal } = useModal();
    const commonStyles = getCommonStyles(theme);

    if (!entry) return null;

    const label = category ? CATEGORY_LABEL[category] : undefined;
    const subtitle = [label, entry.source].filter(Boolean).join(' • ') || undefined;

    const rows = getEntryStatRows(category, entry);
    const hasEntries = Array.isArray(entry.entries) && entry.entries.length > 0;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            onBack={onBack}
            theme={theme}
            title={entry.name}
            subtitle={subtitle}
        >
            {/* Structured stat rows (deities, vehicles, objects, …) */}
            {rows.length > 0 && (
                <View style={{ marginBottom: hasEntries ? 10 : 0 }}>
                    {rows.map(row => (
                        <View key={row.label} style={[commonStyles.mb_2xs, { flexDirection: 'row' }]}>
                            <Text style={[commonStyles.text_bold, commonStyles.text_primary, commonStyles.text_sm, { width: 120 }]}>{row.label}</Text>
                            <Text style={[commonStyles.text_primary, commonStyles.text_sm, { flex: 1 }]}>{row.value}</Text>
                        </View>
                    ))}
                </View>
            )}

            {entry.prerequisite && typeof entry.prerequisite === 'string' ? (
                renderEntries(`{@i Prerequisite: ${entry.prerequisite}}`, 0, theme)
            ) : null}
            {hasEntries
                ? renderEntries(
                    entry.entries,
                    0,
                    theme,
                    undefined,          // onCreaturePress
                    undefined,          // onSpellPress
                    {},                 // textStyle
                    undefined,          // onDamagePress
                    undefined,          // onHitPress
                    (cat, name, source) => openEntryModal(cat, name, source)
                )
                : (rows.length === 0 ? renderEntries('No description available for this entry.', 0, theme) : null)}
        </BaseModal>
    );
}
