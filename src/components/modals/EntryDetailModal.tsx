// REACT
import React from 'react';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// UTILS
import { renderEntries } from 'src/utils/replaceTags';

interface EntryDetailModalProps {
    visible: boolean;
    entry: any | null;
    category: string | null;
    onClose: () => void;
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
};

/**
 * Generic detail modal for entries-based reference content (conditions, diseases, statuses,
 * actions, feats, backgrounds, …). Renders the `entries` tree via the shared renderer, with
 * nested tappable tags routed back through openEntryModal so cross-links work.
 */
export default function EntryDetailModal({ visible, entry, category, onClose, theme }: EntryDetailModalProps) {
    const { openEntryModal } = useModal();

    if (!entry) return null;

    const label = category ? CATEGORY_LABEL[category] : undefined;
    const subtitle = [label, entry.source].filter(Boolean).join(' • ') || undefined;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title={entry.name}
            subtitle={subtitle}
        >
            {entry.prerequisite && typeof entry.prerequisite === 'string' ? (
                renderEntries(`{@i Prerequisite: ${entry.prerequisite}}`, 0, theme)
            ) : null}
            {Array.isArray(entry.entries) && entry.entries.length > 0
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
                : renderEntries('No description available for this entry.', 0, theme)}
        </BaseModal>
    );
}
