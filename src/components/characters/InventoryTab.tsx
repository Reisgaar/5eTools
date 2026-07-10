// REACT
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import { Button } from 'src/components/ui';
import ItemPickerModal from 'src/components/characters/ItemPickerModal';

// STYLES
import { styleConstants } from 'src/styles/style-constants';

// DATA / CONTEXT
import { useData } from 'src/context/DataContext';
import { useModal } from 'src/context/ModalContext';

// UTILS
import { formatItemType } from 'src/utils/itemUtils';

// TYPES
import { Character, Currency, InventoryItem } from 'src/models/interfaces/utils';

const COINS: { key: keyof Currency; label: string }[] = [
    { key: 'pp', label: 'PP' },
    { key: 'gp', label: 'GP' },
    { key: 'ep', label: 'EP' },
    { key: 'sp', label: 'SP' },
    { key: 'cp', label: 'CP' },
];
const norm = (s?: string) => (s || '').trim().toLowerCase();

interface InventoryTabProps {
    character: Character;
    theme: any;
    onUpdate: (patch: Partial<Character>) => void;
}

export default function InventoryTab({ character, theme, onUpdate }: InventoryTabProps) {
    const { items } = useData();
    const { openEntryModal } = useModal();
    const [pickerVisible, setPickerVisible] = React.useState(false);

    // name|source → compendium item (with a name-only fallback).
    const { byKey, byName } = React.useMemo(() => {
        const k = new Map<string, any>();
        const n = new Map<string, any>();
        for (const it of items || []) {
            if (!it?.name) continue;
            k.set(`${norm(it.name)}|${norm(it.source)}`, it);
            if (!n.has(norm(it.name))) n.set(norm(it.name), it);
        }
        return { byKey: k, byName: n };
    }, [items]);

    const lookup = (inv: InventoryItem) => byKey.get(`${norm(inv.name)}|${norm(inv.source)}`) || byName.get(norm(inv.name)) || null;

    const inventory = character.inventory || [];
    const totalWeight = inventory.reduce((sum, inv) => sum + ((lookup(inv)?.weight || 0) * (inv.quantity || 0)), 0);
    const capacity = (character.abilities?.str ?? 10) * 15;
    const overloaded = totalWeight > capacity;
    const attunedCount = inventory.filter(inv => inv.attuned).length;

    const setInventory = (next: InventoryItem[]) => onUpdate({ inventory: next });
    const setCoin = (key: keyof Currency, text: string) => {
        const v = parseInt(text, 10);
        onUpdate({ currency: { ...character.currency, [key]: isNaN(v) ? 0 : Math.max(0, v) } });
    };

    const addItem = (item: any) => {
        const idx = inventory.findIndex(inv => norm(inv.name) === norm(item.name) && norm(inv.source) === norm(item.source));
        if (idx >= 0) setInventory(inventory.map((inv, i) => i === idx ? { ...inv, quantity: (inv.quantity || 0) + 1 } : inv));
        else setInventory([...inventory, { name: item.name, source: item.source, quantity: 1, equipped: false }]);
    };
    const setQty = (i: number, q: number) => setInventory(inventory.map((inv, idx) => idx === i ? { ...inv, quantity: Math.max(1, q) } : inv));
    const removeItem = (i: number) => setInventory(inventory.filter((_, idx) => idx !== i));
    const toggle = (i: number, field: 'equipped' | 'attuned') => setInventory(inventory.map((inv, idx) => idx === i ? { ...inv, [field]: !inv[field] } : inv));

    return (
        <View>
            {/* Currency */}
            <Text style={[styles.header, { color: theme.text }]}>Currency</Text>
            <View style={styles.coinRow}>
                {COINS.map(coin => (
                    <View key={coin.key} style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[styles.coinLabel, { color: theme.noticeText }]}>{coin.label}</Text>
                        <TextInput
                            style={[styles.coinInput, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                            keyboardType="numeric"
                            value={String(character.currency?.[coin.key] ?? 0)}
                            onChangeText={t => setCoin(coin.key, t)}
                        />
                    </View>
                ))}
            </View>

            {/* Weight */}
            <View style={[styles.weightRow, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <Ionicons name="barbell-outline" size={18} color={theme.noticeText} />
                <Text style={{ color: theme.text, marginLeft: styleConstants.marginSM, flex: 1 }}>Carried weight</Text>
                <Text style={{ color: overloaded ? '#dc2626' : theme.text, fontWeight: '700' }}>{totalWeight} / {capacity} lb</Text>
            </View>

            {/* Items */}
            <View style={styles.headerRow}>
                <Text style={[styles.header, { color: theme.text, marginBottom: 0 }]}>
                    Items ({inventory.length})
                    {attunedCount > 0 ? <Text style={{ color: attunedCount > 3 ? '#dc2626' : theme.noticeText }}>  ·  Attuned {attunedCount}/3</Text> : null}
                </Text>
                <Button title="Add" icon="add" size="sm" onPress={() => setPickerVisible(true)} />
            </View>

            {inventory.length === 0 ? (
                <Text style={{ color: theme.noticeText, textAlign: 'center', paddingVertical: styleConstants.paddingLG }}>
                    No items yet. Tap “Add” to add gear from the compendium.
                </Text>
            ) : (
                inventory.map((inv, i) => {
                    const item = lookup(inv);
                    const canAttune = !!item?.reqAttune;
                    const w = item?.weight || 0;
                    return (
                        <View key={`${inv.name}|${inv.source}|${i}`} style={[styles.itemCard, { borderColor: theme.border }]}>
                            <View style={styles.itemTop}>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => openEntryModal('item', inv.name, inv.source)}>
                                    <Text style={{ color: theme.text, fontSize: styleConstants.fontSizeMD, fontWeight: '600' }}>{inv.name}</Text>
                                    <Text style={{ color: theme.noticeText, fontSize: styleConstants.fontSizeSM }}>
                                        {[item ? formatItemType(item) : null, w ? `${w * inv.quantity} lb` : null].filter(Boolean).join(' · ') || 'Unknown item'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeItem(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ padding: styleConstants.paddingXS }}>
                                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.itemBottom}>
                                <View style={styles.qtyStepper}>
                                    <TouchableOpacity onPress={() => setQty(i, inv.quantity - 1)} style={[styles.qtyBtn, { borderColor: theme.border }]}>
                                        <Ionicons name="remove" size={14} color={theme.text} />
                                    </TouchableOpacity>
                                    <Text style={{ color: theme.text, fontWeight: '700', minWidth: 24, textAlign: 'center' }}>{inv.quantity}</Text>
                                    <TouchableOpacity onPress={() => setQty(i, inv.quantity + 1)} style={[styles.qtyBtn, { borderColor: theme.primary, backgroundColor: theme.primary }]}>
                                        <Ionicons name="add" size={14} color={theme.buttonText || '#fff'} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => toggle(i, 'equipped')} style={[styles.tag, { borderColor: theme.border, backgroundColor: inv.equipped ? theme.primary : 'transparent' }]}>
                                    <Text style={{ color: inv.equipped ? theme.buttonText : theme.noticeText, fontSize: styleConstants.fontSizeSM, fontWeight: '600' }}>Equipped</Text>
                                </TouchableOpacity>
                                {canAttune && (
                                    <TouchableOpacity onPress={() => toggle(i, 'attuned')} style={[styles.tag, { borderColor: theme.border, backgroundColor: inv.attuned ? theme.primary : 'transparent' }]}>
                                        <Text style={{ color: inv.attuned ? theme.buttonText : theme.noticeText, fontSize: styleConstants.fontSizeSM, fontWeight: '600' }}>Attuned</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                })
            )}

            <ItemPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} theme={theme} items={items} onSelect={addItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: { fontSize: styleConstants.fontSizeSM, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: styleConstants.marginSM },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: styleConstants.marginLG, marginBottom: styleConstants.marginSM },
    coinRow: { flexDirection: 'row', gap: styleConstants.gapSM, marginBottom: styleConstants.marginMD },
    coinLabel: { fontSize: styleConstants.fontSizeXS, fontWeight: '700', letterSpacing: 1, marginBottom: styleConstants.marginXS },
    coinInput: { width: '100%', textAlign: 'center', borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, paddingVertical: styleConstants.paddingSM, fontSize: styleConstants.fontSizeMD },
    weightRow: { flexDirection: 'row', alignItems: 'center', padding: styleConstants.paddingMD, borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusLG },
    itemCard: { borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusLG, padding: styleConstants.paddingMD, marginBottom: styleConstants.marginSM },
    itemTop: { flexDirection: 'row', alignItems: 'flex-start' },
    itemBottom: { flexDirection: 'row', alignItems: 'center', gap: styleConstants.gapSM, marginTop: styleConstants.marginSM, flexWrap: 'wrap' },
    qtyStepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    qtyBtn: { width: 28, height: 28, borderRadius: styleConstants.borderRadiusCircle, borderWidth: styleConstants.borderXS, alignItems: 'center', justifyContent: 'center' },
    tag: { paddingHorizontal: styleConstants.paddingMD, paddingVertical: styleConstants.paddingXS, borderRadius: styleConstants.borderRadiusLG, borderWidth: styleConstants.borderXS },
});
