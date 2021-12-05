import { ThemeService } from './services/theme.service';
import { css } from '@emotion/css';

export class AppClasses {
  public readonly root: string = css`
    background-color: ${this.themeService.getColor(['dark', 100])};
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  public readonly wrapper: string = css`
    width: 100%;
    max-width: 1440px;
    padding: 20px;
    box-sizing: border-box;
  `;

  public readonly barWrapper: string = css`
    margin-bottom: 1rem;
  `;

  public readonly listWrapper: string = css`
    margin-top: 1rem;
  `;

  constructor(private readonly themeService: ThemeService) {
  }
}
