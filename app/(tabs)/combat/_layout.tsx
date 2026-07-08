import { Stack } from 'expo-router';

import { Header } from 'src/components';

export default function CombatStackLayout() {
    return (
        <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
            <Stack.Screen name="index" options={{ title: 'Combat Manager' }} />
        </Stack>
    );
}
