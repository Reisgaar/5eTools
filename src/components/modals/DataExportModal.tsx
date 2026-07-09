// REACT
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

// STORES
import { useCampaignStore, useSpellbookStore } from 'src/stores';
import { useCombat } from 'src/context/CombatContext';

// COMPONENTS
import { BaseModal } from 'src/components/ui';

// STYLES
import { getCommonStyles } from 'src/styles/commonStyles';

// UTILS
import { loadPlayersList } from 'src/utils/fileStorage';

// INTERFACES
interface DataExportModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
}

interface ExportData {
    campaigns: any[];
    players: any[];
    spellbooks: any[];
    combats: any[];
    exportDate: string;
    version: string;
}

export default function DataExportModal({ visible, onClose, theme }: DataExportModalProps) {
    const { campaigns } = useCampaignStore();
    const { spellbooks } = useSpellbookStore();
    const { combats } = useCombat();
    const commonStyles = getCommonStyles(theme);

    // Load data and initialize selections when modal opens
    React.useEffect(() => {
        if (visible) {
            loadPlayerCount();
            initializeSelections();
        }
    }, [visible]);

    const initializeSelections = () => {
        // Initialize selected items for all data types
        setSelectedItems({
            campaigns: campaigns.map(c => c.id),
            players: [], // Will be set after loading players
            spellbooks: spellbooks.map(s => s.id),
            combats: combats.map(c => c.id)
        });
    };
    
    const loadPlayerCount = async () => {
        try {
            const loadedPlayers = await loadPlayersList();
            setPlayers(loadedPlayers);
            setPlayerCount(loadedPlayers.length);
            // Initialize selected players
            setSelectedItems(prev => ({
                ...prev,
                players: loadedPlayers.map(p => p.name)
            }));
        } catch (error) {
            console.error('Error loading player count:', error);
            setPlayerCount(0);
        }
    };
    
    const [selectedData, setSelectedData] = useState({
        campaigns: true,
        players: true,
        spellbooks: true,
        combats: true
    });
    const [selectedItems, setSelectedItems] = useState({
        campaigns: [] as string[],
        players: [] as string[],
        spellbooks: [] as string[],
        combats: [] as string[]
    });
    const [isExporting, setIsExporting] = useState(false);
    const [playerCount, setPlayerCount] = useState(0);
    const [players, setPlayers] = useState<any[]>([]);

    const handleToggleSelection = (key: keyof typeof selectedData) => {
        setSelectedData(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        
        // If selecting all, select all items of that type
        if (selectedData[key]) {
            // Deselecting all
            setSelectedItems(prev => ({
                ...prev,
                [key]: []
            }));
        } else {
            // Selecting all
            const allItems = getAllItems(key);
            setSelectedItems(prev => ({
                ...prev,
                [key]: allItems
            }));
        }
    };

    const handleToggleItem = (type: keyof typeof selectedData, itemId: string) => {
        setSelectedItems(prev => {
            const currentItems = prev[type];
            const newItems = currentItems.includes(itemId)
                ? currentItems.filter(id => id !== itemId)
                : [...currentItems, itemId];
            
            // Update the main checkbox based on selection
            const allItems = getAllItems(type);
            const allSelected = allItems.length > 0 && allItems.every(item => newItems.includes(item));
            
            setSelectedData(prevData => ({
                ...prevData,
                [type]: allSelected
            }));
            
            return {
                ...prev,
                [type]: newItems
            };
        });
    };

    const getAllItems = (type: keyof typeof selectedData): string[] => {
        switch (type) {
            case 'campaigns': return campaigns.map(c => c.id);
            case 'players': return players.map(p => p.name);
            case 'spellbooks': return spellbooks.map(s => s.id);
            case 'combats': return combats.map(c => c.id);
            default: return [];
        }
    };

    const getItemsForType = (type: keyof typeof selectedData): any[] => {
        switch (type) {
            case 'campaigns': return campaigns;
            case 'players': return players;
            case 'spellbooks': return spellbooks;
            case 'combats': return combats;
            default: return [];
        }
    };

    const getItemId = (type: keyof typeof selectedData, item: any): string => {
        switch (type) {
            case 'campaigns': return item.id;
            case 'players': return item.name;
            case 'spellbooks': return item.id;
            case 'combats': return item.id;
            default: return '';
        }
    };

    const getItemName = (type: keyof typeof selectedData, item: any): string => {
        switch (type) {
            case 'campaigns': return item.name;
            case 'players': return item.name;
            case 'spellbooks': return item.name;
            case 'combats': return item.name;
            default: return '';
        }
    };

    const handleExport = async () => {
        const hasSelectedItems = Object.values(selectedItems).some(items => items.length > 0);
        if (!hasSelectedItems) {
            Alert.alert('Error', 'Please select at least one item to export.');
            return;
        }

        setIsExporting(true);
        try {
            // Collect data based on individual item selection
            const exportData: ExportData = {
                campaigns: campaigns.filter(c => selectedItems.campaigns.includes(c.id)),
                players: players.filter(p => selectedItems.players.includes(p.name)),
                spellbooks: spellbooks.filter(s => selectedItems.spellbooks.includes(s.id)),
                combats: combats.filter(c => selectedItems.combats.includes(c.id)),
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };

            // Create JSON file
            const jsonData = JSON.stringify(exportData, null, 2);
            const fileName = `dtools_export_${new Date().toISOString().split('T')[0]}.json`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, jsonData);

            // Share the file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/json',
                    dialogTitle: 'Export D&D Tools Data'
                });
            } else {
                Alert.alert('Success', `Data exported to: ${fileUri}`);
            }

            onClose();
        } catch (error) {
            console.error('Export error:', error);
            Alert.alert('Error', 'Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const getDataCount = (type: keyof typeof selectedData) => {
        switch (type) {
            case 'campaigns': return campaigns.length;
            case 'players': return playerCount;
            case 'spellbooks': return spellbooks.length;
            case 'combats': return combats.length;
            default: return 0;
        }
    };

    return (
        <BaseModal
            visible={visible}
            onClose={onClose}
            theme={theme}
            title="Export Data"
            subtitle="Select the data you want to export"
            footerContent={
                <View style={[commonStyles.w_100, { flexDirection: 'row' }, commonStyles.jc_around]}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[commonStyles.py_md, commonStyles.br_md, {
                            backgroundColor: '#6b7280',
                            paddingHorizontal: 24,
                            flex: 0.4
                        }]}
                    >
                        <Text style={[commonStyles.text_center, commonStyles.text_bold, { color: 'white' }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleExport}
                        disabled={isExporting}
                        style={[commonStyles.py_md, commonStyles.br_md, {
                            backgroundColor: theme.primary,
                            paddingHorizontal: 24,
                            flex: 0.4,
                            opacity: isExporting ? 0.6 : 1
                        }]}
                    >
                        <Text style={[commonStyles.text_center, commonStyles.text_bold, { color: 'white' }]}>
                            {isExporting ? 'Exporting...' : 'Export'}
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <ScrollView style={{ flex: 1 }}>
                {Object.entries(selectedData).map(([key, isSelected]) => {
                    const items = getItemsForType(key as keyof typeof selectedData);
                    const selectedCount = selectedItems[key as keyof typeof selectedData].length;
                    
                    return (
                        <View key={key} style={[commonStyles.bw_xs, commonStyles.br_md, commonStyles.mb_sm, { borderColor: theme.tabBorder, overflow: 'hidden' }]}>
                            {/* Main category checkbox */}
                            <TouchableOpacity
                                onPress={() => handleToggleSelection(key as keyof typeof selectedData)}
                                style={[{ flexDirection: 'row' }, commonStyles.ai_center, commonStyles.py_lg, commonStyles.px_md, commonStyles.bwb_xs, {
                                    borderBottomColor: theme.border,
                                    backgroundColor: isSelected ? theme.primary + '10' : 'transparent'
                                }]}
                            >
                                <View style={[commonStyles.br_sm, commonStyles.bw_sm, commonStyles.mr_md, commonStyles.jc_center, commonStyles.ai_center, {
                                    width: 20,
                                    height: 20,
                                    borderColor: theme.primary,
                                    backgroundColor: isSelected ? theme.primary : 'transparent'
                                }]}>
                                    {isSelected && (
                                        <Text style={[commonStyles.text_sm, commonStyles.text_bold, { color: 'white' }]}>✓</Text>
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[commonStyles.text_primary, commonStyles.text_lg, { fontWeight: '600', textTransform: 'capitalize' }]}>
                                        {key}
                                    </Text>
                                    <Text style={[commonStyles.text_grey, commonStyles.text_sm]}>
                                        {selectedCount} of {items.length} items selected
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                            {/* Individual items */}
                            {items.length > 0 && (
                                <View style={[commonStyles.pl_xl, { backgroundColor: theme.innerBackground }]}>
                                    {items.map((item) => {
                                        const itemId = getItemId(key as keyof typeof selectedData, item);
                                        const isItemSelected = selectedItems[key as keyof typeof selectedData].includes(itemId);
                                        
                                        return (
                                            <TouchableOpacity
                                                key={itemId}
                                                onPress={() => handleToggleItem(key as keyof typeof selectedData, itemId)}
                                                style={[{ flexDirection: 'row' }, commonStyles.ai_center, commonStyles.py_md, commonStyles.px_lg, {
                                                    borderBottomWidth: 0.5,
                                                    borderBottomColor: theme.border,
                                                    backgroundColor: isItemSelected ? theme.primary + '05' : 'transparent'
                                                }]}
                                            >
                                                <View style={[commonStyles.br_xs, commonStyles.mr_sm, commonStyles.jc_center, commonStyles.ai_center, {
                                                    width: 16,
                                                    height: 16,
                                                    borderWidth: 1.5,
                                                    borderColor: theme.primary,
                                                    backgroundColor: isItemSelected ? theme.primary : 'transparent'
                                                }]}>
                                                    {isItemSelected && (
                                                        <Text style={[commonStyles.text_xs, commonStyles.text_bold, { color: 'white' }]}>✓</Text>
                                                    )}
                                                </View>
                                                <Text style={[commonStyles.text_primary, commonStyles.text_md, {
                                                    flex: 1
                                                }]}>
                                                    {getItemName(key as keyof typeof selectedData, item)}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </BaseModal>
    );
}
