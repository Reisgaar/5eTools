// EXPO
import { Stack } from 'expo-router';

// CONTEXTS
import { AppSettingsProvider } from 'src/context/AppSettingsContext';
import { CombatProvider } from 'src/context/CombatContext';
import { DataProvider } from 'src/context/DataContext';
import { ModalProvider } from 'src/context/ModalContext';
import { SpellbookProvider } from 'src/context/SpellbookContext';

// COMPONENTS
import { ErrorBoundary, GlobalModals, Header } from 'src/components';

// Root layout for the app, providing all global providers and navigation stack.
export default function RootLayout() {
    return (
        <ErrorBoundary>
            <CombatProvider>
                <AppSettingsProvider>
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
                </AppSettingsProvider>
            </CombatProvider>
        </ErrorBoundary>
    );
}
