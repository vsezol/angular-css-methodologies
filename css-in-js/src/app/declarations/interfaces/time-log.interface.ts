import { TimeRange } from './time-range.interface';

export interface TimeLog {
  id: string;
  isVoid: boolean;
  description: string;
  timeRange: TimeRange;
}
