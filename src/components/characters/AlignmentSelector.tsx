// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// UTILS
import { ALIGNMENT_DESCRIPTIONS, buildAlignment, Ethic, ETHICS, Moral, MORALS, splitAlignment } from 'src/utils/alignment';

interface AlignmentSelectorProps {
    value: string;
    onChange: (label: string) => void;
    theme: any;
}

// A two-column alignment picker: ethical axis (left) × moral axis (right). Picking one from each
// yields "Lawful Good", "Neutral", etc., with the PHB blurb shown underneath.
export default function AlignmentSelector({ value, onChange, theme }: AlignmentSelectorProps) {
    const initial = splitAlignment(value);
    const [ethic, setEthic] = React.useState<Ethic | null>(initial.ethic);
    const [moral, setMoral] = React.useState<Moral | null>(initial.moral);

    // Keep local axes in sync if the incoming value changes (e.g. editing a different character).
    React.useEffect(() => {
        const s = splitAlignment(value);
        setEthic(s.ethic);
        setMoral(s.moral);
    }, [value]);

    const commit = (e: Ethic | null, m: Moral | null) => {
        if (e && m) onChange(buildAlignment(e, m));
    };
    const pickEthic = (e: Ethic) => { setEthic(e); commit(e, moral); };
    const pickMoral = (m: Moral) => { setMoral(m); commit(ethic, m); };

    const label = ethic && moral ? buildAlignment(ethic, moral) : null;
    const description = label ? ALIGNMENT_DESCRIPTIONS[label] : null;

    const Cell = ({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.cell, { borderColor: theme.border, backgroundColor: active ? theme.primary : theme.innerBackground }]}
        >
            <Text style={{ color: active ? theme.buttonText : theme.text, fontWeight: '600', fontSize: styleConstants.fontSizeMD }}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.columns}>
                <View style={styles.col}>
                    {ETHICS.map(e => <Cell key={e} text={e} active={ethic === e} onPress={() => pickEthic(e)} />)}
                </View>
                <View style={styles.col}>
                    {MORALS.map(m => <Cell key={m} text={m} active={moral === m} onPress={() => pickMoral(m)} />)}
                </View>
            </View>

            {label && (
                <View style={[styles.summary, { backgroundColor: theme.primary + '18', borderColor: theme.border }]}>
                    <Text style={[styles.summaryTitle, { color: theme.text }]}>{label}</Text>
                    {description ? <Text style={[styles.summaryBody, { color: theme.noticeText }]}>{description}</Text> : null}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    columns: { flexDirection: 'row', gap: styleConstants.gapSM },
    col: { flex: 1, gap: styleConstants.gapSM },
    cell: {
        paddingVertical: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
        alignItems: 'center',
    },
    summary: {
        marginTop: styleConstants.marginMD,
        padding: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
    },
    summaryTitle: { fontSize: styleConstants.fontSizeLG, fontWeight: '800', marginBottom: styleConstants.margin2XS },
    summaryBody: { fontSize: styleConstants.fontSizeSM, lineHeight: 18 },
});
