// REACT
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// CONTEXTS
import { useCampaign } from 'src/context/CampaignContext';
import { useAppSettings } from 'src/context/AppSettingsContext';

// COMPONENTS
import { CampaignSelectorModal } from 'src/components/modals';

const Header: React.FC = () => {
    const { selectedCampaign, selectedCampaignId, clearSelectedCampaign } = useCampaign();
    const { currentTheme } = useAppSettings();
    const [campaignModalVisible, setCampaignModalVisible] = React.useState(false);

    const handleCampaignPress = () => {
        setCampaignModalVisible(true);
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: currentTheme.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }} edges={['top']}>
                <Image source={require('../../../assets/images/logo_lg.png')} style={[styles.logo, { height: 30, width: 30 }]} />
                
                {selectedCampaignId && selectedCampaignId !== 'all' ? (
                    <TouchableOpacity onPress={handleCampaignPress} style={styles.campaignContainer}>
                        <Text style={[styles.campaignText, { color: currentTheme.text }]}>
                            {selectedCampaign?.name}
                        </Text>
                    </TouchableOpacity>
                ) : selectedCampaignId === 'all' ? (
                    <TouchableOpacity onPress={handleCampaignPress} style={styles.campaignContainer}>
                        <Text style={[styles.campaignText, { color: currentTheme.text }]}>
                            Campaign: all
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Image source={require('../../../assets/images/name.png')} style={[styles.logo, { height: 16, width: 90 }]} />
                )}
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
    campaignContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    campaignText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Header;
