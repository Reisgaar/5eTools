// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Text, Pressable } from 'react-native';

// CONTEXTS
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface CustomButtonProps {
    text: string;
    secondaryText?: string;
    action: () => void;
};

/**
 * A header with two icon buttons.
 */
export default function CustomButton({ text, secondaryText, action }: CustomButtonProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

    return (
        <Pressable
            style={[commonStyles.button, { backgroundColor: currentTheme.buttonBackground, }]}
            onPress={action}
        >
            <Text style={[commonStyles.buttonText, { color: currentTheme.buttonText, fontSize: secondaryText ? 18 : 16 }]}>
                {text}
            </Text>

            {secondaryText && (
                <Text style={{ color: currentTheme.cardText, fontSize: styleConstants.fontSizeSM, textAlign: 'center' }}>
                    {secondaryText}
                </Text>
            )}
        </Pressable>
    );
}
