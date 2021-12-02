import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TimeLog } from 'src/app/declarations/interfaces/time-log.interface';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { css } from '@emotion/css';
import { Uuid } from 'src/app/declarations/types/uuid.type';

@Component({
  selector: 'app-time-logs-list',
  templateUrl: './time-logs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLogsListComponent {
  public readonly timeLogsIds$: Observable<Uuid[]> = this.timeTrackerService
    .getTimeLogs()
    .pipe(map((timeLogs: TimeLog[]) => timeLogs.map((item: TimeLog) => item.id)));

  public get rootClass(): string {
    return css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
    `;
  }

  constructor(private readonly timeTrackerService: TimeTrackerService) {}
}
