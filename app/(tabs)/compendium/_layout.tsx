import { Stack } from 'expo-router';

import { Header } from 'src/components';

export default function CompendiumStackLayout() {
    return (
        <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
            <Stack.Screen name="index" options={{ title: 'Compendium' }} />
            <Stack.Screen name="bestiary" options={{ title: 'Bestiary' }} />
            <Stack.Screen name="spells" options={{ title: 'Spells' }} />
            <Stack.Screen name="conditions" options={{ title: 'Conditions & Diseases' }} />
            <Stack.Screen name="rules-glossary" options={{ title: 'Rules Glossary' }} />
            <Stack.Screen name="actions" options={{ title: 'Actions' }} />
            <Stack.Screen name="feats" options={{ title: 'Feats' }} />
            <Stack.Screen name="backgrounds" options={{ title: 'Backgrounds' }} />
            <Stack.Screen name="items" options={{ title: 'Items' }} />
            <Stack.Screen name="races" options={{ title: 'Races' }} />
            <Stack.Screen name="classes" options={{ title: 'Classes' }} />
            <Stack.Screen name="optional-features" options={{ title: 'Optional Features' }} />
            <Stack.Screen name="char-options" options={{ title: 'Character Options' }} />
            <Stack.Screen name="senses" options={{ title: 'Senses' }} />
            <Stack.Screen name="skills" options={{ title: 'Skills' }} />
            <Stack.Screen name="psionics" options={{ title: 'Psionics' }} />
            <Stack.Screen name="vehicles" options={{ title: 'Vehicles' }} />
            <Stack.Screen name="deities" options={{ title: 'Deities' }} />
            <Stack.Screen name="cults-boons" options={{ title: 'Cults & Boons' }} />
            <Stack.Screen name="rewards" options={{ title: 'Rewards' }} />
            <Stack.Screen name="traps-hazards" options={{ title: 'Traps & Hazards' }} />
            <Stack.Screen name="languages" options={{ title: 'Languages' }} />
            <Stack.Screen name="bastions" options={{ title: 'Bastions' }} />
            <Stack.Screen name="objects" options={{ title: 'Objects' }} />
        </Stack>
    );
}
