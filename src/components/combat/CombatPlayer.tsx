// REACT
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// CONSTANTS
import { DEFAULT_PLAYER_TOKEN } from 'src/constants/tokens';

// STYLES
import { createCombatStyles } from 'src/styles/combat';

// MODELS
import { Combatant } from 'src/context/CombatContext';

// UTILS
import { loadCachedTokenUrl } from 'src/utils/combatUtils';

// INTERFACES
export interface CombatPlayerProps {
    combatant: Combatant;
    isActive: boolean;
    onValueEdit: (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean, combatantNumber?: number) => void;
    onStatusEdit: (id: string, name: string, currentColor?: string, currentCondition?: string) => void;
    onCreaturePress: (name: string, source: string) => void;
    onTokenPress: (tokenUrl: string | undefined, creatureName: string) => void;
    cachedTokenUrls: { [key: string]: string };
    theme: any;
}

/**
 * CombatPlayer component.
 */
export default function CombatPlayer({
    combatant,
    isActive,
    onValueEdit,
    onStatusEdit,
    onCreaturePress,
    onTokenPress,
    cachedTokenUrls,
    theme
}: CombatPlayerProps): JSX.Element {
    const styles = createCombatStyles(theme);
    const [tokenUrl, setTokenUrl] = React.useState<string | undefined>(undefined);
    const ICON_SIZE = 14;

    React.useEffect(() => {
        const loadToken = async () => {
            // For players, use the token URL directly since it's already set
            if (combatant.source === 'player') {
                // Always set a token URL for players - either the custom one or the default
                const finalTokenUrl = combatant.tokenUrl || DEFAULT_PLAYER_TOKEN;
                setTokenUrl(finalTokenUrl);
            } else if (combatant.tokenUrl && combatant.source && combatant.name) {
                // For creatures, use the cached token loading logic
                const cachedUrl = await loadCachedTokenUrl(
                    combatant.tokenUrl,
                    combatant.source,
                    combatant.name
                );
                setTokenUrl(cachedUrl || undefined);
            }
        };
        loadToken();
    }, [combatant.tokenUrl, combatant.source, combatant.name]);

    return (
        <View style={[
            styles.groupContainer,
            {
                borderColor: theme.border,
                borderWidth: 1,
                borderStyle: 'solid'
            }, // Force normal border color and style
            isActive && {
                backgroundColor: theme.primary + '20',
                borderWidth: 2,
                borderColor: theme.primary,
                borderStyle: 'solid'
            }
        ]}>
            {/* Main Container with Two Columns */}
            <View style={styles.groupHeader}>
                {/* Left Column: Token and Stats */}
                <View style={styles.leftColumn}>
                    <TouchableOpacity
                        onPress={() => onTokenPress(tokenUrl || combatant.tokenUrl || DEFAULT_PLAYER_TOKEN, combatant.name)}
                        style={[styles.groupToken, { borderWidth: 3, borderColor: '#22c55a', borderRadius: 32 }]}
                    >
                        <Image
                            source={{ uri: tokenUrl || DEFAULT_PLAYER_TOKEN }}
                            style={styles.groupTokenImage}
                        />
                    </TouchableOpacity>

                    {/* Initiative below token */}
                    <View style={styles.tokenButtonsRow}>
                        <TouchableOpacity
                            onPress={() => onValueEdit('initiative', combatant.initiative, combatant.id, combatant.name, false)}
                            style={styles.tokenButton}
                        >
                            <Ionicons name='flash' size={ICON_SIZE} color={'white'} style={styles.tokenButtonIcon} />
                            <Text style={styles.tokenButtonText}>
                                {combatant.initiative}
                            </Text>
                            {combatant.initiativeBonus !== undefined && combatant.initiativeBonus !== null && (
                                <Text style={[styles.tokenButtonText, { fontSize: 10, marginLeft: 2, color: 'white' }]}>
                                    {`(${combatant.initiativeBonus >= 0 ? '+' : ''}${combatant.initiativeBonus})`}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Right Column: Name and Player Info */}
                <View style={styles.rightColumn}>
                    {/* Name */}
                    <View style={[styles.groupNameRow, { marginBottom: 0 }]}>
                        <View style={styles.groupName}>
                            <Text style={[styles.groupNameText, { color: theme.text }]}>
                                {combatant.name}
                            </Text>
                        </View>
                    </View>

                    {/* Player Info in two columns */}
                    {(combatant.race || combatant.class || combatant.passivePerception) && (
                        <View style={{ marginBottom: 4 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 4 }}>
                                {/* First column */}
                                {combatant.race && (
                                    <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, fontWeight: 'bold' }]}>
                                        Race: {combatant.race}
                                    </Text>
                                )}
                                {combatant.class && (
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, fontWeight: 'bold' }]}>
                                            Class: {combatant.class}
                                        </Text>
                                    </View>
                                )}
                                {combatant.passivePerception && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name='eye' size={12} color={theme.text} style={{ opacity: 0.8, marginRight: 4 }} />
                                        <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8 }]}>
                                            {combatant.passivePerception}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Player Combatant Details */}
                    <View style={styles.member}>
                        <View style={styles.memberContainer}>

                            <View style={[
                                styles.memberBox,
                                combatant.color && { backgroundColor: combatant.color }
                            ]}>
                                {/* Notes - Title of the container */}
                                {combatant.note && (
                                    <View style={styles.memberNotesTitle}>
                                        <Text style={[styles.memberNoteText, { color: theme.text }]}>
                                            {combatant.note}
                                        </Text>
                                    </View>
                                )}

                                {/* Status Conditions - Below notes */}
                                {combatant.conditions && combatant.conditions.length > 0 && (
                                    <View style={styles.statusContainerTop}>
                                        <View style={styles.statusConditions}>
                                            {combatant.conditions
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
                                            onPress={() => onValueEdit('ac', combatant.ac, combatant.id, combatant.name, false)}
                                            style={[styles.memberButton, styles.memberButtonPrimary]}
                                        >
                                            <Ionicons name='shield' size={ICON_SIZE} color={'#eaeaea'} style={styles.memberIcon} />
                                            <Text style={[styles.memberButtonText, styles.memberButtonTextLight]}>
                                                {combatant.ac}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => onValueEdit('hp', combatant.currentHp, combatant.id, combatant.name, false)}
                                            style={[
                                                styles.memberButton,
                                                combatant.currentHp <= 0 ? styles.memberButtonDanger : styles.memberButtonPrimary
                                            ]}
                                        >
                                            <Ionicons
                                                name={combatant.currentHp <= 0 ? 'skull' : 'heart'}
                                                size={ICON_SIZE}
                                                color={combatant.currentHp <= 0 ? (theme.buttonText || 'white') : '#ff4444'}
                                                style={styles.memberIcon}
                                            />
                                            <Text style={[styles.memberButtonText, styles.memberButtonTextLight]}>
                                                {combatant.currentHp}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            const conditionsText = combatant.conditions && combatant.conditions.length > 0
                                                ? combatant.conditions.join(', ')
                                                : '';
                                            onStatusEdit(combatant.id, combatant.name, combatant.color, conditionsText);
                                        }}
                                        style={[styles.memberButton, styles.memberButtonSmall, styles.memberButtonSettings]}
                                    >
                                        <Ionicons name='settings' size={ICON_SIZE} color={'white'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
