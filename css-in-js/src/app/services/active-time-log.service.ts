import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { Uuid } from '../declarations/types/uuid.type';
import { Nullable } from '../declarations/types/nullable.type';
import { filter, take } from 'rxjs/operators';
import { isNotNil } from '../functions/common/is-not-nil.function';

@Injectable({
  providedIn: 'root'
})
export class ActiveTimeLogService {
  private readonly activeTimeLogIdState$: BehaviorSubject<Nullable<Uuid>> = new BehaviorSubject<Nullable<Uuid>>(null);
  public readonly activeTimeLogId$: Observable<Nullable<Uuid>> = this.activeTimeLogIdState$
    .asObservable()
    .pipe(distinctUntilChanged());

  public setActiveById(id: Uuid): void {
    this.activeTimeLogIdState$.next(id);
  }

  public clearActiveById(id: Uuid): void {
    this.activeTimeLogIdState$
      .pipe(
        take(1),
        filter(isNotNil),
        filter((currentId: Uuid) => currentId === id)
      )
      .subscribe(() => {
        this.activeTimeLogIdState$.next(null);
      });
  }
}
