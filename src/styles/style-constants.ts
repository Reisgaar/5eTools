import { Dimensions, DimensionValue, Platform } from 'react-native';

const screen = Dimensions.get('screen');

export const styleConstants = {
    // MARGINS
    margin2XS: 2,
    marginXS: 4,
    marginSM: 8,
    marginMD: 12,
    marginLG: 16,
    marginXL: 20,
    margin2XL: 30,

    // PADDINGS
    padding2XS: 2,
    paddingXS: 4,
    paddingSM: 8,
    paddingMD: 12,
    paddingLG: 16,
    paddingXL: 20,
    padding2XL: 30,

    // GAPS
    gapXS: 4,
    gapSM: 8,
    gapMD: 12,
    gapLG: 16,
    gapXL: 24,

    // BORDERS
    borderXS: 1,
    borderSM: 2,
    borderMD: 3,
    borderLG: 4,
    borderXL: 5,

    // BORDER RADIUS
    borderRadiusXS: 2,
    borderRadiusSM: 4,
    borderRadiusMD: 8,
    borderRadiusLG: 12,
    borderRadiusXL: 16,
    borderRadius2XL: 20,
    borderRadiusCircle: 1000,

    // FONTS
    fontSizeXS: 10,
    fontSizeSM: 12,
    fontSizeMD: 14,
    fontSizeLG: 16,
    fontSizeXL: 18,
    fontSize2XL: 22,

    // IMAGE SIZES
    imageXS: 10,
    imageSM: 20,
    imageMD: 30,
    imageLG: 40,
    imageXL: 50,

    // ICON SIZES
    icon2XS: 16,
    iconXS: 18,
    iconSM: 20,
    iconMD: 22,
    iconLG: 24,
    iconXL: 26,
    icon2XL: 28,

    // PERCENTAGES OVER 1
    ratio100: 1,
    ratio90: 0.9,
    ratio80: 0.8,
    ratio70: 0.7,
    ratio60: 0.6,
    ratio50: 0.5,
    ratio40: 0.4,
    ratio30: 0.3,
    ratio20: 0.2,
    ratio10: 0.1,
    ratio0: 0,

    // PERCENTAGES
    percent100: '100%' as DimensionValue,
    percent90: '90%' as DimensionValue,
    percent80: '80%' as DimensionValue,
    percent75: '75%' as DimensionValue,
    percent70: '70%' as DimensionValue,
    percent60: '60%' as DimensionValue,
    percent50: '50%' as DimensionValue,
    percent40: '40%' as DimensionValue,
    percent33: '33.3%' as DimensionValue,
    percent30: '30%' as DimensionValue,
    percent25: '25%' as DimensionValue,
    percent20: '20%' as DimensionValue,
    percent15: '15%' as DimensionValue,
    percent10: '10%' as DimensionValue,
    percent0: '0%' as DimensionValue,

    // PRESSABLES
    defaultHitSlop: 6,

    // SCREEN DIMENSIONS
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenWidthLimitWithMainPadding: screen.width - 16,

    // SHADOWS
    shadowSM: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 0 },
        },
        android: { elevation: 4 },
    }),

    shadowLG: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 0 },
        },
        android: { elevation: 10 },
    })
};
