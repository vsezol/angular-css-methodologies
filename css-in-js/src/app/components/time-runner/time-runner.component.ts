import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TimeRunnerState } from '../../declarations/types/time-runner-state.type';

@Component({
  selector: 'app-time-runner',
  templateUrl: './time-runner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeRunnerComponent {
  @Output() stateChange: EventEmitter<TimeRunnerState> = new EventEmitter<TimeRunnerState>();

  public isRunning = false;

  public handleClick(): void {
    this.isRunning = !this.isRunning;

    this.processState();
  }

  private processState(): void {
    if (this.isRunning) {
      this.stateChange.emit('start');
      return;
    }

    this.stateChange.emit('stop');
  }
}
