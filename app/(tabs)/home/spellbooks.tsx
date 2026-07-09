// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import ReorderableList, { useReorderableDrag } from 'react-native-reorderable-list';
import { BaseModal, Button, ListItem, ActionMenu } from 'src/components/ui';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import { CreateSpellbookModal } from 'src/components/spells';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// UTILS
import { reorderFullBySubset, moveItem } from 'src/utils/reorder';

// A single draggable spellbook row (long-press anywhere to reorder).
function SpellbookRow({ sb, onOpen, onDelete }: { sb: any; onOpen: (id: string) => void; onDelete: (id: string, name: string) => void }) {
    const drag = useReorderableDrag();
    const count = sb.spellsIndex?.length || 0;
    return (
        <ListItem
            onPress={() => onOpen(sb.id)}
            onLongPress={drag}
            title={sb.name}
            subtitle={`${count} spell${count === 1 ? '' : 's'}${sb.description ? ` • ${sb.description}` : ''}`}
            trailing={
                <ActionMenu
                    title={sb.name}
                    actions={[{ label: 'Delete', icon: 'trash', destructive: true, onPress: () => onDelete(sb.id, sb.name) }]}
                />
            }
        />
    );
}

// A single draggable spell row inside a spellbook (long-press to reorder, tap to open).
function SpellbookSpellRow({ spell, onOpen, onRemove }: { spell: any; onOpen: (spell: any) => void; onRemove: (spell: any) => void }) {
    const drag = useReorderableDrag();
    return (
        <ListItem
            onPress={() => onOpen(spell)}
            onLongPress={drag}
            title={spell.name}
            subtitle={`${spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} (${spell.source})`}
            trailing={
                <TouchableOpacity onPress={() => onRemove(spell)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ padding: styleConstants.paddingXS }}>
                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                </TouchableOpacity>
            }
        />
    );
}

// Spellbook management screen (independent, reached from Home). Create/delete spellbooks and
// view their spells. Adding spells happens from the Spells compendium screen.
export default function SpellbooksScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
    const { selectedCampaign } = useCampaignStore();
    const { spellbooks, deleteSpellbook, removeSpellFromSpellbook, reorderSpellbooks, reorderSpellbookSpells } = useSpellbookStore();
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
        <View style={[commonStyles.container, { padding: styleConstants.paddingLG, backgroundColor: currentTheme.background, flex: 1 }]}>
            <View style={[commonStyles.row_between_center, commonStyles.mb_sm]}>
                <Text style={{ fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', color: currentTheme.text }}>Spellbooks</Text>
                <Button title="New" icon="add" size="sm" onPress={() => setCreateModalVisible(true)} />
            </View>

            {visibleSpellbooks.length > 0 ? (
                <ReorderableList
                    data={visibleSpellbooks}
                    keyExtractor={(item: any) => item.id}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: tabInset }}
                    onReorder={({ from, to }) => reorderSpellbooks(reorderFullBySubset(spellbooks, visibleSpellbooks, from, to, (s: any) => s.id))}
                    renderItem={({ item }) => (
                        <SpellbookRow sb={item} onOpen={setViewingId} onDelete={handleDelete} />
                    )}
                />
            ) : (
                <View style={[styles.empty, { flex: 1 }]}>
                    <Text style={{ color: currentTheme.noticeText, textAlign: 'center' }}>
                        No spellbooks yet. Create one, then add spells from the Compendium → Spells screen.
                    </Text>
                </View>
            )}

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
                scrollable={false}
            >
                {viewingSpellbook && (viewingSpellbook.spellsIndex?.length || 0) > 0 ? (
                    <ReorderableList
                        data={viewingSpellbook.spellsIndex || []}
                        keyExtractor={(item: any) => `${item.source}|${item.name}`}
                        onReorder={({ from, to }) => reorderSpellbookSpells(viewingSpellbook.id, moveItem(viewingSpellbook.spellsIndex || [], from, to))}
                        renderItem={({ item }) => (
                            <SpellbookSpellRow
                                spell={item}
                                onOpen={(s) => { setViewingId(null); openSpellModal({ name: s.name, source: s.source }); }}
                                onRemove={(s) => removeSpellFromSpellbook(viewingSpellbook.id, s.name, s.source)}
                            />
                        )}
                    />
                ) : (
                    <Text style={{ color: currentTheme.noticeText, textAlign: 'center', padding: styleConstants.paddingMD }}>
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
    empty: { padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' },
});
