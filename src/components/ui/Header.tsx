// REACT
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// EXPO
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

// STORES
import { useCampaignStore, useAppSettingsStore } from 'src/stores';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// Props are the standard React Navigation native-stack header props (all optional so the
// component still works if rendered without a navigator). `back` is set by the navigator when
// there is a screen to pop; `options.title` provides the screen title.
interface HeaderProps {
    navigation?: { goBack: () => void };
    options?: { title?: string };
    back?: { title?: string };
}

/**
 * Header component. Rendered as the native-stack header for each tab's stack: shows the logo,
 * the current screen title, an optional back button (on pushed screens), and the campaign
 * selector.
 */
export default function Header({ navigation, options, back }: HeaderProps = {}) {
    const { selectedCampaign, selectedCampaignId } = useCampaignStore();
    const { currentTheme, themeName } = useAppSettingsStore();
    const { openCampaignSelectorModal } = useModal();
    const path = usePathname();

    const handleCampaignPress = () => {
        openCampaignSelectorModal();
    };

    // Prefer the explicit screen title from stack options; fall back to the pathname.
    const getTitle = () => {
        if (options?.title) return options.title;
        const seg = path.substring(path.lastIndexOf('/') + 1);
        if (!seg) return 'Home';
        if (seg.toLowerCase() === 'combat') return 'Combat Manager';
        return seg.charAt(0).toUpperCase() + seg.slice(1);
    };

    return (
        <>
            <SafeAreaView style={{
                backgroundColor: currentTheme.headerBackground,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderBottomWidth: 2,
                borderBottomColor: currentTheme.text,
            }} edges={['top']}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                    {back && navigation ? (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 2 }} accessibilityLabel="Go back">
                            <Ionicons name="chevron-back" size={26} color={currentTheme.text} />
                        </TouchableOpacity>
                    ) : (
                        <Image
                            source={ themeName === 'light' ?
                                require('../../../assets/images/logo_bb_lg.png')
                                : require('../../../assets/images/logo_wbu_lg.png')
                            }
                            style={[styles.logo, { height: 30, width: 30, borderRadius: 6 }]} />
                    )}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: currentTheme.text }}>{getTitle()}</Text>
                </View>

                <TouchableOpacity onPress={handleCampaignPress} style={[styles.filterBtn, { borderColor: currentTheme.text }]}>
                    <Text style={[styles.filterBtnText, { color: currentTheme.text }]}>
                        {selectedCampaignId && selectedCampaign ? selectedCampaign.name : 'All Campaigns'}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        padding: 2,
        borderColor: '#ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        resizeMode: 'contain',
    },
    filterBtn: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBtnText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
});
