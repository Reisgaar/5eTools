// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { Text, View, Pressable } from 'react-native';

// CONTEXTS
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// INTERFACES
interface ClickableTextProps {
    text: string;
    align?: 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch';
    action: () => void;
};

/**
 * A header with two icon buttons.
 */
export default function ClickableText({ text, align = 'flex-start', action }: ClickableTextProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

    return (
        <View style={{ width: '100%', alignItems: align }}>
            <Pressable
                style={commonStyles.settingsButton}
                onPress={action}
            >
                <Text style={[commonStyles.settingsButtonText, { color: currentTheme.linkColor, paddingHorizontal: styleConstants.paddingSM, paddingVertical: styleConstants.paddingXS, textAlign: align === 'center' ? 'center' : 'auto' }]}>
                    {text}
                </Text>
            </Pressable>
        </View>
    );
}
