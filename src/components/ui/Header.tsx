// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { getCommonStyles } from 'src/styles/commonStyles';
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
    const commonStyles = getCommonStyles(currentTheme);

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
            <SafeAreaView style={[commonStyles.row_between_center, commonStyles.px_sm, commonStyles.py_xs, commonStyles.bwb_sm, {
                backgroundColor: currentTheme.headerBackground,
                borderBottomColor: currentTheme.text,
            }]} edges={['top']}>
                <View style={[commonStyles.row_start_center, commonStyles.gap_sm]}>
                    {back && navigation ? (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.pr_2xs} accessibilityLabel="Go back">
                            <Ionicons name="chevron-back" size={26} color={currentTheme.text} />
                        </TouchableOpacity>
                    ) : (
                        <Image
                            source={ themeName === 'light' ?
                                require('../../../assets/images/logo_bb_lg.png')
                                : require('../../../assets/images/logo_wbu_lg.png')
                            }
                            style={[styles.logo, commonStyles.br_sm, { height: 30, width: 30 }]} />
                    )}
                    <Text style={[commonStyles.text_xl, commonStyles.text_bold, commonStyles.text_primary]}>{getTitle()}</Text>
                </View>

                <TouchableOpacity onPress={handleCampaignPress} style={[styles.filterBtn, { borderColor: currentTheme.text }]}>
                    <Text style={[styles.filterBtnText, commonStyles.text_primary]}>
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
        paddingHorizontal: styleConstants.paddingSM,
        padding: styleConstants.padding2XS,
        borderColor: '#ccc',
    },
    title: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
    },
    logo: {
        resizeMode: 'contain',
    },
    filterBtn: {
        borderWidth: styleConstants.borderSM,
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBtnText: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeSM,
    },
});
