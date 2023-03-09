import { isEqual } from 'lodash';

export const isDark = (theme?: string, systemTheme?: string) =>
  (!isEqual(theme, `system`) && isEqual(theme, `dark`)) ||
  (isEqual(theme, `system`) && systemTheme && isEqual(systemTheme, `dark`));
