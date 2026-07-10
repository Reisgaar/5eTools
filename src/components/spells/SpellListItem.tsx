// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// EXPO
import Ionicons from '@expo/vector-icons/Ionicons';

// COMPONENTS
import { ListItem } from 'src/components/ui';

// INTERFACES
interface SpellListItemProps {
    spell: any;
    schoolLabel: string;
    hasSpellbook: boolean; // true when a spellbook is selected (shows a remove/trash affordance)
    onPress: (spell: any) => void;
    onAddToSpellbook: (spell: any) => void;
    theme: any;
}

// Component for a single spell row.
function SpellListItem({ spell, schoolLabel, hasSpellbook, onPress, onAddToSpellbook, theme }: SpellListItemProps) {
    const isRitual = spell.ritual === true;

    const title = (
        <Text style={{ color: theme.text, fontWeight: 'bold' }}>
            {spell.name}
            {isRitual && ' (R)'}
        </Text>
    );

    const subtitle = (
        <Text style={{ color: theme.noticeText, fontStyle: 'italic' }}>
            {spell.level === 0 ? 'C' : spell.level} - {schoolLabel} ({spell.source || spell._source || 'Unknown'})
        </Text>
    );

    const trailing = (
        <TouchableOpacity
            onPress={() => onAddToSpellbook(spell)}
            style={[styles.spellbookButton, {
                backgroundColor: hasSpellbook ? '#dc2626' : theme.primary,
                borderColor: hasSpellbook ? '#dc2626' : theme.primary
            }]}
        >
            <Ionicons
                name={hasSpellbook ? 'trash-outline' : 'add'}
                size={16}
                color="white"
            />
        </TouchableOpacity>
    );

    return (
        <ListItem
            title={title}
            subtitle={subtitle}
            onPress={() => onPress(spell)}
            trailing={trailing}
        />
    );
}

const styles = StyleSheet.create({
    spellbookButton: {
        borderWidth: styleConstants.borderXS,
        width: 32,
        height: 32,
        borderRadius: 100,
        minHeight: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: styleConstants.margin2XS,
    },
});

// Memoized: rows only re-render when their own props change, not on every parent render.
export default React.memo(SpellListItem);
