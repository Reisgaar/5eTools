// EXPO
import { Stack } from 'expo-router';

// CONTEXTS
import { AppSettingsProvider } from 'src/context/AppSettingsContext';
import { CombatProvider } from 'src/context/CombatContext';
import { DataProvider } from 'src/context/DataContext';
import { ModalProvider } from 'src/context/ModalContext';

// COMPONENTS
import ErrorBoundary from 'src/components/ErrorBoundary';
import GlobalModals from 'src/components/GlobalModals';
import Header from 'src/components/Header';

// Root layout for the app, providing all global providers and navigation stack.
export default function RootLayout() {
    return (
        <ErrorBoundary>
            <CombatProvider>
                <AppSettingsProvider>
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
                </AppSettingsProvider>
            </CombatProvider>
        </ErrorBoundary>
    );
}
