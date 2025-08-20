// REACT
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

// STORES
import { useCampaignStore, useSpellbookStore } from 'src/stores';
import { useCombat } from 'src/context/CombatContext';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// UTILS
import { loadPlayersList, savePlayersList } from 'src/utils/fileStorage';

// INTERFACES
interface DataImportModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
}

interface ImportData {
    campaigns: any[];
    players: any[];
    spellbooks: any[];
    combats: any[];
    exportDate: string;
    version: string;
}

interface ConflictItem {
    type: 'campaign' | 'player' | 'spellbook' | 'combat';
    name: string;
    action: 'rename' | 'skip';
    newName?: string;
}

export default function DataImportModal({ visible, onClose, theme }: DataImportModalProps) {
    const { campaigns, createCampaign } = useCampaignStore();
    const { spellbooks, createSpellbook, addSpellToSpellbook } = useSpellbookStore();
    // Combat data is handled by CombatContext
    const { createCombat, combats, reloadCombats, updateCombat } = useCombat();
    
    const [isImporting, setIsImporting] = useState(false);
    const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
    const [showConflictResolution, setShowConflictResolution] = useState(false);
    const [importData, setImportData] = useState<ImportData | null>(null);
    const [players, setPlayers] = useState<any[]>([]);

    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            const file = result.assets[0];
            if (!file) return;

            // Read and parse the file
            const response = await fetch(file.uri);
            const jsonData = await response.text();
            const data: ImportData = JSON.parse(jsonData);

            // Validate the import data
            if (!data.version || !data.exportDate) {
                Alert.alert('Error', 'Invalid export file format.');
                return;
            }

            setImportData(data);
            
            // Load current players for conflict checking
            const currentPlayers = await loadPlayersList();
            setPlayers(currentPlayers);
            
            // Check for conflicts
            const conflictsFound = checkConflicts(data, currentPlayers);
            if (conflictsFound.length > 0) {
                setConflicts(conflictsFound);
                setShowConflictResolution(true);
            } else {
                await performImport(data, []);
            }
        } catch (error) {
            console.error('Import error:', error);
            Alert.alert('Error', 'Failed to read import file. Please check the file format.');
        }
    };

    const handleClose = () => {
        // Reset all state when closing the modal
        setImportData(null);
        setConflicts([]);
        setShowConflictResolution(false);
        setPlayers([]);
        onClose();
    };

    const checkConflicts = (data: ImportData, currentPlayers: any[]): ConflictItem[] => {
        const conflicts: ConflictItem[] = [];
        
        // Check campaigns
        data.campaigns.forEach(campaign => {
            if (campaigns.find(c => c.name === campaign.name)) {
                conflicts.push({
                    type: 'campaign',
                    name: campaign.name,
                    action: 'rename'
                });
            }
        });

        // Check players
        data.players.forEach(player => {
            if (currentPlayers.find(p => p.name === player.name)) {
                conflicts.push({
                    type: 'player',
                    name: player.name,
                    action: 'rename'
                });
            }
        });

        // Check spellbooks
        data.spellbooks.forEach(spellbook => {
            if (spellbooks.find(s => s.name === spellbook.name)) {
                conflicts.push({
                    type: 'spellbook',
                    name: spellbook.name,
                    action: 'rename'
                });
            }
        });

        // Check combats
        data.combats.forEach(combat => {
            if (combats.find(c => c.name === combat.name)) {
                conflicts.push({
                    type: 'combat',
                    name: combat.name,
                    action: 'rename'
                });
            }
        });

        return conflicts;
    };

    const handleConflictAction = (index: number, action: 'rename' | 'skip', newName?: string) => {
        setConflicts(prev => prev.map((conflict, i) => 
            i === index ? { ...conflict, action, newName } : conflict
        ));
    };

    const isImportValid = (): boolean => {
        // Check if all rename conflicts have valid names
        for (const conflict of conflicts) {
            if (conflict.action === 'rename') {
                // Check if input is empty
                if (!conflict.newName || conflict.newName.trim() === '') {
                    return false;
                }
                
                // Check if name already exists
                if (!isNameAvailable(conflict.type, conflict.newName, conflict.name)) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleImportWithConflicts = async () => {
        if (!importData) return;
        
        setIsImporting(true);
        try {
            await performImport(importData, conflicts);
            handleClose();
        } catch (error) {
            console.error('Import error:', error);
            Alert.alert('Error', 'Failed to import data. Please try again.');
        } finally {
            setIsImporting(false);
        }
    };

    const performImport = async (data: ImportData, resolvedConflicts: ConflictItem[]) => {
        // Track campaign ID mappings for renamed campaigns
        const campaignIdMappings: { [oldId: string]: string } = {};
        const skippedCampaignIds: Set<string> = new Set();

        // First pass: Import campaigns and build mappings
        for (const campaign of data.campaigns) {
            const conflict = resolvedConflicts.find(c => c.type === 'campaign' && c.name === campaign.name);
            
            // Skip if there's a conflict and action is 'skip'
            if (conflict && conflict.action === 'skip') {
                skippedCampaignIds.add(campaign.id);
                continue;
            }
            
            // Handle renaming if there's a conflict
            if (conflict && conflict.action === 'rename' && conflict.newName) {
                campaign.name = conflict.newName;
            }
            
            // Create the campaign and store the new ID mapping
            const newCampaignId = createCampaign(campaign.name, campaign.description);
            campaignIdMappings[campaign.id] = newCampaignId;
        }

        // Import players with campaign relationship updates
        const currentPlayers = await loadPlayersList();
        const playersToAdd = data.players.map(player => {
            // Check for conflicts
            const conflict = resolvedConflicts.find(c => c.type === 'player' && c.name === player.name);
            if (conflict && conflict.action === 'skip') {
                return null; // Skip this player
            }
            
            // Handle renaming
            if (conflict && conflict.action === 'rename' && conflict.newName) {
                player.name = conflict.newName;
            }
            
            // Update campaignId based on mappings
            if (player.campaignId) {
                if (skippedCampaignIds.has(player.campaignId)) {
                    // Campaign was skipped, remove the relationship
                    return { ...player, campaignId: undefined };
                } else if (campaignIdMappings[player.campaignId]) {
                    // Campaign was renamed, update to new ID
                    return { ...player, campaignId: campaignIdMappings[player.campaignId] };
                }
            }
            return player;
        }).filter(player => 
            player !== null && !currentPlayers.find(p => p.name === player!.name)
        );
        
        if (playersToAdd.length > 0) {
            await savePlayersList([...currentPlayers, ...playersToAdd]);
        }

        // Import spellbooks with campaign relationship updates
        for (const spellbook of data.spellbooks) {
            const conflict = resolvedConflicts.find(c => c.type === 'spellbook' && c.name === spellbook.name);
            
            // Skip if there's a conflict and action is 'skip'
            if (conflict && conflict.action === 'skip') continue;
            
            // Handle renaming if there's a conflict
            if (conflict && conflict.action === 'rename' && conflict.newName) {
                spellbook.name = conflict.newName;
            }

            // Update campaignId based on mappings
            let updatedCampaignId = spellbook.campaignId;
            if (spellbook.campaignId) {
                if (skippedCampaignIds.has(spellbook.campaignId)) {
                    // Campaign was skipped, remove the relationship
                    updatedCampaignId = undefined;
                } else if (campaignIdMappings[spellbook.campaignId]) {
                    // Campaign was renamed, update to new ID
                    updatedCampaignId = campaignIdMappings[spellbook.campaignId];
                }
            }

            console.log('Creating spellbook:', spellbook.name, 'with campaign ID:', updatedCampaignId);
            const spellbookId = createSpellbook(spellbook.name, spellbook.description, updatedCampaignId);
            console.log('Created spellbook with ID:', spellbookId);
            
            // If spellbook has spells, add them
            if (spellbook.spellsIndex && spellbook.spellsIndex.length > 0) {
                console.log('Adding', spellbook.spellsIndex.length, 'spells to spellbook:', spellbook.name);
                
                for (const spell of spellbook.spellsIndex) {
                    console.log('Adding spell:', spell.name, 'from', spell.source, 'to spellbook:', spellbook.name);
                    addSpellToSpellbook(spellbookId, spell.name, spell.source, {
                        level: spell.level,
                        school: spell.school,
                        ritual: spell.ritual,
                        concentration: spell.concentration,
                        availableClasses: spell.availableClasses
                    });
                }
                
                console.log('Successfully added all spells to spellbook:', spellbook.name);
            }
        }

        // Import combats with campaign relationship updates
        for (const combat of data.combats) {
            const conflict = resolvedConflicts.find(c => c.type === 'combat' && c.name === combat.name);
            
            // Skip if there's a conflict and action is 'skip'
            if (conflict && conflict.action === 'skip') continue;
            
            // Handle renaming if there's a conflict
            if (conflict && conflict.action === 'rename' && conflict.newName) {
                combat.name = conflict.newName;
            }

            // Update campaignId based on mappings
            let updatedCampaignId = combat.campaignId;
            if (combat.campaignId) {
                if (skippedCampaignIds.has(combat.campaignId)) {
                    // Campaign was skipped, remove the relationship
                    updatedCampaignId = undefined;
                } else if (campaignIdMappings[combat.campaignId]) {
                    // Campaign was renamed, update to new ID
                    updatedCampaignId = campaignIdMappings[combat.campaignId];
                }
            }

            // Clean up combatants by fixing invalid token URLs if they exist
            let cleanedCombatants: any[] = [];
            if (combat.combatants && combat.combatants.length > 0) {
                console.log('Cleaning up', combat.combatants.length, 'combatants for combat:', combat.name);
                
                cleanedCombatants = combat.combatants.map((combatant: any) => {
                    // Check if tokenUrl is a local file path that won't exist on this device
                    if (combatant.tokenUrl && (
                        combatant.tokenUrl.startsWith('file://') || 
                        combatant.tokenUrl.startsWith('/var/mobile/') ||
                        combatant.tokenUrl.startsWith('/Users/') ||
                        combatant.tokenUrl.includes('Documents/')
                    )) {
                        console.log('Clearing invalid token URL for combatant:', combatant.name);
                        return {
                            ...combatant,
                            tokenUrl: undefined // This will use the default token
                        };
                    }
                    return combatant;
                });
            }
            
            // Create combat in context (which handles file saving)
            console.log('Creating combat:', combat.name, 'with campaign ID:', updatedCampaignId);
            const combatId = createCombat(combat.name, updatedCampaignId, combat.description);
            console.log('Created combat with ID:', combatId);
            
            // If combat has combatants, add them directly to the file
            if (cleanedCombatants.length > 0) {
                console.log('Adding', cleanedCombatants.length, 'combatants to combat:', combat.name);
                
                // Create the complete combat with combatants
                const completeCombat = {
                    id: combatId,
                    name: combat.name,
                    description: combat.description,
                    createdAt: combat.createdAt || Date.now(),
                    combatants: cleanedCombatants,
                    groupByName: combat.groupByName || {},
                    campaignId: updatedCampaignId
                };
                
                // Save the complete combat to file
                const { storeCombatToFile } = await import('src/utils/fileStorage');
                await storeCombatToFile(completeCombat);
                
                console.log('Successfully created combat with combatants:', combat.name);
            }
        }

        // Wait for all file operations to complete before regenerating
        console.log('Waiting for file operations to complete...');
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Refresh campaigns store
            const { useCampaignStore } = await import('src/stores');
            const campaignStore = useCampaignStore.getState();
            await campaignStore.loadCampaigns();
            
            // Refresh spellbooks store
            const { useSpellbookStore } = await import('src/stores');
            const spellbookStore = useSpellbookStore.getState();
            await spellbookStore.loadSpellbooks();
            console.log('Spellbook store refreshed, spellbooks count:', spellbookStore.spellbooks.length);
            console.log('Spellbooks in store:', spellbookStore.spellbooks.map(sb => ({ name: sb.name, id: sb.id, campaignId: sb.campaignId })));
            
            // Refresh players store
            const { usePlayerStore } = await import('src/stores');
            const playerStore = usePlayerStore.getState();
            await playerStore.loadPlayers();
            console.log('Player store refreshed, players count:', playerStore.players.length);
            
            // Combat context is refreshed by reloadCombats() call below
            console.log('Combat context will be refreshed by reloadCombats()');
            
            // Refresh combat context by regenerating the combat index and reloading
            const { regenerateCombatFiles } = await import('src/utils/fileStorage');
            await regenerateCombatFiles();
            await reloadCombats();
            console.log('Combat context refreshed');
            
            // Force a small delay to ensure all stores are updated and UI re-renders
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Error refreshing stores after import:', error);
        }

        Alert.alert('Success', 'Data imported successfully!');
    };

    const isNameAvailable = (type: string, name: string, currentConflictName: string): boolean => {
        // If the name is the same as the original conflict name, it's not available
        // because that name is already taken by the item we're trying to import
        if (name === currentConflictName) return false;
        
        switch (type) {
            case 'campaign':
                return !campaigns.find(c => c.name === name);
            case 'spellbook':
                return !spellbooks.find(s => s.name === name);
            case 'combat':
                return !combats.find(c => c.name === name);
            case 'player':
                return !players.find(p => p.name === name);
            default:
                return true;
        }
    };

    return (
        <BaseModal
            visible={visible}
            onClose={handleClose}
            theme={theme}
            title={showConflictResolution ? "Resolve Conflicts" : "Import Data"}
            subtitle={showConflictResolution ? "Choose how to handle duplicate items" : "Select a JSON file to import"}
            footerContent={
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={{
                            backgroundColor: '#6b7280',
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius: 8,
                            flex: 0.4
                        }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    {!showConflictResolution ? (
                        <TouchableOpacity
                            onPress={handleFilePick}
                            style={{
                                backgroundColor: theme.primary,
                                paddingVertical: 12,
                                paddingHorizontal: 24,
                                borderRadius: 8,
                                flex: 0.4
                            }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                Select File
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleImportWithConflicts}
                            disabled={isImporting || !isImportValid()}
                            style={{
                                backgroundColor: theme.primary,
                                paddingVertical: 12,
                                paddingHorizontal: 24,
                                borderRadius: 8,
                                flex: 0.4,
                                opacity: (isImporting || !isImportValid()) ? 0.6 : 1
                            }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                {isImporting ? 'Importing...' : 'Import'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
        >
            <ScrollView style={{ flex: 1 }}>
                {showConflictResolution ? (
                    conflicts.map((conflict, index) => (
                        <View key={index} style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.border
                        }}>
                            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                                {conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)}: {conflict.name}
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {['rename', 'skip'].map((action) => (
                                    <TouchableOpacity
                                        key={action}
                                        onPress={() => handleConflictAction(index, action as 'rename' | 'skip')}
                                        style={{
                                            backgroundColor: conflict.action === action ? theme.primary : theme.innerBackground,
                                            paddingVertical: 8,
                                            borderRadius: 6,
                                            flex: 1
                                        }}
                                    >
                                        <Text style={{ 
                                            color: conflict.action === action ? 'white' : theme.text,
                                            textAlign: 'center',
                                            fontSize: 12
                                        }}>
                                            {action === 'rename' ? 'Rename' : 'Skip'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {conflict.action === 'rename' && (
                                <View style={{ marginTop: 8 }}>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: theme.border,
                                            borderRadius: 6,
                                            padding: 8,
                                            color: theme.text,
                                            backgroundColor: theme.innerBackground,
                                            fontSize: 14
                                        }}
                                        placeholder="Enter new name"
                                        placeholderTextColor={theme.noticeText}
                                        value={conflict.newName || ''}
                                        onChangeText={(text) => {
                                            const isAvailable = isNameAvailable(conflict.type, text, conflict.name);
                                            handleConflictAction(index, 'rename', text);
                                        }}
                                    />
                                    {conflict.newName && (
                                        <Text style={{ 
                                            color: isNameAvailable(conflict.type, conflict.newName, conflict.name) ? '#059669' : '#dc2626', 
                                            fontSize: 12, 
                                            marginTop: 4 
                                        }}>
                                            {isNameAvailable(conflict.type, conflict.newName, conflict.name) 
                                                ? '✓ Name available' 
                                                : '✗ Name already exists'
                                            }
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: theme.text, fontSize: 16, textAlign: 'center', marginBottom: 12 }}>
                            Select a JSON file exported from D&D Tools to import your data.
                        </Text>
                        <Text style={{ color: theme.noticeText, fontSize: 14, textAlign: 'center' }}>
                            This will add the imported data to your existing data. If there are conflicts, you'll be asked how to handle them.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </BaseModal>
    );
}
