import { Stack } from 'expo-router';

import { Header } from 'src/components';

export default function DiceStackLayout() {
    return (
        <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
            <Stack.Screen name="index" options={{ title: 'Dice Roller' }} />
        </Stack>
    );
}
