import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

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

interface CombatMemberProps {
  member: Combatant;
  memberIndex: number;
  isActive: boolean;
  onValueEdit: (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean) => void;
  onColorEdit: (id: string, name: string, currentColor?: string) => void;
  onStatusEdit: (id: string, name: string, currentColor?: string, currentCondition?: string) => void;
  onCreaturePress: (name: string, source: string) => void;
  onTokenPress: (tokenUrl: string | undefined, creatureName: string) => void;
  cachedTokenUrls: { [key: string]: string };
  theme: any;
}

export default function CombatMember({
  member,
  memberIndex,
  isActive,
  onValueEdit,
  onColorEdit,
  onStatusEdit,
  onCreaturePress,
  onTokenPress,
  cachedTokenUrls,
  theme
}: CombatMemberProps) {
  return (
    <View style={{ marginLeft: 16, marginBottom: 8 }}>
      {/* Member Container */}
      <View style={{
        backgroundColor: theme.card,
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: theme.border
      }}>
        {/* Member Header with Number */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{
            backgroundColor: theme.primary,
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8
          }}>
            <Text style={{ color: theme.buttonText || 'white', fontSize: 10, fontWeight: 'bold' }}>
              #{memberIndex}
            </Text>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => onValueEdit('ac', member.ac, member.id, member.name, false)}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              width: 70,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Ionicons name='shield' size={12} color={theme.buttonText || 'white'} style={{ marginRight: 2 }} />
            <Text style={{ color: theme.buttonText || 'white', fontSize: 10, fontWeight: 'bold' }}>
              {member.ac}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onValueEdit('hp', member.currentHp, member.id, member.name, false)}
            style={{
              backgroundColor: member.currentHp <= 0 ? '#f44336' : theme.primary,
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              width: 70,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Ionicons name='heart' size={12} color={theme.buttonText || 'white'} style={{ marginRight: 2 }} />
            <Text style={{ color: theme.buttonText || 'white', fontSize: 10, fontWeight: 'bold' }}>
              {member.currentHp}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onStatusEdit(member.id, member.name, member.color, member.conditions?.join(', '))}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              width: 60,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name='medical' size={16} color={theme.buttonText || 'white'} />
          </TouchableOpacity>


        </View>


      </View>

      {/* Status Conditions - Outside the container */}
      {member.conditions && member.conditions.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
          {member.conditions.map((condition, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#FF9800',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginRight: 4,
                marginBottom: 2
              }}
            >
              <Text style={{ 
                color: 'white', 
                fontSize: Platform.OS === 'web' ? 10 : 8, 
                fontWeight: 'bold' 
              }}>
                {condition}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
