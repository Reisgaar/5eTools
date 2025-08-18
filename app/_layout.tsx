// EXPO
import { Stack } from 'expo-router';
import { useEffect } from 'react';

// STORES
import { useAppSettingsStore, useCampaignStore } from 'src/stores';

// CONTEXTS
import { CombatProvider } from 'src/context/CombatContext';
import { DataProvider } from 'src/context/DataContext';
import { ModalProvider } from 'src/context/ModalContext';
import { SpellbookProvider } from 'src/context/SpellbookContext';

// COMPONENTS
import { ErrorBoundary, GlobalModals, Header } from 'src/components';

// Root layout for the app, providing all global providers and navigation stack.
export default function RootLayout() {
    const { initializeSettings } = useAppSettingsStore();
    const { initializeCampaigns } = useCampaignStore();

    useEffect(() => {
        initializeSettings();
        initializeCampaigns();
    }, [initializeSettings, initializeCampaigns]);

    return (
        <ErrorBoundary>
            <CombatProvider>
                <DataProvider>
                    <SpellbookProvider>
                        <ModalProvider>
                            <Stack
                                screenOptions={{
                                    header: () => <Header />
                                }}>
                                <Stack.Screen name="(tabs)" />
                            </Stack>
                            <GlobalModals />
                        </ModalProvider>
                    </SpellbookProvider>
                </DataProvider>
            </CombatProvider>
        </ErrorBoundary>
    );
}
