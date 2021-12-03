import { ThemeService } from '../../../services/theme.service';
import { css } from '@emotion/css';
import { ButtonVariants } from '../../../declarations/types/button-variants.type';

export class ButtonClasses {
  constructor(private readonly themeService: ThemeService) {}

  public readonly root: string = css`
    cursor: pointer;
    transition: all 0.2s;
    height: 35px;
    min-width: 70px;
    box-sizing: border-box;
    color: ${this.themeService.getColor('light')};
    border: none;
  `;

  public getByVariant(variant: ButtonVariants): string {
    const classesByVariant: { [key in ButtonVariants]: string } = {
      primary: css`
        background-color: ${this.themeService.getColor('primary')};
        :hover {
          background-color: ${this.themeService.getColor(['primary', 100])};
        }
      `,
      secondary: css`
        background-color: ${this.themeService.getColor(['secondary', 500])};
        :hover {
          background-color: ${this.themeService.getColor(['secondary', 400])};
        }
      `,
      danger: css`
        background-color: ${this.themeService.getColor('danger')};
        :hover {
          background-color: ${this.themeService.getColor(['danger', 100])};
        }
      `
    };

    return classesByVariant[variant];
  }
}
