import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { TimeRange } from '../../declarations/interfaces/time-range.interface';
import { LocalTimeLogsService } from './services/local-time-logs.service';
import { Uuid } from '../../declarations/types/uuid.type';
import { TimeLog } from '../../declarations/interfaces/time-log.interface';

@Component({
  selector: 'app-time-bar',
  templateUrl: './time-bar.component.html',
  styleUrls: ['time-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocalTimeLogsService]
})
export class TimeBarComponent {
  public readonly timeLogsIds$: Observable<Uuid[]> = this.localTimeLogsService.timeLogsIds$;
  public readonly timeLogs$: Observable<TimeLog[]> = this.localTimeLogsService.timeLogs$;

  public readonly globalTimeRange$: Observable<TimeRange> = this.timeTrackerService.globalTimeRange$;

  constructor(
    private readonly timeTrackerService: TimeTrackerService,
    private readonly localTimeLogsService: LocalTimeLogsService
  ) {}
}
