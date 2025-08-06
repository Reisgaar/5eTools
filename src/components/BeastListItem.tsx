import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { commonStyles } from 'src/styles/commonStyles';

interface BeastListItemProps {
    beast: any;
    onAddToCombat: (beast: any) => void;
    onViewDetails: (beast: any) => void;
    theme: any;
}



// Helper function to get source initials
const getSourceInitials = (source: string): string => {
    if (!source) return '?';
    
    // Handle common source abbreviations
    const sourceMap: { [key: string]: string } = {
        'monster-manual': 'MM',
        'players-handbook': 'PHB',
        'dungeon-masters-guide': 'DMG',
        'volos-guide-to-monsters': 'VGtM',
        'mordenkainens-tome-of-foes': 'MToF',
        'fizbans-treasury-of-dragons': 'FToD',
        'van-richtens-guide-to-ravenloft': 'VRGtR',
        'strixhaven-curriculum-of-chaos': 'SCoC',
        'candlekeep-mysteries': 'CM',
        'tales-from-the-yawning-portal': 'TftYP',
        'ghosts-of-saltmarsh': 'GoS',
        'storm-kings-thunder': 'SKT',
        'curse-of-strahd': 'CoS',
        'out-of-the-abyss': 'OotA',
        'princes-of-the-apocalypse': 'PotA',
        'rise-of-tiamat': 'RoT',
        'hoard-of-the-dragon-queen': 'HotDQ',
        'lost-mine-of-phandelver': 'LMoP',
        'dragon-of-icespire-peak': 'DoIP',
        'descent-into-avernus': 'DiA',
        'baldurs-gate-descent-into-avernus': 'BGDiA',
        'icewind-dale-rime-of-the-frostmaiden': 'IDRotF',
        'the-wild-beyond-the-witchlight': 'WBtW',
        'call-of-the-netherdeep': 'CotN',
        'journeys-through-the-radiant-citadel': 'JttRC',
        'spelljammer-adventures-in-space': 'SAiS',
        'dragonlance-shadow-of-the-dragon-queen': 'DSotDQ',
        'keys-from-the-golden-vault': 'KftGV',
        'planescape-adventures-in-the-multiverse': 'PAitM',
        'bigbys-presentation-of-giants': 'BPoG',
        'the-book-of-many-things': 'TBoMT',
        'phantasmal-force': 'PF',
        'dungeon-masters-guide-2': 'DMG2',
        'monster-manual-2': 'MM2',
        'monster-manual-3': 'MM3',
        'fiend-folio': 'FF',
        'manual-of-the-planes': 'MotP',
        'deities-and-demigods': 'DD',
        'unearthed-arcana': 'UA',
        'eberron-rising-from-the-last-war': 'ERftLW',
        'explorers-guide-to-wildemount': 'EGtW',
        'acquisitions-incorporated': 'AI',
        'guildmasters-guide-to-ravnica': 'GGtR',
        'mythic-odysseys-of-theros': 'MOoT',
        'adventure-with-muk': 'AwM',
        'adventure-with-muk-2': 'AwM2',
        'adventure-with-muk-3': 'AwM3',
        'adventure-with-muk-4': 'AwM4',
        'adventure-with-muk-5': 'AwM5',
        'adventure-with-muk-6': 'AwM6',
        'adventure-with-muk-7': 'AwM7',
        'adventure-with-muk-8': 'AwM8',
        'adventure-with-muk-9': 'AwM9',
        'adventure-with-muk-10': 'AwM10',
        'adventure-with-muk-11': 'AwM11',
        'adventure-with-muk-12': 'AwM12',
        'adventure-with-muk-13': 'AwM13',
        'adventure-with-muk-14': 'AwM14',
        'adventure-with-muk-15': 'AwM15',
        'adventure-with-muk-16': 'AwM16',
        'adventure-with-muk-17': 'AwM17',
        'adventure-with-muk-18': 'AwM18',
        'adventure-with-muk-19': 'AwM19',
        'adventure-with-muk-20': 'AwM20',
        'adventure-with-muk-21': 'AwM21',
        'adventure-with-muk-22': 'AwM22',
        'adventure-with-muk-23': 'AwM23',
        'adventure-with-muk-24': 'AwM24',
        'adventure-with-muk-25': 'AwM25',
        'adventure-with-muk-26': 'AwM26',
        'adventure-with-muk-27': 'AwM27',
        'adventure-with-muk-28': 'AwM28',
        'adventure-with-muk-29': 'AwM29',
        'adventure-with-muk-30': 'AwM30',
        'adventure-with-muk-31': 'AwM31',
        'adventure-with-muk-32': 'AwM32',
        'adventure-with-muk-33': 'AwM33',
        'adventure-with-muk-34': 'AwM34',
        'adventure-with-muk-35': 'AwM35',
        'adventure-with-muk-36': 'AwM36',
        'adventure-with-muk-37': 'AwM37',
        'adventure-with-muk-38': 'AwM38',
        'adventure-with-muk-39': 'AwM39',
        'adventure-with-muk-40': 'AwM40',
        'adventure-with-muk-41': 'AwM41',
        'adventure-with-muk-42': 'AwM42',
        'adventure-with-muk-43': 'AwM43',
        'adventure-with-muk-44': 'AwM44',
        'adventure-with-muk-45': 'AwM45',
        'adventure-with-muk-46': 'AwM46',
        'adventure-with-muk-47': 'AwM47',
        'adventure-with-muk-48': 'AwM48',
        'adventure-with-muk-49': 'AwM49',
        'adventure-with-muk-50': 'AwM50',
        // Additional common sources
        'xanathars-guide-to-everything': 'XGtE',
        'tashas-cauldron-of-everything': 'TCoE',
        'monsters-of-the-multiverse': 'MotM',
        'adventure-with-muk-51': 'AwM51',
        'adventure-with-muk-52': 'AwM52',
        'adventure-with-muk-53': 'AwM53',
        'adventure-with-muk-54': 'AwM54',
        'adventure-with-muk-55': 'AwM55',
        'adventure-with-muk-56': 'AwM56',
        'adventure-with-muk-57': 'AwM57',
        'adventure-with-muk-58': 'AwM58',
        'adventure-with-muk-59': 'AwM59',
        'adventure-with-muk-60': 'AwM60',
    };
    
    const lowerSource = source.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return sourceMap[lowerSource] || source.substring(0, 3).toUpperCase();
};

// Component for individual beast (single source)
export default function BeastListItem({
  beast,
  onAddToCombat,
  onViewDetails,
  theme
}: BeastListItemProps) {
    // Format CR display
    const formatCR = (cr: any): string => {
        if (!cr || cr === 'Unknown' || cr === '') return '?';
        return String(cr);
    };
    
    return (
        <View style={[commonStyles.itemCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
            <TouchableOpacity 
                style={commonStyles.itemInfoContainer}
                onPress={() => onViewDetails(beast)}
            >
                <Text>
                    <Text style={[commonStyles.itemLevel, { color: theme.text }]}>{formatCR(beast.CR)}{' - '}</Text>
                    <Text style={[commonStyles.itemName, { color: theme.text }]}>{beast.name}{' '}</Text>
                    <Text style={[commonStyles.itemInfo, { color: theme.text }]}>({getSourceInitials(beast.source)})</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onAddToCombat(beast)}
                style={[commonStyles.itemActionButton, { backgroundColor: theme.primary }]}
            >
                <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
        </View>
    );
}



