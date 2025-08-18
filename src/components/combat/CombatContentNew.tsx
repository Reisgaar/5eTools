// REACT
import React from 'react';
import { FlatList, View } from 'react-native';

// CONTEXTS
import { useCombat } from 'src/context/CombatContext';
import { useModal } from 'src/context/ModalContext';

// COMPONENTS
import CombatHeader from 'src/components/combat/CombatHeader';
import CombatControls from 'src/components/combat/CombatControls';
import CombatGroup from 'src/components/combat/CombatGroup';
import CombatIndividual from 'src/components/combat/CombatIndividual';
import CombatPlayer from 'src/components/combat/CombatPlayer';

import {
    PlayerModal,
    ValueEditModal,
    HPEditModal,
    MaxHPEditModal,
    StatusModal,
    NoteModal,
    DeleteCombatantModal,
    CombatSettingsModal,
    CombatFormModal,
    TokenViewModal
} from 'src/components/combat/modals';
import { ConfirmModal, ColorModal } from 'src/components/modals';

// STYLES
import { createCombatStyles } from 'src/styles/combat';

// INTERFACES
import { CombatContentProps } from 'src/models/interfaces/combat';

// UTILS
import { getCombatDisplayList } from 'src/utils/combatUtils';
import { loadCombatImages } from 'src/utils/combatUtils';
import { loadPlayersList } from 'src/utils/fileStorage';
import { getCachedTokenUrl } from 'src/utils/tokenCache';

/**
 * Main component for the combat content.
 */
