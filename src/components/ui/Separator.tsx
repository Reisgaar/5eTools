// REACT
import React from 'react';
import { getCommonStyles } from 'src/styles/commonStyles';
import { Text, View } from 'react-native';

// CONTEXTS
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// INTERFACES
interface SeparatorProps {
    title?: string;
    size?: 'small' | 'medium' | 'large';
};

/**
 * A separator line.
 */
export default function Seaparator( { size = 'medium', title }: SeparatorProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

    return (
        <View>
            {title && (
                <Text style={[commonStyles.text_primary, commonStyles.text_center, commonStyles.text_bold, commonStyles.mt_sm, { marginBottom: -8 }]}>{title}</Text>
            )}
            <View style={[commonStyles.w_100, { height: 1, marginVertical: size === 'small' ? 8 : size === 'medium' ? 12 : 20, backgroundColor: currentTheme.text }]} />
        </View>
    );
}
