import { Injectable } from '@angular/core';
import { TimeLog } from '../declarations/interfaces/time-log.interface';
import { TimeTrackerService } from './time-tracker.service';
import { BehaviorSubject, interval, Observable, of, Subscription } from 'rxjs';
import { Nullable } from '../declarations/types/nullable.type';
import { filter, switchMap, take } from 'rxjs/operators';
import { TimeLogDTO } from '../declarations/dto/time-log.dto';
import { Uuid } from '../declarations/types/uuid.type';
import { TimeRangeDTO } from '../declarations/dto/time-range.dto';
import { isNil } from '../functions/common/is-nil.function';
import { isNotNil } from '../functions/common/is-not-nil.function';

const MIN_DIFF_TO_REMOVE: number = 30000;

@Injectable({
  providedIn: 'root'
})
export class CurrentTimeLogService {
  private readonly currentTimeLogId$: BehaviorSubject<Nullable<Uuid>> = new BehaviorSubject<Nullable<Uuid>>(null);
  private readonly currentTimeLog$: Observable<Nullable<TimeLog>> = this.currentTimeLogId$.pipe(
    switchMap((id: Nullable<Uuid>) => (isNil(id) ? of(null) : this.timeTrackerService.getTimeLogById(id)))
  );

  private updateTimeLogSubscription!: Subscription;

  constructor(private readonly timeTrackerService: TimeTrackerService) {}

  public start(timeLog: TimeLog): void {
    this.currentTimeLogId$.next(timeLog.id);
    this.timeTrackerService.addTimeLog(timeLog);
    this.updateTimeLogSubscription = this.updateTimeLogLoop();
  }

  public stop(): void {
    this.removeByMinimalDiff();
    this.updateTimeLogSubscription.unsubscribe();
    this.currentTimeLogId$.next(null);
  }

  private updateTimeLogLoop(): Subscription {
    return interval(1000)
      .pipe(switchMap(() => this.currentTimeLog$.pipe(take(1), filter(isNotNil))))
      .subscribe((timeLog: TimeLog) => {
        this.timeTrackerService.updateTimeLog(this.getTimeLogWithUpdatedTime(timeLog));
      });
  }

  private getTimeLogWithUpdatedTime(timeLog: TimeLog): TimeLog {
    return new TimeLogDTO({
      id: timeLog.id,
      description: timeLog.description,
      timeRange: new TimeRangeDTO({
        from: timeLog.timeRange.from,
        to: new Date()
      })
    });
  }

  private removeByMinimalDiff(): void {
    this.currentTimeLog$.pipe(take(1), filter(isNotNil)).subscribe((timeLog: TimeLog) => {
      const { from, to } = timeLog.timeRange;
      const diffSeconds: number = to.getTime() - from.getTime();
      if (diffSeconds < MIN_DIFF_TO_REMOVE) {
        this.timeTrackerService.removeTimeLog(timeLog.id);
      }
    });
  }
}
