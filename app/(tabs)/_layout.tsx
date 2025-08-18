// REACT
import React, { useMemo } from 'react';

// EXPO
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { SafeAreaView } from 'react-native-safe-area-context';
// No longer import modal overlays or ModalProvider here

// Layout for the main tab navigation of the app, providing themed tab bar and screen structure.
export default function TabsLayout() {
    const { currentTheme } = useAppSettingsStore();

    const screens = useMemo(() => [
        { name: 'index', title: 'Home', icon: 'home' },
        { name: 'bestiary', title: 'Bestiary', icon: 'paw' },
        { name: 'spells', title: 'Spells', icon: 'book' },
        { name: 'combat', title: 'Combat', icon: 'skull' },
        { name: 'settings', title: 'Settings', icon: 'settings' },
    ], []);

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: currentTheme.tabBackground }}>
            <Tabs
                initialRouteName="index"
                screenOptions={({ route }) => {
                    const screen = screens.find(s => s.name === route.name);
                    return {
                        headerShown: false,
                        tabBarActiveTintColor: '#5e60ce',
                        tabBarInactiveTintColor: '#888',
                        tabBarStyle: {
                            paddingBottom: 0,
                            height: 60,
                            elevation: 0, // Android
                            shadowOpacity: 0, // iOS
                            backgroundColor: currentTheme.tabBackground,
                            borderTopWidth: 1,
                            borderColor: currentTheme.tabBorder
                        },
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name={(screen?.icon || 'ellipse') as keyof typeof Ionicons.glyphMap}
                                size={size}
                                color={color}
                            />
                        ),
                        tabBarLabel: screen?.title,
                    };
                }}
            >
                {screens.map(({ name }) => (
                    <Tabs.Screen key={name} name={name} />
                ))}
            </Tabs>
          </SafeAreaView>
    );
}
