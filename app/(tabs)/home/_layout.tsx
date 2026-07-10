import { Stack } from 'expo-router';

import { Header } from 'src/components';

export default function HomeStackLayout() {
    return (
        <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="campaigns" options={{ title: 'Campaigns' }} />
            <Stack.Screen name="characters" options={{ title: 'Characters' }} />
            <Stack.Screen name="character" options={{ title: 'Character Sheet' }} />
            <Stack.Screen name="spellbooks" options={{ title: 'Spellbooks' }} />
            <Stack.Screen name="library" options={{ title: 'Library' }} />
            <Stack.Screen name="reader" options={{ title: 'Reader' }} />
        </Stack>
    );
}
