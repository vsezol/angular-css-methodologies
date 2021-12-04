import { ThemeService } from '../../services/theme.service';
import { css } from '@emotion/css';

export class TimeBarClasses {
  constructor(private readonly themeService: ThemeService) {}

  public readonly root: string = css`
    display: flex;
    width: 100%;
    min-height: 40px;
    box-sizing: border-box;
    background-color: ${this.themeService.getColor(['dark', 300])};
  `;
}