export default function CombatContentNew({
    combatants,
    combatName,
    onUpdateHp,
    onUpdateMaxHp,
    onUpdateAc,
    onUpdateInitiative,
    onUpdateInitiativeForGroup,
    onUpdateColor,
    onUpdateConditions,
    onUpdateNote,
    onRemoveCombatant,
    onRandomizeInitiative,
    onStopCombat,
    onBackToList,
    onEditCombat,
    theme,
    isGroupEnabled,
    toggleGroupForName,
    groupByName,
    round,
    turnIndex,
    started,
    onStartCombat,
    onNextTurn
}: CombatContentProps) {
    const { getTurnOrder, addPlayerCombatant, resetCombatGroups, currentCombat, currentCombatId } = useCombat();
    const { openBeastModal, openSpellModal } = useModal();

    // State for modals
    const [playerModalVisible, setPlayerModalVisible] = React.useState(false);
    const [valueEditModalVisible, setValueEditModalVisible] = React.useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = React.useState(false);
    const [hpEditModalVisible, setHpEditModalVisible] = React.useState(false);
    const [maxHpEditModalVisible, setMaxHpEditModalVisible] = React.useState(false);

    // State for new individual settings modals
    const [combatSettingsModalVisible, setCombatSettingsModalVisible] = React.useState(false);
    const [statusModalVisible, setStatusModalVisible] = React.useState(false);
    const [colorModalVisible, setColorModalVisible] = React.useState(false);
    const [noteModalVisible, setNoteModalVisible] = React.useState(false);
    const [deleteCombatantModalVisible, setDeleteCombatantModalVisible] = React.useState(false);

    // State for token view modal
    const [tokenModalVisible, setTokenModalVisible] = React.useState(false);
    const [tokenModalData, setTokenModalData] = React.useState<{
        tokenUrl: string;
        fallbackUrl: string;
        creatureName: string;
    } | null>(null);

    // State for confirm modal
    const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
    const [confirmModalData, setConfirmModalData] = React.useState<{
        title: string;
        message: string;
        onConfirm: () => void;
            } | null>(null);

    // State for edit combat modal
    const [editCombatModalVisible, setEditCombatModalVisible] = React.useState(false);

    // State for editing
    const [editingValue, setEditingValue] = React.useState<{
        type: 'initiative' | 'hp' | 'ac';
        value: number;
        id: string;
        name: string;
        isGroup: boolean;
        combatantNumber?: number;
    } | null>(null);

    const [editingHp, setEditingHp] = React.useState<{
        id: string;
        name: string;
        currentHp: number;
        maxHp: number;
        combatantNumber?: number;
    } | null>(null);

    const [editingStatus, setEditingStatus] = React.useState<{
        id: string;
        name: string;
        currentColor?: string;
        currentConditions?: string[];
        currentNote?: string;
    } | null>(null);

    // State for players
    const [allPlayers, setAllPlayers] = React.useState<any[]>([]);
    const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);

    // State for cached token URLs
    const [cachedTokenUrls, setCachedTokenUrls] = React.useState<{ [key: string]: string }>({});

    // Refs
    const flatListRef = React.useRef<FlatList>(null);

    // Load cached token URLs
    const loadCachedTokenUrls = async () => {
        const newCachedUrls: { [key: string]: string } = {};

        for (const combatant of combatants) {
            if (combatant.tokenUrl && combatant.source && combatant.name) {
                try {
                    const cachedUrl = await getCachedTokenUrl(combatant.source, combatant.name);
                    if (cachedUrl)
                        newCachedUrls[`${combatant.source}-${combatant.name}`] = cachedUrl;
                } catch (error) {
                    console.error('Error loading cached token URL:', error);
                }
            }
        }

        setCachedTokenUrls(newCachedUrls);
    };

    // Load players list
    const loadPlayers = async () => {
        console.log('🔍 loadPlayers called');
        try {
            const players = await loadPlayersList();
            console.log('📋 Players loaded:', players.length, 'players');
            setAllPlayers(players);
            console.log('✅ Players state updated');
        } catch (error) {
            console.error('❌ Error loading players:', error);
        }
    };

    // Get combat display list
    const groupedCombatants = getCombatDisplayList(combatants, groupByName, started);

    // Memoize the toggle group function to prevent unnecessary re-renders
    const handleToggleGroup = React.useCallback((nameOrigin: string) => {
        toggleGroupForName(nameOrigin);
    }, [toggleGroupForName]);

    // Load data on mount
    React.useEffect(() => {
        loadCachedTokenUrls();
        loadPlayers();
    }, [combatants]);

    // Auto-scroll to active combatant when turn changes
    React.useEffect(() => {
        if (started && flatListRef.current) {
            const turnOrder = getTurnOrder(combatants, groupByName);
            if (turnOrder.length > 0 && turnIndex < turnOrder.length) {
                const activeTurn = turnOrder[turnIndex];
                if (!activeTurn) return;

                // Find the index of the active combatant in the groupedCombatants list
                const activeIndex = groupedCombatants.findIndex(group => {
                    if (group.groupMembers.length === 1) {
                        // Individual combatant
                        return group.groupMembers[0].id === activeTurn.ids[0];
                    } else {
                        // Group - check if any member is active
                        return activeTurn.ids.some(id =>
                            group.groupMembers.some(member => member.id === id)
                        );
                    }
                });

                if (activeIndex !== -1) {
                    // Scroll to the active combatant with a small delay to ensure the list is rendered
                    setTimeout(() => {
                        flatListRef.current?.scrollToIndex({
                            index: activeIndex,
                            animated: true,
                            viewPosition: 0.3, // Position the item 30% from the top
                        });
                    }, 100);
                }
            }
        }
    }, [turnIndex, started, combatants, groupByName, groupedCombatants]);

    // Open player modal
    const openPlayerModal = async () => {
        console.log('🔍 openPlayerModal called');
        try {
            await loadPlayers();
            console.log('✅ Players loaded successfully');
            setPlayerModalVisible(true);
            console.log('✅ Player modal set to visible');
        } catch (error) {
            console.error('❌ Error in openPlayerModal:', error);
        }
    };

    // Handle adding players to combat
    const handleAddPlayersToCombat = () => {
        console.log('➕ handleAddPlayersToCombat called with:', selectedPlayers);
        selectedPlayers.forEach(playerName => {
            const player = allPlayers.find(p => p.name === playerName);
            if (player) {
                console.log('👤 Adding player to combat:', player.name);
                addPlayerCombatant(player);
            } else {
                console.log('❌ Player not found:', playerName);
            }
        });
        setSelectedPlayers([]);
        setPlayerModalVisible(false);
        console.log('✅ Players added, modal closed');
    };

    // Handle value editing
    const handleValueEdit = (type: 'initiative' | 'hp' | 'ac', value: number, id: string, name: string, isGroup: boolean, combatantNumber?: number) => {
        if (type === 'hp') {
            // Find the combatant to get maxHp
            const combatant = combatants.find(c => c.id === id);
            if (combatant) {
                handleHpEdit(id, name, value, combatant.maxHp, combatantNumber);
                return;
            }
        }
        setEditingValue({ type, value, id, name, isGroup, combatantNumber });
        setValueEditModalVisible(true);
    };

    const handleValueAccept = (newValue: number) => {
        if (editingValue) {
            if (editingValue.type === 'initiative') {
                if (editingValue.isGroup)
                    onUpdateInitiativeForGroup(editingValue.name, newValue);
                else
                    onUpdateInitiative(editingValue.id, newValue);
            } else if (editingValue.type === 'hp') {
                onUpdateHp(editingValue.id, newValue);
            } else if (editingValue.type === 'ac') {
                onUpdateAc(editingValue.id, newValue);
            }
        }
        setValueEditModalVisible(false);
        setEditingValue(null);
    };

    const handleValueCancel = () => {
        setValueEditModalVisible(false);
        setEditingValue(null);
    };

    // Handle HP editing
    const handleHpEdit = (id: string, name: string, currentHp: number, maxHp: number, combatantNumber?: number) => {
        setEditingHp({ id, name, currentHp, maxHp, combatantNumber });
        setHpEditModalVisible(true);
    };

    const handleHpAccept = (newCurrentHp: number) => {
        if (editingHp)
            onUpdateHp(editingHp.id, newCurrentHp);

        setHpEditModalVisible(false);
        setEditingHp(null);
    };

    const handleHpCancel = () => {
        setHpEditModalVisible(false);
        setEditingHp(null);
    };

    const handleMaxHpEdit = () => {
        setMaxHpEditModalVisible(true);
    };

    const handleMaxHpAccept = (newMaxHp: number) => {
        if (editingHp) {
            onUpdateMaxHp(editingHp.id, newMaxHp);

            // Calculate the adjusted currentHp based on the logic:
            // - If MaxHP goes down below CurrentHP → CurrentHP = MaxHP
            // - If MaxHP goes up and CurrentHP = MaxHP → CurrentHP goes up with MaxHP
            // - If MaxHP goes up and CurrentHP < MaxHP → CurrentHP stays the same
            let adjustedCurrentHp = editingHp.currentHp;

            if (newMaxHp < editingHp.currentHp) {
                // MaxHP went down below CurrentHP → CurrentHP = MaxHP
                adjustedCurrentHp = newMaxHp;
            } else if (editingHp.currentHp === editingHp.maxHp && newMaxHp > editingHp.maxHp) {
                // MaxHP went up and CurrentHP was equal to MaxHP → CurrentHP goes up with MaxHP
                adjustedCurrentHp = newMaxHp;
            }
            // Otherwise: CurrentHP stays the same

            // Update the editingHp state with both new maxHp and adjusted currentHp
            setEditingHp(prev => prev ? {
                ...prev,
                maxHp: newMaxHp,
                currentHp: adjustedCurrentHp
            } : null);
        }
        setMaxHpEditModalVisible(false);
    };

    const handleMaxHpCancel = () => {
        setMaxHpEditModalVisible(false);
    };

    // Handle status editing - new approach with individual modals
    const handleStatusEdit = (id: string, name: string, currentColor?: string, currentCondition?: string) => {
        const combatant = combatants.find(c => c.id === id);
        setEditingStatus({
            id,
            name,
            currentColor,
            currentConditions: combatant?.conditions || [],
            currentNote: combatant?.note || ''
        });
        setCombatSettingsModalVisible(true);
    };

    // Handle individual settings modal actions
    const handleStatusPress = () => {
        setCombatSettingsModalVisible(false);
        setStatusModalVisible(true);
    };

    const handleColorPress = () => {
        setCombatSettingsModalVisible(false);
        setColorModalVisible(true);
    };

    const handleNotePress = () => {
        setCombatSettingsModalVisible(false);
        setNoteModalVisible(true);
    };

    const handleDeletePress = () => {
        setCombatSettingsModalVisible(false);
        setDeleteCombatantModalVisible(true);
    };

    // Handle status modal actions
    const handleStatusSelect = (conditions: string[]) => {
        if (editingStatus)
            onUpdateConditions(editingStatus.id, conditions);

        setStatusModalVisible(false);
    };

    const handleStatusCancel = () => {
        setStatusModalVisible(false);
    };

    // Handle color modal actions
    const handleColorSelect = (color: string | null) => {
        if (editingStatus)
            onUpdateColor(editingStatus.id, color);

        setColorModalVisible(false);
    };

    const handleColorCancel = () => {
        setColorModalVisible(false);
    };

    // Handle note modal actions
    const handleNoteUpdate = (note: string) => {
        if (editingStatus)
            onUpdateNote(editingStatus.id, note);

        setNoteModalVisible(false);
    };

    const handleNoteCancel = () => {
        setNoteModalVisible(false);
    };

    // Handle delete modal actions
    const handleDeleteConfirm = () => {
        if (editingStatus)
            onRemoveCombatant(editingStatus.id);

        setDeleteCombatantModalVisible(false);
        setEditingStatus(null);
    };

    const handleDeleteCancel = () => {
        setDeleteCombatantModalVisible(false);
    };

    // Handle creature press
    const handleCreaturePress = async (name: string, source: string) => {
        openBeastModal({ name, source });
    };

    // Handle token press - show full image modal
    const handleTokenPress = async (tokenUrl: string | undefined, creatureName: string) => {
        console.log('Token pressed for:', creatureName);

        // Find the combatant by name
        const combatant = combatants.find(c => c.name === creatureName);
        if (!combatant) {
            console.log('No combatant found for:', creatureName);
            return;
        }

        // For players, use the token URL directly
        if (combatant.source === 'player') {
            setTokenModalData({
                tokenUrl: tokenUrl || combatant.tokenUrl || '',
                fallbackUrl: tokenUrl || combatant.tokenUrl || '',
                creatureName
            });
            setTokenModalVisible(true);
            return;
        }

        // For creatures, load images from the source
        if (!combatant.source) {
            console.log('No source found for creature:', creatureName);
            return;
        }

        try {
            // Get both display and modal images
            const images = await loadCombatImages(combatant.source, creatureName);

            setTokenModalData({
                tokenUrl: images.modalUrl, // Use full image for modal
                fallbackUrl: images.displayUrl, // Use token as fallback
                creatureName
            });
            setTokenModalVisible(true);
        } catch (error) {
            console.error('Error loading images for token press:', error);
            // Fallback to token URL if available
            if (tokenUrl) {
                setTokenModalData({
                    tokenUrl,
                    fallbackUrl: tokenUrl,
                    creatureName
                });
                setTokenModalVisible(true);
            }
        }
    };

    // Handle spell press
    const handleSpellPress = async (name: string, source: string) => {
        openSpellModal({ name, source });
    };

    // Function to show confirm modal
    const showConfirmModal = (title: string, message: string, onConfirm: () => void) => {
        setConfirmModalData({ title, message, onConfirm });
        setConfirmModalVisible(true);
    };

    // Handle randomize initiative with confirm modal
    const handleRandomizeInitiativeWithConfirm = () => {
        setConfirmModalData({
            title: 'Randomize Initiative',
            message: 'Do you want to roll initiative for all creatures? (1d20 + initiative bonus)',
            onConfirm: () => {
                console.log('=== RANDOMIZE INITIATIVE CONFIRMED ===');

                if (combatants.length === 0) {
                    console.log('No combatants to update');
                    return;
                }

                // Simple approach: update each combatant individually
                combatants.forEach((combatant, index) => {
                    console.log(`Processing combatant ${index + 1}: ${combatant.name}`);

                    // Roll 1d20
                    const initiativeRoll = Math.floor(Math.random() * 20) + 1;

                    // Get initiative bonus (default to 0 if not set)
                    const initiativeBonus = combatant.initiativeBonus || 0;

                    // Calculate total initiative
                    const totalInitiative = initiativeRoll + initiativeBonus;

                    console.log(`${combatant.name}: roll=${initiativeRoll}, bonus=${initiativeBonus}, total=${totalInitiative}`);

                    // Update the combatant's initiative
                    onUpdateInitiative(combatant.id, totalInitiative);
                });

                console.log('=== RANDOMIZE INITIATIVE COMPLETED ===');
            }
        });
        setConfirmModalVisible(true);
    };

    const turnOrder = getTurnOrder(combatants, groupByName);
    const styles = createCombatStyles(theme);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <CombatHeader
                combatName={combatName}
                onBackToList={onBackToList}
                onRandomizeInitiative={handleRandomizeInitiativeWithConfirm}
                onOpenPlayerModal={() => {
                    console.log('🔗 onOpenPlayerModal prop called');
                    openPlayerModal();
                }}
                onEditCombat={() => setEditCombatModalVisible(true)}
                theme={theme}
            />

            {/* Combat List */}
            <FlatList
                style={styles.combatList}
                ref={flatListRef}
                data={groupedCombatants}
                keyExtractor={(item) => item.key}
                onScrollToIndexFailed={(info) => {
                    console.warn('Failed to scroll to index:', info);
                }}
                renderItem={({ item: group, index }) => {
                    const isActive = started && turnOrder[index] && turnOrder[index].ids.some(id =>
                        combatants.find(c => c.id === id) &&
                        turnOrder.findIndex(turn => turn.ids.includes(id)) === turnIndex
                    );
                    const groupEnabled = isGroupEnabled(group.nameOrigin);

                    // If group is enabled, render as a group
                    // If group is disabled, render each combatant individually
                    return (
                        <>
                            {groupEnabled ? (
                                <CombatGroup
                                    group={group}
                                    isActive={isActive}
                                    isGroupEnabled={groupEnabled}
                                    onToggleGroup={() => handleToggleGroup(group.nameOrigin)}
                                    onValueEdit={handleValueEdit}
                                    onStatusEdit={handleStatusEdit}
                                    onCreaturePress={handleCreaturePress}
                                    onTokenPress={handleTokenPress}
                                    cachedTokenUrls={cachedTokenUrls}
                                    theme={theme}
                                />
                            ) : (
                                <View>
                                    {group.groupMembers.map((member: any, memberIndex: number) => {
                                        // Use CombatPlayer for players, CombatIndividual for creatures
                                        {member.source === 'player' ? (
                                            <CombatPlayer
                                                key={member.id}
                                                combatant={member}
                                                isActive={isActive}
                                                onValueEdit={handleValueEdit}
                                                onStatusEdit={handleStatusEdit}
                                                onCreaturePress={handleCreaturePress}
                                                onTokenPress={handleTokenPress}
                                                cachedTokenUrls={cachedTokenUrls}
                                                theme={theme}
                                            />
                                        ) : (
                                            <CombatIndividual
                                                key={member.id}
                                                combatant={member}
                                                isActive={isActive}
                                                canGroup={group.showGroupButton}
                                                memberIndex={memberIndex + 1}
                                                onToggleGroup={() => handleToggleGroup(group.nameOrigin)}
                                                onValueEdit={handleValueEdit}
                                                onStatusEdit={handleStatusEdit}
                                                onCreaturePress={handleCreaturePress}
                                                onTokenPress={handleTokenPress}
                                                cachedTokenUrls={cachedTokenUrls}
                                                theme={theme}
                                            />
                                        );};
                                    })}
                                </View>
                            )};
                        </>
                    );
                }}
            />

            <CombatControls
                started={started}
                round={round}
                onStopCombat={onStopCombat}
                onNextTurn={onNextTurn}
                onStartCombat={onStartCombat}
                theme={theme}
            />

            {/* Modals */}
            {console.log('🎭 PlayerModal render state:', { visible: playerModalVisible, playersCount: allPlayers.length })}
            <PlayerModal
                visible={playerModalVisible}
                onClose={() => {
                    console.log('🚪 PlayerModal closing');
                    setPlayerModalVisible(false);
                }}
                onAddPlayers={handleAddPlayersToCombat}
                allPlayers={allPlayers}
                selectedPlayers={selectedPlayers}
                onPlayerToggle={(playerName) => {
                    console.log('👤 Player toggle:', playerName);
                    setSelectedPlayers(sel => sel.includes(playerName)
                        ? sel.filter(n => n !== playerName)
                        : [...sel, playerName]);
                }}
                theme={theme}
            />

            <ValueEditModal
                visible={valueEditModalVisible}
                onClose={handleValueCancel}
                onAccept={handleValueAccept}
                title={editingValue?.type === 'initiative' ? 'Edit Initiative' :
                    editingValue?.type === 'hp' ? 'Edit HP' : 'Edit AC'}
                creatureName={editingValue?.name}
                combatantNumber={editingValue?.combatantNumber}
                initialValue={editingValue?.value || 0}
                theme={theme}
                isInitiative={editingValue?.type === 'initiative'}
                initiativeBonus={(() => {
                    if (editingValue?.type !== 'initiative') return 0;
                    if (editingValue?.isGroup) {
                        const combatant = combatants.find(c => c.name === editingValue.name);
                        return combatant?.initiativeBonus || 0;
                    } else {
                        const combatant = combatants.find(c => c.id === editingValue.id);
                        return combatant?.initiativeBonus || 0;
                    }
                })()}
                isGroup={editingValue?.isGroup || false}
            />

            {/* New Individual Settings Modals */}
            <CombatSettingsModal
                visible={combatSettingsModalVisible}
                onClose={() => setCombatSettingsModalVisible(false)}
                onStatusPress={handleStatusPress}
                onColorPress={handleColorPress}
                onNotePress={handleNotePress}
                onDeletePress={handleDeletePress}
                creatureName={editingStatus?.name || 'Creature'}
                theme={theme}
            />

            <StatusModal
                visible={statusModalVisible}
                onClose={handleStatusCancel}
                onAccept={handleStatusSelect}
                currentConditions={editingStatus?.currentConditions || []}
                creatureName={editingStatus?.name || 'Creature'}
                theme={theme}
            />

            <ColorModal
                visible={colorModalVisible}
                onClose={handleColorCancel}
                onAccept={handleColorSelect}
                currentColor={editingStatus?.currentColor}
                creatureName={editingStatus?.name || 'Creature'}
                theme={theme}
            />

            <NoteModal
                visible={noteModalVisible}
                onClose={handleNoteCancel}
                onAccept={handleNoteUpdate}
                currentNote={editingStatus?.currentNote || ''}
                creatureName={editingStatus?.name || 'Creature'}
                theme={theme}
            />

            <DeleteCombatantModal
                visible={deleteCombatantModalVisible}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                creatureName={editingStatus?.name || 'Creature'}
                theme={theme}
            />

            <HPEditModal
                visible={hpEditModalVisible}
                onClose={handleHpCancel}
                onAccept={handleHpAccept}
                onMaxHpEdit={handleMaxHpEdit}
                creatureName={editingHp?.name || 'Creature'}
                combatantNumber={editingHp?.combatantNumber || 1}
                initialCurrentHp={editingHp?.currentHp || 0}
                maxHp={editingHp?.maxHp || 1}
                theme={theme}
            />

            <MaxHPEditModal
                visible={maxHpEditModalVisible}
                onClose={handleMaxHpCancel}
                onAccept={handleMaxHpAccept}
                creatureName={editingHp?.name || 'Creature'}
                combatantNumber={editingHp?.combatantNumber || 1}
                currentHp={editingHp?.currentHp || 0}
                initialMaxHp={editingHp?.maxHp || 1}
                theme={theme}
            />

            {/* Token View Modal */}
            <TokenViewModal
                visible={tokenModalVisible}
                onClose={() => setTokenModalVisible(false)}
                tokenUrl={tokenModalData?.tokenUrl || ''}
                fallbackUrl={tokenModalData?.fallbackUrl || ''}
                creatureName={tokenModalData?.creatureName || ''}
                theme={theme}
            />

            {/* Edit Combat Modal */}
            <CombatFormModal
                visible={editCombatModalVisible}
                onClose={() => setEditCombatModalVisible(false)}
                mode="edit"
                combatId={currentCombatId || ''}
                initialName={combatName}
                initialDescription={currentCombat?.description}
                initialCampaignId={currentCombat?.campaignId}
                theme={theme}
            />

            {/* Confirm Modal */}
            <ConfirmModal
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={() => confirmModalData?.onConfirm()}
                title={confirmModalData?.title || ''}
                message={confirmModalData?.message || ''}
                theme={theme}
            />
        </View>
    );
}
