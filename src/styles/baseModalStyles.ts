// REACT
import { StyleSheet } from 'react-native';
import { styleConstants } from 'src/styles/style-constants';

export const createBaseModalStyles = (theme: any) => StyleSheet.create({
    // Overlay and container
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 10
    },
    baseModalContainer: {
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        backgroundColor: theme.card,
        borderRadius: styleConstants.borderRadius2XL,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 8,
        zIndex: 10,
    },

    // Main modal content
    modalContent: {
        backgroundColor: theme.card,
        borderRadius: styleConstants.borderRadius2XL,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 8,
        zIndex: 10,
    },

    // Header section
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: styleConstants.paddingLG,
        paddingVertical: styleConstants.paddingMD,
    },
    modalHeaderContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: styleConstants.marginSM,
    },
    modalToken: {
        width: 32,
        height: 32,
        borderRadius: styleConstants.borderRadiusXL,
        marginRight: styleConstants.marginMD,
        borderWidth: styleConstants.borderSM,
        borderColor: theme.primary,
    },
    modalHeaderInfo: {
        flex: 1,
    },
    modalTitle: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        color: theme.text,
    },
    modalSubtitle: {
        fontSize: styleConstants.fontSizeSM,
        color: theme.noticeText,
        marginTop: styleConstants.margin2XS,
    },
    modalCloseButton: {
        padding: styleConstants.paddingXS,
    },
    modalCloseText: {
        color: theme.text,
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeXL,
    },

    // Separator
    modalSeparator: {
        height: 1,
        backgroundColor: theme.border,
    },

    // Content sections
    modalBody: {
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingSM,
    },

    // Footer section
    modalFooter: {
        paddingHorizontal: styleConstants.paddingXL,
        paddingVertical: styleConstants.paddingMD,
        borderTopWidth: styleConstants.borderXS,
        borderTopColor: theme.border,
        alignItems: 'flex-end',
    },

    // Generic content styles
    modalSection: {
        marginBottom: styleConstants.marginXL,
    },
    modalSectionTitle: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: styleConstants.marginMD,
    },
    modalText: {
        fontSize: styleConstants.fontSizeMD,
        color: theme.text,
        lineHeight: 20,
    },
    modalNoticeText: {
        fontSize: styleConstants.fontSizeSM,
        color: theme.noticeText,
        fontStyle: 'italic',
    },

    // Grid styles for details
    modalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        borderRadius: styleConstants.borderRadiusMD,
        marginBottom: styleConstants.marginXL,
        overflow: 'hidden',
    },
    modalGridItem: {
        width: '50%',
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        padding: styleConstants.paddingLG,
        alignItems: 'center',
    },
    modalGridLabel: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeMD,
        color: theme.text,
        marginBottom: styleConstants.marginXS,
        textAlign: 'center',
    },
    modalGridValue: {
        fontSize: styleConstants.fontSizeMD,
        color: theme.text,
        textAlign: 'center',
    },

    // Button styles
    modalButton: {
        borderRadius: styleConstants.borderRadiusLG,
        paddingVertical: styleConstants.paddingSM,
        paddingHorizontal: styleConstants.paddingXL,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    modalButtonPrimary: {
        backgroundColor: theme.primary,
    },
    modalButtonSecondary: {
        backgroundColor: theme.innerBackground,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
    },
    modalButtonText: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeLG,
    },
    modalButtonTextPrimary: {
        color: theme.buttonText || 'white',
    },
    modalButtonTextSecondary: {
        color: theme.text,
    },

    // Input styles
    modalInput: {
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        borderRadius: styleConstants.borderRadiusLG,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM + 2,
        backgroundColor: theme.inputBackground,
        color: theme.text,
        fontSize: styleConstants.fontSizeLG,
        marginBottom: styleConstants.marginLG,
    },

    // List styles
    modalListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingLG,
        borderBottomWidth: styleConstants.borderXS,
        borderBottomColor: theme.border,
    },
    modalListItemSelected: {
        backgroundColor: theme.primary + '20',
    },
    modalListItemText: {
        flex: 1,
        fontSize: styleConstants.fontSizeLG,
        color: theme.text,
    },
    modalListItemSubtext: {
        fontSize: styleConstants.fontSizeSM,
        color: theme.noticeText,
        marginTop: styleConstants.margin2XS,
    },

    // Checkbox for filter modals
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: styleConstants.borderSM,
        borderRadius: styleConstants.borderRadiusSM,
        marginRight: styleConstants.marginMD,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Action row for modals with multiple buttons
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: styleConstants.gapSM,
        marginTop: styleConstants.marginLG,
    },

    // Settings option styles
    settingsOption: {
        width: '48%',
        marginBottom: styleConstants.marginXS,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingSM,
        borderRadius: styleConstants.borderRadiusMD,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: styleConstants.borderRadius2XL,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: styleConstants.marginMD,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: '600',
        marginBottom: styleConstants.margin2XS,
    },
    optionDescription: {
        fontSize: styleConstants.fontSizeSM,
        textAlign: 'center',
    },

    // Conditions grid styles
    conditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: styleConstants.paddingXS,
    },
    conditionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: styleConstants.marginSM,
        width: '48%',
        minWidth: 0,
    },

    // Color grid styles
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: styleConstants.marginLG,
        gap: styleConstants.gapSM,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: styleConstants.borderRadius2XL,
        margin: styleConstants.marginXS,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: styleConstants.borderXS,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    selectedColor: {
        borderWidth: styleConstants.borderSM,
        borderColor: 'black',
    },
    currentSelection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: styleConstants.marginLG,
        justifyContent: 'center',
    },
    currentText: {
        fontSize: styleConstants.fontSizeMD,
        marginRight: styleConstants.marginSM,
    },
    currentColor: {
        width: 20,
        height: 20,
        borderRadius: styleConstants.borderRadiusMD,
    },

    // Note input styles
    noteInput: {
        borderRadius: styleConstants.borderRadiusMD,
        padding: styleConstants.paddingMD,
        fontSize: styleConstants.fontSizeMD,
        minHeight: 120,
        textAlignVertical: 'top',
        marginTop: styleConstants.marginMD,
        borderWidth: styleConstants.borderXS,
    },

    // Delete button styles
    deleteBtn: {
        paddingVertical: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusMD,
        alignItems: 'center',
        marginTop: styleConstants.marginLG,
    },
    confirmationContainer: {
        marginTop: styleConstants.marginLG,
    },
    confirmationText: {
        fontSize: styleConstants.fontSizeMD,
        textAlign: 'center',
        marginBottom: styleConstants.marginLG,
        fontWeight: '500',
    },
    confirmationButtons: {
        flexDirection: 'row',
        gap: styleConstants.gapMD,
    },
    confirmationBtn: {
        flex: 1,
        paddingVertical: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusMD,
        alignItems: 'center',
    },

    // Beast Detail Modal specific styles
    beastDetailModalContent: {
        backgroundColor: theme.card,
        borderRadius: styleConstants.borderRadius2XL,
        marginHorizontal: styleConstants.marginSM,
        width: '95%',
        maxWidth: '100%',
        maxHeight: '95%',
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: styleConstants.marginXL,
    },
    beastDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: styleConstants.paddingXL,
        borderBottomWidth: styleConstants.borderXS,
        borderBottomColor: theme.border,
    },
    beastDetailHeaderContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    beastDetailHeaderInfo: {
        flex: 1,
        marginLeft: styleConstants.marginMD,
    },
    beastDetailHeaderTitle: {
        fontSize: styleConstants.fontSizeXL,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: styleConstants.marginXS,
    },
    beastDetailHeaderSubtitle: {
        fontSize: styleConstants.fontSizeMD,
        color: theme.noticeText,
        fontStyle: 'italic',
    },
    beastDetailCloseButton: {
        padding: styleConstants.paddingXS,
    },
    beastDetailSeparator: {
        height: 1,
        backgroundColor: theme.border,
    },
    beastDetailImageContainer: {
        alignItems: 'center',
        padding: styleConstants.paddingXL,
        borderBottomWidth: styleConstants.borderXS,
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
        paddingHorizontal: styleConstants.paddingXL,
        flex: 1,
    },
    beastDetailContent: {
        paddingTop: styleConstants.paddingXS,
    },
    beastDetailText: {
        color: theme.text,
        marginBottom: styleConstants.marginXS,
        fontSize: styleConstants.fontSizeSM,
    },
    beastDetailBoldText: {
        fontWeight: 'bold',
    },
    beastDetailStatsContainer: {
        flexDirection: 'row',
        marginVertical: styleConstants.marginXS,
        justifyContent: 'space-between',
    },
    beastDetailStatButton: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: styleConstants.margin2XS,
        backgroundColor: theme.primary,
        borderRadius: styleConstants.borderRadiusLG,
        paddingVertical: styleConstants.paddingXS,
        paddingHorizontal: styleConstants.padding2XS,
    },
    beastDetailStatText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeSM,
    },
    beastDetailStatValue: {
        color: 'white',
        fontSize: styleConstants.fontSizeSM,
    },
    beastDetailSourceText: {
        color: theme.noticeText,
        fontStyle: 'italic',
        marginTop: styleConstants.marginSM,
        marginBottom: styleConstants.marginLG,
        textAlign: 'right',
        fontSize: styleConstants.fontSizeXS,
    },
    beastDetailFooter: {
        paddingHorizontal: styleConstants.paddingXL,
        paddingVertical: styleConstants.paddingMD,
        borderTopWidth: styleConstants.borderXS,
        alignItems: 'flex-end',
    },

    footerButton: {
        width: '48%',
        borderRadius: styleConstants.borderRadiusLG,
        paddingVertical: styleConstants.paddingMD,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeLG,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionContainer: {
        width: '50%',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingSM,
        paddingHorizontal: styleConstants.paddingXS,
        marginBottom: styleConstants.marginXS,
    },
    optionText: {
        fontSize: styleConstants.fontSizeMD,
    },
});
