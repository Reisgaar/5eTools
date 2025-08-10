import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SourceFilterModalProps {
  visible: boolean;
  onClose: () => void;
  sourceOptions: string[];
  selectedSources: string[];
  onToggleSource: (source: string) => void;
  onClear: () => void;
  onApply: () => void;
  theme: any;
  sourceIdToNameMap: Record<string, string>;
}

// Function to get source acronym
const getSourceAcronym = (sourceName: string): string => {
  const acronymMap: { [key: string]: string } = {
    "Player's Handbook": "PHB",
    "Dungeon Master's Guide": "DMG",
    "Monster Manual": "MM",
    "Volo's Guide to Monsters": "VGtM",
    "Mordenkainen's Tome of Foes": "MToF",
    "Tasha's Cauldron of Everything": "TCoE",
    "Xanathar's Guide to Everything": "XGtE",
    "Fizban's Treasury of Dragons": "FToD",
    "Mordenkainen Presents: Monsters of the Multiverse": "MPMM",
    "The Wild Beyond the Witchlight": "WBtW",
    "Van Richten's Guide to Ravenloft": "VRGtR",
    "Strixhaven: A Curriculum of Chaos": "SACoC",
    "Candlekeep Mysteries": "CM",
    "Icewind Dale: Rime of the Frostmaiden": "IDRotF",
    "Explorer's Guide to Wildemount": "EGtW",
    "Eberron: Rising from the Last War": "ERftLW",
    "Acquisitions Incorporated": "AI",
    "Guildmasters' Guide to Ravnica": "GGtR",
    "Mythic Odysseys of Theros": "MOoT",
    "Theros: Beyond Death": "TBD",
    "Baldur's Gate: Descent into Avernus": "BGDiA",
    "Dragon Heist": "DH",
    "Dungeon of the Mad Mage": "DotMM",
    "Ghosts of Saltmarsh": "GoS",
    "Princes of the Apocalypse": "PotA",
    "Out of the Abyss": "OotA",
    "Curse of Strahd": "CoS",
    "Storm King's Thunder": "SKT",
    "Tales from the Yawning Portal": "TftYP",
    "Tomb of Annihilation": "ToA",
    "Hoard of the Dragon Queen": "HotDQ",
    "The Rise of Tiamat": "RoT",
    "Lost Mine of Phandelver": "LMoP",
    "Tyranny of Dragons": "ToD",
    "Elemental Evil Player's Companion": "EEPC",
    "Sword Coast Adventurer's Guide": "SCAG",
    "Unearthed Arcana": "UA",
    "Adventure League": "AL",
    "Homebrew": "HB",
    "Critical Role": "CR",
    "D&D Beyond": "DDB",
    "Dungeon Master's Guild": "DMG",
    "Kobold Press": "KP",
    "Green Ronin": "GR",
    "Paizo": "PZ",
    "Wizards of the Coast": "WotC",
    "Other": "OTH"
  };
  
  return acronymMap[sourceName] || sourceName.substring(0, 3).toUpperCase();
};

export default function SourceFilterModal({
  visible,
  onClose,
  sourceOptions,
  selectedSources,
  onToggleSource,
  onClear,
  onApply,
  theme,
  sourceIdToNameMap
}: SourceFilterModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.modalContent, { backgroundColor: theme.card }]} activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Filter by Source
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          <View style={styles.modalBody}>
            <TouchableOpacity 
              onPress={onClear} 
              style={[styles.clearButton, { borderColor: theme.primary }]}
            > 
              <Text style={[styles.clearButtonText, { color: theme.primary }]}>Clear</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.scrollView}>
              <View style={styles.optionsGrid}> 
                {sourceOptions
                  .filter(source => source !== '[object Object]')
                  .map(source => ({
                    id: source,
                    name: sourceIdToNameMap[source.toUpperCase()] ? sourceIdToNameMap[source.toUpperCase()] : source.toUpperCase()
                  }))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(({ id, name }) => {
                    const acronym = getSourceAcronym(name);
                    return (
                      <View key={id} style={styles.optionContainerFull}>
                        <TouchableOpacity
                          style={[
                            styles.optionRow, 
                            { borderColor: theme.border },
                            selectedSources.includes(id) && { backgroundColor: theme.primary + '20' }
                          ]}
                          onPress={() => onToggleSource(id)}
                        >
                          <View style={[
                            styles.checkbox, 
                            { borderColor: theme.primary },
                            selectedSources.includes(id) && { backgroundColor: theme.primary }
                          ]} />
                          <View style={styles.optionTextContainer}>
                            <Text style={[styles.optionText, { color: theme.text }]}>
                              {name}
                            </Text>
                            <Text style={[styles.optionAcronym, { color: theme.noticeText }]}>
                              ({acronym})
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              onPress={onApply} 
              style={[styles.applyButton, { backgroundColor: theme.primary }]}
            > 
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 0,
    marginHorizontal: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  separator: {
    height: 1,
    marginBottom: 0,
  },
  modalBody: {
    padding: 20,
  },
  clearButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    marginBottom: 16,
    minHeight: 24,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  scrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionContainerFull: {
    width: '100%',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
  },
  optionAcronym: {
    fontSize: 12,
    marginLeft: 4,
  },
  applyButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});