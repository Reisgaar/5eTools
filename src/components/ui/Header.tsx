// REACT
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// EXPO
import { usePathname } from 'expo-router';

// CONTEXTS
import { useCampaign } from 'src/context/CampaignContext';
import { useAppSettings } from 'src/context/AppSettingsContext';

// COMPONENTS
import CampaignSelectorModal from 'src/components/modals/CampaignSelectorModal';

const Header: React.FC = () => {
    const { selectedCampaign, selectedCampaignId, clearSelectedCampaign } = useCampaign();
    const { currentTheme } = useAppSettings();
    const [campaignModalVisible, setCampaignModalVisible] = React.useState(false);

    const handleCampaignPress = () => {
        setCampaignModalVisible(true);
    };

    // Map pathname to tab name
    const getTabName = () => {
        const path = usePathname(); 
        const name = path.substring(path.lastIndexOf('/') + 1).charAt(0).toUpperCase() + path.substring(path.lastIndexOf('/') + 2)
        return !name || name === '' ? 'Home' : name.toLowerCase() === 'combat' ? 'Combat Manager' : name;
    };

    return (
        <>
            <SafeAreaView style={{
                backgroundColor: currentTheme.background, 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderBottomWidth: 2,
                borderBottomColor: currentTheme.text,
            }} edges={['top']}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                    <Image source={require('../../../assets/images/logo_lg.png')} style={[styles.logo, { height: 30, width: 30, borderRadius: 6 }]} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: currentTheme.text }}>{getTabName()}</Text>
                </View>
                
                <TouchableOpacity onPress={handleCampaignPress} style={[styles.filterBtn, { borderColor: selectedCampaignId ? currentTheme.primary : currentTheme.text }]}>
                    <Text style={[styles.filterBtnText, { color: selectedCampaignId ? currentTheme.primary : currentTheme.text }]}>
                        {selectedCampaignId && selectedCampaign ? selectedCampaign.name : 'All Campaigns'}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>

            <CampaignSelectorModal 
                visible={campaignModalVisible} 
                onClose={() => setCampaignModalVisible(false)} 
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        padding: 2,
        borderColor: '#ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        resizeMode: 'contain',
    },
    filterBtn: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBtnText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default Header;
