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
}

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

// Provides theme and app settings context to the application.
export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<ThemeType>('dark');

    const currentTheme = themeName === 'dark' ? darkTheme : lightTheme;

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem('APP_THEME');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setThemeName(savedTheme);
            } else {
                const systemTheme = Appearance.getColorScheme() ?? 'dark';
                setThemeName(systemTheme);
            }
        })();
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeName(newTheme);
        AsyncStorage.setItem('APP_THEME', newTheme);
    };

    return (
        <AppSettingsContext.Provider
            value={{ themeName, currentTheme, setTheme }}
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
