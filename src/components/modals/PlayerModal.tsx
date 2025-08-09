import React from 'react';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../ui';
import { DEFAULT_PLAYER_TOKEN } from '../../constants/tokens';

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
                  <Image
                    source={{ uri: item.tokenUrl || DEFAULT_PLAYER_TOKEN }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      marginRight: 8,
                      borderWidth: 2,
                      borderColor: '#22c55a'
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: 'bold' }}>{item.name}</Text>
                    <Text style={{ color: theme.text, fontSize: 12 }}>
                      {item.race} - {item.class}
                    </Text>
                  </View>
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
