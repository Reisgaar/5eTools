// REACT
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { Button } from 'src/components/ui';
import CreaturePickerModal from 'src/components/characters/CreaturePickerModal';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// DATA / CONTEXT
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// TYPES
import { Character, CharacterCreature } from 'src/models/interfaces/utils';

const norm = (s?: string) => (s || '').trim().toLowerCase();

interface CreaturesTabProps {
    character: Character;
    theme: any;
    onUpdate: (patch: Partial<Character>) => void;
}

export default function CreaturesTab({ character, theme, onUpdate }: CreaturesTabProps) {
    const { simpleBeasts, getFullBeast } = useData();
    const { openBeastModal } = useModal();
    const [pickerVisible, setPickerVisible] = React.useState(false);

    const byKey = React.useMemo(() => {
        const m = new Map<string, any>();
        for (const b of simpleBeasts || []) m.set(`${norm(b.name)}|${norm(b.source)}`, b);
        return m;
    }, [simpleBeasts]);

    const creatures = character.creatures || [];
    const setCreatures = (next: CharacterCreature[]) => onUpdate({ creatures: next });

    const addCreature = (b: any) => {
        if (creatures.some(c => norm(c.name) === norm(b.name) && norm(c.source) === norm(b.source))) return;
        setCreatures([...creatures, { name: b.name, source: b.source }]);
    };
    const removeCreature = (i: number) => setCreatures(creatures.filter((_, idx) => idx !== i));
    const openCreature = async (c: CharacterCreature) => {
        const full = await getFullBeast(c.name, c.source);
        openBeastModal(full || { name: c.name, source: c.source });
    };

    return (
        <View>
            <View style={styles.headerRow}>
                <Text style={[styles.header, { color: theme.text }]}>Creatures ({creatures.length})</Text>
                <Button title="Add" icon="add" size="sm" onPress={() => setPickerVisible(true)} />
            </View>
            <Text style={[styles.note, { color: theme.noticeText }]}>Wild shape forms, summons, companions and other creatures for quick reference.</Text>

            {creatures.length === 0 ? (
                <Text style={{ color: theme.noticeText, textAlign: 'center', paddingVertical: styleConstants.paddingLG }}>
                    No creatures yet. Tap “Add” to add creatures from the bestiary.
                </Text>
            ) : (
                creatures.map((c, i) => {
                    const b = byKey.get(`${norm(c.name)}|${norm(c.source)}`);
                    return (
                        <View key={`${c.name}|${c.source}|${i}`} style={[styles.row, { borderBottomColor: theme.border }]}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => openCreature(c)}>
                                <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeMD, fontWeight: '600' }}>{c.name}</Text>
                                <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>
                                    {b ? `CR ${String(b.CR)} · ${b.type} (${c.source})` : c.source}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeCreature(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ padding: styleConstants.paddingXS }}>
                                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    );
                })
            )}

            <CreaturePickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} theme={theme} beasts={simpleBeasts} onSelect={addCreature} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: styleConstants.marginXS },
    header: { fontSize: styleConstants.fontSizeSM, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    note: { fontSize: styleConstants.fontSizeSM, fontStyle: 'italic', marginBottom: styleConstants.marginMD },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: styleConstants.paddingMD, borderBottomWidth: styleConstants.borderXS },
});
