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
        </Stack>
    );
}
