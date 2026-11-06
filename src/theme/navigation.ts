import { fonts } from '@/theme/tokens';

import { useColors } from './theme';

/** Stack header + background colours for the current theme. */
export function useStackHeader() {
  const c = useColors();
  return {
    headerStyle: { backgroundColor: c.bg },
    headerTintColor: c.text,
    headerShadowVisible: false,
    headerTitleStyle: { fontFamily: fonts.display, color: c.text },
    contentStyle: { backgroundColor: c.bg },
  };
}
