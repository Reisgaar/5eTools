import React from 'react';
import { Text, View } from 'react-native';

// Helper for splitting and replacing tags in a string
export function replaceTags(
    text: string,
    theme: any,
    onCreaturePress?: (name: string, source: string) => void,
    onSpellPress?: (name: string, source: string) => void,
    onDamagePress?: (expression: string) => void,
    onHitPress?: (bonus: string) => void
): React.ReactNode[] {
    if (!text) return [];
    const tagRegex = /\{@(\w+)([^}]*)\}/g;
    let lastIndex = 0;
    let match;
    const nodes: React.ReactNode[] = [];
    let key = 0;

    // Style for rolls (damage, hit, save)
    const rollStyle = {
        backgroundColor: theme.primary,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        color: '#fff',
        fontWeight: 'bold' as const,
        marginHorizontal: 2,
    };

    while ((match = tagRegex.exec(text)) !== null) {
        // Add text before the tag
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }
        const [full, tag, rest] = match;
        const params = rest.split('|').map(s => s.trim());
        // Tag handling
        switch (tag) {
            case 'action':
            case 'adventure':
            case 'b':
            case 'book':
            case 'deity':
            case 'disease':
            case 'feat':
            case 'filter':
            case 'footnote':
            case 'i':
            case 'item':
            case 'note':
            case 'quickref':
            case 'sense':
            case 'skill':
            case 'skillCheck':
            case 'status':
            case 'table':
            case 'variantrule':
                // Italic, stop at first |
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic' }}>{params[0]}</Text>);
                break;
            case 'atk':
            case 'atkr':
                // Attack type(s), e.g. mw = Melee Weapon Attack
                const atkMap: Record<string, string> = {
                    m: 'Melee Attack',
                    r: 'Ranged Attack',
                    mw: 'Melee Weapon Attack',
                    rw: 'Ranged Weapon Attack',
                    ms: 'Melee Spell Attack',
                    rs: 'Ranged Spell Attack',
                };
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic' }}>{params[0].split(',').map(a => atkMap[a.trim()] || a.trim()).join(', ')}</Text>);
                break;
            case 'damage':
            case 'dice':
                if (onDamagePress) {
                    nodes.push(
                        <Text key={key++} style={rollStyle} onPress={() => onDamagePress(params[0])}>{' '}{params[0]}{' '}</Text>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontWeight: 'bold' }}>{' '}{params[0]}{' '}</Text>
                    );
                }
                break;
            case 'dc':
                nodes.push(
                    <Text key={key++} style={{ fontWeight: 'bold' }}>{' '}{`DC ${params[0]}`}{' '}</Text>
                );
                break;
            case 'hit':
                if (onHitPress) {
                    nodes.push(
                        <Text key={key++} style={rollStyle} onPress={() => onHitPress(params[0])}>{' '}{`+${params[0]}`}{' '}</Text>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontWeight: 'bold' }}>{' '}{`+${params[0]}`}{' '}</Text>
                    );
                }
                break;
            case 'h':
            case 'hom':
                // Ignore
                break;
            case 'recharge':
                // Recharge value
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold' }}>{params[0] ? `Recharge ${params[0]}` : 'Recharge'}</Text>);
                break;
            case 'condition':
                // Italic, add parenthesis if | found
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic' }}>{params[0]}{params[1] ? ` (${params[1]})` : ''}</Text>);
                break;
            case 'creature':
                // Clickable link to bestiary
                nodes.push(
                    <Text
                        key={key++}
                        style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}
                        onPress={onCreaturePress ? () => onCreaturePress(params[0], params[1]) : undefined}
                    >
                        {params[0]}
                    </Text>
                );
                break;
            case 'spell':
                // Clickable link to spellbook
                nodes.push(
                    <Text
                        key={key++}
                        style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}
                        onPress={onSpellPress ? () => onSpellPress(params[0], params[1]) : undefined}
                    >
                        {params[0]}
                    </Text>
                );
                break;
            default:
                // Fallback: just show the first param in italic
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic' }}>{params[0]}</Text>);
                break;
        }
        lastIndex = tagRegex.lastIndex;
    }
    // Add any remaining text
    if (lastIndex < text.length) {
        nodes.push(<Text key={key++}>{text.slice(lastIndex)}</Text>);
    }
    return nodes;
}

// Shared function to render complex entries including lists
export function renderEntries(
    entries: any, 
    indent: number = 0, 
    theme: any, 
    onCreaturePress?: (name: string, source: string) => void, 
    onSpellPress?: (name: string, source: string) => void,
    textStyle: any = {},
    onDamagePress?: (expression: string) => void,
    onHitPress?: (bonus: string) => void
): React.ReactNode {
    if (!entries) return null;
    
    if (typeof entries === 'string') {
        const parsed = replaceTags(entries, theme, onCreaturePress, onSpellPress, onDamagePress, onHitPress);
        return <Text style={[{ marginLeft: indent, marginBottom: 6, color: theme.text, fontSize: 12 }, textStyle]}>{parsed}</Text>;
    }
    
    if (Array.isArray(entries)) {
        return entries.map((entry, idx) => (
            <React.Fragment key={idx}>
                {renderEntries(entry, indent, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress)}
            </React.Fragment>
        ));
    }
    
    if (typeof entries === 'object') {
        if (entries.type === 'entries' && entries.name) {
            return (
                <View key={entries.name + indent} style={{ marginLeft: indent + 10, marginBottom: 4 }}>
                    <Text style={[{ fontWeight: 'bold', marginBottom: 2, color: theme.text, fontSize: 12 }, textStyle]}>{entries.name}.</Text>
                    {renderEntries(entries.entries, indent + 10, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress)}
                </View>
            );
        }
        
        if (entries.type === 'list' && entries.items) {
            return (
                <View style={{ marginLeft: indent, marginBottom: 4 }}>
                    {entries.items.map((item: any, idx: number) => (
                        <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
                            <Text style={[{ color: theme.text, marginRight: 8, fontSize: 12 }, textStyle]}>•</Text>
                            <Text style={[{ color: theme.text, flex: 1, fontSize: 12 }, textStyle]}>
                                {typeof item === 'string' ? replaceTags(item, theme, onCreaturePress, onSpellPress, onDamagePress, onHitPress) : renderEntries(item, 0, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress)}
                            </Text>
                        </View>
                    ))}
                </View>
            );
        }
        
        if (entries.entries) {
            return renderEntries(entries.entries, indent, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress);
        }
        
        // Fallback for unknown object types
        return <Text style={[{ marginLeft: indent, color: theme.text, fontSize: 12 }, textStyle]}>{JSON.stringify(entries)}</Text>;
    }
    
    return null;
}

// Parse dice expressions like '12d8 + 5' or '2d6-1'
export function parseDiceExpression(expr: string): { numDice: number, diceType: number, modifier: number } | null {
    // Match patterns like 12d8, 12d8+5, 12d8 - 5, 1d6, 1d6+1, etc.
    const match = expr.replace(/\s+/g, '').match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) return null;
    const numDice = parseInt(match[1], 10);
    const diceType = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;
    return { numDice, diceType, modifier };
}

// Roll dice given numDice, diceType, and modifier
export function rollDice(numDice: number, diceType: number, modifier: number = 0): { result: number, breakdown: number[] } {
    const breakdown: number[] = [];
    for (let i = 0; i < numDice; i++) {
        breakdown.push(Math.floor(Math.random() * diceType) + 1);
    }
    const result = breakdown.reduce((a, b) => a + b, 0) + modifier;
    return { result, breakdown };
}
