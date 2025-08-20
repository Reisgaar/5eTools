// REACT
import { useEffect } from 'react';

// EXPO
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore, usePlayerStore } from 'src/stores';

// CONTEXTS
import { CombatProvider } from 'src/context/CombatContext';
import { DataProvider } from 'src/context/DataContext';
import { ModalProvider } from 'src/context/ModalContext';

// COMPONENTS
import { ErrorBoundary, GlobalModals, Header } from 'src/components';

// Root layout for the app, providing all global providers and navigation stack.
export default function RootLayout() {
    const { initializeSettings, themeName } = useAppSettingsStore();
    const { initializeCampaigns } = useCampaignStore();
    const { loadSpellbooks } = useSpellbookStore();
    const { initializePlayers } = usePlayerStore();
    // Combat initialization is handled by CombatContext

    useEffect(() => {
        initializeSettings();
        initializeCampaigns();
        loadSpellbooks();
        initializePlayers();
        // Combat initialization is handled by CombatContext
    }, [initializeSettings, initializeCampaigns, loadSpellbooks, initializePlayers]);

    return (
        <ErrorBoundary>
            <CombatProvider>
                <DataProvider>
                    <ModalProvider>
                        <Stack
                            screenOptions={{
                                header: () => <Header />
                            }}>
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
