// REACT
import { StyleSheet } from 'react-native';

export const createBaseModalStyles = (theme: any) => StyleSheet.create({
    // Overlay and container
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 10,
        paddingTop: 40,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 10,
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
        fontSize: 17,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 3,
    },
    modalSubtitle: {
        fontSize: 12,
        color: theme.noticeText,
        marginBottom: 5,
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
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    modalScrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    modalScrollContent: {
        paddingBottom: 16,
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
        padding: 16,
        alignItems: 'center',
    },
    modalGridLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        color: theme.text,
        marginBottom: 6,
        textAlign: 'center',
    },
    modalGridValue: {
        fontSize: 14,
        color: theme.text,
        textAlign: 'center',
    },

    // Button styles
    modalButton: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
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

    // Checkbox for filter modals
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Action row for modals with multiple buttons
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 8,
        marginTop: 16,
    },

    // Settings option styles
    settingsOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionDescription: {
        fontSize: 12,
    },

    // Conditions grid styles
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    conditionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 4,
        width: '48%',
        minWidth: 0,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },

    // Color grid styles
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: 'black',
    },
    currentSelection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        justifyContent: 'center',
    },
    currentText: {
        fontSize: 14,
        marginRight: 8,
    },
    currentColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },

    // Note input styles
    noteInput: {
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        minHeight: 120,
        textAlignVertical: 'top',
        marginTop: 12,
        borderWidth: 1,
    },

    // Delete button styles
    deleteBtn: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    confirmationContainer: {
        marginTop: 16,
    },
    confirmationText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '500',
    },
    confirmationButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    confirmationBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    // Beast Detail Modal specific styles
    beastDetailModalContent: {
        backgroundColor: theme.card,
        borderRadius: 12,
        marginHorizontal: 10,
        width: '95%',
        maxWidth: '100%',
        maxHeight: '95%',
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 20,
    },
    beastDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    beastDetailHeaderContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    beastDetailHeaderInfo: {
        flex: 1,
        marginLeft: 12,
    },
    beastDetailHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 4,
    },
    beastDetailHeaderSubtitle: {
        fontSize: 14,
        color: theme.noticeText,
        fontStyle: 'italic',
    },
    beastDetailCloseButton: {
        padding: 4,
    },
    beastDetailSeparator: {
        height: 1,
        backgroundColor: theme.border,
    },
    beastDetailImageContainer: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    beastDetailImageLoadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
    },
    beastDetailImage: {
        width: '100%',
        height: 400,
        maxHeight: 500,
        resizeMode: 'contain',
    },
    beastDetailBody: {
        paddingHorizontal: 20,
        flex: 1,
    },
    beastDetailContent: {
        paddingTop: 5,
    },
    beastDetailText: {
        color: theme.text,
        marginBottom: 6,
        fontSize: 12,
    },
    beastDetailBoldText: {
        fontWeight: 'bold',
    },
    beastDetailStatsContainer: {
        flexDirection: 'row',
        marginVertical: 6,
        justifyContent: 'space-between',
    },
    beastDetailStatButton: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 2,
        backgroundColor: theme.primary,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 2,
    },
    beastDetailStatText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    beastDetailStatValue: {
        color: 'white',
        fontSize: 12,
    },
    beastDetailSourceText: {
        color: theme.noticeText,
        fontStyle: 'italic',
        marginTop: 8,
        marginBottom: 18,
        textAlign: 'right',
        fontSize: 10,
    },
    beastDetailFooter: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        alignItems: 'flex-end',
    },
});
