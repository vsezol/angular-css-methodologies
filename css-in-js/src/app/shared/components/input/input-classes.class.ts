import { ThemeService } from '../../../services/theme.service';
import { css } from '@emotion/css';

export class InputClasses {
  constructor(private readonly themeService: ThemeService) {}

  public readonly host: string = css`
    width: 100%;
  `;

  public readonly root: string = css`
    background: transparent;
    box-sizing: border-box;
    border: none;
    margin: 0;
    padding: 0;
    outline: none;
    color: ${this.themeService.getColor('light')};
    width: 100%;
    font-size: 0.8rem;

    line-height: 35px;
    height: 35px;
  `;
}
