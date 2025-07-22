import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppSettings } from '../context/AppSettingsContext';
import { useData } from '../context/DataContext';

interface DataStatusProps {
    showDetails?: boolean;
}

export const DataStatus: React.FC<DataStatusProps> = ({ showDetails = true }) => {
    const { beasts, spells, isLoading, isInitialized } = useData();
    const { currentTheme } = useAppSettings();

    if (isLoading) {
        return (
            <View style={{ 
                backgroundColor: currentTheme.card,
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
            }}>
                <ActivityIndicator size="small" color={currentTheme.primary} />
                <Text style={{ 
                    color: currentTheme.noticeText,
                    marginTop: 8,
                    fontSize: 14
                }}>
                    Loading data...
                </Text>
            </View>
        );
    }

    if (!isInitialized) {
        return (
            <View style={{ 
                backgroundColor: currentTheme.card,
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
            }}>
                <Text style={{ 
                    color: currentTheme.noticeText,
                    fontSize: 14,
                    textAlign: 'center'
                }}>
                    No data available
                </Text>
            </View>
        );
    }

    return (
        <View style={{ 
            backgroundColor: currentTheme.card,
            padding: 16,
            borderRadius: 8
        }}>
            <Text style={{ 
                fontSize: 16,
                fontWeight: 'bold',
                color: currentTheme.text,
                marginBottom: 8
            }}>
                Data Status
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ 
                        color: currentTheme.noticeText,
                        fontSize: 14
                    }}>
                        Beasts: {beasts.length}
                    </Text>
                </View>
                <View>
                    <Text style={{ 
                        color: currentTheme.noticeText,
                        fontSize: 14
                    }}>
                        Spells: {spells.length}
                    </Text>
                </View>
            </View>

            {showDetails && beasts.length > 0 && (
                <Text style={{ 
                    color: currentTheme.noticeText,
                    fontSize: 12,
                    marginTop: 8
                }}>
                    Sample beast: {beasts[0]?.name}
                </Text>
            )}

            {showDetails && spells.length > 0 && (
                <Text style={{ 
                    color: currentTheme.noticeText,
                    fontSize: 12,
                    marginTop: 4
                }}>
                    Sample spell: {spells[0]?.name}
                </Text>
            )}
        </View>
    );
}; 