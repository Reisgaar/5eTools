// REACT
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// CONSTANTS
import { DEFAULT_CREATURE_TOKEN } from 'src/constants/tokens';

// STYLES
import { createCombatStyles } from 'src/styles/combat';

// MODELS
import { CombatIndividualProps } from 'src/models/interfaces/combat';

// UTILS
import { loadCachedTokenUrl } from 'src/utils/combatUtils';

/**
 * CombatIndividual component.
 */
export default function CombatIndividual({
    combatant,
    isActive,
    canGroup,
    memberIndex,
    onToggleGroup,
    onValueEdit,
    onStatusEdit,
    onCreaturePress,
    onTokenPress,
    cachedTokenUrls,
    theme
}: CombatIndividualProps): JSX.Element {
    const styles = createCombatStyles(theme);
    const [tokenUrl, setTokenUrl] = React.useState<string | undefined>(undefined);
    const ICON_SIZE = 14;

    React.useEffect(() => {
        const loadToken = async () => {
            if (combatant.tokenUrl && combatant.source && combatant.name) {
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
            isActive && { backgroundColor: theme.primary + '20', borderWidth: 2, borderColor: theme.primary }
        ]}
        >
            {/* Main Container with Two Columns */}
            <View style={styles.groupHeader}>
                {/* Left Column: Token and Stats */}
                <View style={styles.leftColumn}>
                    <TouchableOpacity
                        onPress={() => onTokenPress(tokenUrl, combatant.name)}
                        style={styles.groupToken}
                    >
                        <Image
                            source={tokenUrl ? { uri: tokenUrl } : { uri: DEFAULT_CREATURE_TOKEN }}
                            style={styles.groupTokenImage}
                        />
                    </TouchableOpacity>

                    {/* Initiative and Passive Perception below token */}
                    <View style={styles.tokenButtonsRow}>
                        <TouchableOpacity
                            onPress={() => onValueEdit('initiative', combatant.initiative, combatant.id, combatant.name, false)}
                            style={styles.tokenButton}
                        >
                            <Ionicons name='flash' size={ICON_SIZE} color={theme.buttonText || 'white'} style={styles.tokenButtonIcon} />
                            <Text style={styles.tokenButtonText}>
                                {combatant.initiative}
                            </Text>
                            {combatant.initiativeBonus !== undefined && combatant.initiativeBonus !== null && (
                                <Text style={[styles.tokenButtonText, { fontSize: 10, marginLeft: 2, color: theme.buttonText || 'white' }]}>
                                    {`(${combatant.initiativeBonus >= 0 ? '+' : ''}${combatant.initiativeBonus})`}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Right Column: Name and Combatants */}
                <View style={styles.rightColumn}>
                    {/* Name and Group Toggle */}
                    <View style={styles.groupNameRow}>
                        <TouchableOpacity
                            onPress={() => onCreaturePress(combatant.name, combatant.source)}
                            style={styles.groupName}
                        >
                            <Text style={[styles.groupNameText, { color: theme.text }]}>
                                {combatant.name}
                            </Text>
                        </TouchableOpacity>

                        {/* Show group button if grouping is possible */}
                        {canGroup && (
                            <TouchableOpacity
                                onPress={onToggleGroup}
                                style={[styles.groupToggleButton, styles.groupToggleButtonUngrouped]}
                            >
                                <Text style={styles.groupToggleText}>Group</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Speed and Senses - Below name */}
                    {(combatant.speed || combatant.senses) && (
                        <View style={{ marginBottom: 4 }}>
                            {combatant.speed && (
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, fontWeight: 'bold' }]}>
                                            Speed:
                                        </Text>
                                    </View>
                                    <View style={{ marginLeft: 4 }}>
                                        <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8 }]}>
                                            {combatant.speed}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {combatant.senses && (
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, fontWeight: 'bold' }]}>
                                            Senses:
                                        </Text>
                                    </View>
                                    <View style={{ marginLeft: 4 }}>
                                        <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8 }]}>
                                            {combatant.senses}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Individual Combatant Details */}
                    <View style={styles.member}>
                        <View style={styles.memberContainer}>
                            <Text style={styles.memberNumber}>{`#${memberIndex || 1}`}</Text>
                            <View
                                style={[
                                    styles.memberBox,
                                    combatant.color && { backgroundColor: combatant.color }
                                ]}
                            >
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
                                                        <Text style={[
                                                            styles.statusBadgeText,
                                                            Platform.OS === 'web' ? styles.statusBadgeTextWeb : styles.statusBadgeTextMobile
                                                        ]}>
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
                                            <Ionicons name='shield' size={ICON_SIZE} color={theme.buttonText || 'white'} style={styles.memberIcon} />
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
                                        <Ionicons name='medical' size={ICON_SIZE} color={theme.buttonText || 'white'} style={styles.memberIcon} />
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
