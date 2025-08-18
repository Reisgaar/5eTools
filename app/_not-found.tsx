// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

/**
 * Screen that is shown when a page is not found.
 */
export default function NotFoundScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();

    const sentences = [
        'You have entered the fog of war. This page does not exist!',
        'You cast \'Find Page\'… but nothing happens.',
        'The Dungeon Master says: \'That page isn\'t in your campaign.',
        'You rolled a natural 1 on your navigation check.',
        'This page failed its saving throw against \'Oblivion\'.',
        'You open the door… but it\'s just a brick wall. 404!',
        'You search for the page, but only find a mimic!',
        'The page you seek is hidden by a powerful illusion.',
        'You step into a portal… and land on a 404.',
        'Your quest log does not contain this page.',
        'The gods have not prepared this spell page yet.',
        'You find a blank scroll. Looks like this page is missing!',
        'You trigger a trap! It\'s a 404.',
    ];

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: currentTheme.background }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold', marginBottom: 16, color: currentTheme.primary }}>404</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 24, color: currentTheme.text, textAlign: 'center' }}>
                Page not found.
            </Text>
            <Text style={{ fontSize: 18, marginTop: 24, marginBottom: 40, color: currentTheme.text, textAlign: 'center', fontStyle: 'italic', maxWidth: 250 }}>
                {sentences[Math.floor(Math.random() * sentences.length)]}
            </Text>
            <TouchableOpacity
                onPress={() => router.replace('/')}
                style={{ backgroundColor: currentTheme.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
} 