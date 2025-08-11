import { StyleSheet, Platform } from 'react-native';

export const createBaseModalStyles = (theme: any) => StyleSheet.create({
    // Overlay and container
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    
    // Main modal content
    modalContent: {
        backgroundColor: theme.card,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000,
        
        // Responsive sizing
        width: Platform.OS === 'web' ? '90%' : '95%',
        maxWidth: Platform.OS === 'web' ? 450 : 500,
        maxHeight: Platform.OS === 'web' ? '85%' : '85%',
        minHeight: Platform.OS === 'web' ? 300 : 400,
    },
    
    // Header section
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    modalHeaderContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    modalToken: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
        borderWidth: 2,
        borderColor: theme.primary,
    },
    modalHeaderInfo: {
        flex: 1,
    },
    modalTitle: {
        fontSize: Platform.OS === 'web' ? 16 : 18,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: Platform.OS === 'web' ? 2 : 4,
    },
    modalSubtitle: {
        fontSize: Platform.OS === 'web' ? 11 : 12,
        color: theme.noticeText,
        marginBottom: Platform.OS === 'web' ? 4 : 6,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalCloseText: {
        color: theme.text,
        fontWeight: 'bold',
        fontSize: 18,
    },
    
    // Separator
    modalSeparator: {
        height: 1,
        backgroundColor: theme.border,
        marginBottom: 16,
    },
    
    // Content sections
    modalBody: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    modalScrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    modalScrollContent: {
        paddingBottom: 20,
    },
    
    // Footer section
    modalFooter: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        alignItems: 'flex-end',
    },
    
    // Generic content styles
    modalSection: {
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 12,
    },
    modalText: {
        fontSize: 14,
        color: theme.text,
        lineHeight: 20,
    },
    modalNoticeText: {
        fontSize: 12,
        color: theme.noticeText,
        fontStyle: 'italic',
    },
    
    // Grid styles for details
    modalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 8,
        marginBottom: 20,
        overflow: 'hidden',
    },
    modalGridItem: {
        width: '50%',
        borderWidth: 1,
        borderColor: theme.border,
        padding: Platform.OS === 'web' ? 12 : 16,
        alignItems: 'center',
    },
    modalGridLabel: {
        fontWeight: 'bold',
        fontSize: Platform.OS === 'web' ? 12 : 14,
        color: theme.text,
        marginBottom: Platform.OS === 'web' ? 4 : 6,
        textAlign: 'center',
    },
    modalGridValue: {
        fontSize: Platform.OS === 'web' ? 12 : 14,
        color: theme.text,
        textAlign: 'center',
    },
    
    // Button styles
    modalButton: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonPrimary: {
        backgroundColor: theme.primary,
    },
    modalButtonSecondary: {
        backgroundColor: theme.innerBackground,
        borderWidth: 1,
        borderColor: theme.border,
    },
    modalButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalButtonTextPrimary: {
        color: theme.buttonText || 'white',
    },
    modalButtonTextSecondary: {
        color: theme.text,
    },
    
    // Input styles
    modalInput: {
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: theme.inputBackground,
        color: theme.text,
        fontSize: 16,
        marginBottom: 16,
    },
    
    // List styles
    modalListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    modalListItemSelected: {
        backgroundColor: theme.primary + '20',
    },
    modalListItemText: {
        flex: 1,
        fontSize: 16,
        color: theme.text,
    },
    modalListItemSubtext: {
        fontSize: 12,
        color: theme.noticeText,
        marginTop: 2,
    },
});

