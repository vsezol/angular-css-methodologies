import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectGlobal } from '@emotion/css';
import { ThemeService } from './services/theme.service';
import { AppClasses } from './app-classes.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public readonly classes: AppClasses = new AppClasses(this.themeService);

  constructor(private readonly themeService: ThemeService) {
    this.injectGlobalStyles();
  }

  public injectGlobalStyles(): void {
    injectGlobal`
      * {
        box-sizing: border-box;
        font-family: roboto-regular;
        font-size: 1rem;
      }

      :root {
        color-scheme: dark;
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
