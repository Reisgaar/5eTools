// REACT
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header: React.FC = () => {
    return (
        <SafeAreaView style={{ backgroundColor: "#000", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }} edges={['top']}>
            <Image source={require('../../assets/images/logo_lg.png')} style={[styles.logo, { height: 30, width: 30 }]} />
            <Image source={require('../../assets/images/name.png')} style={[styles.logo, { height: 16, width: 90 }]} />
        </SafeAreaView>
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
});

export default Header;
