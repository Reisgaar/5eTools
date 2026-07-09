// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { getCommonStyles } from 'src/styles/commonStyles';
import { Text, TouchableOpacity, View } from 'react-native';

// EXPO
import { useRouter } from 'expo-router';

// STORES
import { useAppSettingsStore } from 'src/stores';

/**
 * Screen that is shown when a page is not found.
 */
export default function NotFoundScreen() {
    const router = useRouter();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

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
        <View style={[commonStyles.jc_center, commonStyles.ai_center, { flex: 1, padding: 24, backgroundColor: currentTheme.background }]}>
            <Text style={[commonStyles.text_bold, commonStyles.mb_lg, { fontSize: 50, color: currentTheme.primary }]}>404</Text>
            <Text style={[commonStyles.text_xl, commonStyles.text_bold, commonStyles.text_primary, commonStyles.text_center, { marginBottom: 24 }]}>
                Page not found.
            </Text>
            <Text style={[commonStyles.text_xl, commonStyles.text_primary, commonStyles.text_center, { marginTop: 24, marginBottom: 40, fontStyle: 'italic', maxWidth: 250 }]}>
                {sentences[Math.floor(Math.random() * sentences.length)]}
            </Text>
            <TouchableOpacity
                onPress={() => router.replace('/home')}
                style={[commonStyles.py_md, commonStyles.br_md, { backgroundColor: currentTheme.primary, paddingHorizontal: styleConstants.padding2XL }]}
            >
                <Text style={[commonStyles.text_bold, commonStyles.text_lg, { color: 'white' }]}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
} 