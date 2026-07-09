// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// INTERFACES
export interface SegmentOption {
    key: string;
    label: string;
    badge?: number;      // optional count shown next to the label
    disabled?: boolean;  // greyed out and non-selectable
}

interface SegmentedControlProps {
    options: SegmentOption[];
    value: string;
    onChange: (key: string) => void;
}

/**
 * A themed pill segmented control (iOS-style). Reusable wherever a small set of mutually
 * exclusive views need switching between.
 */
export default function SegmentedControl({ options, value, onChange }: SegmentedControlProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();

    return (
        <View style={[styles.track, { backgroundColor: currentTheme.innerBackground, borderColor: currentTheme.border }]}>
            {options.map(opt => {
                const active = opt.key === value;
                const disabled = !!opt.disabled;
                return (
                    <TouchableOpacity
                        key={opt.key}
                        style={[styles.segment, active && { backgroundColor: currentTheme.primary }, disabled && { opacity: 0.4 }]}
                        activeOpacity={0.8}
                        disabled={disabled}
                        onPress={() => onChange(opt.key)}
                    >
                        <Text
                            numberOfLines={1}
                            style={[styles.label, { color: active ? currentTheme.buttonText : currentTheme.noticeText }]}
                        >
                            {opt.label}{opt.badge != null ? `  ${opt.badge}` : ''}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        flexDirection: 'row',
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
        padding: styleConstants.paddingXS / 2,
        gap: styleConstants.gapXS / 2,
    },
    segment: {
        flex: 1,
        paddingVertical: styleConstants.paddingSM,
        borderRadius: styleConstants.borderRadiusMD,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: styleConstants.fontSizeMD,
        fontWeight: '700',
    },
});
