// REACT
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
            const textBefore = text.slice(lastIndex, match.index);
            if (textBefore.trim()) {
                nodes.push(<Text key={key++} style={{ color: theme.text }}>{textBefore}</Text>);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0]}</Text>);
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
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0].split(',').map(a => atkMap[a.trim()] || a.trim()).join(', ')}</Text>);
                break;
            case 'damage':
            case 'dice':
                if (onDamagePress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('🎲 Dice button pressed:', params[0]);
                                onDamagePress(params[0]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 1,
                                paddingHorizontal: 3,
                                marginHorizontal: 1,
                                borderRadius: 2,
                                minHeight: 16,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={rollStyle}>{params[0]}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{params[0]}</Text>
                    );
                }
                break;
            case 'dc':
                nodes.push(
                    <Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{`DC ${params[0]}`}</Text>
                );
                break;
            case 'hit':
                if (onHitPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('⚔️ Hit button pressed:', params[0]);
                                onHitPress(params[0]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 1,
                                paddingHorizontal: 3,
                                marginHorizontal: 1,
                                borderRadius: 2,
                                minHeight: 16,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={rollStyle}>{`+${params[0]}`}</Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{`+${params[0]}`}</Text>
                    );
                }
                break;
            case 'h':
            case 'hom':
                // Ignore
                break;
            case 'recharge':
                // Recharge value
                nodes.push(<Text key={key++} style={{ fontWeight: 'bold', color: theme.text }}>{params[0] ? `Recharge ${params[0]}` : 'Recharge'}</Text>);
                break;
            case 'condition':
                // Italic, add parenthesis if | found
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0]}{params[1] ? ` (${params[1]})` : ''}</Text>);
                break;
            case 'creature':
                // Clickable link to bestiary
                if (onCreaturePress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('🐉 Creature button pressed:', params[0], params[1]);
                                onCreaturePress(params[0], params[1]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 1,
                                marginHorizontal: 1,
                                borderRadius: 1,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                                {params[0]}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                            {params[0]}
                        </Text>
                    );
                }
                break;
            case 'spell':
                // Clickable link to spellbook
                if (onSpellPress) {
                    nodes.push(
                        <TouchableOpacity
                            key={key++}
                            onPressIn={() => {
                                console.log('✨ Spell button pressed:', params[0], params[1]);
                                onSpellPress(params[0], params[1]);
                            }}
                            activeOpacity={0.7}
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 1,
                                marginHorizontal: 1,
                                borderRadius: 1,
                                minHeight: 14,
                                zIndex: 1,
                                alignSelf: 'baseline',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                                {params[0]}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    nodes.push(
                        <Text key={key++} style={{ fontStyle: 'italic', textDecorationLine: 'underline', color: '#4a90e2' }}>
                            {params[0]}
                        </Text>
                    );
                }
                break;
            default:
                // Fallback: just show the first param in italic
                nodes.push(<Text key={key++} style={{ fontStyle: 'italic', color: theme.text }}>{params[0]}</Text>);
                break;
        }
        lastIndex = tagRegex.lastIndex;
    }
    // Add any remaining text
    if (lastIndex < text.length) {
        const textAfter = text.slice(lastIndex);
        if (textAfter.trim()) {
            nodes.push(<Text key={key++} style={{ color: theme.text }}>{textAfter}</Text>);
        }
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
        return (
            <Text style={[{ marginLeft: indent, marginBottom: 6, color: theme.text, fontSize: 12, flexWrap: 'wrap' }, textStyle]}>
                {parsed}
            </Text>
        );
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
                            <View style={[{ flex: 1 }]}>
                                {typeof item === 'string' ? (
                                    <Text style={[{ color: theme.text, fontSize: 12, flexWrap: 'wrap' }, textStyle]}>
                                        {replaceTags(item, theme, onCreaturePress, onSpellPress, onDamagePress, onHitPress)}
                                    </Text>
                                ) : renderEntries(item, 0, theme, onCreaturePress, onSpellPress, textStyle, onDamagePress, onHitPress)}
                            </View>
                        </View>
                    ))}
                </View>
            );
        }

        if (entries.type === 'table' && entries.rows) {
            // Calculate column widths based on content
            const calculateColumnWidths = () => {
                const numCols = entries.rows[0]?.length || 0;
                const columnWidths = new Array(numCols).fill(1); // Default equal width
                
                // Analyze content to determine optimal widths
                entries.rows.forEach((row: any[]) => {
                    row.forEach((cell: any, colIdx: number) => {
                        const cellText = typeof cell === 'string' ? cell : String(cell);
                        const cellLength = cellText.length;
                        
                        // If column has mostly short content (like numbers), give it less width
                        if (cellLength < 20) {
                            columnWidths[colIdx] = Math.min(columnWidths[colIdx], 0.3);
                        } else if (cellLength > 100) {
                            // If column has very long content, give it more width
                            columnWidths[colIdx] = Math.max(columnWidths[colIdx], 2);
                        }
                    });
                });
                
                // Normalize widths to sum to numCols
                const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
                return columnWidths.map(width => (width / totalWidth) * numCols);
            };
            
            const columnWidths = calculateColumnWidths();
            
            return (
                <View style={{ marginLeft: indent, marginBottom: 8 }}>
                    {entries.caption && (
                        <Text style={[{ fontWeight: 'bold', marginBottom: 4, color: theme.text, fontSize: 12 }, textStyle]}>
                            {entries.caption}
                        </Text>
                    )}
                    <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 4 }}>
                        {entries.colLabels && (
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.border }}>
                                {entries.colLabels.map((label: string, idx: number) => (
                                    <View key={idx} style={{ 
                                        flex: columnWidths[idx] || 1, 
                                        padding: 8, 
                                        backgroundColor: theme.innerBackground || '#f5f5f5',
                                        borderRightWidth: idx < entries.colLabels.length - 1 ? 1 : 0,
                                        borderRightColor: theme.border
                                    }}>
                                        <Text style={[{ fontWeight: 'bold', color: theme.text, fontSize: 11 }, textStyle]}>
                                            {label}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {entries.rows.map((row: any[], rowIdx: number) => (
                            <View key={rowIdx} style={{ flexDirection: 'row', borderBottomWidth: rowIdx < entries.rows.length - 1 ? 1 : 0, borderBottomColor: theme.border }}>
                                {row.map((cell: any, cellIdx: number) => (
                                    <View key={cellIdx} style={{ 
                                        flex: columnWidths[cellIdx] || 1, 
                                        padding: 8,
                                        borderRightWidth: cellIdx < row.length - 1 ? 1 : 0,
                                        borderRightColor: theme.border,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={[{ color: theme.text, fontSize: 11, flexWrap: 'wrap' }, textStyle]}>
                                            {typeof cell === 'string' ? 
                                                replaceTags(cell, theme, onCreaturePress, onSpellPress, onDamagePress, onHitPress) : 
                                                cell
                                            }
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
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
