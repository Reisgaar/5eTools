// REACT
import React, { JSX } from "react";
import { Text, View } from "react-native";

// CONTEXTS
import { useAppSettings } from "src/context/AppSettingsContext";

// STYLES

type Props = {
    title?: string;
    size?: 'small' | 'medium' | 'large';
};

/**
 * A separator line.
 */
export default function Seaparator( { size = 'medium', title }: Props): JSX.Element {
    const { currentTheme } = useAppSettings();

    return (
        <View>
            {title && (
                <Text style={{ color: currentTheme.text, textAlign: 'center', fontWeight: 'bold', marginTop: 8, marginBottom: -8 }}>{title}</Text>
            )}
            <View style={{ width: '100%', height: 1, marginVertical: size === 'small' ? 8 : size === 'medium' ? 12 : 20, backgroundColor: currentTheme.text }} />
        </View>
    );
}


