// REACT
import { StyleSheet } from 'react-native';
import { styleConstants } from 'src/styles/style-constants';

export const createCombatStyles = (theme: any) => StyleSheet.create({
    // Combat Header Styles
    header: {
        position: 'absolute',
        zIndex: 10,
        top: 10,
        left: '50%',
        transform: [{ translateX: '-50%' }],
        width: '90%',
        height: 46,
        backgroundColor: theme.combatControls,
        borderColor: theme.primary,
        borderWidth: styleConstants.borderSM,
        borderRadius: styleConstants.borderRadiusCircle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: styleConstants.paddingXS,
    },
    headerBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: styleConstants.paddingSM,
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: theme.text,
        fontSize: styleConstants.fontSizeXL,
        fontWeight: 'bold',
        marginLeft: styleConstants.marginSM,
    },
    headerMenuButton: {
        padding: styleConstants.paddingSM,
    },
    headerActionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: styleConstants.gapSM,
    },
    headerIconButton: {
        width: 32,
        height: 32,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerModalSeparator: {
        height: 1,
        backgroundColor: theme.border,
        marginBottom: styleConstants.marginXL,
    },
    headerModalButtonsContainer: {
        alignItems: 'center',
        paddingHorizontal: styleConstants.paddingLG,
    },
    headerModalTitle: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeXL,
        color: theme.text,
        marginBottom: styleConstants.marginLG,
        textAlign: 'center',
    },
    headerModalButton: {
        borderRadius: styleConstants.borderRadiusMD,
        padding: styleConstants.paddingLG,
        marginBottom: styleConstants.marginMD,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        width: 200,
    },
    headerModalButtonPrimary: {
        backgroundColor: theme.primary,
    },
    headerModalButtonSuccess: {
        backgroundColor: '#4CAF50',
    },
    headerModalButtonInfo: {
        backgroundColor: '#2196F3',
    },
    headerModalButtonDanger: {
        backgroundColor: '#f44336',
    },
    headerModalButtonSecondary: {
        backgroundColor: '#eee',
    },
    headerModalButtonText: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeLG,
    },
    headerModalButtonTextPrimary: {
        color: theme.buttonText || 'white',
    },
    headerModalButtonTextLight: {
        color: 'white',
    },
    headerModalButtonTextDark: {
        color: theme.text,
    },

    // Combat Controls Styles
    controls: {
        position: 'absolute',
        zIndex: 10,
        bottom: 8,
        left: '50%',
        transform: [{ translateX: '-50%' }],
        width: '90%',
        height: 46,
        backgroundColor: theme.combatControls,
        borderColor: theme.primary,
        borderWidth: styleConstants.borderSM,
        borderRadius: styleConstants.borderRadiusCircle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    controlsStartButton: {
        backgroundColor: theme.primary,
        borderRadius: 100,
        paddingHorizontal: styleConstants.paddingLG,
        paddingVertical: styleConstants.paddingMD,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    controlsStartIcon: {
        marginRight: styleConstants.marginXS,
    },
    controlsStartText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeMD,
    },
    controlsFinishButton: {
        backgroundColor: '#eee',
        borderRadius: 100,
        paddingVertical: styleConstants.paddingSM,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '31%',
    },
    controlsFinishIcon: {
        marginRight: styleConstants.marginXS,
    },
    controlsFinishText: {
        color: '#c00',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeSM,
    },
    controlRoundButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '31%',
    },
    controlsRoundText: {
        fontSize: styleConstants.fontSizeXS,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: theme.textInverse
    },
    controlsRoundNumberText: {
        fontSize: styleConstants.fontSizeXL,
        fontWeight: 'bold',
        color: theme.textInverse,
    },
    controlsNextButton: {
        backgroundColor: theme.primary,
        borderRadius: 100,
        paddingVertical: styleConstants.paddingSM,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '31%',
    },
    controlsNextIcon: {
        marginRight: styleConstants.marginXS,
    },
    controlsNextText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeSM,
    },

    // Combat Member Styles
    member: {
        marginBottom: styleConstants.marginXS,
    },
    memberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberNumber: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: 'bold',
        marginRight: styleConstants.marginSM,
        color: theme.text,
    },
    memberBox: {
        backgroundColor: theme.card,
        overflow: 'hidden',
        borderRadius: styleConstants.borderRadiusMD,
        padding: styleConstants.paddingXS,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        flex: 1,
    },
    memberButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    memberButton: {
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
        width: 70,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    memberButtonPrimary: {
        backgroundColor: theme.primary,
    },
    memberButtonSuccess: {
        backgroundColor: '#4CAF50',
    },
    memberButtonDanger: {
        backgroundColor: '#f44336',
    },
    memberButtonSmall: {
        width: 60,
    },
    memberButtonSettings: {
        backgroundColor: '#2196F3',
    },
    memberLeftButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: styleConstants.gapSM,
    },
    memberButtonText: {
        fontSize: styleConstants.fontSizeSM,
        fontWeight: 'bold',
    },
    memberButtonTextLight: {
        color: 'white',
    },
    memberButtonTextWhite: {
        color: 'white',
    },
    memberIcon: {
        marginRight: styleConstants.margin2XS,
    },
    memberNotes: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: styleConstants.marginXS,
        marginLeft: 0,
    },
    memberNotesTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: styleConstants.marginXS,
        paddingVertical: styleConstants.padding2XS,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginHorizontal: -4,
        marginTop: -4,
    },
    memberNoteButton: {
        backgroundColor: theme.primary,
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
        marginRight: styleConstants.marginSM,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 32,
    },
    memberNoteText: {
        fontSize: styleConstants.fontSizeXS,
        flex: 1,
        fontStyle: 'italic',
        fontWeight: '600',
    },

    // Status Conditions Styles
    statusContainer: {
        marginTop: styleConstants.marginXS,
        minHeight: 20,
    },
    statusContainerTop: {
        marginBottom: styleConstants.marginXS,
        minHeight: 12,
    },
    statusConditions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    statusBadge: {
        backgroundColor: '#4A5568',
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingXS,
        paddingVertical: styleConstants.padding2XS,
        marginRight: styleConstants.margin2XS,
        marginBottom: styleConstants.margin2XS,
    },
    statusBadgeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statusBadgeTextWeb: {
        fontSize: styleConstants.fontSizeXS,
    },
    statusBadgeTextMobile: {
        fontSize: styleConstants.fontSizeXS,
    },
    memberIconColor: {
        color: 'white', // Default color, will be overridden by theme.buttonText
    },

    // Combat Group Styles
    groupContainer: {
        backgroundColor: theme.card,
        borderRadius: styleConstants.borderRadiusMD,
        marginBottom: styleConstants.marginXS,
        padding: styleConstants.paddingMD,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
    },
    groupHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    // Left column: token and stats
    leftColumn: {
        width: 60,
        alignItems: 'center',
        marginRight: styleConstants.marginLG,
    },
    groupToken: {
        marginBottom: styleConstants.marginSM,
    },
    groupTokenImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    tokenButtonsRow: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 60,
    },
    tokenButton: {
        backgroundColor: theme.primary,
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: 70,
        height: 32,
        marginBottom: styleConstants.margin2XS,
    },
    tokenButtonIcon: {
        marginRight: styleConstants.margin2XS,
    },
    tokenButtonText: {
        color: 'white',
        fontSize: styleConstants.fontSizeSM,
        fontWeight: 'bold',
    },
    // Right column: name and combatants
    rightColumn: {
        flex: 1,
    },

    groupContent: {
        flex: 1,
    },
    groupNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: styleConstants.marginSM,
    },
    groupName: {
        flex: 1,
    },
    groupNameText: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeLG,
        color: 'black', // Will be overridden by theme.text
    },
    groupToggleButton: {
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
    },
    groupToggleButtonGrouped: {
        backgroundColor: '#f44336',
    },
    groupToggleButtonUngrouped: {
        backgroundColor: '#4CAF50',
    },
    groupToggleText: {
        color: 'white',
        fontSize: styleConstants.fontSizeXS,
        fontWeight: 'bold',
    },
    groupButtonsRow: {
        flexDirection: 'row',
        marginBottom: styleConstants.marginSM,
        gap: styleConstants.gapSM,
    },
    groupButton: {
        backgroundColor: theme.primary,
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
        width: 70,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    groupButtonText: {
        color: theme.buttonText || 'white',
        fontSize: styleConstants.fontSizeSM,
        fontWeight: 'bold',
    },
    groupButtonIcon: {
        marginRight: styleConstants.margin2XS,
    },

    // Notes Toggle Styles
    notesToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: styleConstants.paddingLG,
        paddingVertical: styleConstants.paddingSM,
    },
    notesToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notesToggleIcon: {
        marginRight: styleConstants.marginSM,
    },
    notesToggleText: {
        color: theme.text,
        fontWeight: 'bold',
    },

    // Modal Styles
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: theme.card,
        borderRadius: styleConstants.borderRadiusLG,
        padding: 24,
        width: 320,
        maxWidth: '90%',
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeXL,
        color: theme.text,
        marginBottom: styleConstants.marginLG,
    },
    modalInput: {
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        borderRadius: styleConstants.borderRadiusMD,
        padding: styleConstants.paddingMD,
        backgroundColor: theme.innerBackground,
        color: theme.text,
        marginBottom: styleConstants.marginLG,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusMD,
        alignItems: 'center',
    },
    modalButtonSecondary: {
        backgroundColor: '#eee',
        marginRight: styleConstants.marginSM,
    },
    modalButtonPrimary: {
        backgroundColor: theme.primary,
        marginLeft: styleConstants.marginSM,
    },
    modalButtonText: {
        fontWeight: 'bold',
    },
    modalButtonTextSecondary: {
        color: 'black',
    },
    modalButtonTextPrimary: {
        color: theme.buttonText || 'white',
    },

    // Combat List Styles
    listContainer: {
        flex: 1,
        padding: styleConstants.paddingLG,
    },
    listSectionTitle: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginSM,
        marginLeft: styleConstants.marginXS,
        color: 'black', // Will be overridden by theme.text
    },
    listContainerBox: {
        borderRadius: styleConstants.borderRadiusMD,
        borderWidth: styleConstants.borderXS,
        padding: styleConstants.paddingLG,
        marginBottom: styleConstants.marginLG,
        backgroundColor: 'white', // Will be overridden by theme.card
    },
    listCombatNameInput: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM,
        fontSize: styleConstants.fontSizeLG,
        backgroundColor: 'white', // Will be overridden by theme.inputBackground
        color: 'black', // Will be overridden by theme.text
    },
    listCreateBtn: {
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingLG,
        paddingVertical: styleConstants.paddingSM,
        backgroundColor: 'blue', // Will be overridden by theme.primary
    },
    listCreateBtnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    listCombatListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: styleConstants.marginSM,
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
    },
    listCombatOption: {
        flex: 1,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingLG,
        borderBottomWidth: styleConstants.borderXS,
        borderBottomColor: theme.primary,
    },
    listCombatName: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        marginBottom: 0,
        color: 'black', // Will be overridden by theme.text
    },
    listCombatCount: {
        fontSize: styleConstants.fontSizeSM,
        color: 'gray', // Will be overridden by theme.noticeText
        marginLeft: styleConstants.marginSM,
    },
    listActiveBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: styleConstants.paddingXS,
        paddingVertical: styleConstants.padding2XS,
        borderRadius: styleConstants.borderRadiusSM,
        marginLeft: styleConstants.marginSM,
    },
    listActiveBadgeText: {
        color: 'white',
        fontSize: styleConstants.fontSizeXS,
        fontWeight: 'bold',
    },
    listActiveCombatBtn: {
        padding: styleConstants.paddingSM,
        marginLeft: styleConstants.marginSM,
        borderRadius: styleConstants.borderRadiusSM,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue', // Will be overridden by theme.primary
    },
    listEmptyText: {
        color: 'gray', // Will be overridden by theme.noticeText
        textAlign: 'center',
        marginVertical: styleConstants.marginSM,
        fontStyle: 'italic',
        fontSize: styleConstants.fontSizeLG,
    },
    combatList: {
        flex: 1,
        padding: styleConstants.paddingSM
    },

    // Combat Selection Modal Styles
    selectionContainer: {
        marginBottom: styleConstants.marginXL,
    },
    selectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: styleConstants.marginSM,
    },
    selectionTitle: {
        marginBottom: styleConstants.marginSM,
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selectionQuantityBtn: {
        width: 44,
        height: 44,
        borderRadius: styleConstants.borderRadius2XL,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: styleConstants.marginXS,
    },
    selectionQuantityBtnLeft: {
        marginRight: styleConstants.marginSM,
    },
    selectionQuantityBtnRight: {
        marginLeft: styleConstants.marginSM,
    },
    selectionQuantityBtnText: {
        color: 'white',
        fontSize: styleConstants.fontSizeXL,
        fontWeight: 'bold',
    },
    selectionQuantityInput: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        padding: styleConstants.paddingMD,
        width: 80,
        textAlign: 'center',
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
    },
    selectionSection: {
        marginBottom: styleConstants.marginXL,
        flex: 1,
    },
    selectionSectionTitle: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginMD,
    },
    selectionEmptyText: {
        textAlign: 'center',
        marginVertical: styleConstants.marginLG,
        fontStyle: 'italic',
    },
    selectionScrollView: {
        flex: 1,
        minHeight: 120,
        maxHeight: 200,
    },
    selectionCombatOption: {
        padding: styleConstants.paddingLG,
        marginBottom: styleConstants.marginSM,
        borderRadius: styleConstants.borderRadiusLG,
        borderWidth: styleConstants.borderXS,
    },
    selectionCombatName: {
        fontWeight: 'bold',
        marginBottom: styleConstants.marginXS,
        fontSize: styleConstants.fontSizeLG,
    },
    selectionCombatInfo: {
        fontSize: styleConstants.fontSizeSM,
    },
    selectionCreateSection: {
        marginBottom: styleConstants.marginLG,
    },
    selectionCreateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: styleConstants.gapXS,
    },
    selectionCreateInput: {
        flex: 1,
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingSM,
        fontSize: styleConstants.fontSizeMD,
    },
    selectionCreateBtn: {
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingLG,
        paddingVertical: styleConstants.paddingSM,
        minWidth: 60,
        alignItems: 'center',
    },
    selectionCreateBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeMD,
    },
});
