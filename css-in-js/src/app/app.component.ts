import { ChangeDetectionStrategy, Component } from '@angular/core';
import { css, injectGlobal } from '@emotion/css';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public get rootClass(): string {
    return css`
      background-color: ${this.themeService.getColor(['dark', 100])};
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;
  }

  public get wrapperClass(): string {
    return css`
      width: 100%;
      max-width: 1440px;
      padding: 20px;
      box-sizing: border-box;
    `;
  }

  public get controlBarWrapperClass(): string {
    return css`
      margin-bottom: 1rem;
    `;
  }

  public get timeLogsListWrapperClass(): string {
    return css`
      padding: 20px 0px 0px 0px;
    `;
  }

  constructor(private readonly themeService: ThemeService) {
    this.setGlobalStyles();
  }

  private setGlobalStyles(): void {
    injectGlobal`
      * {
        box-sizing: border-box;
        font-family: roboto-regular;
        font-size: 1rem;
      }

      body {
        margin: 0;
      }

      @font-face {
        font-family: roboto-regular;
        src: local("Roboto Regular"), url(../assets/fonts/roboto/Roboto-Regular.ttf);
        font-display: swap;
      }

      @font-face {
        font-family: roboto-bold;
        src: local("Roboto Regular"), url(../assets/fonts/roboto/Roboto-Bold.ttf);
        font-display: swap;
      }
    `;
  }
}
