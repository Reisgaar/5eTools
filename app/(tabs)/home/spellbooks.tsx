// REACT
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// STYLES
import { commonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { BaseModal } from 'src/components/ui';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import { CreateSpellbookModal } from 'src/components/spells';

// Spellbook management screen (independent, reached from Home). Create/delete spellbooks and
// view their spells. Adding spells happens from the Spells compendium screen.
export default function SpellbooksScreen() {
    const { currentTheme } = useAppSettingsStore();
    const { selectedCampaign } = useCampaignStore();
    const { spellbooks, deleteSpellbook, removeSpellFromSpellbook } = useSpellbookStore();
    const { openSpellModal } = useModal();

    const [createModalVisible, setCreateModalVisible] = React.useState(false);
    const [viewingId, setViewingId] = React.useState<string | null>(null);

    const [confirmVisible, setConfirmVisible] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(null);
    const [confirmMessage, setConfirmMessage] = React.useState('');

    // Scope to the selected campaign (show all when none selected).
    const visibleSpellbooks = React.useMemo(() => {
        const id = selectedCampaign?.id;
        return id ? spellbooks.filter(sb => sb.campaignId === id) : spellbooks;
    }, [spellbooks, selectedCampaign?.id]);

    // Derive the currently-viewed spellbook reactively so removals update the list immediately.
    const viewingSpellbook = React.useMemo(
        () => spellbooks.find(sb => sb.id === viewingId) || null,
        [spellbooks, viewingId]
    );

    const handleDelete = (id: string, name: string) => {
        setConfirmMessage(`Delete the spellbook "${name}"? This cannot be undone.`);
        setConfirmAction(() => () => deleteSpellbook(id));
        setConfirmVisible(true);
    };

    return (
        <View style={[commonStyles.container, { padding: 16, backgroundColor: currentTheme.background, flex: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: currentTheme.text }}>Spellbooks</Text>
                <TouchableOpacity onPress={() => setCreateModalVisible(true)} style={styles.addButton}>
                    <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingBottom: 16 }}>
                {visibleSpellbooks.length > 0 ? (
                    <ScrollView style={[styles.listContainer, { borderColor: currentTheme.primary, backgroundColor: currentTheme.card }]}>
                        {visibleSpellbooks.map(sb => (
                            <TouchableOpacity
                                key={sb.id}
                                onPress={() => setViewingId(sb.id)}
                                activeOpacity={0.7}
                                style={[styles.row, { borderBottomColor: currentTheme.primary }]}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.name, { color: currentTheme.text }]}>{sb.name}</Text>
                                    <Text style={[styles.sub, { color: currentTheme.noticeText }]}>
                                        {(sb.spellsIndex?.length || 0)} spell{(sb.spellsIndex?.length || 0) === 1 ? '' : 's'}
                                        {sb.description ? ` • ${sb.description}` : ''}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(sb.id, sb.name)} style={[styles.actionButton, { backgroundColor: '#dc2626' }]}>
                                    <Ionicons name="trash" size={16} color="white" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={[styles.empty, styles.listContainer, { borderColor: currentTheme.primary, backgroundColor: currentTheme.card }]}>
                        <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                            No spellbooks yet. Create one, then add spells from the Compendium → Spells screen.
                        </Text>
                    </View>
                )}
            </View>

            {/* Create */}
            <CreateSpellbookModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                theme={currentTheme}
            />

            {/* View a spellbook's spells */}
            <BaseModal
                visible={!!viewingSpellbook}
                onClose={() => setViewingId(null)}
                theme={currentTheme}
                title={viewingSpellbook?.name || 'Spellbook'}
                subtitle={`${viewingSpellbook?.spellsIndex?.length || 0} spells`}
            >
                {viewingSpellbook && (viewingSpellbook.spellsIndex?.length || 0) > 0 ? (
                    [...(viewingSpellbook.spellsIndex || [])]
                        .sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name))
                        .map(spell => (
                            <View
                                key={`${spell.name}|${spell.source}`}
                                style={[commonStyles.itemCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.primary }]}
                            >
                                <TouchableOpacity
                                    style={commonStyles.itemInfoContainer}
                                    onPress={() => { setViewingId(null); openSpellModal({ name: spell.name, source: spell.source }); }}
                                >
                                    <Text style={[commonStyles.itemName, { color: currentTheme.text }]}>
                                        <Text style={{ fontWeight: 'bold' }}>{spell.name}</Text>
                                        <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>{'\n'}{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} ({spell.source})</Text>
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => removeSpellFromSpellbook(viewingSpellbook.id, spell.name, spell.source)}
                                    style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
                                >
                                    <Ionicons name="trash-outline" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))
                ) : (
                    <Text style={{ color: currentTheme.noticeText, textAlign: 'center', padding: 12 }}>
                        This spellbook is empty. Add spells from the Compendium → Spells screen.
                    </Text>
                )}
            </BaseModal>

            {/* Confirm delete */}
            <ConfirmModal
                visible={confirmVisible}
                onClose={() => setConfirmVisible(false)}
                onConfirm={() => { if (confirmAction) confirmAction(); }}
                title="Delete Spellbook"
                message={confirmMessage}
                theme={currentTheme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    addButton: { backgroundColor: '#22c55e', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    listContainer: { flex: 1, borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1 },
    name: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    sub: { fontSize: 12, fontStyle: 'italic' },
    actionButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    empty: { padding: 20, alignItems: 'center', justifyContent: 'center' },
});
