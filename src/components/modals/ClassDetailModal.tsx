// REACT
import React from 'react';
import { Text, View } from 'react-native';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';
import { useData } from 'src/context/DataContext';

// UTILS
import { renderEntries } from 'src/utils/replaceTags';
import { normalizeString } from 'src/utils/stringUtils';

interface ClassDetailModalProps {
    visible: boolean;
    classSummary: any | null;
    onClose: () => void;
    theme: any;
}

const ABILITY_FULL: Record<string, string> = {
    str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
};

// Parse a classFeatures reference ("Fighting Style|Fighter||1" or { classFeature: "…" }).
function parseFeatureRef(ref: any): { name: string; level: number } | null {
    const raw = typeof ref === 'string' ? ref : ref?.classFeature;
    if (!raw) return null;
    const parts = String(raw).split('|');
    return { name: parts[0], level: parseInt(parts[3], 10) || 1 };
}

export default function ClassDetailModal({ visible, classSummary, onClose, theme }: ClassDetailModalProps) {
    const { openEntryModal } = useModal();
    const { getClassFile } = useData();

    const view = React.useMemo(() => {
        if (!classSummary) return null;
        const file = getClassFile(classSummary.name);
        const cls = (file && file.class && file.class[0]) || classSummary;

        // Resolve class features grouped by level.
        const featureEntries: any[] = (file && file.classFeature) || [];
        const byNameLevel = new Map<string, any>();
        for (const cf of featureEntries) byNameLevel.set(`${normalizeString(cf.name)}|${cf.level}`, cf);

        const levels = new Map<number, any[]>();
        for (const ref of cls.classFeatures || []) {
            const parsed = parseFeatureRef(ref);
            if (!parsed) continue;
            const cf = byNameLevel.get(`${normalizeString(parsed.name)}|${parsed.level}`);
            if (!cf) continue;
            if (!levels.has(parsed.level)) levels.set(parsed.level, []);
            levels.get(parsed.level)!.push(cf);
        }
        const sortedLevels = Array.from(levels.keys()).sort((a, b) => a - b);

        const subclasses: string[] = ((file && file.subclass) || [])
            .map((s: any) => s.name)
            .filter(Boolean)
            .sort((a: string, b: string) => a.localeCompare(b));

        return { cls, levels, sortedLevels, subclasses };
    }, [classSummary, getClassFile]);

    if (!classSummary || !view) return null;
    const { cls, levels, sortedLevels, subclasses } = view;

    const rows: { label: string; value: string }[] = [];
    if (cls.hd?.faces) rows.push({ label: 'Hit Die', value: `d${cls.hd.faces}` });
    if (Array.isArray(cls.proficiency) && cls.proficiency.length) {
        rows.push({ label: 'Saving Throws', value: cls.proficiency.map((p: string) => ABILITY_FULL[p] || p).join(', ') });
    }

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title={cls.name} subtitle={cls.source}>
            <View style={{ marginBottom: rows.length ? 10 : 0 }}>
                {rows.map(row => (
                    <View key={row.label} style={{ flexDirection: 'row', marginBottom: 3 }}>
                        <Text style={{ fontWeight: 'bold', color: theme.text, fontSize: 12, width: 110 }}>{row.label}</Text>
                        <Text style={{ color: theme.text, fontSize: 12, flex: 1 }}>{row.value}</Text>
                    </View>
                ))}
            </View>

            {sortedLevels.length === 0 ? (
                <Text style={{ color: theme.noticeText, fontSize: 12 }}>No class features available.</Text>
            ) : (
                sortedLevels.map(level => (
                    <View key={level} style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold', color: theme.primary, fontSize: 13, marginBottom: 4 }}>
                            Level {level}
                        </Text>
                        {levels.get(level)!.map((cf: any, idx: number) => (
                            <View key={`${cf.name}-${idx}`} style={{ marginBottom: 6 }}>
                                <Text style={{ fontWeight: 'bold', color: theme.text, fontSize: 12, marginBottom: 2 }}>{cf.name}</Text>
                                {renderEntries(cf.entries, 0, theme, undefined, undefined, {}, undefined, undefined,
                                    (cat, name, source) => openEntryModal(cat, name, source))}
                            </View>
                        ))}
                    </View>
                ))
            )}

            {subclasses.length > 0 && (
                <View style={{ marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', color: theme.primary, fontSize: 13, marginBottom: 4 }}>
                        {cls.subclassTitle || 'Subclasses'}
                    </Text>
                    {subclasses.map((name: string) => (
                        <Text key={name} style={{ color: theme.text, fontSize: 12, marginBottom: 2 }}>• {name}</Text>
                    ))}
                </View>
            )}
        </BaseModal>
    );
}
