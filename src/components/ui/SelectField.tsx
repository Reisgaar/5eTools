// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import BaseModal from 'src/components/ui/BaseModal';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

export interface SelectOption {
    label: string;
    value: string;
    sub?: string; // secondary text, e.g. the source
}

interface SelectFieldProps {
    /** Field label shown above the control. Pass '' to omit it (e.g. compact rows). */
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    theme: any;
    placeholder?: string;
    /** Offer a "None" entry that clears the value. */
    allowClear?: boolean;
}

/**
 * A themed dropdown-style field. Tapping it opens the option list in a modal and returns the
 * chosen value. Options are rendered as a plain scrollable list (BaseModal handles scrolling).
 */
export default function SelectField({
    label,
    value,
    options,
    onChange,
    theme,
    placeholder = 'Select…',
    allowClear,
}: SelectFieldProps) {
    const [open, setOpen] = React.useState(false);

    const selected = options.find(o => o.value === value) || null;
    const rows: SelectOption[] = allowClear ? [{ label: 'None', value: '' }, ...options] : options;
    const choose = (v: string) => { onChange(v); setOpen(false); };

    return (
        <View>
            {label ? <Text style={[styles.label, { color: theme.text }]}>{label}</Text> : null}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpen(true)}
                style={[styles.field, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
            >
                <Text style={{ color: selected ? theme.text : theme.noticeText, fontSize: styleConstants.fontSizeLG, flex: 1 }} numberOfLines={1}>
                    {selected ? selected.label : placeholder}
                </Text>
                <Ionicons name="chevron-down" size={18} color={theme.noticeText} />
            </TouchableOpacity>

            <BaseModal visible={open} onClose={() => setOpen(false)} theme={theme} title={label}>
                {rows.length === 0 ? (
                    <Text style={{ color: theme.noticeText, textAlign: 'center', padding: styleConstants.paddingLG }}>
                        No options available.
                    </Text>
                ) : (
                    rows.map((item, i) => {
                        const active = item.value === value;
                        return (
                            <TouchableOpacity
                                key={`${item.value}|${item.sub || ''}|${i}`}
                                activeOpacity={0.7}
                                onPress={() => choose(item.value)}
                                style={[styles.row, { borderBottomColor: theme.border }, active && { backgroundColor: theme.primary + '20' }]}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeLG }}>{item.label}</Text>
                                    {item.sub ? <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>{item.sub}</Text> : null}
                                </View>
                                {active && <Ionicons name="checkmark" size={20} color={theme.primary} />}
                            </TouchableOpacity>
                        );
                    })
                )}
            </BaseModal>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginMD,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusLG,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM + 2,
        minHeight: 46,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingSM,
        borderBottomWidth: styleConstants.borderXS,
    },
});
