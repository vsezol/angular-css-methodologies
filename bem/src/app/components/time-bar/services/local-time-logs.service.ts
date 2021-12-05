import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { TimeLog } from '../../../declarations/interfaces/time-log.interface';
import { map } from 'rxjs/operators';
import { TimeTrackerService } from '../../../services/time-tracker.service';
import { Nullable } from '../../../declarations/types/nullable.type';
import { isNil } from '../../../functions/common/is-nil.function';
import { TimeLogDTO } from '../../../declarations/dto/time-log.dto';
import { Uuid } from '../../../declarations/types/uuid.type';

@Injectable()
export class LocalTimeLogsService {
  public readonly timeLogs$: Observable<TimeLog[]> = this.timeTrackerService.getTimeLogs().pipe(
    map((timeLogs: TimeLog[]) => this.fillVoids(timeLogs)),
    shareReplay(1)
  );

  public readonly timeLogsIds$ = this.timeLogs$.pipe(
    map((timeLogs: TimeLog[]) => timeLogs.map((item: TimeLog) => item.id))
  );

  public getTimeLogById(id: Uuid): Observable<Nullable<TimeLog>> {
    return this.timeLogs$.pipe(
      map((timeLogs: TimeLog[]) => {
        const timeLog = timeLogs.find((item: TimeLog) => item.id === id);
        return timeLog;
      })
    );
  }
  constructor(private readonly timeTrackerService: TimeTrackerService) {}

  private fillVoids(timeLogs: TimeLog[]): TimeLog[] {
    return timeLogs.reduce((newArray: TimeLog[], current: TimeLog, index: number, array: TimeLog[]) => {
      const next: Nullable<TimeLog> = array[index + 1];

      if (!isNil(next)) {
        const start = current.timeRange.to;
        const end = next.timeRange.from;

        const diff: number = end.getTime() - start.getTime();

        if (diff > 0) {
          return [...newArray, current, this.createVoidTimeLog(start, end)];
        }
      }

      return [...newArray, current];
    }, []);
  }

  private createVoidTimeLog(from: Date, to: Date): TimeLog {
    return new TimeLogDTO({
      isVoid: true,
      timeRange: {
        from: from,
        to: to
      }
    });
  }
}
