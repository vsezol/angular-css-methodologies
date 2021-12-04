import { css } from '@emotion/css';
import { ThemeService } from '../../services/theme.service';

export class ControlBarClasses {
  constructor(private readonly themeService: ThemeService) {}

  public readonly root: string = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${this.themeService.getColor(['light', 100])};
  `;
}
