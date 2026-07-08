// REACT
import { useEffect } from 'react';

// EXPO
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore, usePlayerStore, useLibraryStore } from 'src/stores';

// CONTEXTS
import { CombatProvider } from 'src/context/CombatContext';
import { DataProvider } from 'src/context/DataContext';
import { ModalProvider } from 'src/context/ModalContext';

// COMPONENTS
import { ErrorBoundary, GlobalModals } from 'src/components';

// Root layout for the app, providing all global providers and navigation stack.
export default function RootLayout() {
    const { initializeSettings, themeName } = useAppSettingsStore();
    const { initializeCampaigns } = useCampaignStore();
    const { loadSpellbooks } = useSpellbookStore();
    const { initializePlayers } = usePlayerStore();
    const { init: initLibrary } = useLibraryStore();
    // Combat initialization is handled by CombatContext

    useEffect(() => {
        initializeSettings();
        initializeCampaigns();
        loadSpellbooks();
        initializePlayers();
        initLibrary();
        // Combat initialization is handled by CombatContext
    }, [initializeSettings, initializeCampaigns, loadSpellbooks, initializePlayers, initLibrary]);

    return (
        <ErrorBoundary>
            <CombatProvider>
                <DataProvider>
                    <ModalProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                        <GlobalModals />
                        <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
                    </ModalProvider>
                </DataProvider>
            </CombatProvider>
        </ErrorBoundary>
    );
}
