import React, { useMemo } from 'react';
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
  sourceIdToNameMap?: Record<string, string>;
}

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
  // Pre-compute selected state for better performance
  const selectedSet = useMemo(() => new Set(selectedSources), [selectedSources]);

  // Function to get source acronym (e.g., "Player's Handbook" -> "PHB")
  const getSourceAcronym = (sourceName: string): string => {
    const acronyms: Record<string, string> = {
      "player's handbook": "PHB",
      "monster manual": "MM",
      "dungeon master's guide": "DMG",
      "volo's guide to monsters": "VGtM",
      "mordenkainen's tome of foes": "MToF",
      "tasha's cauldron of everything": "TCoE",
      "xanathar's guide to everything": "XGtE",
      "fizban's treasury of dragons": "FToD",
      "mordenkainen presents: monsters of the multiverse": "MPMM",
      "the wild beyond the witchlight": "WBtW",
      "van richten's guide to ravenloft": "VRGtR",
      "strixhaven: a curriculum of chaos": "SACoC",
      "candlekeep mysteries": "CM",
      "tales from the yawning portal": "TftYP",
      "ghosts of saltmarsh": "GoS",
      "princes of the apocalypse": "PotA",
      "out of the abyss": "OotA",
      "curse of strahd": "CoS",
      "storm king's thunder": "SKT",
      "tomb of annihilation": "ToA",
      "waterdeep: dragon heist": "WDH",
      "waterdeep: dungeon of the mad mage": "WDMM",
      "baldur's gate: descent into avernus": "BGDIA",
      "icewind dale: rime of the frostmaiden": "IDRotF",
      "theros": "Theros",
      "ravnica": "Ravnica",
      "eberron": "Eberron",
      "acquisitions incorporated": "AI",
      "explorer's guide to wildemount": "EGtW",
      "mythic odysseys of theros": "MOoT",
      "guildmasters' guide to ravnica": "GGtR",
      "wayfinder's guide to eberron": "WGtE",
      "rising from the last war": "RftLW",
      "eberron: rising from the last war": "ERftLW",
      "unearthed arcana": "UA",
      "adventure league": "AL",
      "dungeon masters guild": "DMG",
      "homebrew": "Homebrew",
      "custom": "Custom"
    };
    
    const normalizedName = sourceName.toLowerCase().trim();
    return acronyms[normalizedName] || sourceName;
  };

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
                {sourceOptions.map(source => {
                  const isSelected = selectedSet.has(source);
                  const displayName = sourceIdToNameMap && sourceIdToNameMap[source] ? sourceIdToNameMap[source] : source;
                  const acronym = getSourceAcronym(displayName);
                  return (
                    <View key={source} style={styles.optionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.optionRow, 
                          { borderColor: theme.border },
                          isSelected && { backgroundColor: theme.primary + '20' }
                        ]}
                        onPress={() => onToggleSource(source)}
                      >
                        <View style={[
                          styles.checkbox, 
                          { borderColor: theme.primary },
                          isSelected && { backgroundColor: theme.primary }
                        ]} />
                        <View style={styles.optionTextContainer}>
                          <Text style={[styles.optionText, { color: theme.text }]}>
                            {displayName}
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
  optionContainer: {
    width: '48%', // Adjust as needed for 2 columns
    marginBottom: 8,
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