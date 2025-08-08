// REACT
import React, { JSX } from "react";
import { Text, Pressable } from "react-native";

// CONTEXTS
import { useAppSettings } from "../../context/AppSettingsContext";

// STYLES
import { commonStyles } from 'src/style/styles';

type Props = {
    text: string;
    secondaryText?: string;
    action: () => void;
};

/**
 * A header with two icon buttons.
 */
export default function CustomButton({ text, secondaryText, action }: Props): JSX.Element {
    const { currentTheme } = useAppSettings();

    return (
        <Pressable
            style={[commonStyles.button, { backgroundColor: currentTheme.buttonBackground, }]}
            onPress={action}
        >
            <Text style={[commonStyles.buttonText, { color: currentTheme.buttonText, fontSize: secondaryText ? 18 : 16 }]}>
                {text}
            </Text>

            {secondaryText && (
                <Text style={{ color: currentTheme.cardText, fontSize: 12, textAlign: 'center' }}>
                    {secondaryText}
                </Text>
            )}
        </Pressable>
    );
}


