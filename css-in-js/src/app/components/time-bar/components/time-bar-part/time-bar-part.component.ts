import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
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
import { ThemeService } from '../../../../services/theme.service';
import { Uuid } from 'src/app/declarations/types/uuid.type';
import { isNotNil } from 'src/app/functions/common/is-not-nil.function';
import { LocalTimeLogsService } from '../../services/local-time-logs.service';
import { ActiveTimeLogService } from '../../../../services/active-time-log.service';
import { Nullable } from '../../../../declarations/types/nullable.type';
import { TimeBarPartClasses } from './time-bar-part-classes.class';

interface Inputs {
  timeLogId: Uuid;
  globalTimeRange: TimeRange;
}

@Component({
  selector: 'app-time-bar-part',
  templateUrl: './time-bar-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeBarPartComponent implements OnChanges, OnDestroy, Inputs {
  @Input() public timeLogId!: Uuid;
  @Input() public globalTimeRange!: TimeRange;

  public readonly classes: TimeBarPartClasses = new TimeBarPartClasses(this.themeService);

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

  @HostBinding('class')
  public hostClasses: string[] = [];

  constructor(
    private readonly themeService: ThemeService,
    private readonly localTimeLogsService: LocalTimeLogsService,
    private readonly hoverTimeLogService: ActiveTimeLogService,
    private readonly viewRef: ViewContainerRef,
    private readonly renderer: Renderer2
  ) {
    this.setHostClasses();
    this.subscription.add(this.processHostClassWhenIsHoverChanged());
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
      .pipe(
        take(1),
        map(([inputs, timeLog]: [Inputs, TimeLog]) => {
          return this.classes.getBaseHost({
            isVoid: timeLog.isVoid,
            width: this.getWidthInPercents(timeLog.timeRange, inputs.globalTimeRange)
          });
        })
      )
      .subscribe((hostClasses: string[]) => {
        this.hostClasses = hostClasses;
      });
  }

  private processHostClassWhenIsHoverChanged(): Subscription {
    return this.isHover$.subscribe((isHover: boolean) => {
      if (isHover) {
        this.renderer.addClass(this.viewRef.element.nativeElement, this.classes.highlightHost);
        return;
      }

      this.renderer.removeClass(this.viewRef.element.nativeElement, this.classes.highlightHost);
    });
  }

  private getWidthInPercents(localTimeRange: TimeRange, fullTimeRange: TimeRange): number {
    const getDiff = (timeRange: TimeRange) => timeRange.to.getTime() - timeRange.from.getTime();
    return Math.round((getDiff(localTimeRange) / getDiff(fullTimeRange)) * 1000) / 10;
  }
}
