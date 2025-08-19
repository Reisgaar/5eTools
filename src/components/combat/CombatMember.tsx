// REACT
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// STYLES
import { createCombatStyles } from 'src/styles/combat';

// MODELS
import { CombatMemberProps } from 'src/models/interfaces/combat';

/**
 * CombatMember component.
 */
export default function CombatMember({
    member,
    memberIndex,
    isActive,
    onValueEdit,
    onStatusEdit,
    onCreaturePress,
    onTokenPress,
    cachedTokenUrls,
    theme
}: CombatMemberProps): JSX.Element {
    const styles = createCombatStyles(theme);
    const ICON_SIZE = 14;

    return (
        <View style={styles.member}>
            {/* Member Container with Number on the left */}
            <View style={styles.memberContainer}>
                {/* Member Number - Left side */}
                <Text style={styles.memberNumber}>{`#${memberIndex}`}</Text>

                {/* Member Box - Right side */}
                <View style={[
                    styles.memberBox,
                    member.color && { backgroundColor: member.color }
                ]}>
                    {/* Notes - Title of the container */}
                    {member.note && (
                        <View style={styles.memberNotesTitle}>
                            <Text style={[styles.memberNoteText, { color: theme.text }]}>
                                {member.note}
                            </Text>
                        </View>
                    )}

                    {/* Status Conditions - Below notes */}
                    {member.conditions && member.conditions.length > 0 && (
                        <View style={styles.statusContainerTop}>
                            <View style={styles.statusConditions}>
                                {member.conditions
                                    .filter(condition => condition && condition.trim() !== '') // Filter out empty conditions
                                    .map((condition, index) => (
                                        <View key={index} style={styles.statusBadge}>
                                            <Text style={[styles.statusBadgeText, styles.statusBadgeTextMobile]}>
                                                {condition}
                                            </Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    )}

                    {/* Action Buttons Row */}
                    <View style={styles.memberButtonRow}>
                        <View style={styles.memberLeftButtons}>
                            <TouchableOpacity
                                onPress={() => onValueEdit('ac', member.ac, member.id, member.name, false, memberIndex)}
                                style={[styles.memberButton, styles.memberButtonPrimary]}
                            >
                                <Ionicons name='shield' size={ICON_SIZE} color={'#eaeaea'} style={styles.memberIcon} />
                                <Text style={[styles.memberButtonText, styles.memberButtonTextLight]}>
                                    {member.ac}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => onValueEdit('hp', member.currentHp, member.id, member.name, false, memberIndex)}
                                style={[
                                    styles.memberButton,
                                    member.currentHp <= 0 ? styles.memberButtonDanger : styles.memberButtonPrimary
                                ]}
                            >
                                <Ionicons
                                    name={member.currentHp <= 0 ? 'skull' : 'heart'}
                                    size={12}
                                    color={member.currentHp <= 0 ? ('white') : '#ff4444'}
                                    style={styles.memberIcon}
                                />
                                <Text style={[styles.memberButtonText, styles.memberButtonTextLight]}>
                                    {member.currentHp}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                const conditionsText = member.conditions && member.conditions.length > 0
                                    ? member.conditions.join(', ')
                                    : '';
                                onStatusEdit(member.id, member.name, member.color, conditionsText);
                            }}
                            style={[styles.memberButton, styles.memberButtonSmall, styles.memberButtonSettings]}
                        >
                            <Ionicons name='settings' size={ICON_SIZE} color={'white'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
