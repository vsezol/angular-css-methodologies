import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TimeLog } from 'src/app/declarations/interfaces/time-log.interface';
import { Observable } from 'rxjs';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { getUuid } from '../../functions/common/get-uuid.function';
import { css } from '@emotion/css';
import { TimeRange } from '../../declarations/interfaces/time-range.interface';
import { Today } from 'src/app/declarations/classes/today.class';
import { map } from 'rxjs/operators';
import { Time } from '@angular/common';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-time-bar',
  templateUrl: './time-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeBarComponent {
  public readonly timeLogs$: Observable<TimeLog[]> = this.timeTrackerService.getTimeLogs().pipe(
    map((timeLogs: TimeLog[]) => {
      const sortedTimeLogs = [...timeLogs];
      sortedTimeLogs.sort((a: TimeLog, b: TimeLog) => {
        return a.range.from.getTime() - b.range.from.getTime();
      });
      return sortedTimeLogs;
    }),
    map((timeLogs: TimeLog[]) => {
      let newTimeLogs: TimeLog[] = [];

      const createVoidTimeLog = (from: Date, to: Date) => {
        return {
          isVoid: true,
          description: '',
          id: getUuid(),
          range: {
            from: from,
            to: to
          }
        };
      };

      for (let i = -1; i < timeLogs.length - 1; i += 2) {
        const next: TimeLog = timeLogs[i + 1];
        const current: TimeLog = timeLogs[i] ?? createVoidTimeLog(this.today.start, next.range.from);

        const diff: number = current.range.to.getTime() - next.range.from.getTime();

        if (diff === 0) {
          newTimeLogs = [...newTimeLogs, current, next];
          continue;
        }

        const voidTimeLog = createVoidTimeLog(current.range.to, next.range.from);

        newTimeLogs = [...newTimeLogs, current, voidTimeLog, next];
      }

      return newTimeLogs;
    })
  );
  private readonly today: Today = new Today();

  public readonly globalTimeRange: TimeRange = {
    from: this.today.start,
    to: this.today.end
  };

  public readonly styleClass$: Observable<string> = this.timeLogs$.pipe(
    map(() => {
      return css`
        display: flex;
        width: 100%;
        box-sizing: border-box;
        background-color: ${this.themeService.getColor(['dark', 300])};
      `;
    })
  );

  constructor(private readonly timeTrackerService: TimeTrackerService, private readonly themeService: ThemeService) {
    this.timeTrackerService.addTimeLog({
      id: getUuid(),
      description: 'some description 1',
      isVoid: false,
      range: {
        from: new Date(Date.now()),
        to: new Date(Date.now() + 10000 * 5)
      }
    });

    this.timeTrackerService.addTimeLog({
      id: getUuid(),
      description: 'some description 2',
      isVoid: false,
      range: {
        from: new Date(Date.now() + 10000 * 5 + 10000 * 4),
        to: new Date(Date.now() + 10000 * 5)
      }
    });

    this.timeTrackerService.addTimeLog({
      id: getUuid(),
      description: 'some description 3',
      isVoid: false,
      range: {
        from: new Date(Date.now() + 10000 * 5 + 10000 * 4 + 10000 * 5),
        to: new Date(Date.now() + 10000 * 1000 + 10000 * 4 + 10000 * 5 + 10000 * 5)
      }
    });
  }
}
