import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { TimeRange } from '../../../../declarations/interfaces/time-range.interface';
import { TimeLog } from '../../../../declarations/interfaces/time-log.interface';
import { ComponentChanges } from '../../../../declarations/interfaces/component-changes.interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap, take } from 'rxjs/operators';
import { updateByChanges } from '../../../../functions/common/update-by-changes.function';
import { isEmpty } from '../../../../functions/common/is-empty.function';
import { Uuid } from 'src/app/declarations/types/uuid.type';
import { isNotNil } from 'src/app/functions/common/is-not-nil.function';
import { LocalTimeLogsService } from '../../services/local-time-logs.service';
import { ActiveTimeLogService } from '../../../../services/active-time-log.service';
import { Nullable } from '../../../../declarations/types/nullable.type';

interface Inputs {
  timeLogId: Uuid;
  globalTimeRange: TimeRange;
}

@Component({
  selector: 'app-time-bar-part',
  templateUrl: './time-bar-part.component.html',
  styleUrls: ['./time-bar-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeBarPartComponent implements OnChanges, OnDestroy, Inputs {
  @Input() public timeLogId!: Uuid;
  @Input() public globalTimeRange!: TimeRange;

  public readonly inputs$: BehaviorSubject<Inputs> = new BehaviorSubject<Inputs>({
    timeLogId: this.timeLogId,
    globalTimeRange: this.globalTimeRange
  });

  private readonly isHover$: Observable<boolean> = combineLatest([
    this.inputs$.pipe(map(({ timeLogId }: Inputs) => timeLogId)),
    this.hoverTimeLogService.activeTimeLogId$
  ]).pipe(map(([id, hoverId]: [Uuid, Nullable<Uuid>]) => isNotNil(hoverId) && id === hoverId));

  public readonly timeLog$: Observable<TimeLog> = this.inputs$.pipe(
    pluck('timeLogId'),
    distinctUntilChanged(),
    switchMap((id: Uuid) => this.localTimeLogsService.getTimeLogById(id)),
    filter(isNotNil)
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly localTimeLogsService: LocalTimeLogsService,
    private readonly hoverTimeLogService: ActiveTimeLogService,
    private readonly viewRef: ViewContainerRef,
    private readonly renderer: Renderer2
  ) {
    this.setHostClasses();
    this.subscription.add(this.processIsHoverHostClassWhenIsHoverChanged());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.updateInputs(changes);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateInputs(changes: ComponentChanges<this>): void {
    this.inputs$.pipe(take(1)).subscribe((previousInputs: Inputs) => {
      this.inputs$.next(updateByChanges(previousInputs, changes));
    });
  }

  private setHostClasses(): void {
    combineLatest([
      this.inputs$.pipe(filter((inputs: Inputs) => isNotNil(inputs.timeLogId) && !isEmpty(inputs.globalTimeRange))),
      this.timeLog$
    ])
      .pipe(take(1))
      .subscribe(([inputs, timeLog]: [Inputs, TimeLog]) => {
        this.setHostWidth(this.getWidthInPercents(timeLog.timeRange, inputs.globalTimeRange));
        this.processVoidHostClass(timeLog.isVoid);
      });
  }

  private setHostWidth(width: number): void {
    this.renderer.setStyle(this.viewRef.element.nativeElement, 'flex', `0 0 ${width}%`);
  }

  private processVoidHostClass(isVoid: boolean) {
    if (isVoid) {
      this.renderer.addClass(this.viewRef.element.nativeElement, 'void');
      return;
    }

    this.renderer.removeClass(this.viewRef.element.nativeElement, 'void');
  }

  private processIsHoverHostClassWhenIsHoverChanged(): Subscription {
    return this.isHover$.subscribe((isHover: boolean) => {
      if (isHover) {
        this.renderer.addClass(this.viewRef.element.nativeElement, 'highlight');
        return;
      }

      this.renderer.removeClass(this.viewRef.element.nativeElement, 'highlight');
    });
  }

  private getWidthInPercents(localTimeRange: TimeRange, fullTimeRange: TimeRange): number {
    const getDiff = (timeRange: TimeRange) => timeRange.to.getTime() - timeRange.from.getTime();
    return Math.round((getDiff(localTimeRange) / getDiff(fullTimeRange)) * 1000) / 10;
  }
}
