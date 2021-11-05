import { Injectable } from '@angular/core';
import { TimeLog } from '../declarations/interfaces/time-log.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Uuid } from '../declarations/types/uuid.type';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {
  private readonly timeLogs$: BehaviorSubject<TimeLog[]> = new BehaviorSubject<TimeLog[]>([]);

  public getTimeLogs(): Observable<TimeLog[]> {
    return this.timeLogs$.asObservable();
  }

  public updateTimeLig(timeLog: TimeLog): void {
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
}
