// REACT
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    // CONTAINERS
    pageContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    descriptionContainer: {
        padding: 18,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 32,
    },
    headerWithButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },

    // TEXT
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
    },
    linkText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        textDecorationLine: 'underline',
    },
    noticeText: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    description: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    skillValue: {
        fontSize: 18,
        width: 30,
        textAlign: 'center',
    },

    // BUTTONS
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    langButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    settingsButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    settingsButtonText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 8,
        gap: 8,
    },
    backButtonText: {
        fontSize: 16,
        marginLeft: 8,
    },
    confirmButton: {
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 10,
    },
    confirmButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // INPUTS
    input: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },

    // DISPLAY
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    skillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    skillLabel: {
        fontSize: 18,
        flex: 1,
    },

    // STATUS
    selected: {
        borderWidth: 2,
    },
});
