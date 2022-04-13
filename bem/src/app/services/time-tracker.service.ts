import { Injectable } from '@angular/core';
import { TimeLog } from '../declarations/interfaces/time-log.interface';
import { BehaviorSubject, distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Uuid } from '../declarations/types/uuid.type';
import { StorageService } from './storage.service';
import { isNil } from '../functions/common/is-nil.function';
import { TimeLogDTO } from '../declarations/dto/time-log.dto';
import { Nullable } from '../declarations/types/nullable.type';
import { Today } from '../declarations/classes/today.class';
import { TimeRange } from '../declarations/interfaces/time-range.interface';

const TIME_LOGS_STORAGE_KEY = 'TIME_LOGS';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {
  private readonly timeLogs$: BehaviorSubject<TimeLog[]> = new BehaviorSubject<TimeLog[]>([]);

  private readonly today: Today = new Today();

  public readonly globalTimeRange$: Observable<TimeRange>;

  public readonly totalTimeSpent$: Observable<number> = this.timeLogs$.pipe(
    map((timeLogs: TimeLog[]) =>
      timeLogs.reduce((timeSpent: number, item: TimeLog) => {
        return timeSpent + item.timeRange.to.getTime() - item.timeRange.from.getTime();
      }, 0)
    )
  );

  constructor(private readonly storage: StorageService) {
    this.initializeTimeLogsByStorage();

    this.globalTimeRange$ = this.getTimeLogs().pipe(
      map((timeLogs: TimeLog[]) => timeLogs[0]?.timeRange?.from ?? new Date()),
      map((from: Date) => ({
        from,
        to: this.today.end
      }))
    );

    this.syncTimeLogsWithStorage();
  }

  public getTimeLogById(id: Uuid): Observable<Nullable<TimeLog>> {
    return this.timeLogs$.asObservable().pipe(
      map((timeLogs: TimeLog[]) => {
        const timeLog = timeLogs.find((item: TimeLog) => item.id === id);
        return timeLog;
      })
    );
  }

  public getTimeLogs(): Observable<TimeLog[]> {
    return this.timeLogs$.asObservable().pipe(map((timeLogs: TimeLog[]) => this.sortTimeLogs(timeLogs)));
  }

  public updateTimeLog(timeLog: TimeLog): void {
    this.removeTimeLog(timeLog.id);
    this.addTimeLog(timeLog);
  }

  public addTimeLog(timeLog: TimeLog): void {
    this.timeLogs$.pipe(take(1)).subscribe((timeLogs: TimeLog[]): void => {
      this.timeLogs$.next([...timeLogs, timeLog]);
    });
  }

  public removeTimeLog(id: Uuid): void {
    this.timeLogs$.pipe(take(1)).subscribe((timeLogs: TimeLog[]): void => {
      const filteredTimeLogs: TimeLog[] = timeLogs.filter((item: TimeLog) => item.id !== id);
      this.timeLogs$.next(filteredTimeLogs);
    });
  }

  private sortTimeLogs(timeLogs: TimeLog[]): TimeLog[] {
    const sortedTimeLogs = [...timeLogs];

    sortedTimeLogs.sort((a: TimeLog, b: TimeLog) => {
      return a.timeRange.from.getTime() - b.timeRange.from.getTime();
    });

    return sortedTimeLogs;
  }

  private initializeTimeLogsByStorage() {
    const storeData: Nullable<TimeLog[]> = this.storage.get<TimeLog[]>(TIME_LOGS_STORAGE_KEY);

    if (isNil(storeData)) {
      return;
    }

    const newTimeLogs: TimeLog[] = storeData.map(
      (timeLog: TimeLog) =>
        new TimeLogDTO({
          ...timeLog,
          timeRange: {
            from: new Date(timeLog.timeRange.from),
            to: new Date(timeLog.timeRange.to)
          }
        })
    );

    this.timeLogs$.next(newTimeLogs);
  }

  private syncTimeLogsWithStorage(): Subscription {
    return this.timeLogs$.pipe(distinctUntilChanged()).subscribe((timeLogs: TimeLog[]) => {
      this.storage.set(TIME_LOGS_STORAGE_KEY, timeLogs);
    });
  }
}
