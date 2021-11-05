import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-item',
  templateUrl: './time-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
