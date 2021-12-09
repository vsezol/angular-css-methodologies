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
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    width: 100%;
    max-width: 1440px;
    padding: 20px;
    box-sizing: border-box;
  `;

  public readonly barWrapper: string = css`
    margin-bottom: 1rem;
    box-sizing: border-box;
  `;

  public readonly listWrapper: string = css`
    height: 100%;
    max-height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 1rem;
  `;

  constructor(private readonly themeService: ThemeService) {
  }
}
