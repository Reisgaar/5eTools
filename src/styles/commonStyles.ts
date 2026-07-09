// REACT
import { StyleSheet } from 'react-native';
import { styleConstants } from './style-constants';
import { Theme } from 'src/theme/theme';

// Theme-aware common styles factory (mirrors the reference project's getCommonStyles pattern).
// Layout/geometry styles are theme-independent; color styles read from the passed theme.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getCommonStyles = (theme: Theme) => StyleSheet.create({
    // DISPLAYS
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    },
    absoluteWithContenCentered: {
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: styleConstants.percent100,
        height: styleConstants.percent100,
        alignItems: 'center',
        justifyContent: 'center'
    },

    // POSITIONS
    relative: { position: 'relative' },
    absolute: { position: 'absolute' },

    // ALIGNMENTS
    ai_baseline: { alignItems: 'baseline' },
    ai_center: { alignItems: 'center' },
    ai_end: { alignItems: 'flex-end' },
    ai_start: { alignItems: 'flex-start' },
    ai_stretch: { alignItems: 'stretch' },

    jc_center: { justifyContent: 'center' },
    jc_end: { justifyContent: 'flex-end' },
    jc_start: { justifyContent: 'flex-start' },
    jc_around: { justifyContent: 'space-around' },
    jc_between: { justifyContent: 'space-between' },
    jc_evenly: { justifyContent: 'space-evenly' },

    // DISPLAY ROW COMBINATIONS
    row_center_baseline: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline' },
    row_center_center: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    row_center_end: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' },
    row_center_start: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' },
    row_center_stretch: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' },

    row_end_baseline: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'baseline' },
    row_end_center: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
    row_end_end: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' },
    row_end_start: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' },
    row_end_stretch: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'stretch' },

    row_start_baseline: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'baseline' },
    row_start_center: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    row_start_end: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' },
    row_start_start: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' },
    row_start_stretch: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch' },

    row_around_baseline: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'baseline' },
    row_around_center: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    row_around_end: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
    row_around_start: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' },
    row_around_stretch: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'stretch' },

    row_between_baseline: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    row_between_center: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    row_between_end: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    row_between_start: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    row_between_stretch: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' },

    row_evenly_baseline: { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'baseline' },
    row_evenly_center: { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
    row_evenly_end: { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-end' },
    row_evenly_start: { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start' },
    row_evenly_stretch: { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'stretch' },

    // WIDTHS
    w_screenLimit: { maxWidth: styleConstants.screenWidthLimitWithMainPadding },
    w_100: { width: styleConstants.percent100 },
    w_90: { width: styleConstants.percent90 },
    w_80: { width: styleConstants.percent80 },
    w_75: { width: styleConstants.percent75 },
    w_70: { width: styleConstants.percent70 },
    w_60: { width: styleConstants.percent60 },
    w_50: { width: styleConstants.percent50 },
    w_40: { width: styleConstants.percent40 },
    w_33: { width: styleConstants.percent33 },
    w_30: { width: styleConstants.percent30 },
    w_25: { width: styleConstants.percent25 },
    w_20: { width: styleConstants.percent20 },
    w_15: { width: styleConstants.percent15 },
    w_10: { width: styleConstants.percent10 },

    // HEIGHTS
    h_100: { height: styleConstants.percent100 },
    h_90: { height: styleConstants.percent90 },
    h_80: { height: styleConstants.percent80 },
    h_75: { height: styleConstants.percent75 },
    h_70: { height: styleConstants.percent70 },
    h_60: { height: styleConstants.percent60 },
    h_50: { height: styleConstants.percent50 },
    h_40: { height: styleConstants.percent40 },
    h_33: { height: styleConstants.percent33 },
    h_30: { height: styleConstants.percent30 },
    h_25: { height: styleConstants.percent25 },
    h_20: { height: styleConstants.percent20 },
    h_15: { height: styleConstants.percent15 },
    h_10: { height: styleConstants.percent10 },

    // BORDERS
    bw_xs: { borderWidth: styleConstants.borderXS },
    bw_sm: { borderWidth: styleConstants.borderSM },
    bw_md: { borderWidth: styleConstants.borderMD },
    bw_lg: { borderWidth: styleConstants.borderLG },
    bw_xl: { borderWidth: styleConstants.borderXL },
    bwt_xs: { borderTopWidth: styleConstants.borderXS },
    bwt_sm: { borderTopWidth: styleConstants.borderSM },
    bwt_md: { borderTopWidth: styleConstants.borderMD },
    bwt_lg: { borderTopWidth: styleConstants.borderLG },
    bwt_xl: { borderTopWidth: styleConstants.borderXL },
    bwr_xs: { borderRightWidth: styleConstants.borderXS },
    bwr_sm: { borderRightWidth: styleConstants.borderSM },
    bwr_md: { borderRightWidth: styleConstants.borderMD },
    bwr_lg: { borderRightWidth: styleConstants.borderLG },
    bwr_xl: { borderRightWidth: styleConstants.borderXL },
    bwb_xs: { borderBottomWidth: styleConstants.borderXS },
    bwb_sm: { borderBottomWidth: styleConstants.borderSM },
    bwb_md: { borderBottomWidth: styleConstants.borderMD },
    bwb_lg: { borderBottomWidth: styleConstants.borderLG },
    bwb_xl: { borderBottomWidth: styleConstants.borderXL },
    bwl_xs: { borderLeftWidth: styleConstants.borderXS },
    bwl_sm: { borderLeftWidth: styleConstants.borderSM },
    bwl_md: { borderLeftWidth: styleConstants.borderMD },
    bwl_lg: { borderLeftWidth: styleConstants.borderLG },
    bwl_xl: { borderLeftWidth: styleConstants.borderXL },

    // BORDER RADIUS
    br_xs: { borderRadius: styleConstants.borderRadiusXS },
    br_sm: { borderRadius: styleConstants.borderRadiusSM },
    br_md: { borderRadius: styleConstants.borderRadiusMD },
    br_lg: { borderRadius: styleConstants.borderRadiusLG },
    br_xl: { borderRadius: styleConstants.borderRadiusXL },
    brts_xs: { borderTopStartRadius: styleConstants.borderRadiusXS },
    brts_sm: { borderTopStartRadius: styleConstants.borderRadiusSM },
    brts_md: { borderTopStartRadius: styleConstants.borderRadiusMD },
    brts_lg: { borderTopStartRadius: styleConstants.borderRadiusLG },
    brts_xl: { borderTopStartRadius: styleConstants.borderRadiusXL },
    brte_xs: { borderTopEndRadius: styleConstants.borderRadiusXS },
    brte_sm: { borderTopEndRadius: styleConstants.borderRadiusSM },
    brte_md: { borderTopEndRadius: styleConstants.borderRadiusMD },
    brte_lg: { borderTopEndRadius: styleConstants.borderRadiusLG },
    brte_xl: { borderTopEndRadius: styleConstants.borderRadiusXL },
    brbs_xs: { borderBottomStartRadius: styleConstants.borderRadiusXS },
    brbs_sm: { borderBottomStartRadius: styleConstants.borderRadiusSM },
    brbs_md: { borderBottomStartRadius: styleConstants.borderRadiusMD },
    brbs_lg: { borderBottomStartRadius: styleConstants.borderRadiusLG },
    brbs_xl: { borderBottomStartRadius: styleConstants.borderRadiusXL },
    brbe_xs: { borderBottomEndRadius: styleConstants.borderRadiusXS },
    brbe_sm: { borderBottomEndRadius: styleConstants.borderRadiusSM },
    brbe_md: { borderBottomEndRadius: styleConstants.borderRadiusMD },
    brbe_lg: { borderBottomEndRadius: styleConstants.borderRadiusLG },
    brbe_xl: { borderBottomEndRadius: styleConstants.borderRadiusXL },
    br_circle: { borderRadius: styleConstants.borderRadiusCircle },

    // GAPS
    gap_xs: { gap: styleConstants.gapXS },
    gap_sm: { gap: styleConstants.gapSM },
    gap_md: { gap: styleConstants.gapMD },
    gap_lg: { gap: styleConstants.gapLG },
    gap_xl: { gap: styleConstants.gapXL },

    // MARGINS
    m_2xs: { margin: styleConstants.margin2XS },
    m_xs: { margin: styleConstants.marginXS },
    m_sm: { margin: styleConstants.marginSM },
    m_md: { margin: styleConstants.marginMD },
    m_lg: { margin: styleConstants.marginLG },
    m_xl: { margin: styleConstants.marginXL },
    mx_2xs: { marginHorizontal: styleConstants.margin2XS },
    mx_xs: { marginHorizontal: styleConstants.marginXS },
    mx_sm: { marginHorizontal: styleConstants.marginSM },
    mx_md: { marginHorizontal: styleConstants.marginMD },
    mx_lg: { marginHorizontal: styleConstants.marginLG },
    mx_xl: { marginHorizontal: styleConstants.marginXL },
    my_2xs: { marginVertical: styleConstants.margin2XS },
    my_xs: { marginVertical: styleConstants.marginXS },
    my_sm: { marginVertical: styleConstants.marginSM },
    my_md: { marginVertical: styleConstants.marginMD },
    my_lg: { marginVertical: styleConstants.marginLG },
    my_xl: { marginVertical: styleConstants.marginXL },
    mt_2xs: { marginTop: styleConstants.margin2XS },
    mt_xs: { marginTop: styleConstants.marginXS },
    mt_sm: { marginTop: styleConstants.marginSM },
    mt_md: { marginTop: styleConstants.marginMD },
    mt_lg: { marginTop: styleConstants.marginLG },
    mt_xl: { marginTop: styleConstants.marginXL },
    mr_2xs: { marginRight: styleConstants.margin2XS },
    mr_xs: { marginRight: styleConstants.marginXS },
    mr_sm: { marginRight: styleConstants.marginSM },
    mr_md: { marginRight: styleConstants.marginMD },
    mr_lg: { marginRight: styleConstants.marginLG },
    mr_xl: { marginRight: styleConstants.marginXL },
    mb_2xs: { marginBottom: styleConstants.margin2XS },
    mb_xs: { marginBottom: styleConstants.marginXS },
    mb_sm: { marginBottom: styleConstants.marginSM },
    mb_md: { marginBottom: styleConstants.marginMD },
    mb_lg: { marginBottom: styleConstants.marginLG },
    mb_xl: { marginBottom: styleConstants.marginXL },
    ml_2xs: { marginLeft: styleConstants.margin2XS },
    ml_xs: { marginLeft: styleConstants.marginXS },
    ml_sm: { marginLeft: styleConstants.marginSM },
    ml_md: { marginLeft: styleConstants.marginMD },
    ml_lg: { marginLeft: styleConstants.marginLG },
    ml_xl: { marginLeft: styleConstants.marginXL },

    // PADDINGS
    p_2xs: { padding: styleConstants.padding2XS },
    p_xs: { padding: styleConstants.paddingXS },
    p_sm: { padding: styleConstants.paddingSM },
    p_md: { padding: styleConstants.paddingMD },
    p_lg: { padding: styleConstants.paddingLG },
    p_xl: { padding: styleConstants.paddingXL },
    px_2xs: { paddingHorizontal: styleConstants.padding2XS },
    px_xs: { paddingHorizontal: styleConstants.paddingXS },
    px_sm: { paddingHorizontal: styleConstants.paddingSM },
    px_md: { paddingHorizontal: styleConstants.paddingMD },
    px_lg: { paddingHorizontal: styleConstants.paddingLG },
    px_xl: { paddingHorizontal: styleConstants.paddingXL },
    py_2xs: { paddingVertical: styleConstants.padding2XS },
    py_xs: { paddingVertical: styleConstants.paddingXS },
    py_sm: { paddingVertical: styleConstants.paddingSM },
    py_md: { paddingVertical: styleConstants.paddingMD },
    py_lg: { paddingVertical: styleConstants.paddingLG },
    py_xl: { paddingVertical: styleConstants.paddingXL },
    pt_2xs: { paddingTop: styleConstants.padding2XS },
    pt_xs: { paddingTop: styleConstants.paddingXS },
    pt_sm: { paddingTop: styleConstants.paddingSM },
    pt_md: { paddingTop: styleConstants.paddingMD },
    pt_lg: { paddingTop: styleConstants.paddingLG },
    pt_xl: { paddingTop: styleConstants.paddingXL },
    pr_2xs: { paddingRight: styleConstants.padding2XS },
    pr_xs: { paddingRight: styleConstants.paddingXS },
    pr_sm: { paddingRight: styleConstants.paddingSM },
    pr_md: { paddingRight: styleConstants.paddingMD },
    pr_lg: { paddingRight: styleConstants.paddingLG },
    pr_xl: { paddingRight: styleConstants.paddingXL },
    pb_2xs: { paddingBottom: styleConstants.padding2XS },
    pb_xs: { paddingBottom: styleConstants.paddingXS },
    pb_sm: { paddingBottom: styleConstants.paddingSM },
    pb_md: { paddingBottom: styleConstants.paddingMD },
    pb_lg: { paddingBottom: styleConstants.paddingLG },
    pb_xl: { paddingBottom: styleConstants.paddingXL },
    pl_2xs: { paddingLeft: styleConstants.padding2XS },
    pl_xs: { paddingLeft: styleConstants.paddingXS },
    pl_sm: { paddingLeft: styleConstants.paddingSM },
    pl_md: { paddingLeft: styleConstants.paddingMD },
    pl_lg: { paddingLeft: styleConstants.paddingLG },
    pl_xl: { paddingLeft: styleConstants.paddingXL },

    // TEXTS
    text_xs: { fontSize: styleConstants.fontSizeXS },
    text_sm: { fontSize: styleConstants.fontSizeSM },
    text_md: { fontSize: styleConstants.fontSizeMD },
    text_lg: { fontSize: styleConstants.fontSizeLG },
    text_xl: { fontSize: styleConstants.fontSizeXL },
    text_2xl: { fontSize: styleConstants.fontSize2XL },

    text_left: { textAlign: 'left' },
    text_center: { textAlign: 'center' },
    text_right: { textAlign: 'right' },
    text_bold: { fontWeight: 'bold' },

    // Themed text colors
    text_primary: { color: theme.text },
    text_grey: { color: theme.noticeText },
    text_error: { color: '#dc2626' },
    text_clickable: { color: theme.linkColor },

    // Container styles
    container: {
        alignItems: 'stretch',
        padding: styleConstants.paddingXL,
        backgroundColor: theme.background,
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
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        backgroundColor: theme.inputBackground,
        color: theme.text,
        borderRadius: styleConstants.borderRadiusLG,
        paddingHorizontal: styleConstants.paddingMD,
        paddingVertical: styleConstants.paddingSM + 2,
        fontSize: styleConstants.fontSizeLG,
        marginBottom: styleConstants.marginLG,
    },

    // Button styles
    settingsButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    settingsButtonText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },

    // Card styles for items (beasts/spells)
    itemCard: {
        backgroundColor: theme.card,
        borderRadius: styleConstants.borderRadiusLG,
        padding: styleConstants.paddingMD,
        marginBottom: styleConstants.marginSM,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        flexDirection: 'row',
        alignItems: 'center',
        ...styleConstants.shadowSM,
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
        marginBottom: styleConstants.marginLG,
        borderRadius: styleConstants.borderRadiusLG,
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
        padding: styleConstants.paddingXS,
        borderRadius: styleConstants.borderRadiusCircle,
        borderWidth: styleConstants.borderXS,
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
        backgroundColor: theme.card,
        borderRadius: styleConstants.borderRadius2XL,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
        padding: styleConstants.paddingLG,
        alignItems: 'stretch',
        ...styleConstants.shadowLG,
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
        padding: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusLG,
        marginBottom: styleConstants.marginSM,
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
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
        padding: styleConstants.paddingLG,
        borderRadius: styleConstants.borderRadiusLG,
        marginBottom: styleConstants.marginXL,
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
        paddingHorizontal: styleConstants.paddingSM + 2,
        paddingVertical: styleConstants.paddingSM,
        borderRadius: styleConstants.borderRadiusLG,
        alignItems: 'center',
        borderWidth: styleConstants.borderXS,
        borderColor: theme.border,
    },
    selected: {
        backgroundColor: theme.primary + '20',
        borderColor: theme.primary,
        borderWidth: styleConstants.borderSM,
    },
    button: {
        paddingHorizontal: styleConstants.paddingXL,
        paddingVertical: styleConstants.paddingMD,
        borderRadius: styleConstants.borderRadiusLG,
        alignItems: 'center',
        marginTop: styleConstants.marginSM,
    },
    buttonText: {
        fontWeight: '600',
        fontSize: styleConstants.fontSizeLG,
    },
    filterBtn: {
        borderWidth: styleConstants.borderXS,
        borderRadius: styleConstants.borderRadiusMD,
        paddingHorizontal: styleConstants.paddingSM,
        paddingVertical: styleConstants.paddingXS,
        marginRight: styleConstants.marginSM,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
