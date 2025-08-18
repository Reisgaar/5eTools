// REACT
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

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
    return (
        <View style={[commonStyles.modalItem, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <TouchableOpacity
                style={commonStyles.modalItemInfo}
                onPress={onPress}
            >
                <Text style={[commonStyles.modalItemName, { color: theme.text }]}>{spellbook.name}</Text>
                {spellbook.description && (
                    <Text style={[commonStyles.modalItemDescription, { color: theme.noticeText }]}>{spellbook.description}</Text>
                )}
                <Text style={[commonStyles.modalItemStats, { color: theme.noticeText }]}>
                    {(spellbook.spellsIndex || []).length} spells • Created {new Date(spellbook.createdAt).toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                {isSelected && (
                    <View style={[{ width: 24, height: 24, borderRadius: 12, marginRight: 8, alignItems: 'center' as const, justifyContent: 'center' as const }, { backgroundColor: theme.primary }]}>
                        <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                )}
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
            </View>
        </View>
    );
}
