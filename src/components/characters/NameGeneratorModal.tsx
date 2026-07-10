// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { BaseModal, Button, SegmentedControl } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';
import { styleConstants } from 'src/styles/style-constants';

// UTILS
import { generateName, getNameConfig, Age, Gender, GeneratedName } from 'src/utils/nameGenerator';

interface NameGeneratorModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    /** The character's (possibly free-text) race name — decides which name tables apply. */
    raceName: string;
    /** Preselected gender, if the form already tracks one. */
    initialGender?: Gender;
    /** Called with the chosen full name when the user taps "Use Name". */
    onApply: (name: string) => void;
}

// A wrapping row of selectable pills (used for ethnicity + surname, which can exceed 3 options).
function ChipGroup({ theme, options, value, onChange }: {
    theme: any;
    options: { key: string; label: string }[];
    value: string | null;
    onChange: (key: string | null) => void;
}) {
    return (
        <View style={styles.chipRow}>
            {options.map(opt => {
                const active = opt.key === value || (opt.key === '__none__' && value === null);
                return (
                    <TouchableOpacity
                        key={opt.key}
                        activeOpacity={0.8}
                        onPress={() => onChange(opt.key === '__none__' ? null : opt.key)}
                        style={[
                            styles.chip,
                            { borderColor: theme.border, backgroundColor: active ? theme.primary : theme.innerBackground },
                        ]}
                    >
                        <Text style={{ color: active ? theme.buttonText : theme.text, fontWeight: '600', fontSize: styleConstants.fontSizeSM }}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function SectionLabel({ theme, children }: { theme: any; children: React.ReactNode }) {
    return <Text style={[styles.sectionLabel, { color: theme.noticeText }]}>{children}</Text>;
}

export default function NameGeneratorModal({ visible, onClose, theme, raceName, initialGender, onApply }: NameGeneratorModalProps) {
    const commonStyles = getCommonStyles(theme);
    const config = React.useMemo(() => getNameConfig(raceName), [raceName]);

    const [gender, setGender] = React.useState<Gender>(initialGender || 'nonbinary');
    const [ethnicity, setEthnicity] = React.useState<string | null>(null);
    const [age, setAge] = React.useState<Age | null>(null);
    const [surname, setSurname] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<GeneratedName | null>(null);

    const roll = React.useCallback(() => {
        setResult(generateName(raceName, { gender, ethnicity, age: age ?? undefined, surname }));
    }, [raceName, gender, ethnicity, age, surname]);

    // Initialise defaults each time the modal opens for a race.
    React.useEffect(() => {
        if (!visible) return;
        setGender(initialGender || 'nonbinary');
        setEthnicity(config.suggestedEthnicity);
        setAge(config.ages.includes('adult') ? 'adult' : config.ages[0] ?? null);
        setSurname(config.surnames[0]?.key ?? null);
    }, [visible, raceName]); // eslint-disable-line react-hooks/exhaustive-deps

    // Re-roll whenever the modal is open and any selector changes.
    React.useEffect(() => {
        if (visible && config.hasNames) roll();
    }, [visible, roll, config.hasNames]);

    if (!config.hasNames) return null;

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Generate Name"
            subtitle={`${config.raceKey} names`}
            footerContent={(
                <View style={[commonStyles.w_100, commonStyles.row_center_center, commonStyles.gap_sm]}>
                    <View style={{ flex: 1 }}>
                        <Button title="Cancel" variant="secondary" onPress={onClose} fullWidth />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Use Name"
                            icon="checkmark"
                            onPress={() => { if (result) { onApply(result.full); onClose(); } }}
                            disabled={!result}
                            fullWidth
                        />
                    </View>
                </View>
            )}
        >
            {/* Result banner */}
            <View style={[styles.resultBanner, { backgroundColor: theme.primary + '18', borderColor: theme.border }]}>
                <Text style={[styles.resultName, { color: theme.text }]} numberOfLines={2}>
                    {result?.full || '—'}
                </Text>
                <TouchableOpacity onPress={roll} activeOpacity={0.8} style={[styles.rerollBtn, { backgroundColor: theme.primary }]}>
                    <Ionicons name="dice" size={20} color={theme.buttonText} />
                </TouchableOpacity>
            </View>

            {/* Gender */}
            {config.gendered && (
                <View style={styles.section}>
                    <SectionLabel theme={theme}>Gender</SectionLabel>
                    <SegmentedControl
                        options={[
                            { key: 'male', label: 'Male' },
                            { key: 'female', label: 'Female' },
                            { key: 'nonbinary', label: 'Non-binary' },
                        ]}
                        value={gender}
                        onChange={k => setGender(k as Gender)}
                    />
                </View>
            )}

            {/* Age (Elf) */}
            {config.ages.length > 0 && (
                <View style={styles.section}>
                    <SectionLabel theme={theme}>Age</SectionLabel>
                    <SegmentedControl
                        options={config.ages.map(a => ({ key: a, label: a === 'child' ? 'Child' : 'Adult' }))}
                        value={age ?? config.ages[0]}
                        onChange={k => setAge(k as Age)}
                    />
                </View>
            )}

            {/* Ethnicity / lineage */}
            {config.ethnicities.length > 0 && (
                <View style={styles.section}>
                    <SectionLabel theme={theme}>Ethnicity</SectionLabel>
                    <ChipGroup
                        theme={theme}
                        value={ethnicity}
                        onChange={setEthnicity}
                        options={[{ key: '__none__', label: 'Any' }, ...config.ethnicities]}
                    />
                </View>
            )}

            {/* Surname */}
            {config.surnames.length > 0 && (
                <View style={styles.section}>
                    <SectionLabel theme={theme}>Surname</SectionLabel>
                    <ChipGroup
                        theme={theme}
                        value={surname}
                        onChange={setSurname}
                        options={[{ key: '__none__', label: 'None' }, ...config.surnames]}
                    />
                </View>
            )}
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: styleConstants.marginLG },
    sectionLabel: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: styleConstants.marginSM,
    },
    resultBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: styleConstants.gapSM,
        paddingVertical: styleConstants.paddingLG,
        paddingHorizontal: styleConstants.paddingLG,
        borderRadius: styleConstants.borderRadius2XL,
        borderWidth: styleConstants.borderXS,
        marginBottom: styleConstants.marginLG,
    },
    resultName: { flex: 1, fontSize: styleConstants.fontSizeXL, fontWeight: '800' },
    rerollBtn: {
        width: 40, height: 40,
        borderRadius: styleConstants.borderRadiusCircle,
        alignItems: 'center', justifyContent: 'center',
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: styleConstants.gapSM },
    chip: {
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM,
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
    },
});
