// Space the floating (absolutely-positioned) tab bar occupies at the bottom of the screen.
// Scrollable content under the tabs uses this as paddingBottom so nothing is hidden behind
// the bar, while non-scroll content can still extend to the very bottom of the screen.
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styleConstants } from 'src/styles/style-constants';

export const TAB_BAR_HEIGHT = 64;

/** Total vertical space reserved by the floating tab bar (bar height + bottom gap + inset). */
export function useTabBarInset(): number {
    const insets = useSafeAreaInsets();
    const bottomGap = Math.max(insets.bottom, styleConstants.marginSM);
    return TAB_BAR_HEIGHT + bottomGap + styleConstants.marginMD;
}
