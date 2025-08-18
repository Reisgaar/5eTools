// REACT
import React, { JSX } from "react";
import { Text, Pressable } from "react-native";

// CONTEXTS
import { useAppSettingsStore } from "src/stores/appSettingsStore";

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

type Props = {
    text: string;
    secondaryText?: string;
    action: () => void;
};

/**
 * A header with two icon buttons.
 */
export default function CustomButton({ text, secondaryText, action }: Props): JSX.Element {
    const { currentTheme } = useAppSettingsStore();

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


