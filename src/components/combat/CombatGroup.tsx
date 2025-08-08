import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { getCachedTokenUrl } from '../../utils/tokenCache';
import { DEFAULT_CREATURE_TOKEN } from '../../constants/tokens';
import CombatMember from './CombatMember';

interface Combatant {
  id: string;
  name: string;
  source: string;
  tokenUrl?: string;
  maxHp: number;
  currentHp: number;
  initiative: number;
  ac: number;
  passivePerception?: number;
  color?: string;
  conditions?: string[];
  note?: string;
}

interface CombatGroupProps {
  group: {
    name: string;
    initiative: number;
    passivePerception?: number;
    groupMembers: Combatant[];
  };
  isActive: boolean;
  isGroupEnabled: boolean;
  onToggleGroup: () => void;
  onValueEdit: (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean) => void;
  onColorEdit: (id: string, name: string, currentColor?: string) => void;
  onStatusEdit: (id: string, name: string, currentColor?: string, currentCondition?: string) => void;
  onCreaturePress: (name: string, source: string) => void;
  onTokenPress: (tokenUrl: string | undefined, creatureName: string) => void;
  cachedTokenUrls: { [key: string]: string };
  theme: any;
}

export default function CombatGroup({
  group,
  isActive,
  isGroupEnabled,
  onToggleGroup,
  onValueEdit,
  onColorEdit,
  onStatusEdit,
  onCreaturePress,
  onTokenPress,
  cachedTokenUrls,
  theme
}: CombatGroupProps) {
  const [tokenUrl, setTokenUrl] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const loadToken = async () => {
      if (group.groupMembers[0]?.tokenUrl && group.groupMembers[0]?.source && group.groupMembers[0]?.name) {
        const cachedUrl = await getCachedTokenUrl(group.groupMembers[0].source, group.groupMembers[0].name);
        setTokenUrl(cachedUrl || undefined);
      }
    };
    loadToken();
  }, [group.groupMembers[0]?.tokenUrl, group.groupMembers[0]?.source, group.groupMembers[0]?.name]);

  return (
    <View style={{
      backgroundColor: isActive ? theme.primary + '20' : theme.card,
      borderRadius: 8,
      marginBottom: 8,
      padding: 8,
      borderWidth: isActive ? 2 : 1,
      borderColor: isActive ? theme.primary : theme.border
    }}>
      {/* Group Header - Structure like DNI */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {/* Token (Photo) - Left side */}
        <TouchableOpacity
          onPress={() => onTokenPress(tokenUrl, group.name)}
          style={{ marginRight: 12 }}
        >
          <Image
            source={tokenUrl ? { uri: tokenUrl } : { uri: DEFAULT_CREATURE_TOKEN }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        </TouchableOpacity>

        {/* Content - Right side */}
        <View style={{ flex: 1 }}>
          {/* Name and Group Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <TouchableOpacity
              onPress={() => onCreaturePress(group.name, group.groupMembers[0]?.source || '')}
              style={{ flex: 1 }}
            >
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>
                {group.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onToggleGroup}
              style={{
                backgroundColor: isGroupEnabled ? '#f44336' : '#4CAF50',
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 4
              }}
            >
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {isGroupEnabled ? 'Ungroup' : 'Group'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Initiative and Passive Perception */}
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <TouchableOpacity
              onPress={() => onValueEdit('initiative', group.initiative, '', group.name, true)}
              style={{
                backgroundColor: theme.primary,
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
                marginRight: 4,
                minWidth: 36,
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Ionicons name='walk' size={10} color={theme.buttonText || 'white'} style={{ marginRight: 2 }} />
              <Text style={{ color: theme.buttonText || 'white', fontSize: 10, fontWeight: 'bold' }}>
                {group.initiative}
              </Text>
            </TouchableOpacity>
            
            {group.passivePerception && (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.primary,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  minWidth: 36,
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Ionicons name='eye' size={10} color={theme.buttonText || 'white'} style={{ marginRight: 2 }} />
                <Text style={{ color: theme.buttonText || 'white', fontSize: 10, fontWeight: 'bold' }}>
                  {group.passivePerception}
                </Text>
              </TouchableOpacity>
            )}
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
          onColorEdit={onColorEdit}
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
