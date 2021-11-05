import { Inject, Injectable } from '@angular/core';
import { THEME_CONFIG_TOKEN } from '../constants/tokens/theme-config.token';
import { ThemeConfig } from '../declarations/interfaces/theme-config.interface';
import { ColorNames } from '../declarations/types/color-names.type';
import { ColorTints } from '../declarations/types/color-tints.type';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(@Inject(THEME_CONFIG_TOKEN) private readonly themeConfig: ThemeConfig) {}

  public getColor(path: [ColorNames, ColorTints] | [ColorNames] | ColorNames): string {
    let name: ColorNames;
    let tint: ColorTints = 0;

    if (typeof path === 'string') {
      return this.themeConfig.colors[path]['0'];
    }

    if (Array.isArray(path) && path.length === 1) {
      return this.themeConfig.colors[path[0]]['0'];
    }

    return this.themeConfig.colors[path[0]][path[1]];
  }
}
