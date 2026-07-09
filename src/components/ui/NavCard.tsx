// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// INTERFACES
interface NavCardProps {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    iconColor?: string;   // defaults to the theme primary
}

/**
 * A tappable navigation card with a leading circular icon, title + subtitle, and a trailing
 * chevron. Shared by the Home dashboard and the Compendium hub.
 */
export default function NavCard({ title, subtitle, icon, onPress, iconColor }: NavCardProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
            activeOpacity={0.7}
        >
            <View style={[styles.cardIcon, { backgroundColor: iconColor || currentTheme.primary }]}>
                <Ionicons name={icon} size={22} color="white" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text_lg, { fontWeight: '600', color: currentTheme.text }]}>{title}</Text>
                <Text style={[commonStyles.text_sm, { color: currentTheme.noticeText }]}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.noticeText} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusLG,
        padding: styleConstants.paddingMD,
        marginBottom: styleConstants.marginMD,
        gap: styleConstants.gapMD,
    },
    cardIcon: {
        width: styleConstants.imageLG,
        height: styleConstants.imageLG,
        borderRadius: styleConstants.borderRadiusCircle,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
