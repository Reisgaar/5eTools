// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// EXPO
import Ionicons from '@expo/vector-icons/Ionicons';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

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
    const commonStyles = getCommonStyles(theme);
    const isRitual = spell.ritual === true;

    return (
        <View style={[commonStyles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity
                style={commonStyles.itemInfoContainer}
                onPress={() => onPress(spell)}
            >
                <Text style={[commonStyles.itemName, { color: theme.text }]}>
                    <Text style={{ fontWeight: 'bold' }}>
                        {spell.name}
                        {isRitual && ' (R)'}
                    </Text>
                    <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{'\n'}{spell.level === 0 ? 'C' : spell.level} - {schoolLabel} ({spell.source || spell._source || 'Unknown'})</Text>
                </Text>
            </TouchableOpacity>
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
        </View>
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
