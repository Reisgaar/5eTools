// REACT
import React from 'react';
import { styleConstants } from 'src/styles/style-constants';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// STORES
import { useAppSettingsStore, useCampaignStore, useSpellbookStore } from 'src/stores';

// CONTEXTS
import { useModal } from 'src/context/ModalContext';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// COMPONENTS
import { BaseModal, Button, ListItem, ActionMenu } from 'src/components/ui';
import ConfirmModal from 'src/components/modals/ConfirmModal';
import { CreateSpellbookModal } from 'src/components/spells';
import { useTabBarInset } from 'src/hooks/useTabBarInset';

// Spellbook management screen (independent, reached from Home). Create/delete spellbooks and
// view their spells. Adding spells happens from the Spells compendium screen.
export default function SpellbooksScreen() {
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);
    const tabInset = useTabBarInset();
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
        <View style={[commonStyles.container, { padding: styleConstants.paddingLG, backgroundColor: currentTheme.background, flex: 1 }]}>
            <View style={[commonStyles.row_between_center, commonStyles.mb_sm]}>
                <Text style={{ fontSize: styleConstants.fontSizeLG, fontWeight: 'bold', color: currentTheme.text }}>Spellbooks</Text>
                <Button title="New" icon="add" size="sm" onPress={() => setCreateModalVisible(true)} />
            </View>

            {visibleSpellbooks.length > 0 ? (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: tabInset }}>
                    {visibleSpellbooks.map(sb => {
                        const count = sb.spellsIndex?.length || 0;
                        return (
                            <ListItem
                                key={sb.id}
                                onPress={() => setViewingId(sb.id)}
                                title={sb.name}
                                subtitle={`${count} spell${count === 1 ? '' : 's'}${sb.description ? ` • ${sb.description}` : ''}`}
                                trailing={
                                    <ActionMenu
                                        title={sb.name}
                                        actions={[
                                            { label: 'Delete', icon: 'trash', destructive: true, onPress: () => handleDelete(sb.id, sb.name) },
                                        ]}
                                    />
                                }
                            />
                        );
                    })}
                </ScrollView>
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
            >
                {viewingSpellbook && (viewingSpellbook.spellsIndex?.length || 0) > 0 ? (
                    [...(viewingSpellbook.spellsIndex || [])]
                        .sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name))
                        .map((spell, idx) => (
                            <View
                                key={`${spell.source}|${spell.name}|${idx}`}
                                style={[commonStyles.itemCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}
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
    listContainer: { flex: 1, borderWidth: styleConstants.borderXS, borderRadius: styleConstants.borderRadiusMD, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: styleConstants.paddingMD, paddingHorizontal: styleConstants.paddingLG, borderBottomWidth: styleConstants.borderXS },
    name: { fontSize: styleConstants.fontSizeLG, fontWeight: '600', marginBottom: styleConstants.margin2XS },
    sub: { fontSize: styleConstants.fontSizeSM, fontStyle: 'italic' },
    actionButton: { width: 32, height: 32, borderRadius: styleConstants.borderRadiusXL, alignItems: 'center', justifyContent: 'center' },
    empty: { padding: styleConstants.paddingXL, alignItems: 'center', justifyContent: 'center' },
});
