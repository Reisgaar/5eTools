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
        {/* Token */}
        <TouchableOpacity
          onPress={() => onTokenPress(tokenUrl, group.name)}
          style={styles.groupToken}
        >
          <Image
            source={tokenUrl ? { uri: tokenUrl } : { uri: DEFAULT_CREATURE_TOKEN }}
            style={styles.groupTokenImage}
          />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.groupContent}>
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

          {/* Initiative and Passive Perception */}
          <View style={styles.groupButtonsRow}>
            <TouchableOpacity
              onPress={() => onValueEdit('initiative', group.initiative, '', group.name, true, 1)}
              style={styles.groupButton}
            >
              <Ionicons name='walk' size={10} color={theme.buttonText || 'white'} style={styles.groupButtonIcon} />
              <Text style={styles.groupButtonText}>
                {group.initiative}
              </Text>
            </TouchableOpacity>
            
            {group.passivePerception ? (
              <TouchableOpacity style={styles.groupButton}>
                <Ionicons name='eye' size={10} color={theme.buttonText || 'white'} style={styles.groupButtonIcon} />
                <Text style={styles.groupButtonText}>
                  {group.passivePerception}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

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
  );
}
