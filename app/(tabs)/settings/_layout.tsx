import { Stack } from 'expo-router';

import { Header } from 'src/components';

export default function SettingsStackLayout() {
    return (
        <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
            <Stack.Screen name="index" options={{ title: 'Settings' }} />
        </Stack>
    );
}
