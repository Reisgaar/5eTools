// REACT
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { Ionicons } from '@expo/vector-icons';

// CONSTANTS
import { DEFAULT_CREATURE_TOKEN } from 'src/constants/tokens';

// STYLES
import { createCombatStyles } from 'src/styles/combat';
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import CombatMember from 'src/components/combat/CombatMember';

// MODELS
import { CombatGroupProps } from 'src/models/interfaces/combat';

// UTILS
import { loadCachedTokenUrl } from 'src/utils/combatUtils';

/**
 * CombatGroup component.
 */
export default function CombatGroup({
    group,
    isActive,
    isGroupEnabled,
    onToggleGroup,
    onValueEdit,
    onStatusEdit,
    onCreaturePress,
    onTokenPress,
    cachedTokenUrls,
    theme
}: CombatGroupProps): React.JSX.Element {
    const styles = createCombatStyles(theme);
    const commonStyles = getCommonStyles(theme);
    const [tokenUrl, setTokenUrl] = React.useState<string | undefined>(undefined);
    const ICON_SIZE = 14;

    React.useEffect(() => {
        const loadToken = async () => {
            if (group.groupMembers[0]?.tokenUrl && group.groupMembers[0]?.source && group.groupMembers[0]?.name) {
                const cachedUrl = await loadCachedTokenUrl(
                    group.groupMembers[0].tokenUrl,
                    group.groupMembers[0].source,
                    group.groupMembers[0].name
                );
                setTokenUrl(cachedUrl || undefined);
            }
        };
        loadToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group.groupMembers[0]?.tokenUrl, group.groupMembers[0]?.source, group.groupMembers[0]?.name]);

    return (
        <View style={[
            styles.groupContainer,
            isActive && [commonStyles.bw_sm, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]
        ]}>
            {/* Group Header */}
            <View style={styles.groupHeader}>
                {/* Left Column: Token and Stats */}
                <View style={styles.leftColumn}>
                    <TouchableOpacity
                        onPress={() => onTokenPress(tokenUrl, group.name)}
                        style={styles.groupToken}
                    >
                        <Image
                            source={tokenUrl ? { uri: tokenUrl } : { uri: DEFAULT_CREATURE_TOKEN }}
                            style={styles.groupTokenImage}
                        />
                    </TouchableOpacity>

                    {/* Initiative */}
                    <View style={styles.tokenButtonsRow}>
                        <TouchableOpacity
                            onPress={() => onValueEdit('initiative', group.initiative, '', group.name, true, 1)}
                            style={styles.tokenButton}
                        >
                            <Ionicons name='flash' size={ICON_SIZE} color={'white'} style={styles.tokenButtonIcon} />
                            <Text style={styles.tokenButtonText}>
                                {group.initiative}
                            </Text>
                            {group.initiativeBonus !== undefined && group.initiativeBonus !== null && (
                                <Text style={[styles.tokenButtonText, commonStyles.text_xs, commonStyles.ml_2xs, { color: 'white' }]}>
                                    {`(${group.initiativeBonus >= 0 ? '+' : ''}${group.initiativeBonus})`}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Right Column: Name and Combatants */}
                <View style={styles.rightColumn}>
                    {/* Name and Group Toggle */}
                    <View style={[styles.groupNameRow, { marginBottom: 0 }]}>
                        <TouchableOpacity
                            onPress={() => onCreaturePress(group.name, group.source)}
                            style={styles.groupName}
                        >
                            <Text style={[styles.groupNameText, commonStyles.text_primary]}>
                                {group.name}
                            </Text>
                        </TouchableOpacity>

                        {/* Only show group button if there are multiple members */}
                        {group.showGroupButton && (
                            <TouchableOpacity
                                onPress={onToggleGroup}
                                style={[
                                    styles.groupToggleButton,
                                    isGroupEnabled ? styles.groupToggleButtonGrouped : styles.groupToggleButtonUngrouped
                                ]}
                            >
                                <Text style={styles.groupToggleText}>
                                    {isGroupEnabled ? 'Ungroup' : 'Group'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Speed and Senses - Below name */}
                    {(group.speed || group.senses) && (
                        <View style={commonStyles.mb_sm}>
                            {group.speed && (
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Text style={[styles.groupNameText, commonStyles.text_primary, commonStyles.text_xs, commonStyles.text_bold, { opacity: 0.8 }]}>
                                            Speed:
                                        </Text>
                                    </View>
                                    <View style={commonStyles.ml_xs}>
                                        <Text style={[styles.groupNameText, commonStyles.text_primary, commonStyles.text_xs, { opacity: 0.8 }]}>
                                            {group.speed}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {group.senses && (
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Text style={[styles.groupNameText, commonStyles.text_primary, commonStyles.text_xs, commonStyles.text_bold, { opacity: 0.8 }]}>
                                            Senses:
                                        </Text>
                                    </View>
                                    <View style={commonStyles.ml_xs}>
                                        <Text style={[styles.groupNameText, commonStyles.text_primary, commonStyles.text_xs, { opacity: 0.8 }]}>
                                            {group.senses}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Group Members */}
                    {group.groupMembers.map((member, index) => (
                        <CombatMember
                            key={member.id}
                            member={member}
                            memberIndex={index + 1}
                            isActive={isActive}
                            onValueEdit={onValueEdit}
                            onStatusEdit={onStatusEdit}
                            onCreaturePress={onCreaturePress}
                            onTokenPress={onTokenPress}
                            cachedTokenUrls={cachedTokenUrls}
                            theme={theme}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}
