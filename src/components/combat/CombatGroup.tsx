import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_CREATURE_TOKEN } from '../../constants/tokens';
import { createCombatStyles } from '../../styles/combat';
import CombatMember from './CombatMember';
import { CombatGroupProps } from './types';
import { loadCachedTokenUrl } from './utils';

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
}: CombatGroupProps) {
  const styles = createCombatStyles(theme);
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
  }, [group.groupMembers[0]?.tokenUrl, group.groupMembers[0]?.source, group.groupMembers[0]?.name]);

  return (
    <View style={[
      styles.groupContainer,
      isActive && { backgroundColor: theme.primary + '20', borderWidth: 2, borderColor: theme.primary }
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

          {/* Initiative and Passive Perception below token */}
          <View style={styles.tokenButtonsRow}>
            <TouchableOpacity
              onPress={() => onValueEdit('initiative', group.initiative, '', group.name, true, 1)}
              style={styles.tokenButton}
            >
              <Ionicons name='flash' size={ICON_SIZE} color={theme.buttonText || 'white'} style={styles.tokenButtonIcon} />
              <Text style={styles.tokenButtonText}>
                {group.initiative}
              </Text>
              {group.initiativeBonus !== undefined && group.initiativeBonus !== null && (
                <Text style={[styles.tokenButtonText, { fontSize: 10, marginLeft: 2, color: theme.buttonText || 'white' }]}>
                  ({group.initiativeBonus >= 0 ? '+' : ''}{group.initiativeBonus})
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
              onPress={() => onCreaturePress(group.name, group.source)}
              style={styles.groupName}
            >
              <Text style={[styles.groupNameText, { color: theme.text }]}>
                {group.name}
              </Text>
            </TouchableOpacity>

            {/* Only show group button if there are multiple members */}
            {group.showGroupButton ? (
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
            ) : null}
          </View>

          {/* Speed and Senses - Below name */}
          {(group.speed || group.senses) && (
            <View style={{ marginBottom: 4 }}>
              {group.speed && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, fontWeight: 'bold' }]}>
                    Speed:
                  </Text>
                  <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, marginLeft: 4 }]}>
                    {group.speed}
                  </Text>
                </View>
              )}
              {group.senses && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, fontWeight: 'bold' }]}>
                    Senses:
                  </Text>
                  <Text style={[styles.groupNameText, { color: theme.text, fontSize: 10, opacity: 0.8, marginLeft: 4 }]}>
                    {group.senses}
                  </Text>
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
