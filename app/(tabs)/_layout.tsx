// REACT
import React, { useMemo } from 'react';
import { styleConstants } from 'src/styles/style-constants';

// EXPO
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCombat } from 'src/context/CombatContext';

// HOOKS
import { TAB_BAR_HEIGHT } from 'src/hooks/useTabBarInset';

// Layout for the main tab navigation of the app, providing themed tab bar and screen structure.
export default function TabsLayout() {
    const { currentTheme } = useAppSettingsStore();
    const insets = useSafeAreaInsets();
    const bottomGap = Math.max(insets.bottom, styleConstants.marginSM);
    // Hide the tab bar while inside an open combat, to give the tracker maximum room.
    const { currentCombatId } = useCombat();

    const screens = useMemo(() => [
        { name: 'home', title: 'Home', icon: 'home' },
        { name: 'compendium', title: 'Compendium', icon: 'library' },
        { name: 'dice', title: 'Dice', icon: 'dice' },
        { name: 'combat', title: 'Combat', icon: 'skull' },
        { name: 'settings', title: 'Settings', icon: 'settings' },
    ], []);

    return (
        <Tabs
            initialRouteName="home"
            screenOptions={({ route }) => {
                const screen = screens.find(s => s.name === route.name);
                const hideBar = route.name === 'combat' && !!currentCombatId;
                return {
                    headerShown: false,
                    tabBarActiveTintColor: currentTheme.tabActive,
                    tabBarInactiveTintColor: currentTheme.tabInactive,
                    // Floating pill tab bar: absolutely positioned so screen content fills the
                    // full height and flows underneath it (screens pad their scroll content via
                    // useTabBarInset so nothing is hidden). Hidden entirely inside an open combat.
                    tabBarStyle: hideBar ? { display: 'none' } : {
                        position: 'absolute',
                        bottom: bottomGap,
                        height: TAB_BAR_HEIGHT,
                        marginHorizontal: styleConstants.marginSM,
                        paddingVertical: styleConstants.paddingSM,
                        borderRadius: styleConstants.borderRadiusCircle,
                        borderWidth: 1,
                        borderTopWidth: 1,
                        borderColor: currentTheme.primary,
                        backgroundColor: currentTheme.tabBackground,
                        elevation: 4, // Android
                        shadowColor: '#000', // iOS
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 }
                    },
                    tabBarItemStyle: { paddingHorizontal: 0 },
                    tabBarLabelStyle: { fontSize: styleConstants.fontSizeXS, lineHeight: 14, letterSpacing: -0.2, fontWeight: '600' },
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
    );
}
