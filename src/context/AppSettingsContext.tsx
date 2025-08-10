// REACT
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

// THEMES
import { darkTheme, lightTheme, Theme } from 'src/theme/theme';

type ThemeType = 'light' | 'dark';

interface AppSettings {
    themeName: ThemeType;
    currentTheme: Theme;
    setTheme: (theme: ThemeType) => void;
    useAdvancedDiceRoll: boolean;
    setUseAdvancedDiceRoll: (useAdvanced: boolean) => void;
}

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

// Provides theme and app settings context to the application.
export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<ThemeType>('light');
    const [useAdvancedDiceRoll, setUseAdvancedDiceRollState] = useState<boolean>(true);

    const currentTheme = themeName === 'dark' ? darkTheme : lightTheme;

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem('APP_THEME');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setThemeName(savedTheme);
            } else {
                const systemTheme = Appearance.getColorScheme() ?? 'light';
                setThemeName(systemTheme);
            }

            const savedDiceRoll = await AsyncStorage.getItem('USE_ADVANCED_DICE_ROLL');
            if (savedDiceRoll !== null) {
                setUseAdvancedDiceRollState(savedDiceRoll === 'true');
            }
        })();
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeName(newTheme);
        AsyncStorage.setItem('APP_THEME', newTheme);
    };

    const setUseAdvancedDiceRoll = (useAdvanced: boolean) => {
        setUseAdvancedDiceRollState(useAdvanced);
        AsyncStorage.setItem('USE_ADVANCED_DICE_ROLL', useAdvanced.toString());
    };

    return (
        <AppSettingsContext.Provider
            value={{ 
                themeName, 
                currentTheme, 
                setTheme, 
                useAdvancedDiceRoll, 
                setUseAdvancedDiceRoll 
            }}
        >
            {children}
        </AppSettingsContext.Provider>
    );
};

export function useAppSettings() {
    const context = useContext(AppSettingsContext);
    if (!context) {
        throw new Error('useAppSettings must be used within an AppSettingsProvider');
    }
    return context;
}
