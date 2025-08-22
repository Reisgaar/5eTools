// REACT
import React from 'react';
import { Text, TouchableOpacity, View, Pressable } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STYLES
import { createCombatStyles } from 'src/styles/combat';

// MODELS
import { CombatHeaderProps } from 'src/models/interfaces/combat';

/**
 * CombatHeader component.
 */
export default function CombatHeader({
    combatName,
    onBackToList,
    onRandomizeInitiative,
    onOpenPlayerModal,
    onEditCombat,
    theme
}: CombatHeaderProps): JSX.Element {
    const styles = createCombatStyles(theme);

    return (
        <View style={[styles.header, { backgroundColor: theme.card }]}>
            <TouchableOpacity
                onPress={onBackToList}
                style={styles.headerBackButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
                {combatName}
            </Text>

            <View style={styles.headerActionButtons}>
                {/* Edit Combat Button */}
                <TouchableOpacity
                    onPress={onEditCombat}
                    style={[styles.headerIconButton, { backgroundColor: theme.primary }]}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="settings-outline" size={20} color="white" />
                </TouchableOpacity>

                {/* Randomize Initiative Button */}
                <TouchableOpacity
                    onPress={onRandomizeInitiative}
                    style={[styles.headerIconButton, { backgroundColor: theme.primary }]}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="dice-outline" size={20} color="white" />
                </TouchableOpacity>

                {/* Add Player Button */}
                <Pressable
                    onPress={() => {
                        console.log('🔘 Add Player button pressed (Pressable)');
                        onOpenPlayerModal();
                    }}
                    style={({ pressed }) => [
                        styles.headerIconButton,
                        {
                            backgroundColor: theme.primary,
                            opacity: pressed ? 0.7 : 1
                        }
                    ]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="person-add-outline" size={20} color="white" />
                </Pressable>
            </View>
        </View>
    );
}
