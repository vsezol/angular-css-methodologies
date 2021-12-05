import { ColorNames } from '../types/color-names.type';
import { ColorTints } from '../types/color-tints.type';

export interface ThemeConfig {
  colors: { [name in ColorNames]: { [tint in ColorTints]: string } };
}
