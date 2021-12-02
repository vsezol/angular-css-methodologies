import { ChangeDetectionStrategy, Component } from '@angular/core';
import { css } from '@emotion/css';
import { ThemeService } from 'src/app/services/theme.service';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';

@Component({
  selector: 'app-clock-face',
  templateUrl: './clock-face.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockFaceComponent {
  get rootClass(): string {
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

  constructor(private readonly themeService: ThemeService, private readonly timeTrackerService: TimeTrackerService) {}
}
