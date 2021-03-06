import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { Today } from '../../declarations/classes/today.class';
import { TimeRunnerState } from '../../declarations/types/time-runner-state.type';
import { CurrentTimeLogService } from 'src/app/services/current-time-log.service';
import { TimeLogDTO } from 'src/app/declarations/dto/time-log.dto';
import { ControlBarClasses } from './control-bar-classes.class';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlBarComponent {
  public readonly classes: ControlBarClasses = new ControlBarClasses(this.themeService);

  public readonly totalTimeSpent$: Observable<number> = this.timeTrackerService.totalTimeSpent$.pipe(
    map((timeDiff: number) => new Today().start.getTime() + new Date(timeDiff).getTime())
  );

  constructor(
    private readonly timeTrackerService: TimeTrackerService,
    private readonly themeService: ThemeService,
    private readonly currentTimeLogService: CurrentTimeLogService
  ) {}

  public handleStateChange(state: TimeRunnerState): void {
    if (state === 'start') {
      this.currentTimeLogService.start(
        new TimeLogDTO({
          timeRange: {
            from: new Date(),
            to: new Date()
          }
        })
      );
      return;
    }

    this.currentTimeLogService.stop();
  }
}
