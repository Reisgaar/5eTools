// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// INTERFACES
interface ListItemProps {
    // Primary label — a plain string, or arbitrary nodes for rich/inline-tagged titles.
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    // Leading visual (token image, level badge, icon tile) and trailing controls (actions, chevron, size).
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;   // e.g. to start a drag-reorder
    selected?: boolean;   // draws the accent border/tint
    disabled?: boolean;
}

/**
 * The app's single list row. Every browseable list (bestiary, spells, items, conditions,
 * library, spellbooks…) can render through this: pass a `leading` node for a token/badge, the
 * `title`/`subtitle`, and a `trailing` node for actions. Uses the shared themed card surface.
 */
export default function ListItem({ title, subtitle, leading, trailing, onPress, onLongPress, selected, disabled }: ListItemProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

    return (
        <TouchableOpacity
            activeOpacity={onPress || onLongPress ? 0.7 : 1}
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={200}
            disabled={disabled || (!onPress && !onLongPress)}
            style={[
                commonStyles.itemCard,
                selected && { borderColor: currentTheme.primary, backgroundColor: currentTheme.primary + '18' },
            ]}
        >
            {leading != null ? <View style={styles.leading}>{leading}</View> : null}
            <View style={styles.body}>
                {typeof title === 'string'
                    ? <Text style={[commonStyles.text_md, { color: currentTheme.text, fontWeight: '700' }]}>{title}</Text>
                    : title}
                {subtitle != null
                    ? (typeof subtitle === 'string'
                        ? <Text style={[commonStyles.text_sm, { color: currentTheme.noticeText, marginTop: styleConstants.margin2XS }]}>{subtitle}</Text>
                        : subtitle)
                    : null}
            </View>
            {trailing != null ? <View style={styles.trailing}>{trailing}</View> : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    leading: { marginRight: styleConstants.marginMD },
    body: { flex: 1, minWidth: 0 },
    trailing: { marginLeft: styleConstants.marginSM, flexDirection: 'row', alignItems: 'center' },
});
