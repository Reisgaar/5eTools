// REACT
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { ListItem } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface SpellbookItemProps {
    spellbook: any;
    theme: any;
    isSelected?: boolean;
    isInSpellbook?: boolean;
    onPress: () => void;
    onDelete?: () => void;
    showDeleteButton?: boolean;
    showToggleButton?: boolean;
}

/**
 * SpellbookItem component.
 */
export default function SpellbookItem({
    spellbook,
    theme,
    isSelected = false,
    isInSpellbook = false,
    onPress,
    onDelete,
    showDeleteButton = false,
    showToggleButton = false
}: SpellbookItemProps) {
    const commonStyles = getCommonStyles(theme);

    const subtitle = (
        <>
            <Text style={[commonStyles.modalItemStats, { color: theme.noticeText }]}>
                {(spellbook.spellsIndex || []).length} spells
            </Text>
        </>
    );

    const trailing = (
        <>
            {showToggleButton && (
                <TouchableOpacity
                    onPress={onPress}
                    style={[commonStyles.modalActionButton, { backgroundColor: isInSpellbook ? '#dc2626' : theme.primary }]}
                >
                    <Ionicons
                        name={isInSpellbook ? 'remove' : 'add'}
                        size={16}
                        color="white"
                    />
                </TouchableOpacity>
            )}
            {showDeleteButton && onDelete && (
                <TouchableOpacity
                    onPress={onDelete}
                    style={[commonStyles.modalActionButton, { backgroundColor: '#dc2626' }]}
                >
                    <Ionicons name="trash" size={16} color="white" />
                </TouchableOpacity>
            )}
        </>
    );

    return (
        <ListItem
            title={spellbook.name}
            subtitle={subtitle}
            selected={isSelected}
            onPress={onPress}
            trailing={trailing}
        />
    );
}
