import React from 'react';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../ui';

interface Player {
  name: string;
  race: string;
  class: string;
}

interface PlayerModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPlayers: () => void;
  allPlayers: Player[];
  selectedPlayers: string[];
  onPlayerToggle: (playerName: string) => void;
  theme: any;
}

export default function PlayerModal({
  visible,
  onClose,
  onAddPlayers,
  allPlayers,
  selectedPlayers,
  onPlayerToggle,
  theme
}: PlayerModalProps) {
  return (
    <BaseModal visible={visible} onClose={onClose} theme={theme} title="Add Players to Combat">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            
            <FlatList
              data={allPlayers}
              keyExtractor={item => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.name}
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                  onPress={() => onPlayerToggle(item.name)}
                >
                  <Ionicons
                    name={selectedPlayers.includes(item.name) ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={theme.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: theme.text, fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ color: theme.text, marginLeft: 8, fontSize: 12 }}>
                    {item.race} - {item.class}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: theme.noticeText, textAlign: 'center' }}>
                  No players found.
                </Text>
              }
            />
            
            <TouchableOpacity 
              onPress={onAddPlayers} 
              style={{ 
                backgroundColor: theme.primary, 
                borderRadius: 8, 
                padding: 12,
                alignItems: 'center',
                marginTop: 16
              }}
            > 
              <Text style={{ color: theme.buttonText || 'white', textAlign: 'center', fontWeight: 'bold' }}>Add</Text>
            </TouchableOpacity>
          </ScrollView>
    </BaseModal>
  );
}
