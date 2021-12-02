import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { Uuid } from '../declarations/types/uuid.type';
import { Nullable } from '../declarations/types/nullable.type';
import { filter, take } from 'rxjs/operators';
import { isNotNil } from '../functions/common/is-not-nil.function';

@Injectable({
  providedIn: 'root'
})
export class HoverTimeLogService {
  private readonly hoveredTimeLogIdState$: BehaviorSubject<Nullable<Uuid>> = new BehaviorSubject<Nullable<Uuid>>(null);
  public readonly hoveredTimeLogId$: Observable<Nullable<Uuid>> = this.hoveredTimeLogIdState$
    .asObservable()
    .pipe(distinctUntilChanged());

  public setHoveredById(id: Uuid): void {
    this.hoveredTimeLogIdState$.next(id);
  }

  public clearHoveredById(id: Uuid): void {
    this.hoveredTimeLogIdState$
      .pipe(
        take(1),
        filter(isNotNil),
        filter((currentId: Uuid) => currentId === id)
      )
      .subscribe(() => {
        this.hoveredTimeLogIdState$.next(null);
      });
  }
}
