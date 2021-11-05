import { InjectionToken } from '@angular/core';
import { ThemeConfig } from 'src/app/declarations/interfaces/theme-config.interface';

export const THEME_CONFIG_TOKEN: InjectionToken<ThemeConfig> = new InjectionToken<ThemeConfig>('THEME_CONFIG_TOKEN');
