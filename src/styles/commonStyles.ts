import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    // Container styles
    container: {
        alignItems: 'stretch',
        padding: 20,
        backgroundColor: '#121212',
        flexGrow: 1,
    },
    
    // Header styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    
    // Title styles
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    
    // Input styles
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    
    // Card styles for items (beasts/spells)
    itemCard: {
        backgroundColor: '#232323',
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemInfoContainer: {
        flex: 1,
    },
    itemActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    
    // Item text styles
    itemLevel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemInfo: {
        fontSize: 10,
        fontStyle: 'italic',
    },
    itemSource: {
        fontSize: 12,
        fontWeight: '400',
        marginLeft: 4,
    },
    
    // View mode selector styles
    viewModeSelector: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    viewModeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewModeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    
    // Level filter styles
    levelBar: {
        marginBottom: 16,
        flexGrow: 0,
    },
    levelBtn: {
        width: '8%',
        padding: 4,
        borderRadius: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelBtnText: {
        color: '#ccc',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    
    // Current selection info styles
    currentSelectionInfo: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    currentSelectionText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    // Loading styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loading: {
        color: '#aaa',
        marginVertical: 16,
        textAlign: 'center',
    },
    
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '95%',
        maxWidth: 450,
        maxHeight: '90%',
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 16,
        alignItems: 'stretch',
        elevation: 6,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    modalCloseButton: {
        padding: 4,
    },
    modalSeparator: {
        height: 1,
        marginBottom: 20,
        opacity: 0.3,
    },
    
    // Modal item styles
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    modalItemInfo: {
        flex: 1,
    },
    modalItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    modalItemDescription: {
        fontSize: 14,
        marginBottom: 4,
    },
    modalItemStats: {
        fontSize: 12,
    },
    modalActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    // Section styles
    section: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    spellbooksSection: {
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
    },
    
    // Settings styles
    row: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    langButton: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    selected: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderWidth: 2,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    },
});
