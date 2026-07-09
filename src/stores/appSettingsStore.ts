// REACT
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

// THEMES
import { darkTheme, lightTheme, Theme } from 'src/theme/theme';

// ZUSTAND
import { create } from 'zustand';

// TYPES
type ThemeMode = 'auto' | 'light' | 'dark';
type ThemeType = 'light' | 'dark';
type Edition = '2014' | '2024' | 'both';

const THEME_MODE_KEY = 'APP_THEME_MODE';
const LEGACY_THEME_KEY = 'APP_THEME';
const EDITION_KEY = 'PREFERRED_EDITION';
const IGNORED_SOURCES_KEY = 'IGNORED_SOURCES';

// Resolve the concrete light/dark theme from a mode (auto follows the OS color scheme).
const resolveThemeName = (mode: ThemeMode): ThemeType =>
    mode === 'auto' ? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light') : mode;

// INTERFACES
interface AppSettingsState {
    themeMode: ThemeMode;      // user preference: auto | light | dark
    themeName: ThemeType;      // resolved concrete theme (what components read)
    currentTheme: Theme;
    useAdvancedDiceRoll: boolean;
    preferredEdition: Edition;         // which edition wins when a name exists in both cores
    ignoredSources: string[];          // normalized source codes hidden from all lists
    setThemeMode: (mode: ThemeMode) => void;
    setUseAdvancedDiceRoll: (useAdvanced: boolean) => void;
    setPreferredEdition: (edition: Edition) => void;
    toggleIgnoredSource: (source: string) => void;
    initializeSettings: () => Promise<void>;
}

/**
 * AppSettingsStore is a Zustand store that manages the app settings.
 */
export const useAppSettingsStore = create<AppSettingsState>((set, get) => ({
    themeMode: 'auto',
    themeName: resolveThemeName('auto'),
    currentTheme: resolveThemeName('auto') === 'dark' ? darkTheme : lightTheme,
    useAdvancedDiceRoll: true,
    preferredEdition: '2024',
    ignoredSources: [],

    setThemeMode: (mode: ThemeMode) => {
        const themeName = resolveThemeName(mode);
        set({ themeMode: mode, themeName, currentTheme: themeName === 'dark' ? darkTheme : lightTheme });
        AsyncStorage.setItem(THEME_MODE_KEY, mode);
    },

    setUseAdvancedDiceRoll: (useAdvanced: boolean) => {
        set({ useAdvancedDiceRoll: useAdvanced });
        AsyncStorage.setItem('USE_ADVANCED_DICE_ROLL', useAdvanced.toString());
    },

    setPreferredEdition: (edition: Edition) => {
        set({ preferredEdition: edition });
        AsyncStorage.setItem(EDITION_KEY, edition);
    },

    toggleIgnoredSource: (source: string) => {
        const src = source.trim().toLowerCase();
        const next = get().ignoredSources.includes(src)
            ? get().ignoredSources.filter(s => s !== src)
            : [...get().ignoredSources, src];
        set({ ignoredSources: next });
        AsyncStorage.setItem(IGNORED_SOURCES_KEY, JSON.stringify(next));
    },

    initializeSettings: async () => {
        try {
            const savedMode = await AsyncStorage.getItem(THEME_MODE_KEY);
            let themeMode: ThemeMode = 'auto';
            if (savedMode === 'auto' || savedMode === 'light' || savedMode === 'dark') {
                themeMode = savedMode;
            } else {
                // Migrate the legacy explicit light/dark preference if present.
                const legacy = await AsyncStorage.getItem(LEGACY_THEME_KEY);
                if (legacy === 'light' || legacy === 'dark') themeMode = legacy;
            }

            const savedDiceRoll = await AsyncStorage.getItem('USE_ADVANCED_DICE_ROLL');
            const useAdvancedDiceRoll = savedDiceRoll !== null ? savedDiceRoll === 'true' : true;

            const savedEdition = await AsyncStorage.getItem(EDITION_KEY);
            const preferredEdition: Edition =
                savedEdition === '2014' || savedEdition === '2024' || savedEdition === 'both' ? savedEdition : '2024';

            let ignoredSources: string[] = [];
            try {
                const savedIgnored = await AsyncStorage.getItem(IGNORED_SOURCES_KEY);
                if (savedIgnored) ignoredSources = JSON.parse(savedIgnored);
            } catch { ignoredSources = []; }

            const themeName = resolveThemeName(themeMode);
            set({ themeMode, themeName, currentTheme: themeName === 'dark' ? darkTheme : lightTheme, useAdvancedDiceRoll, preferredEdition, ignoredSources });

            // Keep 'auto' in sync with live OS theme changes.
            Appearance.addChangeListener(({ colorScheme }) => {
                if (get().themeMode !== 'auto') return;
                const tn: ThemeType = colorScheme === 'dark' ? 'dark' : 'light';
                set({ themeName: tn, currentTheme: tn === 'dark' ? darkTheme : lightTheme });
            });
        } catch (error) {
            console.error('Error initializing app settings:', error);
        }
    },
}));
