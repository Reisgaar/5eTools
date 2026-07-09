// REACT
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// TYPES
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;          // default 'primary'
    size?: ButtonSize;                // default 'md'
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';  // default 'left'
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
}

/**
 * The app's single button. Variants cover the common intents (primary action, secondary,
 * destructive, and text-only ghost); use this instead of hand-rolling TouchableOpacity buttons.
 */
export default function Button({
    title, onPress, variant = 'primary', size = 'md',
    icon, iconPosition = 'left', fullWidth, disabled, loading,
}: ButtonProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();

    const palette: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
        primary: { bg: currentTheme.primary, fg: currentTheme.buttonText || '#fff' },
        secondary: { bg: currentTheme.innerBackground, fg: currentTheme.text, border: currentTheme.border },
        danger: { bg: '#dc2626', fg: '#fff' },
        ghost: { bg: 'transparent', fg: currentTheme.primary },
    };
    const c = palette[variant];
    const sizeStyle = size === 'sm' ? styles.sm : styles.md;
    const fontSize = size === 'sm' ? styleConstants.fontSizeMD : styleConstants.fontSizeLG;
    const iconSize = size === 'sm' ? styleConstants.iconXS : styleConstants.iconSM;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.75}
            style={[
                styles.base,
                sizeStyle,
                { backgroundColor: c.bg },
                c.border ? { borderWidth: styleConstants.borderXS, borderColor: c.border } : null,
                fullWidth ? { alignSelf: 'stretch' } : null,
                (disabled || loading) ? { opacity: 0.5 } : null,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={c.fg} />
            ) : (
                <View style={styles.row}>
                    {icon && iconPosition === 'left' ? <Ionicons name={icon} size={iconSize} color={c.fg} /> : null}
                    <Text style={[styles.label, { color: c.fg, fontSize }]}>{title}</Text>
                    {icon && iconPosition === 'right' ? <Ionicons name={icon} size={iconSize} color={c.fg} /> : null}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: styleConstants.borderRadiusLG,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sm: { paddingVertical: styleConstants.paddingSM, paddingHorizontal: styleConstants.paddingMD, minHeight: 36 },
    md: { paddingVertical: styleConstants.paddingMD, paddingHorizontal: styleConstants.paddingXL, minHeight: 44 },
    row: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM },
    label: { fontWeight: '700' },
});
