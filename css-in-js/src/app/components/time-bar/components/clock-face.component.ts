import { Component } from '@angular/core';
import { css } from '@emotion/css';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-clock-face',
  templateUrl: './clock-face.component.html'
})
export class ClockFaceComponent {
  public get rootClass(): string {
    return css`
      display: flex;
      justify-content: space-between;
    `;
  }

  public get itemClass(): string {
    return css`
      font-size: 0.7rem;
      font-family: roboto-bold;
      color: ${this.themeService.getColor(['light', 100])};
    `;
  }

  constructor(private readonly themeService: ThemeService) {}
}
