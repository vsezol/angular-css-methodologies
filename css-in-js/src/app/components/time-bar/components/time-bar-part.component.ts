import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { TimeRange } from '../../../declarations/interfaces/time-range.interface';
import { TimeLog } from '../../../declarations/interfaces/time-log.interface';
import { ComponentChanges } from '../../../declarations/interfaces/component-changes.interface';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { css } from '@emotion/css';
import { updateByChanges } from '../../../functions/common/update-by-changes.function';
import { isEmpty } from '../../../functions/common/is-empty.function';
import { THEME_CONFIG_TOKEN } from '../../../constants/tokens/theme-config.token';
import { ThemeConfig } from '../../../declarations/interfaces/theme-config.interface';
import { ThemeService } from '../../../services/theme.service';

interface Inputs {
  timeLog: TimeLog;
  globalTimeRange: TimeRange;
}

@Component({
  selector: 'app-time-bar-part',
  templateUrl: './time-bar-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeBarPartComponent implements OnChanges, OnDestroy, Inputs {
  @Input() public timeLog!: TimeLog;
  @Input() public globalTimeRange!: TimeRange;

  public readonly inputs$: BehaviorSubject<Inputs> = new BehaviorSubject<Inputs>({
    timeLog: this.timeLog,
    globalTimeRange: this.globalTimeRange
  });

  private readonly subscription: Subscription = new Subscription();

  @HostBinding('class')
  public hostClasses: string[] = [];

  constructor(private readonly themeService: ThemeService) {
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
    return this.inputs$
      .pipe(
        filter((inputs: Inputs) => !isEmpty(inputs.timeLog) && !isEmpty(inputs.globalTimeRange)),
        map((inputs: Inputs) => this.getHostClasses(inputs))
      )
      .subscribe((hostClasses: string[]) => {
        this.hostClasses = hostClasses;
      });
  }

  private getHostClasses(inputs: Inputs): string[] {
    const classes: string[] = [];

    const bg: string = inputs.timeLog.isVoid ? 'transparent' : this.themeService.getColor(['primary', 0]);

    classes.push(
      css`
        content: '';
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
        padding: 0px 2px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s;

        .text {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 1rem;
          color: ${this.themeService.getColor(['light', 100])};
        }
      `
    );

    classes.push(
      css`
        flex: 0 0 ${this.getWidthInPercents(inputs.timeLog.range, this.globalTimeRange)}%;
      `
    );

    classes.push(
      css`
        background-color: ${bg};
        border: 3px solid ${bg};
      `
    );

    if (!inputs.timeLog.isVoid) {
      classes.push(css`
        cursor: pointer;
        :hover {
          border: 3px solid ${this.themeService.getColor(['primary', 400])};
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
