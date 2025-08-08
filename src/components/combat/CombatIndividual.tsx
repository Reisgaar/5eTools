import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_CREATURE_TOKEN } from '../../constants/tokens';
import { createCombatStyles } from '../../styles/combat';
import { CombatIndividualProps } from './types';
import { loadCachedTokenUrl } from './utils';

export default function CombatIndividual({
  combatant,
  isActive,
  canGroup,
  onToggleGroup,
  onValueEdit,
  onStatusEdit,
  onCreaturePress,
  onTokenPress,
  cachedTokenUrls,
  theme
}: CombatIndividualProps) {
  const styles = createCombatStyles(theme);
  const [tokenUrl, setTokenUrl] = React.useState<string | undefined>(undefined);

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
    ]}>
      {/* Individual Combatant Header */}
      <View style={styles.groupHeader}>
        {/* Token */}
        <TouchableOpacity
          onPress={() => onTokenPress(tokenUrl, combatant.name)}
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
              onPress={() => onCreaturePress(combatant.name, combatant.source)}
              style={styles.groupName}
            >
              <Text style={[styles.groupNameText, { color: theme.text }]}>
                {combatant.name}
              </Text>
            </TouchableOpacity>

            {/* Show group button if grouping is possible */}
            {canGroup ? (
              <TouchableOpacity
                onPress={onToggleGroup}
                style={[styles.groupToggleButton, styles.groupToggleButtonUngrouped]}
              >
                <Text style={styles.groupToggleText}>
                  Group
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Initiative and Passive Perception */}
          <View style={styles.groupButtonsRow}>
            <TouchableOpacity
              onPress={() => onValueEdit('initiative', combatant.initiative, combatant.id, combatant.name, false)}
              style={styles.groupButton}
            >
              <Ionicons name='walk' size={10} color={theme.buttonText || 'white'} style={styles.groupButtonIcon} />
              <Text style={styles.groupButtonText}>
                {combatant.initiative}
              </Text>
            </TouchableOpacity>
            
            {combatant.passivePerception ? (
              <TouchableOpacity style={styles.groupButton}>
                <Ionicons name='eye' size={10} color={theme.buttonText || 'white'} style={styles.groupButtonIcon} />
                <Text style={styles.groupButtonText}>
                  {combatant.passivePerception}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Individual Combatant Details */}
      <View style={styles.member}>
        <View style={styles.memberContainer}>
          <Text style={styles.memberNumber}>#1</Text>
          <View style={[
            styles.memberBox,
            combatant.color && { backgroundColor: combatant.color }
          ]}>
            {/* Notes - Above buttons */}
            {combatant.note ? (
              <View style={styles.memberNotes}>
                <Text style={[styles.memberNoteText, { color: theme.text }]}>
                  {combatant.note}
                </Text>
              </View>
            ) : null}

            {/* Action Buttons Row */}
            <View style={styles.memberButtonRow}>
              <View style={styles.memberLeftButtons}>
                <TouchableOpacity
                  onPress={() => onValueEdit('ac', combatant.ac, combatant.id, combatant.name, false)}
                  style={[styles.memberButton, styles.memberButtonPrimary]}
                >
                  <Ionicons name='shield' size={12} color={theme.buttonText || 'white'} style={styles.memberIcon} />
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
                    size={12} 
                    color={theme.buttonText || 'white'} 
                    style={styles.memberIcon} 
                  />
                  <Text style={[styles.memberButtonText, styles.memberButtonTextLight]}>
                    {combatant.currentHp}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => onStatusEdit(combatant.id, combatant.name, combatant.color, combatant.conditions?.join(', '))}
                style={[styles.memberButton, styles.memberButtonSmall, styles.memberButtonSettings]}
              >
                <Ionicons name='medical' size={12} color={theme.buttonText || 'white'} style={styles.memberIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
