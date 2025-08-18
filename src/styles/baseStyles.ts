// REACT
import { StyleSheet } from 'react-native';

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
        zIndex: 1000,
    },
    modalContentWrapper: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: 16,
        overflow: 'hidden',
    },
    modalContent: {
        borderRadius: 16,
        padding: 20,
        alignItems: 'stretch',
        elevation: 6,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalCloseButton: {
        padding: 4,
    },
    closeIconBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 4,
    },

    // Filter Modal Base Styles
    filterModalContent: {
        borderRadius: 12,
        padding: 24,
        width: 340,
        maxWidth: '90%',
        maxHeight: '80%',
    },
    filterClearButton: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignSelf: 'flex-end',
        marginBottom: 6,
        minHeight: 24,
        minWidth: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterClearButtonText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    filterScrollView: {
        maxHeight: 300,
        marginVertical: 10,
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
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 6,
        marginBottom: 4,
    },
    filterCheckbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 4,
    },
    filterOptionText: {
        marginLeft: 8,
        fontSize: 14,
    },
    filterApplyButton: {
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 12,
    },
    filterApplyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    // List Item Base Styles
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    listItemContent: {
        flex: 1,
    },
    listItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    listItemDescription: {
        fontSize: 12,
        marginBottom: 2,
    },
    listItemStats: {
        fontSize: 10,
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
        zIndex: 1000,
    },
    detailContent: {
        width: '90%',
        maxWidth: 400,
        maxHeight: '85%',
        borderRadius: 16,
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
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    detailSubtitle: {
        fontSize: 12,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    detailField: {
        fontSize: 12,
        marginBottom: 4,
    },
    detailEntry: {
        fontSize: 12,
        marginBottom: 6,
    },
    detailGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    detailGridItem: {
        width: '50%',
        borderWidth: 1,
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
        fontSize: 12,
    },
    detailGridValue: {
        textAlign: 'center',
    },
    detailScrollView: {
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5,
    },
    detailScrollContent: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    detailSource: {
        marginTop: 25,
        textAlign: 'right',
        fontSize: 10,
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
