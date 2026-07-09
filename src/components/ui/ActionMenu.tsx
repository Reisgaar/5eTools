// REACT
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// TYPES
export interface ActionMenuItem {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    destructive?: boolean;
    disabled?: boolean;
    onPress: () => void;
}

interface ActionMenuProps {
    actions: ActionMenuItem[];
    title?: string;   // optional sheet header (e.g. the item's name)
}

/**
 * A ⋯ (kebab) button that opens a themed bottom action sheet with the given options. Reusable
 * anywhere a list row or card needs an overflow menu (edit / delete / …).
 */
export default function ActionMenu({ actions, title }: ActionMenuProps): React.JSX.Element {
    const { currentTheme } = useAppSettingsStore();
    const insets = useSafeAreaInsets();
    const [open, setOpen] = React.useState(false);
    const close = () => setOpen(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setOpen(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.trigger}
                accessibilityLabel="More options"
            >
                <Ionicons name="ellipsis-vertical" size={20} color={currentTheme.noticeText} />
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
                <Pressable style={styles.overlay} onPress={close}>
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.sheet, {
                            backgroundColor: currentTheme.card,
                            borderColor: currentTheme.border,
                            paddingBottom: Math.max(insets.bottom, styleConstants.paddingMD),
                        }]}
                    >
                        {title ? <Text numberOfLines={1} style={[styles.title, { color: currentTheme.noticeText }]}>{title}</Text> : null}
                        {actions.map((a, i) => (
                            <TouchableOpacity
                                key={i}
                                disabled={a.disabled}
                                onPress={() => { close(); a.onPress(); }}
                                style={[styles.row, a.disabled && { opacity: 0.4 }]}
                            >
                                {a.icon ? <Ionicons name={a.icon} size={20} color={a.destructive ? '#dc2626' : currentTheme.text} /> : null}
                                <Text style={[styles.label, { color: a.destructive ? '#dc2626' : currentTheme.text }]}>{a.label}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={close} style={[styles.row, styles.cancel, { borderTopColor: currentTheme.border }]}>
                            <Text style={[styles.label, { color: currentTheme.noticeText, fontWeight: '700', textAlign: 'center', flex: 1 }]}>Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: styleConstants.borderRadius2XL,
        borderTopRightRadius: styleConstants.borderRadius2XL,
        borderWidth: styleConstants.borderXS,
        paddingTop: styleConstants.paddingSM,
        paddingHorizontal: styleConstants.paddingSM,
    },
    title: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        paddingHorizontal: styleConstants.paddingMD,
        paddingTop: styleConstants.paddingSM,
        paddingBottom: styleConstants.paddingXS,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: styleConstants.gapMD,
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusMD,
    },
    label: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: '500',
    },
    cancel: {
        borderTopWidth: styleConstants.borderXS,
        marginTop: styleConstants.marginXS,
        justifyContent: 'center',
    },
});
