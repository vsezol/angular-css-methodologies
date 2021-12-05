import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { TimeLog } from 'src/app/declarations/interfaces/time-log.interface';
import { BehaviorSubject, distinctUntilChanged, Observable, pluck, ReplaySubject, Subject, Subscription } from 'rxjs';
import { Nullable } from '../../declarations/types/nullable.type';
import { isNil } from '../../functions/common/is-nil.function';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Today } from '../../declarations/classes/today.class';
import { FormControl } from '@angular/forms';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { TimeLogDTO } from '../../declarations/dto/time-log.dto';
import { isNotNil } from '../../functions/common/is-not-nil.function';
import { Uuid } from 'src/app/declarations/types/uuid.type';
import { InputComponent } from '../../shared/components/input/input.component';
import { ActiveTimeLogService } from '../../services/active-time-log.service';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLogComponent implements OnDestroy, AfterViewChecked {
  @ViewChild(InputComponent) public inputComponent!: InputComponent;
  private readonly inputComponent$: Subject<InputComponent> = new Subject<InputComponent>();

  @Input()
  public set timeLogId(value: Nullable<Uuid>) {
    if (isNil(value)) {
      return;
    }

    this.timeLogId$.next(value);
  }

  public readonly isEditMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly timeLogId$: ReplaySubject<Uuid> = new ReplaySubject<Uuid>(1);

  public readonly timeLog$: Observable<TimeLog> = this.timeLogId$.pipe(
    distinctUntilChanged(),
    switchMap((id: Uuid) => this.timeTrackerService.getTimeLogById(id)),
    filter(isNotNil)
  );

  public readonly timeDiff$: Observable<number> = this.timeLog$.pipe(
    filter(isNotNil),
    map(({ timeRange: { from, to } }: TimeLog) => to.getTime() - from.getTime()),
    map((timeDiff: number) => new Today().start.getTime() + new Date(timeDiff).getTime())
  );

  public readonly descriptionControl: FormControl = new FormControl('');

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly timeTrackerService: TimeTrackerService,
    private readonly hoverTimeLogService: ActiveTimeLogService
  ) {
    this.initializeDescriptionControl();
  }

  public ngAfterViewChecked(): void {
    if (isNotNil(this.inputComponent)) {
      this.inputComponent$.next(this.inputComponent);
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('mouseenter')
  public handleMouseEnter(): void {
    this.setActiveTimeLog();
  }

  @HostListener('mouseleave')
  public handleMouseLeave(): void {
    this.isEditMode$
      .pipe(
        take(1),
        filter((isEditMode: boolean) => !isEditMode)
      )
      .subscribe(() => {
        this.clearActiveTimeLog();
      });
  }

  public handleBlur(): void {
    this.updateTimeLogByDescriptionControl();
    this.disableEditMode();
  }

  public handleEnter(): void {
    this.updateTimeLogByDescriptionControl();
    this.disableEditMode();
  }

  public enableEditMode(): void {
    this.isEditMode$.next(true);
    this.setActiveTimeLog();
    this.inputComponent$.pipe(take(1)).subscribe((inputComponent: InputComponent) => {
      inputComponent.doFocus();
    });
  }

  private disableEditMode(): void {
    this.isEditMode$.next(false);
    this.clearActiveTimeLog();
  }

  private initializeDescriptionControl(): Subscription {
    return this.timeLog$
      .pipe(take(1), pluck('description'), distinctUntilChanged())
      .subscribe((description: string) => {
        this.descriptionControl.setValue(description);
      });
  }

  private updateTimeLogByDescriptionControl(): void {
    this.timeLog$.pipe(take(1)).subscribe((timeLog: TimeLog) => {
      this.timeTrackerService.updateTimeLog(new TimeLogDTO({ ...timeLog, description: this.descriptionControl.value }));
    });
  }

  private setActiveTimeLog(): void {
    this.timeLogId$.pipe(take(1)).subscribe((id: Uuid) => {
      this.hoverTimeLogService.setActiveById(id);
    });
  }

  private clearActiveTimeLog(): void {
    this.timeLogId$.pipe(take(1)).subscribe((id: Uuid) => {
      this.hoverTimeLogService.clearActiveById(id);
    });
  }
}
