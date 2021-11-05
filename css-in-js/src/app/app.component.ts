import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { css, injectGlobal } from '@emotion/css';
import { ThemeService } from './services/theme.service';
import { TimeTrackerService } from './services/time-tracker.service';

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
      justify-content: center;
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
      }

      @font-face {
        font-family: roboto-bold;
        src: local("Roboto Regular"), url(../assets/fonts/roboto/Roboto-Bold.ttf);
      }
    `;
  }
}
