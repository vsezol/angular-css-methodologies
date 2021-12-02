import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { css } from '@emotion/css';
import { TimeRange } from '../../declarations/interfaces/time-range.interface';
import { map } from 'rxjs/operators';
import { ThemeService } from 'src/app/services/theme.service';
import { LocalTimeLogsService } from './services/local-time-logs.service';
import { Uuid } from '../../declarations/types/uuid.type';
import { TimeLog } from '../../declarations/interfaces/time-log.interface';

@Component({
  selector: 'app-time-bar',
  templateUrl: './time-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocalTimeLogsService]
})
export class TimeBarComponent {
  public readonly timeLogsIds$: Observable<Uuid[]> = this.localTimeLogsService.timeLogsIds$;
  public readonly timeLogs$: Observable<TimeLog[]> = this.localTimeLogsService.timeLogs$;

  public readonly globalTimeRange$: Observable<TimeRange> = this.timeTrackerService.globalTimeRange$;

  public readonly styleClass$: Observable<string> = this.timeLogs$.pipe(
    map(() => {
      return css`
        display: flex;
        width: 100%;
        min-height: 40px;
        box-sizing: border-box;
        background-color: ${this.themeService.getColor(['dark', 300])};
      `;
    })
  );

  constructor(
    private readonly timeTrackerService: TimeTrackerService,
    private readonly themeService: ThemeService,
    private readonly localTimeLogsService: LocalTimeLogsService
  ) {}
}
