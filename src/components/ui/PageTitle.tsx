// REACT
import React, { JSX } from "react";
import { TouchableOpacity, Text, View } from "react-native";

// EXPO
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

// CONTEXTS
import { useAppSettings } from "../../context/AppSettingsContext";

// STYLES
import { commonStyles } from 'src/style/styles';

type Props = {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    backgroundColor?: string;
    textColor?: string;
};

/**
 * A header with two icon buttons.
 */
export default function PageTitle({ title, subtitle, showBackButton = false, backgroundColor, textColor }: Props): JSX.Element {
    const { currentTheme } = useAppSettings();

    return (
        <View
            style={[
                commonStyles.headerWithButtons,
                {
                    alignItems: 'center',
                    backgroundColor: backgroundColor ?? currentTheme.headerBackground
                }
            ]}
        >
            <TouchableOpacity onPress={() => {router.back()}} disabled={!showBackButton}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={!showBackButton ? "transparent" : textColor ?? currentTheme.headerText}
                    style={{padding: 10}}
                />
            </TouchableOpacity>

            <View>
                <Text style={[commonStyles.title, { marginBottom: 0, paddingVertical: 0, color: textColor ?? currentTheme.headerText }]}>{title}</Text>
                {subtitle && (
                    <Text style={{ fontSize: 10, color: textColor ?? currentTheme.headerText }}>
                        {subtitle}
                    </Text>
                )}
            </View>

            <TouchableOpacity onPress={() => {}}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="transparent"
                    style={{padding: 10}}
                />
            </TouchableOpacity>
        </View>
    );
}


