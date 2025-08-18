// EXPO
import { Stack } from 'expo-router';
import { useEffect } from 'react';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// CONTEXTS
import { CombatProvider } from 'src/context/CombatContext';
import { DataProvider } from 'src/context/DataContext';
import { ModalProvider } from 'src/context/ModalContext';

// COMPONENTS
import { ErrorBoundary, GlobalModals, Header } from 'src/components';

// Root layout for the app, providing all global providers and navigation stack.
export default function RootLayout() {
    const { initializeSettings } = useAppSettingsStore();
    const { initializeCampaigns } = useCampaignStore();
    const { loadSpellbooks } = useSpellbookStore();

    useEffect(() => {
        initializeSettings();
        initializeCampaigns();
        loadSpellbooks();
    }, [initializeSettings, initializeCampaigns, loadSpellbooks]);

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
                    </ModalProvider>
                </DataProvider>
            </CombatProvider>
        </ErrorBoundary>
    );
}
