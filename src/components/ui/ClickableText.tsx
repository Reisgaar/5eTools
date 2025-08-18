// REACT
import React, { JSX } from "react";
import { Text, View, Pressable } from "react-native";

// CONTEXTS
import { useAppSettingsStore } from "src/stores/appSettingsStore";

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

type Props = {
    text: string;
    align?: 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch';
    action: () => void;
};

/**
 * A header with two icon buttons.
 */
export default function ClickableText({ text, align = 'flex-start', action }: Props): JSX.Element {
    const { currentTheme } = useAppSettingsStore();

    return (
        <View style={{ width: '100%', alignItems: align }}>
            <Pressable
                style={commonStyles.settingsButton}
                onPress={action}
            >
                <Text style={[commonStyles.settingsButtonText, { color: currentTheme.linkColor, paddingHorizontal: 10, paddingVertical: 4, textAlign: align === 'center' ? 'center' : 'auto' }]}>
                    {text}
                </Text>
            </Pressable>
        </View>
    );
}


