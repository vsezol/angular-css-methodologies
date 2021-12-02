import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { TimeRange } from '../../../declarations/interfaces/time-range.interface';
import { TimeLog } from '../../../declarations/interfaces/time-log.interface';
import { ComponentChanges } from '../../../declarations/interfaces/component-changes.interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap, take } from 'rxjs/operators';
import { css } from '@emotion/css';
import { updateByChanges } from '../../../functions/common/update-by-changes.function';
import { isEmpty } from '../../../functions/common/is-empty.function';
import { ThemeService } from '../../../services/theme.service';
import { Uuid } from 'src/app/declarations/types/uuid.type';
import { isNotNil } from 'src/app/functions/common/is-not-nil.function';
import { getOverflowEllipsisStyles } from '../../../functions/styles/get-overflow-ellipsis-styles.function';
import { LocalTimeLogsService } from '../services/local-time-logs.service';
import { HoverTimeLogService } from '../../../services/hover-time-log.service';
import { Nullable } from '../../../declarations/types/nullable.type';

interface Inputs {
  timeLogId: Uuid;
  globalTimeRange: TimeRange;
}

interface CreateCssClassesProps {
  timeLog: TimeLog;
  globalTimeRange: TimeRange;
  isHover: boolean;
}

@Component({
  selector: 'app-time-bar-part',
  templateUrl: './time-bar-part.component.html',
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
    this.hoverTimeLogService.hoveredTimeLogId$
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
    private readonly hoverTimeLogService: HoverTimeLogService,
    private readonly viewRef: ViewContainerRef,
    private readonly renderer: Renderer2,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.subscription.add(this.updateHostClassWhenInputsChanged());
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

  private updateHostClassWhenInputsChanged(): Subscription {
    return combineLatest([
      this.inputs$.pipe(filter((inputs: Inputs) => isNotNil(inputs.timeLogId) && !isEmpty(inputs.globalTimeRange))),
      this.timeLog$,
      this.isHover$
    ])
      .pipe(
        map(([inputs, timeLog, isHover]: [Inputs, TimeLog, boolean]) => {
          return {
            globalTimeRange: inputs.globalTimeRange,
            timeLog,
            isHover
          };
        }),
        map((props: CreateCssClassesProps) => this.getHostClasses(props))
      )
      .subscribe((hostClasses: string[]) => {
        this.hostClasses = hostClasses;
        this.changeDetectorRef.markForCheck();
      });
  }

  private getHostClasses(props: CreateCssClassesProps): string[] {
    const classes: string[] = [];

    const bg: string = props.timeLog.isVoid ? 'transparent' : this.themeService.getColor(['primary', 0]);

    classes.push(
      css`
        content: '';
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
        padding: 0px 0px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.2s ease-out, flex 0.5s ease-out;

        .text {
          display: block;
          content: '';
          white-space: nowrap;
          ${getOverflowEllipsisStyles()};
          overflow: hidden;
          font-size: 0.8rem;
          color: ${this.themeService.getColor(['light', 100])};
        }
      `
    );

    classes.push(
      css`
        flex: 0 0 ${this.getWidthInPercents(props.timeLog.timeRange, this.globalTimeRange)}%;
      `
    );

    classes.push(
      css`
        background-color: ${bg};
      `
    );

    if (props.isHover) {
      classes.push(
        css`
          transition: background-color 50ms ease-out;
          background-color: ${this.themeService.getColor(['warning', 200])};
        `
      );
    }

    if (!props.timeLog.isVoid) {
      classes.push(css`
        cursor: pointer;

        :hover {
          background-color: ${this.themeService.getColor(['primary', 200])};
        }
      `);
    }

    return classes;
  }

  private getWidthInPercents(localTimeRange: TimeRange, fullTimeRange: TimeRange): number {
    const getDiff = (timeRange: TimeRange) => timeRange.to.getTime() - timeRange.from.getTime();
    return Math.round((getDiff(localTimeRange) / getDiff(fullTimeRange)) * 1000) / 10;
  }
}
