import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseModal from './BaseModal';
import { commonStyles } from 'src/styles/commonStyles';

interface AddToSpellbookModalProps {
    visible: boolean;
    onClose: () => void;
    spell: any;
    spellbooks: any[];
    onAddToSpellbook: (spellbookId: string, spell: any) => void;
    isSpellInSpellbook: (spellbookId: string, spellName: string, spellSource: string) => boolean;
    theme: any;
}

export default function AddToSpellbookModal({ 
    visible, 
    onClose, 
    spell, 
    spellbooks, 
    onAddToSpellbook, 
    isSpellInSpellbook, 
    theme 
}: AddToSpellbookModalProps) {
    
    const renderSpellbookItem = ({ item }: { item: any }) => {
        if (!spell) return null;
        
        const isInSpellbook = isSpellInSpellbook(item.id, spell.name, spell.source);
        
        return (
            <View style={[commonStyles.modalItem, { backgroundColor: theme.card, borderColor: theme.primary }]}>
                <View style={commonStyles.modalItemInfo}>
                    <Text style={[commonStyles.modalItemName, { color: theme.text }]}>{item.name}</Text>
                    {item.description && (
                        <Text style={[commonStyles.modalItemDescription, { color: theme.noticeText }]}>{item.description}</Text>
                    )}
                    <Text style={[commonStyles.modalItemStats, { color: theme.noticeText }]}>
                        {item.spells.length} spells
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => onAddToSpellbook(item.id, spell)}
                    style={[commonStyles.modalActionButton, { backgroundColor: isInSpellbook ? '#dc2626' : theme.primary }]}
                >
                    <Ionicons 
                        name={isInSpellbook ? "remove" : "add"} 
                        size={16} 
                        color="white" 
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <BaseModal visible={visible} onClose={onClose} theme={theme} title="Add to Spellbook">
            {/* Spell Info */}
            {spell && (
                <View style={[commonStyles.section, { backgroundColor: theme.card }]}>
                    <Text style={[commonStyles.modalItemName, { color: theme.text }]}>{spell.name}</Text>
                    <Text style={[commonStyles.modalItemDescription, { color: theme.noticeText }]}>
                        Level {spell.level === 0 ? 'Cantrip' : spell.level} • {spell.school} • {spell.source}
                    </Text>
                </View>
            )}

            {/* Spellbooks List */}
            <View style={commonStyles.spellbooksSection}>
                <Text style={[commonStyles.sectionTitle, { color: theme.text }]}>Select Spellbook</Text>
                {spellbooks.length === 0 ? (
                    <Text style={[commonStyles.emptyText, { color: theme.noticeText }]}>
                        No spellbooks available. Create one first!
                    </Text>
                ) : (
                    <FlatList
                        data={spellbooks}
                        renderItem={renderSpellbookItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </BaseModal>
    );
}


