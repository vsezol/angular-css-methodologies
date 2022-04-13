import { TimeRange } from '../interfaces/time-range.interface';

export class TimeRangeDTO implements TimeRange {
  public from: Date;
  public to: Date;

  constructor({ from, to }: TimeRange) {
    this.from = from;
    this.to = to;
  }
}
