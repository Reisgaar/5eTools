// REACT
import React from 'react';
import { getCommonStyles } from 'src/styles/commonStyles';
import { ActivityIndicator, Text, View } from 'react-native';

// CONTEXTS
import { useData } from 'src/context/DataContext';

// STORES
import { useAppSettingsStore } from 'src/stores/appSettingsStore';

// INTERFACES
interface DataStatusProps {
    showDetails?: boolean;
}

/**
 * DataStatus component.
 */
export default function DataStatus({ showDetails = true }: DataStatusProps) {
    const { beasts, spells, isLoading, isInitialized } = useData();
    const { currentTheme } = useAppSettingsStore();
    const commonStyles = getCommonStyles(currentTheme);

    if (isLoading) {
        return (
            <View style={[commonStyles.p_lg, commonStyles.br_md, commonStyles.ai_center, { backgroundColor: currentTheme.card }]}>
                <ActivityIndicator size="small" color={currentTheme.primary} />
                <Text style={[commonStyles.text_grey, commonStyles.mt_sm, commonStyles.text_md]}>
                    Loading data...
                </Text>
            </View>
        );
    }

    if (!isInitialized) {
        return (
            <View style={[commonStyles.p_lg, commonStyles.br_md, commonStyles.ai_center, { backgroundColor: currentTheme.card }]}>
                <Text style={[commonStyles.text_grey, commonStyles.text_md, commonStyles.text_center]}>
                    No data available
                </Text>
            </View>
        );
    }

    return (
        <View style={[commonStyles.p_lg, commonStyles.br_md, { backgroundColor: currentTheme.card }]}>
            <Text style={[commonStyles.text_lg, commonStyles.text_bold, commonStyles.text_primary, commonStyles.mb_sm]}>
                Data Status
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={[commonStyles.text_grey, commonStyles.text_md]}>
                        Beasts: {beasts.length}
                    </Text>
                </View>
                <View>
                    <Text style={[commonStyles.text_grey, commonStyles.text_md]}>
                        Spells: {spells.length}
                    </Text>
                </View>
            </View>

            {showDetails && beasts.length > 0 && (
                <Text style={[commonStyles.text_grey, commonStyles.text_sm, commonStyles.mt_sm]}>
                    Sample beast: {beasts[0]?.name}
                </Text>
            )}

            {showDetails && spells.length > 0 && (
                <Text style={[commonStyles.text_grey, commonStyles.text_sm, commonStyles.mt_xs]}>
                    Sample spell: {spells[0]?.name}
                </Text>
            )}
        </View>
    );
};
