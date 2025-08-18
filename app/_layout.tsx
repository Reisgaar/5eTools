// EXPO
import { Stack } from 'expo-router';
import { useEffect } from 'react';

// STORES
import { useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { CampaignProvider } from 'src/context/CampaignContext';
import { CombatProvider } from 'src/context/CombatContext';
import { DataProvider } from 'src/context/DataContext';
import { ModalProvider } from 'src/context/ModalContext';
import { SpellbookProvider } from 'src/context/SpellbookContext';

// COMPONENTS
import { ErrorBoundary, GlobalModals, Header } from 'src/components';

// Root layout for the app, providing all global providers and navigation stack.
export default function RootLayout() {
    const { initializeSettings } = useAppSettingsStore();

    useEffect(() => {
        initializeSettings();
    }, [initializeSettings]);

    return (
        <ErrorBoundary>
            <CampaignProvider>
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
            </CampaignProvider>
        </ErrorBoundary>
    );
}
