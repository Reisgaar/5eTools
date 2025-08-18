// REACT
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

// THEMES
import { darkTheme, lightTheme, Theme } from 'src/theme/theme';

// ZUSTAND
import { create } from 'zustand';

// TYPES
type ThemeType = 'light' | 'dark';

// INTERFACES
interface AppSettingsState {
    themeName: ThemeType;
    currentTheme: Theme;
    useAdvancedDiceRoll: boolean;
    setTheme: (theme: ThemeType) => void;
    setUseAdvancedDiceRoll: (useAdvanced: boolean) => void;
    initializeSettings: () => Promise<void>;
}

/**
 * AppSettingsStore is a Zustand store that manages the app settings.
 */
export const useAppSettingsStore = create<AppSettingsState>((set, get) => ({
    themeName: 'light',
    currentTheme: lightTheme,
    useAdvancedDiceRoll: true,

    setTheme: (newTheme: ThemeType) => {
        const currentTheme = newTheme === 'dark' ? darkTheme : lightTheme;
        set({ themeName: newTheme, currentTheme });
        AsyncStorage.setItem('APP_THEME', newTheme);
    },

    setUseAdvancedDiceRoll: (useAdvanced: boolean) => {
        set({ useAdvancedDiceRoll: useAdvanced });
        AsyncStorage.setItem('USE_ADVANCED_DICE_ROLL', useAdvanced.toString());
    },

    initializeSettings: async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('APP_THEME');
            let themeName: ThemeType = 'light';
            
            if (savedTheme === 'light' || savedTheme === 'dark') {
                themeName = savedTheme;
            } else {
                const systemTheme = Appearance.getColorScheme() ?? 'light';
                themeName = systemTheme;
            }

            const savedDiceRoll = await AsyncStorage.getItem('USE_ADVANCED_DICE_ROLL');
            const useAdvancedDiceRoll = savedDiceRoll !== null ? savedDiceRoll === 'true' : true;

            const currentTheme = themeName === 'dark' ? darkTheme : lightTheme;
            
            set({ themeName, currentTheme, useAdvancedDiceRoll });
        } catch (error) {
            console.error('Error initializing app settings:', error);
        }
    },
}));
