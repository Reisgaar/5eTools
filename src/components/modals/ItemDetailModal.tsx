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
import { getItemStatRows, formatItemType, formatRarity } from 'src/utils/itemUtils';

interface ItemDetailModalProps {
    visible: boolean;
    item: any | null;
    onClose: () => void;
    onBack?: () => void;
    theme: any;
}

/**
 * Detail modal for an item: a compact stat block (type, rarity, damage, AC, properties, value,
 * weight, …) followed by the item's description entries.
 */
export default function ItemDetailModal({ visible, item, onClose, onBack, theme }: ItemDetailModalProps) {
    const { openEntryModal } = useModal();
    const commonStyles = getCommonStyles(theme);

    if (!item) return null;

    const rows = getItemStatRows(item);
    const subtitle = [formatItemType(item), formatRarity(item.rarity)].filter(Boolean).join(' • ') || item.source;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            onBack={onBack}
            theme={theme}
            title={item.name}
            subtitle={subtitle}
        >
            {/* Stat rows */}
            <View style={{ marginBottom: rows.length ? 10 : 0 }}>
                {rows.map(row => (
                    <View key={row.label} style={[commonStyles.mb_2xs, { flexDirection: 'row' }]}>
                        <Text style={[commonStyles.text_bold, commonStyles.text_primary, commonStyles.text_sm, { width: 110 }]}>{row.label}</Text>
                        <Text style={[commonStyles.text_primary, commonStyles.text_sm, { flex: 1, flexWrap: 'wrap' }]}>{row.value}</Text>
                    </View>
                ))}
            </View>

            {/* Description */}
            {Array.isArray(item.entries) && item.entries.length > 0
                ? renderEntries(
                    item.entries,
                    0,
                    theme,
                    undefined,
                    undefined,
                    {},
                    undefined,
                    undefined,
                    (cat, name, source) => openEntryModal(cat, name, source)
                )
                : null}
        </BaseModal>
    );
}
