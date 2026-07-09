// REACT
import { StyleSheet } from 'react-native';
import { styleConstants } from 'src/styles/style-constants';

/**
 * Base styles that are shared across multiple components
 * These styles are theme-agnostic and can be extended with theme-specific styles
 */
export const baseStyles = StyleSheet.create({
    // Modal Base Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalContentWrapper: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: styleConstants.borderRadiusXL,
        overflow: 'hidden',
    },
    modalContent: {
        borderRadius: styleConstants.borderRadiusXL,
        padding: styleConstants.paddingXL,
        alignItems: 'stretch',
        elevation: 6,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: styleConstants.marginLG,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeXL,
        marginBottom: styleConstants.marginLG,
        textAlign: 'center',
    },
    modalCloseButton: {
        padding: styleConstants.paddingXS,
    },
    closeIconBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: styleConstants.paddingXS,
    },

    // Filter Modal Base Styles
    filterModalContent: {
        borderRadius: styleConstants.borderRadiusLG,
        padding: 24,
        width: 340,
        maxWidth: '90%',
        maxHeight: '80%',
    },
    filterClearButton: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusSM,
        paddingHorizontal: styleConstants.paddingXS,
        paddingVertical: styleConstants.padding2XS,
        alignSelf: 'flex-end',
        marginBottom: styleConstants.marginXS,
        minHeight: 24,
        minWidth: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterClearButtonText: {
        fontWeight: 'bold',
        fontSize: styleConstants.fontSizeSM,
    },
    filterScrollView: {
        maxHeight: 300,
        marginVertical: styleConstants.marginSM,
    },
    filterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    filterOptionContainer: {
        width: '33%',
    },
    filterOptionContainerHalf: {
        width: '50%',
    },
    filterOptionContainerFull: {
        width: '100%',
    },
    filterOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingSM,
        paddingHorizontal: styleConstants.paddingXS,
        borderRadius: styleConstants.borderRadiusSM,
        marginBottom: styleConstants.marginXS,
    },
    filterCheckbox: {
        width: 18,
        height: 18,
        borderWidth: styleConstants.borderSM,
        borderRadius: styleConstants.borderRadiusSM,
        marginRight: styleConstants.marginXS,
    },
    filterOptionText: {
        marginLeft: styleConstants.marginSM,
        fontSize: styleConstants.fontSizeMD,
    },
    filterApplyButton: {
        borderRadius: styleConstants.borderRadiusMD,
        paddingVertical: styleConstants.paddingSM,
        alignItems: 'center',
        marginTop: styleConstants.marginMD,
    },
    filterApplyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    // List Item Base Styles
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: styleConstants.paddingMD,
        paddingHorizontal: styleConstants.paddingLG,
        borderRadius: styleConstants.borderRadiusMD,
        marginBottom: styleConstants.marginSM,
    },
    listItemContent: {
        flex: 1,
    },
    listItemName: {
        fontSize: styleConstants.fontSizeLG,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginXS,
    },
    listItemDescription: {
        fontSize: styleConstants.fontSizeSM,
        marginBottom: styleConstants.margin2XS,
    },
    listItemStats: {
        fontSize: styleConstants.fontSizeXS,
    },

    // Detail Modal Base Styles
    detailOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    detailContent: {
        width: '90%',
        maxWidth: 400,
        maxHeight: '85%',
        borderRadius: styleConstants.borderRadiusXL,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    detailCloseBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        width: 30,
        height: 30,
        borderRadius: styleConstants.borderRadiusXL,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailTitle: {
        fontSize: styleConstants.fontSizeXL,
        fontWeight: 'bold',
        marginBottom: styleConstants.marginXS,
    },
    detailSubtitle: {
        fontSize: styleConstants.fontSizeSM,
        marginBottom: styleConstants.marginSM,
        fontStyle: 'italic',
    },
    detailField: {
        fontSize: styleConstants.fontSizeSM,
        marginBottom: styleConstants.marginXS,
    },
    detailEntry: {
        fontSize: styleConstants.fontSizeSM,
        marginBottom: styleConstants.marginXS,
    },
    detailGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        marginBottom: styleConstants.marginSM,
    },
    detailGridItem: {
        width: '50%',
        borderWidth: styleConstants.borderXS,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
    },
    detailGridItemLast: {
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    detailGridLabel: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: styleConstants.fontSizeSM,
    },
    detailGridValue: {
        textAlign: 'center',
    },
    detailScrollView: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        marginTop: styleConstants.marginXS,
    },
    detailScrollContent: {
        paddingVertical: styleConstants.paddingXS,
        paddingHorizontal: styleConstants.paddingSM,
    },
    detailSource: {
        marginTop: 25,
        textAlign: 'right',
        fontSize: styleConstants.fontSizeXS,
        fontStyle: 'italic',
    },
});

/**
 * Helper function to create themed styles by extending base styles
 */
export function createThemedStyles<T extends Record<string, any>>(
    baseStyles: T,
    theme: any,
    themeOverrides: Partial<T> = {}
): T {
    return {
        ...baseStyles,
        ...themeOverrides,
    };
}
