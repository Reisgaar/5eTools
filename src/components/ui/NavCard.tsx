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
 * A tappable navigation card with a large tinted icon tile, title + subtitle, and a trailing
 * chevron. Shared by the Home dashboard and the Compendium hub.
 */
export default function NavCard({ title, subtitle, icon, onPress, iconColor }: NavCardProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const accent = iconColor || currentTheme.primary;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}
            activeOpacity={0.7}
        >
            <View style={[styles.iconTile, { backgroundColor: accent + '22' }]}>
                <Ionicons name={icon} size={28} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text_lg, { fontWeight: '700', color: currentTheme.text }]}>{title}</Text>
                <Text style={[commonStyles.text_sm, { color: currentTheme.noticeText, marginTop: styleConstants.margin2XS }]}>{subtitle}</Text>
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
        borderRadius: styleConstants.borderRadius2XL,
        padding: styleConstants.paddingMD,
        marginBottom: styleConstants.marginMD,
        gap: styleConstants.gapMD,
        ...styleConstants.shadowSM,
    },
    iconTile: {
        width: 52,
        height: 52,
        borderRadius: styleConstants.borderRadiusXL,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
